// Action Types definition
export type ActionType = 
  | 'dna_summary' | 'dna_diagnosis' | 'dna_recommendations'
  | 'offer_generation' | 'offer_improvement' | 'offer_diagnosis' | 'offer_variation'
  | 'campaign_generation' | 'campaign_improvement' | 'campaign_variation' | 'campaign_channel_adaptation'
  | 'zap_message' | 'zap_followup' | 'zap_objection_reply' | 'zap_broadcast' | 'zap_status'
  | 'creative_brief' | 'image_prompt' | 'visual_diagnosis' | 'image_generation_request'
  | 'library_adapt_to_dna' | 'library_personalize_template'
  | 'business_diagnosis' | 'consultor_question' | 'action_plan_generation'
  | 'calendar_day_idea' | 'calendar_week_plan'
  | 'customer_followup_message' | 'customer_reactivation_message' | 'customer_objection_reply'
  | 'performance_analysis' | 'weekly_report'
  | 'module_adjustment';

export interface AIResult {
  success: boolean;
  data?: any;
  error?: string;
  isFallback?: boolean;
}

const runFallback = (actionType: ActionType, payload: any) => {
  // Simple fallbacks for offline viewing
  return {
    actionType,
    module: 'fallback',
    strategy: { notice: 'Modo Offline Ativo' },
    result: { 
      headline: `Nova oferta: ${payload.input?.productOrService || 'Produto Especial'}`,
      description: `Aproveite hoje nosso ${payload.input?.productOrService || 'Produto Especial'} para resolver seu problema. Compre agora e resolva.`
    },
    quality: { specificityScore: 30, usefulnessScore: 30, finalScore: 30, warnings: ['Modo fallback local'] },
    personalizationProof: { usedDNA: false },
    missingContext: [],
    nextBestActions: []
  };
};

export const aiCore = {
  run: async (actionType: ActionType, payload: any, context?: any, userId?: string, plan?: string, currentUsage?: any): Promise<AIResult> => {
     try {
       const API_URL = import.meta.env.VITE_API_URL || '';
       const response = await fetch(`${API_URL}/api/ai/run`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           actionType,
           payload,
           context,
           userId,
           plan,
           currentUsage
         })
       });

       if (!response.ok) {
         if (response.status === 403) {
            const data = await response.json();
            return { success: false, error: data.message || 'Limite atingido' };
         }
         return { success: false, error: 'Erro de comunicação com a inteligência artificial.' };
       }

       const data = await response.json();
       
       if (data.fallback) {
           const fallbackResponse = runFallback(actionType, payload);
           return { success: true, data: fallbackResponse, isFallback: true, error: data.message };
       }

       if (data.parsingError) {
          // If Gemini couldn't output JSON, format it safely
          return { success: true, data: { result: { text: data.result } }, isFallback: false };
       }

       return { success: true, data: data, isFallback: false };
     } catch (e: any) {
        console.error("AI Error:", e);
        const fallbackResponse = runFallback(actionType, payload);
        return { success: true, data: fallbackResponse, isFallback: true };
     }
  },

  evaluateResult: async (content: string, niche: string): Promise<{ score: number; feedback: string }> => {
    // Heuristic analysis for Beta Controlled
    let score = 75;
    const feedback: string[] = [];

    const genericTerms = ['imperdível', 'não perca', 'venha conferir', 'melhor da região', 'qualidade e preço', 'promoção especial', 'lead', 'funil'];
    const foundBadTerms = genericTerms.filter(term => content.toLowerCase().includes(term));
    
    if (foundBadTerms.length > 0) {
      score -= foundBadTerms.length * 10;
      feedback.push(`Evite termos genéricos/marketeiros: ${foundBadTerms.join(', ')}`);
    }

    if (content.length < 40) {
      score -= 20;
      feedback.push('O conteúdo está muito curto ou vago');
    }

    if (!content.includes('?')) {
      score -= 10;
      feedback.push('Sempre termine com uma pergunta para gerar conversa (CTA)');
    }

    if (content.toLowerCase().includes(niche.toLowerCase())) {
      score += 10;
    } else {
      score -= 10;
      feedback.push(`O texto deve citar explicitamente elementos de ${niche}`);
    }

    return { 
      score: Math.max(0, Math.min(100, score)), 
      feedback: feedback.length > 0 ? feedback.join('. ') : 'Excelente! Conteúdo comercial, humano e fácil de usar.' 
    };
  }
};
