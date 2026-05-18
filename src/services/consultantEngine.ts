import { aiCore } from '../lib/ai/aiCore';
import { BusinessDiagnosis, User, BusinessDNA, Offer, Campaign, SalesCalendar, CreativeProject } from '../types';

export const consultantEngine = {
  buildSummary(offers: Offer[], campaigns: Campaign[], calendars: SalesCalendar[], creatives: CreativeProject[]) {
    return {
      offersCount: offers.length,
      offersExample: offers.slice(0, 2).map((o: any) => o.outputs?.shortOffer || o.id),
      campaignsCount: campaigns.length,
      campaignsExample: campaigns.slice(0, 2).map((c: any) => c.outputs?.campaignName || c.product || c.id),
      calendarsCount: calendars.length,
      creativesCount: creatives.length
    };
  },

  calculateCommercialReadinessScore(businessDNA: BusinessDNA | null, summary: any): number {
    let score = 0;
    
    // DNA: 20 points
    if (businessDNA && businessDNA.basics?.businessName) {
      score += 5;
      if (businessDNA.audience?.customerPainPoints) score += 5;
      if (businessDNA.products?.mainProducts) score += 5;
      if (businessDNA.audience?.customerObjections) score += 5;
    }
    
    // Offers: 15 points
    if (summary.offersCount > 0) score += 5;
    if (summary.offersCount > 3) score += 10;

    // Campaigns: 15 points
    if (summary.campaignsCount > 0) score += 5;
    if (summary.campaignsCount > 2) score += 10;
    
    // Zap: 15 points
    // Basic sim points for Zap since we don't store it separately from campaigns yet
    score += 5; 
    
    // Calendar: 15 points
    if (summary.calendarsCount > 0) score += 10;
    if (summary.calendarsCount > 1) score += 5;
    
    // Creatives: 10 points
    if (summary.creativesCount > 0) score += 5;
    if (summary.creativesCount > 2) score += 5;
    
    // History/Execution: 10 points
    if (summary.offersCount > 0 && summary.campaignsCount > 0 && summary.calendarsCount > 0) score += 10;

    return Math.min(100, Math.max(0, score));
  },

  async runDiagnosis(input: any, businessDNA: BusinessDNA | null, summary: any, user: User): Promise<any> {
    const aiResponse = await aiCore.runAIAction('business_diagnosis', {
      module: 'consultant',
      dna: businessDNA,
      summary,
      input
    }, user);
    
    return aiResponse;
  },

  async askConsultant(question: string, context: any, user: User): Promise<any> {
    const aiResponse = await aiCore.runAIAction('consultor_question', {
      module: 'consultant',
      question,
      context
    }, user);
    
    return aiResponse;
  },
  
  async generateActionPlan(context: any, user: User): Promise<any> {
    const aiResponse = await aiCore.runAIAction('action_plan_generation', {
      module: 'consultant',
      context
    }, user);
    
    return aiResponse;
  }
};
