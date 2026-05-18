import { aiCore } from '../lib/ai/aiCore';
import { User, ActivityEvent, ResultRecord, LearningProfile } from '../types';

export const analyticsEngine = {
  calculateExecutionScore(events: ActivityEvent[], results: ResultRecord[]): number {
    let score = 0;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentEvents = events.filter(e => new Date(e.createdAt) > weekAgo);
    
    const plannedCompleted = recentEvents.filter(e => e.eventType === 'calendar_action_done');
    const followupDone = recentEvents.filter(e => e.eventType === 'followup_done');
    const campaignsUsed = recentEvents.filter(e => e.eventType === 'campaign_used');

    // ações planejadas concluídas: 25 pontos
    score += Math.min(25, plannedCompleted.length * 5);
    // follow-ups feitos: 20 pontos
    score += Math.min(20, followupDone.length * 5);
    // campanhas usadas: 15 pontos
    score += Math.min(15, campaignsUsed.length * 5);
    
    // resultados registrados: 15 pontos
    score += Math.min(15, results.length * 3);
    
    // constância semanal: 15 pontos
    const uniqueDays = new Set(recentEvents.map(e => new Date(e.createdAt).toLocaleDateString())).size;
    score += Math.min(15, uniqueDays * 3);

    // recuperação de clientes: 10 pontos
    const reactivations = events.filter(e => e.eventType === 'customer_reactivated');
    score += Math.min(10, reactivations.length * 5);

    return Math.min(100, Math.max(0, score));
  },

  getModuleMetrics(module: string, events: ActivityEvent[], results: ResultRecord[]) {
    const modEvents = events.filter(e => e.module === module);
    const modResults = results.filter(r => r.sourceModule === module);
    
    return {
      eventsCount: modEvents.length,
      resultsCount: modResults.length,
      // further stats...
    };
  },

  async runPerformanceAnalysis(payload: any, user: User | null) {
    return await aiCore.runAIAction('performance_analysis', payload, user);
  },
  
  async runWeeklyReport(payload: any, user: User | null) {
    return await aiCore.runAIAction('weekly_report', payload, user);
  },

  updateLearningProfileLocally(events: ActivityEvent[], results: ResultRecord[], user: User): LearningProfile {
    // A simplified extraction from tracking records
    const topProducts = Array.from(new Set(results.filter(r => r.productOrService).map(r => r.productOrService as string))).slice(0, 3);
    const topChannels = Array.from(new Set(results.filter(r => r.channel).map(r => r.channel as string))).slice(0, 3);
    
    return {
      userId: user.id,
      updatedAt: new Date().toISOString(),
      topProducts,
      topChannels,
      frequentObjections: [], // to be extracted by AI
      bestCampaignTypes: [],
      bestOfferTypes: [],
      bestZapTypes: [],
      activeCustomerSegments: [],
      weakDays: [],
      strongDays: [],
      recommendations: []
    };
  }
};
