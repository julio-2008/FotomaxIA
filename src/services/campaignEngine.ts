import { BusinessDNA, Offer, Campaign, CampaignInput } from '../types';
import { aiCore } from '../lib/ai/aiCore';
import { v4 as uuidv4 } from 'uuid';

export interface CampaignEngineContext {
  input: CampaignInput;
  businessDNA: BusinessDNA | null;
  offer: Offer | null;
}

export const campaignEngine = {
  buildCampaignContext(input: CampaignInput, businessDNA: BusinessDNA | null, offer: Offer | null): CampaignEngineContext {
    return {
      input,
      businessDNA,
      offer
    };
  },

  chooseCampaignType(context: CampaignEngineContext): string {
    const obj = context.input.campaignObjective;
    if (obj) return obj;
    return 'vender_hoje';
  },

  async generateCampaignWithAI(context: CampaignEngineContext, user: any): Promise<any> {
    const aiResponse = await aiCore.runAIAction('campaign_generation', {
      module: 'campaign',
      campaignObjective: context.input?.campaignObjective,
      productOrService: context.input?.productOrService,
      price: context.input?.price,
      promotion: context.input?.promotion,
      targetAudience: context.input?.targetAudience,
      channel: context.input?.channel,
      tone: context.input?.tone,
      desiredAction: context.input?.desiredAction,
      mainObjection: context.input?.mainObjection,
      restrictions: context.input?.restrictions,
      offer: context.offer
    }, user);

    return aiResponse;
  },

  async improveCampaign(campaign: Campaign, context: CampaignEngineContext, user: any): Promise<any> {
    const aiResponse = await aiCore.runAIAction('campaign_improvement', {
      module: 'campaign',
      campaignObjective: context.input?.campaignObjective,
      productOrService: context.input?.productOrService,
      currentCampaign: campaign.outputs,
      offer: context.offer
    }, user);

    return aiResponse;
  },

  adaptCampaignToChannel(campaign: Campaign, channel: string): any {
    return {};
  },

  validateCampaign(campaignData: any): string[] {
    return campaignData?.quality?.warnings || [];
  }
};
