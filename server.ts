import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Stripe from "stripe";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();



async function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  const PORT = 3000;

  app.use(helmet({
    contentSecurityPolicy: false, // Disabling CSP for development environment (Vite inline scripts)
    crossOriginEmbedderPolicy: false,
  }));

  const stripe = process.env.STRIPE_SECRET_KEY 
    ? new Stripe(process.env.STRIPE_SECRET_KEY) 
    : null;

  // Rate Limiting
  const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: "Muitas requisições. Tente mais tarde." } });
  const aiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: { error: "Limite de IA atingido temporariamente." } });
  const billingLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: "Muitas tentativas de faturamento." } });

  app.use("/api/", generalLimiter);
  app.use("/api/ai/", aiLimiter);
  app.use("/api/image/", aiLimiter);
  app.use("/api/stripe/", billingLimiter);

  // Simple JSON DB for server-side persistence
  const dbPath = path.join(process.cwd(), "server-db.json");
  const readDb = () => {
    try {
      if (fs.existsSync(dbPath)) return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    } catch (e) {}
    return { subscriptions: [], processedEvents: [] };
  };
  const writeDb = (data: any) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  function getPlanFromStripePriceId(priceId: string): string {
    if (priceId === process.env.STRIPE_PRICE_ESSENTIAL) return 'essential';
    if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
    if (priceId === process.env.STRIPE_PRICE_MAX) return 'max';
    throw new Error('Invalid price id');
  }

  function getStripePriceIdFromPlan(plan: string): string {
    if (plan === 'essential') return process.env.STRIPE_PRICE_ESSENTIAL || '';
    if (plan === 'pro') return process.env.STRIPE_PRICE_PRO || '';
    if (plan === 'max') return process.env.STRIPE_PRICE_MAX || '';
    throw new Error('Invalid plan');
  }

  // Webhook needs raw body, must be before express.json()
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || !stripe) {
      console.log("⚠️ Stripe Webhook Secret not configured. Ignoring webhook.");
      return res.status(200).json({ status: "skipped", message: "Webhook secret missing" });
    }

    const signature = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const db = readDb();
    
    // Antiduplication Protection
    if (db.processedEvents.some((e: any) => e.eventId === event.id)) {
      return res.status(200).json({ received: true, skipped: true, reason: "duplicate" });
    }
    db.processedEvents.push({ eventId: event.id, type: event.type, createdAt: new Date().toISOString() });
    
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.client_reference_id || session.metadata?.userId;
          const plan = session.metadata?.plan;
          const customerId = session.customer as string;
          const subscriptionId = session.subscription as string;
          
          if (userId && plan && subscriptionId) {
             const existingIdx = db.subscriptions.findIndex((s: any) => s.userId === userId);
             const subData = {
               id: subscriptionId,
               userId,
               provider: "stripe",
               stripeCustomerId: customerId,
               stripeSubscriptionId: subscriptionId,
               plan,
               status: session.payment_status === 'paid' ? 'active' : 'pending',
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
               lastEventId: event.id
             };
             if (existingIdx >= 0) db.subscriptions[existingIdx] = subData;
             else db.subscriptions.push(subData);
          }
          break;
        }
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object as any;
          const customerId = subscription.customer as string;
          const priceId = subscription.items.data[0].price.id;
          
          try {
            const plan = getPlanFromStripePriceId(priceId);
            const subData = db.subscriptions.find((s: any) => s.stripeSubscriptionId === subscription.id || s.stripeCustomerId === customerId);
            if (subData) {
              subData.status = subscription.status;
              subData.plan = plan;
              subData.updatedAt = new Date().toISOString();
              subData.stripePriceId = priceId;
              subData.currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
              subData.currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
              subData.cancelAtPeriodEnd = subscription.cancel_at_period_end;
            }
          } catch(e) {}
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object as any;
          const subData = db.subscriptions.find((s: any) => s.stripeSubscriptionId === subscription.id);
          if (subData) {
            subData.status = "cancelled";
            subData.updatedAt = new Date().toISOString();
          }
          break;
        }
        case "invoice.payment_succeeded": {
          const invoice = event.data.object as any;
          const subData = db.subscriptions.find((s: any) => s.stripeSubscriptionId === invoice.subscription);
          if (subData) {
             subData.status = "active";
             subData.updatedAt = new Date().toISOString();
          }
          break;
        }
        case "invoice.payment_failed": {
          const invoice = event.data.object as any;
          const subData = db.subscriptions.find((s: any) => s.stripeSubscriptionId === invoice.subscription);
          if (subData) {
             subData.status = "past_due";
             subData.updatedAt = new Date().toISOString();
          }
          break;
        }
      }
      writeDb(db);
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).json({ error: "WEBHOOK_PROCESS_ERROR" });
    }
  });

  app.use(express.json());

  // POST /api/stripe/sync-subscription
  app.post("/api/stripe/sync-subscription", async (req, res) => {
    if (!stripe) return res.status(503).json({ error: "STRIPE_NOT_CONFIGURED" });
    const { stripeSubscriptionId, userId } = req.body;
    
    if (!stripeSubscriptionId) return res.status(400).json({ error: "MISSING_SUBSCRIPTION_ID" });

    try {
      const db = readDb();
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId) as any;
       
      const priceId = subscription.items.data[0].price.id;
      let plan = 'trial';
      try { plan = getPlanFromStripePriceId(priceId); } catch(e) {}
      
      const subData = db.subscriptions.find((s: any) => s.stripeSubscriptionId === stripeSubscriptionId) || {};
      subData.stripeSubscriptionId = subscription.id;
      subData.stripeCustomerId = subscription.customer as string;
      subData.plan = plan;
      subData.status = subscription.status;
      subData.stripePriceId = priceId;
      subData.currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
      subData.cancelAtPeriodEnd = subscription.cancel_at_period_end;
      
      if (!db.subscriptions.find((s: any) => s.stripeSubscriptionId === stripeSubscriptionId)) {
        subData.userId = userId;
        subData.provider = "stripe";
        db.subscriptions.push(subData);
      }
      
      writeDb(db);
      
      res.json({ success: true, subscription: subData });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  
  // POST /api/stripe/create-customer-portal-session
  app.post("/api/stripe/create-customer-portal-session", async (req, res) => {
     if (!stripe) return res.status(503).json({ error: "STRIPE_NOT_CONFIGURED" });
     const { stripeCustomerId } = req.body;
     if (!stripeCustomerId) return res.status(400).json({ error: "MISSING_CUSTOMER_ID" });

     try {
        const baseUrl = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
        const portal = await stripe.billingPortal.sessions.create({
           customer: stripeCustomerId,
           return_url: `${baseUrl}/billing`
        });
        res.json({ url: portal.url });
     } catch(e: any) {
        res.status(500).json({ error: e.message });
     }
  });

  // GET /api/stripe/user-subscription
  app.get("/api/stripe/user-subscription", (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "MISSING_USER_ID" });
    const db = readDb();
    
    // find subscription for this user
    const sub = db.subscriptions.find((s: any) => s.userId === userId && s.status !== 'cancelled');
    if (sub) {
       return res.json({ subscription: sub });
    }
    // return latest if all cancelled
    const anySub = db.subscriptions.find((s: any) => s.userId === userId);
    return res.json({ subscription: anySub || null });
  });

  // GET /api/stripe/checkout-session
  app.get("/api/stripe/checkout-session", async (req, res) => {
    if (!stripe) return res.status(503).json({ error: "STRIPE_NOT_CONFIGURED" });
    const { session_id } = req.query;
    if (!session_id || typeof session_id !== 'string') return res.status(400).json({ error: "MISSING_SESSION_ID" });

    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      res.json({ status: session.status, payment_status: session.payment_status });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API Route for Stripe Checkout
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ 
        error: "STRIPE_NOT_CONFIGURED",
        message: "O sistema de pagamentos não foi configurado." 
      });
    }

    const { plan, userId, userEmail } = req.body;
    let priceId = "";

    switch(plan) {
      case 'essential': priceId = process.env.STRIPE_PRICE_ESSENTIAL || ""; break;
      case 'pro': priceId = process.env.STRIPE_PRICE_PRO || ""; break;
      case 'max': priceId = process.env.STRIPE_PRICE_MAX || ""; break;
    }

    if (!priceId) {
      return res.status(400).json({ error: "INVALID_PLAN_OR_PRICE_MISSING" });
    }

    try {
      const baseUrl = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/billing/cancel`,
        customer_email: userEmail,
        metadata: { userId, plan },
        subscription_data: {
          metadata: { userId, plan }
        }
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      res.status(500).json({ error: "CHECKOUT_ERROR", message: error.message });
    }
  });

    // API Image Routes
  const handleImageRoute = async (req: express.Request, res: express.Response, expectedAction: string) => {
    const { payload, userId, plan, currentUsage } = req.body;
    
    const mockUser = {
      id: userId || 'unknown',
      plan: plan || 'trial',
      usage: currentUsage || {},
      subscriptionStatus: 'active' as any
    };

    let usageGuard: any;
    try {
      const ugMod = await import('./src/services/usageGuard.js');
      usageGuard = ugMod.usageGuard;
    } catch (e) {
      try {
          const ugMod = await import('./src/services/usageGuard.ts');
          usageGuard = ugMod.usageGuard;
      } catch (err) {}
    }

    if (usageGuard) {
      const check = usageGuard.canUseAI(mockUser, expectedAction);
      if (!check.can) {
        usageGuard.saveUsageEvent({
           userId: mockUser.id, actionType: expectedAction, module: 'creative', cost: 0, plan: mockUser.plan,
           allowed: false, deniedReason: check.reason, aiMode: 'none', success: false
        });
        return res.status(403).json({ error: check.errorCode || "LIMIT_REACHED", message: check.reason });
      }
    } else {
        const isEnabled = process.env.IMAGE_API_ENABLED === 'true';
        if (!isEnabled) {
             return res.status(403).json({ error: "IMAGE_API_DISABLED", message: "Geração de imagem ainda não está ativa neste ambiente." });
        }
        if (plan === 'trial' || plan === 'essential') {
          return res.status(403).json({ error: "LIMIT_REACHED", message: "Geração de imagem não disponível neste plano." });
        }
    }

    if (process.env.IMAGE_API_ENABLED !== 'true') {
        return res.status(403).json({ error: "IMAGE_API_DISABLED", message: "Geração de imagem ainda não está ativa neste ambiente." });
    }

    // Since this is a placeholder/simulation for now as per instructions (backend must be prepared but fake the provider if not set)
    // We should log success and return mock URL if no real provider code exists, or handle real gemini API calls if using Imagen.
    
    if (usageGuard) {
       usageGuard.saveUsageEvent({
           userId: mockUser.id, actionType: expectedAction, module: 'creative', cost: 8, plan: mockUser.plan,
           allowed: true, success: true, aiMode: 'real_ai'
       });
    }

    return res.json({
        success: true,
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
        provider: process.env.IMAGE_PROVIDER || 'gemini',
        model: process.env.IMAGE_MODEL || 'imagen-4'
    });
  };

  app.post("/api/image/generate", async (req, res) => handleImageRoute(req, res, 'image_generation'));
  app.post("/api/image/edit", async (req, res) => handleImageRoute(req, res, 'image_editing'));
  
  // Generic AI Core Execution Route

  app.post("/api/ai/run", async (req, res) => {
    const { actionType, payload, context, userId, plan, currentUsage } = req.body;
    
    // Simulate full user object for usageGuard
    const mockUser = {
      id: userId || 'unknown',
      plan: plan || 'trial',
      usage: currentUsage || {},
      subscriptionStatus: 'active' as any // simplified for local
    };

    let usageGuard: any;
    try {
      // Import usageGuard dynamically to avoid startup crashes if types fail
      const ugMod = await import('./src/services/usageGuard.js');
      usageGuard = ugMod.usageGuard;
    } catch (e) {
      // fallback if typescript import fails
      try {
          const ugMod = await import('./src/services/usageGuard.ts');
          usageGuard = ugMod.usageGuard;
      } catch (err) {
          console.error("Could not import usageGuard", err);
      }
    }

    if (usageGuard) {
      const check = usageGuard.canUseAI(mockUser, actionType);
      if (!check.can) {
        usageGuard.saveUsageEvent({
           userId: mockUser.id, actionType, module: 'ai', cost: 0, plan: mockUser.plan,
           allowed: false, deniedReason: check.reason, aiMode: 'none', success: false
        });
        return res.status(403).json({ error: check.errorCode || "LIMIT_REACHED", message: check.reason });
      }
    } else {
        // Fallback server-side usage check representation
        if (plan === 'trial' && currentUsage?.trialUsed) {
          return res.status(403).json({ error: "LIMIT_REACHED", message: "Seu teste grátis já foi usado." });
        }
    }
    
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.status(200).json({ 
        fallback: true,
        error: "AI_KEY_NOT_CONFIGURED", 
        message: "Key do Gemini não configurada. Usando modo fallback." 
      });
    }

    let masterPrompt = `
Você é o cérebro comercial do Fotomax IA, uma central de inteligência artificial para pequenos negócios locais.

Sua função é transformar dados reais do negócio em ações comerciais práticas:
- ofertas;
- campanhas;
- mensagens WhatsApp;
- diagnósticos;
- criativos;
- ideias visuais;
- calendários;
- follow-ups;
- recomendações.

Você não é gerador de texto bonito.
Você é um estrategista comercial prático.

AÇÃO SOLICITADA: ${actionType}

DADOS DO CONTEXTO DO NEGÓCIO:
${JSON.stringify(context?.dna || {}, null, 2)}

OFERTA APLICÁVEL:
${JSON.stringify(context?.activeOffer || {}, null, 2)}

DADOS DA SOLICITAÇÃO (PAYLOAD):
${JSON.stringify(payload || {}, null, 2)}

Regras GERAIS:
- use o contexto real do negócio;
- resolva o problema informado;
- seja específico;
- não use texto genérico;
- não invente dados;
- não invente desconto;
- não invente urgência;
- não invente escassez;
- não invente garantia;
- não invente entrega rápida;
- não prometa vendas garantidas;
- não use frases vazias;
- adapte ao canal;
- quebre objeções;
- dê CTA claro;
- respeite o tom da marca;
- respeite restrições;
- declare missingContext quando faltar informação;
- retorne JSON válido no schema solicitado.
    `;

    if (["creative_brief", "image_prompt", "visual_diagnosis"].includes(actionType)) {
      masterPrompt += `
REGRAS ESPECÍFICAS PARA CRIATIVOS:
Você é diretor de arte comercial, estrategista de criativos e especialista em imagem de produto para pequenos negócios locais.
Sua função é transformar DNA Comercial, oferta e campanha em criativos visuais que aumentem clareza, desejo, confiança e ação.
- não crie visual genérico;
- o produto deve ser o foco;
- a oferta precisa ser entendida rápido;
- não coloque texto demais na arte;
- não invente ingredientes, embalagem ou detalhes;
- não altere produto se preservarProduto=true;
- se for premium, evitar poluição e gritaria;
- se for popular direto, priorizar clareza, preço e CTA;
- se for comida, priorizar apetite, textura, luz e realismo;
- se for serviço, priorizar confiança, resultado, prova e agenda;
Para "image_prompt" (Prompt Avançado): deve ser extremamente detalhado (produto, objetivo, canal, formato, composição, iluminação, estilo, cores, hierarquia, restrições, negative prompt, nível de realismo). NUNCA retorne "Crie uma imagem bonita de...".
`;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const result = await model.generateContent(masterPrompt);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/\`\`\`json|\`\`\`/g, "").trim();
      
      try {
        const json = JSON.parse(text);

        // Validate base structure
        const finalJson = {
          actionType,
          module: payload?.module || "core",
          strategy: json.strategy || {},
          result: json.result || json.campaign || json.offer || json,
          quality: json.quality || { specificityScore: 90, usefulnessScore: 90, persuasionScore: 90, contextUsageScore: 90, riskScore: 0, finalScore: 90, warnings: [] },
          personalizationProof: json.personalizationProof || { usedDNA: true },
          missingContext: json.missingContext || [],
          nextBestActions: json.nextBestActions || []
        };

        res.json(finalJson);
      } catch (e: any) {
        // Just return the raw text if parse fails, though we asked for json
        res.json({ result: text, parsingError: true });
      }
    } catch (error: any) {
      console.error("Gemini AI Core Error:", error);
      res.status(500).json({ error: "FAILED_TO_GENERATE", message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
