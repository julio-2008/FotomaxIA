import { BusinessDNA, Offer, Campaign, CreativeProject, User } from '../../types';
import { aiCore } from '../../services/aiCore';
import { v4 as uuidv4 } from 'uuid';

export const creativeEngine = {
  buildCreativeContext(input: any, dna?: BusinessDNA, offer?: Offer, campaign?: Campaign) {
    return {
      dna,
      activeOffer: offer,
      activeCampaign: campaign,
      creativeInput: input
    };
  },

  async runCreativeGeneration(
    actionType: "creative_brief" | "image_prompt" | "visual_diagnosis",
    input: any,
    user: User | null,
    dna?: BusinessDNA,
    offer?: Offer,
    campaign?: Campaign
  ): Promise<any> {
    const context = this.buildCreativeContext(input, dna, offer, campaign);
    return await aiCore.run(actionType, { input, context });
  },

  async generateImageReal(
    input: any,
    user: User | null
  ): Promise<any> {
    if (!user) return { success: false, error: 'User not found' };
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${BASE_URL}/api/image/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          plan: user.plan,
          currentUsage: user.usage,
          payload: input
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || data.error };
      }
      return data;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async editImageReal(
    input: any,
    user: User | null
  ): Promise<any> {
     if (!user) return { success: false, error: 'User not found' };
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${BASE_URL}/api/image/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          plan: user.plan,
          currentUsage: user.usage,
          payload: input
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || data.error };
      }
      return data;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getPreservationRules() {
    return {
      priority: [
        "preservar produto",
        "manter realismo",
        "melhorar apresentação",
        "aumentar apelo comercial"
      ],
      never: [
        "trocar produto",
        "redesenhar produto",
        "mudar tamanho/proporção",
        "mudar embalagem",
        "inventar ingrediente",
        "remover característica real do produto",
        "alterar textura real",
        "transformar em CGI",
        "exagerar cor artificialmente",
        "criar produto idealizado"
      ],
      canDo: [
        "melhorar luz",
        "melhorar contraste",
        "melhorar nitidez",
        "reduzir distrações",
        "limpar fundo (se permitido)",
        "ajustar enquadramento",
        "deixar mais comercial",
        "criar ambiente minimalista (se permitido)",
        "valorizar percepção sem alterar produto"
      ]
    };
  },

  validateCreativeOutput(output: any): { valid: boolean; score: number; warnings: string[] } {
    const warnings: string[] = [];
    let score = 90;

    if (!output?.strategy?.mainFocus) {
      warnings.push("Foco principal não foi definido claramente na estratégia.");
      score -= 10;
    }
    
    if (!output?.result?.imagePrompt && !output?.result?.creativeBrief) {
       warnings.push("Saída fraca: nem prompt nem briefing foram gerados adequadamente.");
       score -= 30;
    }

    if (output?.result?.imagePrompt && output.result.imagePrompt.includes("uma imagem bonita")) {
       warnings.push("Prompt genérico detectado.");
       score -= 20;
    }

    return { 
      valid: score >= 75,
      score: Math.max(0, score),
      warnings 
    };
  }
};
