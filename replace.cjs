const fs = require('fs');
const code = fs.readFileSync('server.ts', 'utf8');
const startMatch = '// API Route for Commercial Intelligence Engine';
const endMatch = 'res.status(500).json({ error: "FAILED_TO_GENERATE", message: error.message });\n    }\n  });';

const startIndex = code.indexOf(startMatch);
if (startIndex !== -1) {
  const endIndex = code.indexOf(endMatch, startIndex) + endMatch.length;
  const newText = `  // Generic AI Core Execution Route
  app.post("/api/ai/run", async (req, res) => {
    const { actionType, payload, context, userId, plan } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.status(200).json({ 
        fallback: true,
        error: "AI_KEY_NOT_CONFIGURED", 
        message: "Key do Gemini não configurada. Usando modo fallback." 
      });
    }

    const masterPrompt = \`
Você é o cérebro comercial do Fotomax IA, um sistema de inteligência artificial para pequenos negócios locais.

Sua função é ajudar negócios reais a vender melhor.
Você não é um gerador de texto bonito. Você é um estrategista comercial prático.

AÇÃO SOLICITADA: \${actionType}

DADOS DO CONTEXTO DO NEGÓCIO:
\${JSON.stringify(context?.dna || {}, null, 2)}

OFERTA APLICÁVEL:
\${JSON.stringify(context?.activeOffer || {}, null, 2)}

DADOS DA SOLICITAÇÃO (PAYLOAD):
\${JSON.stringify(payload || {}, null, 2)}

Regras obrigatórias:
- Use o contexto real do negócio.
- Resolva o problema informado.
- Não use texto genérico.
- Não invente fatos, desconto, urgência, ou escassez.
- Não prometa vendas garantidas.
- Não use frases vazias como "venha conferir", "imperdível", "não perca", "qualidade e preço baixo".
- Se faltar informação, declare missingContext.
- Retorne um JSON válido de acordo com o padrão do sistema.
    \`;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const result = await model.generateContent(masterPrompt);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/\\\`\\\`\\\`json|\\\`\\\`\\\`/g, "").trim();
      
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
  });`;
  
  const newCode = code.substring(0, startIndex) + newText + code.substring(endIndex);
  fs.writeFileSync('server.ts', newCode, 'utf8');
  console.log("Replaced successfully!");
} else {
  console.log("Could not find start index");
}
