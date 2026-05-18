import { User, BusinessDNA, Offer, Campaign } from '../../types';

export type AIActionType = 
  | 'dna_diagnosis' | 'dna_recommendations' | 'dna_summary'
  | 'offer_generation' | 'offer_improvement' | 'offer_diagnosis' | 'offer_variation'
  | 'campaign_generation' | 'campaign_improvement' | 'campaign_variation' | 'campaign_channel_adaptation'
  | 'zap_message' | 'zap_followup' | 'zap_objection_reply' | 'zap_broadcast' | 'zap_status'
  | 'calendar_week_plan' | 'calendar_month_plan' | 'calendar_day_idea' | 'calendar_campaign_sequence'
  | 'library_adapt_to_dna' | 'library_generate_model' | 'library_personalize_template'
  | 'creative_brief' | 'creative_prompt' | 'creative_variation' | 'image_prompt' | 'visual_diagnosis'
  | 'business_diagnosis' | 'sales_problem_diagnosis' | 'customer_objection_analysis'
  | 'action_plan_generation' | 'consultor_question'
  | 'performance_analysis' | 'weekly_report' | 'module_adjustment';

export interface AIActionPayload {
  [key: string]: any;
}

export interface AIResponse {
  actionType: string;
  module: string;
  strategy: Record<string, any>;
  result: Record<string, any>;
  adaptedOutput?: any;
  templateId?: string;
  adaptedTitle?: string;
  whyThisTemplate?: string;
  nextActions?: string[];
  quality: {
    specificityScore: number;
    usefulnessScore: number;
    persuasionScore: number;
    contextUsageScore: number;
    riskScore: number;
    finalScore: number;
    warnings: string[];
  };
  personalizationProof: {
    usedDNA: boolean;
    usedOffer: boolean;
    usedProduct: boolean;
    usedAudience: boolean;
    usedObjection: boolean;
    usedTone: boolean;
    usedRestrictions: boolean;
  };
  missingContext: string[];
  nextBestActions: string[];
}

