import { Offer, OfferInput, OfferStrategy, OfferOutputs, OfferQuality, BusinessDNA } from '../types';
import { aiCore } from '../lib/ai/aiCore';

export const offerEngine = {
  buildOfferContext(input: OfferInput, dna?: BusinessDNA) {
    return {
      input,
      dna: dna ? {
        businessName: dna.basics.businessName,
        niche: dna.basics.niche,
        mainAudience: dna.audience.primaryCustomerProfile,
        tone: dna.brandVoice.brandTone,
        competitors: dna.positioning.mainCompetitors,
        differential: dna.positioning.uniqueSellingPoint,
        rules: dna.offerRules,
        restrictions: dna.restrictions
      } : null
    };
  },

  async generateOfferWithAI(context: any, user: any): Promise<any> {
    const aiResponse = await aiCore.runAIAction('offer_generation', {
      module: 'offer',
      productOrService: context.input?.productOrService,
      originalPrice: context.input?.originalPrice,
      desiredPrice: context.input?.desiredPrice,
      objective: context.input?.objective,
      targetAudience: context.input?.targetAudience,
      mainObjection: context.input?.mainObjection,
      discountAllowed: context.input?.discountAllowed,
      maxDiscount: context.input?.maxDiscount,
      deliveryAvailable: context.input?.deliveryAvailable,
      availableBonus: context.input?.availableBonus
    }, user);

    return aiResponse;
  },

  async improveOffer(offer: Offer, user: any): Promise<any> {
    const aiResponse = await aiCore.runAIAction('offer_improvement', {
      module: 'offer',
      currentOffer: offer.outputs,
      objective: offer.input?.objective,
      productOrService: offer.input?.productOrService
    }, user);

    return aiResponse;
  },

  validateOffer(generated: any): OfferQuality {
    return {
      clarityScore: generated.quality?.clarityScore || 90,
      specificityScore: generated.quality?.specificityScore || 90,
      urgencyScore: generated.quality?.urgencyScore || 90,
      valueScore: generated.quality?.valueScore || 90,
      trustScore: generated.quality?.trustScore || 90,
      riskScore: generated.quality?.riskScore || 90,
      finalScore: generated.quality?.finalScore || 90,
      warnings: generated.quality?.warnings || []
    };
  },

  generateOfferFallback(context: any): any {
    return {
      strategy: {
        offerName: "Máquina de Oferta Simples",
        offerAngle: "Abordagem Direta",
        whyThisOffer: "Porque atende a necessidade.",
        bonusStrategy: "Nenhum",
        guaranteeStrategy: "Padrão Legal",
        scarcityType: "Tempo",
        objectionBreak: "Garantia de Qualidade",
        pricingStrategy: "Ancoragem"
      },
      outputs: {
        offerName: (context.input?.productOrService || 'Produto') + ' Especial',
        shortOffer: `Compre ${context.input?.productOrService || 'nosso produto'} por ${context.input?.desiredPrice || 'um preço especial'}.`,
        completeOffer: `Esta é a nossa oferta de ${context.input?.productOrService || 'Produto'}. Por apenas ${context.input?.desiredPrice || 'este valor'}, você resolve seu problema.`,
        whatsappOffer: `Oi! Temos uma oferta especial hoje de ${context.input?.productOrService || 'Produto'} por apenas ${context.input?.desiredPrice || 'este valor'}. Vai querer?`,
        instagramOffer: `Novidade! ${context.input?.productOrService || 'Produto'} por um preço especial. Chame no direct.`,
        storyOffer: `Story 1: Mostra o problema.\\nStory 2: Apresenta ${context.input?.productOrService || 'Produto'}.\\nStory 3: CTA para o link.`,
        objectionBreakText: "Se não gostar, devolvemos seu dinheiro.",
        bonusText: context.input?.availableBonus || "Sem bônus específico.",
        ctaOptions: ["Comprar agora", "Saber mais"],
        urgencyElement: "Válido apenas hoje"
      },
      quality: {
         clarityScore: 75,
         specificityScore: 75,
         urgencyScore: 75,
         valueScore: 75,
         trustScore: 75,
         riskScore: 75,
         finalScore: 75,
         warnings: []
      }
    };
  }
};
