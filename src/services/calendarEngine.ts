import { aiCore } from '../lib/ai/aiCore';
import { SalesCalendar, SalesCalendarDayItem, User, BusinessDNA, Offer, Campaign } from '../types';

export const calendarEngine = {
  buildCalendarContext(user: User, businessDNA: BusinessDNA | null, offers: Offer[], campaigns: Campaign[], history: SalesCalendar[], input: any) {
    return {
      input,
      dna: businessDNA,
      recentOffers: offers.slice(0, 5),
      recentCampaigns: campaigns.slice(0, 5),
      recentHistory: history.slice(0, 3)
    };
  },

  async generateWeeklyPlan(context: any, user: User): Promise<any> {
    const aiResponse = await aiCore.runAIAction('calendar_week_plan', {
      module: 'calendar',
      objective: context.input.objective,
      focusProducts: context.input.focusProducts,
      intensity: context.input.intensity,
      channels: context.input.channels,
      restrictions: context.input.restrictions,
      expectedFormat: {
        strategy: { period: "semana", mainGoal: "...", weeklyTheme: "...", focusProducts: [], focusChannels: [], whyThisPlan: "...", riskWarnings: [] },
        days: [{ date: "...", weekday: "...", commercialGoal: "...", actionType: "...", channel: "...", productOrService: "...", title: "...", idea: "...", reasonWhy: "...", contentDraft: "...", whatsappDraft: "...", storyDraft: "...", cta: "...", suggestedTime: "...", priority: "...", effortLevel: "...", expectedImpact: "...", warnings: [] }]
      }
    }, user);

    return aiResponse;
  },

  async generateMonthlyPlan(context: any, user: User): Promise<any> {
    const aiResponse = await aiCore.runAIAction('calendar_month_plan', {
      module: 'calendar',
      objective: context.input.objective,
      focusProducts: context.input.focusProducts,
      intensity: context.input.intensity,
      channels: context.input.channels,
      restrictions: context.input.restrictions,
    }, user);

    return aiResponse;
  },

  validateCalendarPlan(generated: any): string[] {
    const warnings: string[] = [];
    
    if (generated.quality?.finalScore < 75) {
      warnings.push("O calendário atual carece de assertividade e pode parecer genérico.");
    }
    
    if (!generated.personalizationProof?.usedDNA) {
      warnings.push("O calendário ignorou o DNA Comercial.");
    }

    return warnings;
  }
};