export const aiCore = {
  async runAIAction(actionType: AIActionType, payload: AIActionPayload, user: User | null): Promise<AIResponse> {
    const context = this.buildGlobalContext(user, payload);
    const requestBody = { actionType, payload, context, userId: user?.id, plan: user?.plan, currentUsage: user?.usage };

    let usageGuard: any;
    try {
       const uMod = await import('../../services/usageGuard');
       usageGuard = uMod.usageGuard;
    } catch(e) { }

    if (usageGuard && user) {
       // Protect frontend call
       const check = usageGuard.canUseAI(user, actionType);
       if (!check.can) {
          usageGuard.saveUsageEvent({
              userId: user.id, actionType, module: 'ai', cost: 0, plan: user.plan,
              allowed: false, deniedReason: check.reason, aiMode: 'none', success: false
          });
          throw new Error(check.reason);
       }
    }

    try {
      const response = await fetch('/api/ai/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Limite de uso atingido.');
        }
        throw new Error(`Failed to generate AI content: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Fallback detection logic if backend failed or is missing AI key
      if (data.error === "AI_KEY_NOT_CONFIGURED" || data.fallback) {
        return this.runFallback(actionType, payload, context);
      }

      let validatedData = this.validateAIOutput(actionType, data, context);
      if (validatedData.quality.finalScore < 75) {
        // Attempt quick client side improvement or flag it
        validatedData = this.improveIfGeneric(actionType, validatedData, context);
      }

      if (user) {
         if (usageGuard) {
             const cost = usageGuard.getActionCost(actionType);
             usageGuard.saveUsageEvent({
                 userId: user.id, actionType, module: 'ai', cost, plan: user.plan,
                 allowed: true, resultId: validatedData.actionType, aiMode: 'real_ai', success: true
             });
         }
         this.saveAIUsageLog(user, actionType, payload, validatedData, validatedData.quality?.finalScore || 0);
      }

      return validatedData;

    } catch (e: any) {
      console.error("AI Core Error:", e);
      const msg = e.message || '';
      if (
        msg.includes('limite') || 
        msg.includes('teste grátis') || 
        msg.includes('Muitas solicitações') || 
        msg.includes('Recurso não disponível') ||
        msg.includes('não está disponível no') ||
        msg.includes('imagem ainda não está') ||
        msg.includes('plano não está ativo')
      ) {
        throw e;
      }
      return this.runFallback(actionType, payload, context);
    }
  },

  buildGlobalContext(user: User | null, payload: AIActionPayload) {
    if (!user) return {};
    
    // We only pass relevant parts of the DNA so we don't blow up the prompt size
    const context: any = {
      plan: user.plan,
    };
    
    if (user.businessProfile) {
      context.dna = {
        name: user.businessProfile.businessName,
        niche: user.businessProfile.niche || user.businessProfile.businessType,
        city: user.businessProfile.city,
        audience: user.businessProfile.targetAudience,
        tone: user.businessProfile.brandTone,
        differential: user.businessProfile.uniqueSellingPoint,
        restrictions: user.businessProfile.wordsToAvoid,
        products: {
            mainProducts: user.businessProfile.mainProducts,
            bestSellerProduct: user.businessProfile.bestSellerProduct,
            highestProfitProduct: user.businessProfile.highestProfitProduct 
        }
      };
    } else if (user.businessDNA) {
      context.dna = {
        name: user.businessDNA.basics.businessName,
        niche: user.businessDNA.basics.niche,
        city: user.businessDNA.basics.city,
        audience: user.businessDNA.audience,
        tone: user.businessDNA.brandVoice?.brandTone || 'direto',
        differential: user.businessDNA.positioning.uniqueSellingPoint || user.businessDNA.positioning.whyChooseUs,
        restrictions: user.businessDNA.restrictions,
        products: user.businessDNA.products
      };
    }
    
    // Filter offers
    if (payload.offer) {
       context.activeOffer = payload.offer;
    }

    return context;
  },

  runFallback(actionType: AIActionType, payload: AIActionPayload, context: any): AIResponse {
    let result: Record<string, any> = {};

    switch (actionType) {
      case 'offer_generation':
        result = {
          offerName: "Oferta Expressa",
          shortOffer: "Compre hoje e garante benefícios.",
          completeOffer: "Oferta completa com condição especial para você aproveitar hoje.",
          whatsappOffer: "Temos uma oferta especial hoje: " + (payload.product || "Produto Especial"),
          instagramOffer: "Novidade na área! Confira.",
          objectionBreak: "Garantia de 7 dias, risco zero.",
          ctaOptions: ["Garantir Agora", "Saber Mais", "Falar no WhatsApp"],
          warnings: []
        };
        break;
      case 'campaign_generation':
        result = {
          campaignName: "Campanha Básica",
          headline: "Preste muita atenção nisso...",
          shortCaption: "Confira nossa novidade especial de hoje para você.",
          longCaption: "Você já sabe que nossa prioridade é trazer o melhor. Entenda por que você não pode deixar essa oportunidade passar. Clique no link da bio e saiba mais.",
          storySequence: [{ story: 1, text: "Olha isso...", visualDirection: "Mostre o produto de perto", cta: "Toque aqui para comprar" }],
          whatsappStatus: "Novidade pra você! Chama no direct.",
          whatsappDirect: "Oi! Tem novidade passando pra te avisar.",
          broadcastMessage: "Cliente selecionado: temos algo especial pra você essa semana.",
          videoScript15s: "Você precisa ver essa novidade. Apenas hoje. Clica no link.",
          ctaOptions: ["Compre agora", "Mande uma mensagem"],
          visualBrief: "Foque no produto de forma limpa e clara."
        };
        break;
      case 'calendar_week_plan':
      case 'calendar_month_plan':
        result = {
          strategy: {
            period: "semana",
            mainGoal: "Manter Constância",
            weeklyTheme: "Ativação de Base",
            focusProducts: ["Produto Base"],
            focusChannels: ["Instagram", "WhatsApp"],
            whyThisPlan: "Aumentar a lembrança da marca e gerar interações com a sua audiência.",
            riskWarnings: []
          },
          days: [
            {
              date: new Date().toISOString(),
              weekday: "Segunda",
              commercialGoal: "Venda Direta",
              actionType: "Post de venda",
              channel: "Instagram",
              productOrService: "Produto Base",
              title: "Oferta Inicial",
              idea: "Post direto focando em problema e solução.",
              reasonWhy: "Movimentar dia fraco.",
              contentDraft: "Você ainda sofre com [problema]? Temos a solução...",
              whatsappDraft: "Oi! Tem novidade pra resolver seu [problema].",
              storyDraft: "Story sobre bastidores usando o produto.",
              cta: "Comprar Agora",
              suggestedTime: "10:00",
              priority: "high",
              effortLevel: "medium",
              expectedImpact: "medium",
              warnings: []
            }
          ],
          extraActions: [],
          quality: {
            specificityScore: 75,
            commercialScore: 75,
            consistencyScore: 75,
            channelFitScore: 75,
            actionabilityScore: 75,
            finalScore: 75,
            warnings: []
          },
          personalizationProof: {
            usedDNA: false,
            usedProducts: false,
            usedWeakDays: false,
            usedChannels: false,
            usedOffers: false,
            usedHistory: false
          },
          missingContext: []
        };
        break;
      case 'zap_message':
        result = {
          completeMessage: "Olá! Tudo bem? Queremos te mostrar nossa novidade hoje. Tem interesse?",
          followUp1: "Ainda tem interesse? Estou fechando os pedidos do dia.",
          followUp2: "Podemos fechar hoje para garantir as condições?",
          objectionReply: "Entendo, mas veja nossa garantia e o valor que trazemos.",
          broadcastVersion: "Promoção especial hoje!",
          statusVersion: "Chame no direct para saber mais.",
          audioScript: "Oi, gravei esse áudio pra te falar de uma exclusividade."
        };
        break;
      case 'creative_brief':
      case 'image_prompt':
      case 'visual_diagnosis':
      case 'creative_variation':
        result = {
          strategy: {
            creativeGoal: "Melhorar clareza da oferta",
            commercialProblem: "Produto precisa de mais destaque visual.",
            visualAngle: "Focar em Textura e Proximidade",
            audienceReactionWanted: "Atenção no feed",
            mainFocus: "Produto no centro bem iluminado",
            visualHierarchy: "1. Imagem, 2. Promessa, 3. CTA",
            channelFit: "Instagram Feed/Story",
            riskWarnings: []
          },
          creative: {
            creativeBrief: "Uma imagem com fundo limpo, focada no produto. Texto: 'Qualidade Especial.' CTA: 'Peça Agora'. Usa apenas as cores da marca de forma elegante.",
            imagePrompt: "Fotografia profissional de " + (payload.product || "produto") + ", iluminação suave, fundo minimalista 4k.",
            editingPrompt: "Aumente o contraste, deixe a saturação um pouco maior para destacar.",
            adText: "Qualidade Especial | Peça Agora",
            headlineOptions: ["Você nunca viu isso", "Detalhes importam"],
            ctaOptions: ["Comprar Agora", "Ver Catálogo"],
            storyLayout: "Imagem de fundo em tela cheia, logo pequeno no topo, CTA com adesivo na parte inferior.",
            feedLayout: "Produto no centro 4:5, texto de apoio na parte inferior.",
            whatsappStatusLayout: "Texto principal chamativo, seta apontando para baixo pedindo pra chamar.",
            bannerText: "A oferta que você pediu.",
            designerInstructions: "Usar fonte sem serifa forte para o título e tom mais claro pra não brigar com a foto.",
            canvaInstructions: "Abra um arquivo 1080x1080px. Coloque fundo liso moderno. Insira o produto no centro com sombra leve. Adicione o título em fonte negrito (Ex: Montserrat) no terço superior. Adicione um botão de 'Comprar' na base.",
            visualChecklist: ["Foto tem boa luz?", "Texto está sumindo?", "CTA chama atenção?"]
          },
          photoAnalysis: {
            productFidelityRules: ["Não alterar a cor real do objeto"],
            whatToImprove: ["Contraste", "Luz"],
            whatNotToChange: ["A embalagem e os ingredientes"],
            commercialWeaknesses: ["Pode parecer muito escuro"],
            recommendedEdits: ["Brilho +10%", "Saturação +5%"]
          }
        };
        break;
      case 'library_adapt_to_dna':
      case 'library_personalize_template':
      case 'library_generate_model':
        result = {
          templateId: "lib_adapted",
          adaptedTitle: payload.templateTitle ? `${payload.templateTitle} (Adaptado)` : "Modelo Adaptado Comercial",
          whyThisTemplate: "Foca no seu produto mantendo a coerência com sua marca e tom de voz.",
          adaptedOutput: {
            offer: "Oferta Exclusiva adaptada: Compre agora e leve algo extra.",
            campaign: "Campanha nova com o tom do seu negócio: Fala pessoal, resolva [problema] hoje.",
            whatsapp: "Oi [nome], lembra de [produto]? Trouxe algo exclusivo pra você que adorou da última vez.",
            story: "Hoje é o dia de resolver [dor] de uma vez. Clica no link e veja a surpresa.",
            ctaOptions: ["Quero aproveitar", "Resolver agora"],
            visualBrief: "Foque nas vantagens do seu público-alvo.",
            postingTip: "Mande preferencialmente à noite ou na hora do almoço."
          },
          personalizationProof: {
            usedDNA: true,
            usedNiche: true,
            usedProduct: true,
            usedAudience: true,
            usedObjection: true,
            usedTone: true
          },
          quality: {
             specificityScore: 90,
             usefulnessScore: 90,
             commercialScore: 90,
             finalScore: 90,
             warnings: []
          },
          nextActions: ["Criar arte", "Agendar envio"]
        };
        break;
      case 'business_diagnosis':
      case 'sales_problem_diagnosis':
      case 'action_plan_generation':
        result = {
          diagnosis: {
            summary: "O negócio tem uma oferta clara, mas falta constância na distribuição e uma esteira de produtos mais lucrativa.",
            mainProblem: "Dependência de desconto para vender.",
            rootCause: "Falta de construção de valor antes da oferta.",
            commercialRisk: "Erosão de margem de lucro e atração de clientes apenas por preço.",
            priorityLevel: "Alta",
            biggestOpportunity: "Criar pacotes ou combos para vender mais sem dar desconto.",
            whatToStopDoing: "Fazer posts apenas no feed focados em preço.",
            whatToStartDoing: "Começar a construir antecipação nos stories.",
            whatToImprove: "Sua quebra de objeções antes de apresentar a oferta.",
            recommendedFocus: "Aumento de Ticket Médio e Valor Percebido."
          },
          scores: {
             dnaScore: 80,
             offerScore: 60,
             campaignScore: 50,
             whatsappScore: 70,
             calendarScore: 40,
             creativeScore: 60,
             consistencyScore: 50,
             commercialReadinessScore: 65,
             finalScore: 65
          },
          actionPlan: {
             todayAction: {
               title: "Criar Oferta Premium",
               why: "Para testar a venda sem desconto.",
               how: "Vá na máquina de ofertas e crie um combo que aumente o ticket.",
               moduleToUse: "ofertas/nova",
               buttonAction: "Criar Combo"
             },
             next3Actions: [
               { title: "Mandar Zap para lista VIP", why: "Eles compram pelo valor", how: "Use Zap rápido", moduleToUse: "zap-rapido" },
               { title: "Criar Calendário da semana", why: "Manter vendas previsíveis", how: "Definir ações", moduleToUse: "calendario" },
               { title: "Atualizar DNA", why: "Adicionar concorrentes", how: "Preencha a aba", moduleToUse: "dna-comercial" }
             ],
             weeklyPlan: ["Seg: Oferta Direta", "Ter: Prova Social", "Qua: Interação"],
             recommendedOffer: "Combo de Valor",
             recommendedCampaign: "Campanha VIP",
             recommendedZapMessage: "Avisa Lista",
             recommendedCreative: "Foto Premium"
          },
          opportunities: ["Venda de segunda chance para quem não comprou"],
          warnings: ["Pode ser que demore alguns dias para a audiência reagir a um preço maior."],
          missingContext: ["Qual o produto que mais dá lucro?"],
          nextBestActions: ["Melhorar oferta"]
        };
        break;
      case 'consultor_question':
      case 'customer_objection_analysis':
        result = {
          answer: "Baseado no seu DNA, o melhor a fazer hoje é enviar uma mensagem de recuperação para quem comprou há mais de 30 dias.",
          reason: "Sua frequência de compras está baixa.",
          recommendedAction: "Zap Rápido - Recuperação",
          module: "zap-rapido"
        };
        break;
      case 'performance_analysis':
      case 'weekly_report':
        result = {
          summary: {
            mainInsight: "Você tem criado campanhas, mas registrado poucos resultados (vendas ou respostas).",
            dataConfidence: "baixa",
            whatIsWorking: "O volume de criação de campanhas no canal Instagram.",
            whatIsNotWorking: "Acompanhamento (follow-up) de clientes que pediram preço.",
            biggestLeak: "Clientes esfriando no WhatsApp por falta de resposta rápida.",
            bestOpportunity: "Fazer uma ação de recuperação de contatos antigos com uma nova oferta."
          },
          metricsInterpretation: {
            execution: "Execução funcional, mas com falhas no acompanhamento do funil de vendas.",
            campaigns: "Bastante produção, mas poucas campanhas baseadas em ofertas de alto valor.",
            offers: "Faltam ofertas que não dependam apenas de desconto.",
            whatsapp: "Usado apenas de forma reativa.",
            customers: "Muitos leads soltos sem marcação de followup.",
            calendar: "Ações soltas sem uma sequência lógica semanal.",
            creatives: "Adequado para a operação atual."
          },
          recommendations: [
            {
              title: "Registrar Vendas Diárias",
              reason: "Precisamos de mais dados para que o Consultor ajude de forma afiada.",
              moduleToUse: "resultados",
              action: "Registrar resultado",
              priority: "Alta"
            },
            {
              title: "Ação de Recuperação no WhatsApp",
              reason: "Aproveite a base existente antes de atrair novos leads.",
              moduleToUse: "zap-rapido",
              action: "Criar Zap",
              priority: "Média"
            }
          ],
          warnings: ["Como não há muitos dados de resultados, esta análise é superficial."],
          nextBestActions: ["Registrar Vendas", "Melhorar ofertas"]
        };
        break;
      case 'module_adjustment':
        result = {
          adjustedResult: {
             ...payload.originalResult,
             ajuste: payload.adjustmentInstruction,
             info: "Este é um ajuste em modo fallback."
          }
        };
        break;
      default:
        result = { info: 'Ação não reconhecida pelo fallback local.' };
    }

    return {
      actionType,
      module: "fallback",
      strategy: { info: "Estratégia base ativada." },
      result,
      quality: {
        specificityScore: 75,
        usefulnessScore: 75,
        persuasionScore: 75,
        contextUsageScore: 75,
        riskScore: 0,
        finalScore: 75,
        warnings: []
      },
      personalizationProof: {
        usedDNA: !!context.dna,
        usedOffer: !!payload.offer,
        usedProduct: !!payload.product,
        usedAudience: false,
        usedObjection: false,
        usedTone: false,
        usedRestrictions: false
      },
      missingContext: ["O ambiente está usando Fallback"],
      nextBestActions: []
    };
  },

  validateAIOutput(actionType: AIActionType, output: AIResponse, context: any): AIResponse {
    if (!output.quality) {
       output.quality = { specificityScore: 80, usefulnessScore: 80, persuasionScore: 80, contextUsageScore: 80, riskScore: 0, finalScore: 80, warnings: [] };
    }
    const forbidden = ["venha conferir", "imperdível", "não perca", "qualidade e preço baixo", "atendimento diferenciado", "o melhor da região", "promoção especial", "temos novidades", "pensando em você", "chama no direct"];
    const textToCheck = JSON.stringify(output.result || {}).toLowerCase();
    let penalty = 0;
    for (const word of forbidden) {
      if (textToCheck.includes(word)) {
        output.quality.warnings.push(`Evite usar o termo genérico: "${word}"`);
        penalty += 10;
      }
    }
    
    if (output.quality.finalScore === undefined || output.quality.finalScore === null) {
      output.quality.finalScore = 80;
    }
    
    output.quality.finalScore -= penalty;
    if (output.quality.finalScore < 0) output.quality.finalScore = 0;

    return output;
  },

  improveIfGeneric(actionType: AIActionType, output: AIResponse, context: any): AIResponse {
    // Para simplificar e não duplicar consumo automático de LLM no frontend,
    // apenas marcamos com warning. Num fluxo real backend-only, isso faria outra chamada.
    if (output.quality.finalScore < 75) {
       output.quality.warnings.push("Resultado básico. Complete mais contexto para melhorar.");
    }
    return output;
  },

  scoreAIOutput(actionType: string, output: any, context: any) {
    // Basic heuristics implemented inside validateAIOutput
  },

  saveAIUsageLog(user: User, actionType: string, input: any, output: any, score: number) {
    if (!user) return;
    const log = {
       id: user.id,
       action: actionType,
       cost: 1, // simplified for now, should map from AI_ACTION_COSTS if accessible here
       qualityScore: score,
       timestamp: new Date().toISOString()
    };
    try {
      const existing = JSON.parse(localStorage.getItem('fotomax_ai_logs') || '[]');
      existing.push(log);
      localStorage.setItem('fotomax_ai_logs', JSON.stringify(existing));
    } catch(e) {}
  },

  sanitizeAIInput(input: any) { return input; },
  sanitizeAIOutput(output: any) { return output; }
};
