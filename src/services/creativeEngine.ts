import { aiCore } from '../lib/ai/aiCore';
import { CreativeProject, User, BusinessDNA, Offer, Campaign } from '../types';

export const creativeEngine = {
  buildCreativeContext(input: any, businessDNA: BusinessDNA | null, offer: Offer | null, campaign: Campaign | null) {
    return {
      input,
      dna: businessDNA,
      offerSnapshot: offer,
      campaignSnapshot: campaign
    };
  },

  async generateCreativeBrief(context: any, user: User): Promise<any> {
    const aiResponse = await aiCore.runAIAction('creative_brief', {
      module: 'creative',
      objective: context.input.creativeGoal,
      product: context.input.productOrService,
      channel: context.input.channel,
      visualStyle: context.input.visualStyle,
      restrictions: context.input.restrictions,
      offer: context.offerSnapshot?.outputs.shortOffer || context.input.offer 
    }, user);

    return aiResponse;
  },

  async analyzeProductPhoto(context: any, user: User): Promise<any> {
    const aiResponse = await aiCore.runAIAction('visual_diagnosis', {
      module: 'creative',
      product: context.input.productOrService,
      objective: context.input.creativeGoal,
      offer: context.offerSnapshot?.outputs.shortOffer || context.input.offer
    }, user);
    
    return aiResponse;
  },

  validateCreativeOutput(output: any, context: any): string[] {
    const warnings: string[] = [];
    if (output.quality?.finalScore < 75) {
      warnings.push("Este criativo ainda pode ficar mais forte.");
    }
    return warnings;
  }
};
