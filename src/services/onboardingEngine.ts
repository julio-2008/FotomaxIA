import { OnboardingProfile, BusinessDNA, User } from '../types';
import { aiCore } from '../lib/ai/aiCore';

export const onboardingEngine = {
  createMiniDNAFromOnboarding(profile: OnboardingProfile, userId: string): Partial<BusinessDNA> {
    return {
      basics: {
        businessName: profile.businessName,
        businessType: profile.businessType as any,
        niche: profile.businessType, // Using businessType as niche for now
        city: profile.city || ''
      },
      products: {
        mainProducts: profile.productOrService ? [profile.productOrService] : [],
        lowTicketOffer: '',
        highTicketOffer: '',
        productBenefits: []
      },
      audience: {
        targetAudience: profile.targetAudience,
        customerPainPoints: [],
        customerObjections: profile.mainObjection ? [profile.mainObjection] : []
      },
      sales: {
        currentPriority: profile.currentProblem as any,
        mainSalesChannel: profile.channel as any
      },
      // dnaSource: "quick_onboarding",
      // dnaCompletionStatus: "partial"
    } as any;
  },

  async generateFirstWin(profile: OnboardingProfile, user: User | null) {
    let actionType: any = 'campaign_generation';
    const problem = profile.currentProblem;

    if (problem === 'criar oferta') actionType = 'library_generate_model'; 
    else if (problem === 'recuperar cliente') actionType = 'customer_objection_analysis'; 
    else if (problem === 'mensagem para WhatsApp') actionType = 'customer_objection_analysis'; // Placeholder for zap
    
    // Adjusting to actual aiCore actions
    // if (problem === 'vender hoje') ...
    
    const payload = {
      objective: profile.currentProblem,
      product: profile.productOrService,
      audience: profile.targetAudience,
      objection: profile.mainObjection,
      channel: profile.channel
    };

    return await aiCore.runAIAction(actionType, payload, user);
  }
};
