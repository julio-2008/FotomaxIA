import { User, PlanTier, AI_ACTION_COSTS, UsageEvent, UserUsage } from '../types';
import { v4 as uuidv4 } from 'uuid';

export type AIActionType = keyof typeof AI_ACTION_COSTS | string;

export const PLAN_LIMITS = {
  trial: {
    totalCredits: 1,
    imageCreditsLimit: 0,
    resetMonthly: false,
    allowedActions: [
      "offer_generation",
      "campaign_generation",
      "zap_message",
      "creative_brief"
    ],
    blockedActions: ["*"],
    maxContacts: 0,
    maxSavedItems: 1,
    improvementLimit: 0,
    variationLimit: 0,
    businessProfilesLimit: 1,
    customerLimit: 0,
    calendarWeekPlanLimit: 0
  },
  essential: {
    totalCredits: 30,
    imageCreditsLimit: 0,
    resetMonthly: true,
    allowedActions: [
      "offer_generation",
      "offer_improvement",
      "campaign_generation",
      "campaign_improvement",
      "zap_message",
      "zap_followup",
      "zap_objection_reply",
      "creative_brief",
      "image_prompt",
      "library_adapt_to_dna",
      "cardapio_generation",
      "vitrine_generation",
      "agenda_message",
      "old_customer_message",
      "product_stuck_offer",
      "module_adjustment",
      "improvement",
      "variation"
    ],
    blockedActions: [
      "image_generation",
      "image_editing",
      "business_diagnosis",
      "weekly_report",
      "calendar_week_plan"
    ],
    maxContacts: 100,
    maxSavedItems: 200,
    improvementLimit: 10,
    variationLimit: 5,
    businessProfilesLimit: 1,
    customerLimit: 100,
    calendarWeekPlanLimit: 0
  },
  pro: {
    totalCredits: 80,
    imageCreditsLimit: 5,
    resetMonthly: true,
    allowedActions: ["*"],
    maxContacts: 500,
    maxSavedItems: 1000,
    improvementLimit: 30,
    variationLimit: 20,
    businessProfilesLimit: 1,
    customerLimit: 500,
    calendarWeekPlanLimit: 4
  },
  max: {
    totalCredits: 180,
    imageCreditsLimit: 20,
    resetMonthly: true,
    allowedActions: ["*"],
    maxBusinessProfiles: 3,
    maxContacts: 2000,
    maxSavedItems: 5000,
    improvementLimit: 80,
    variationLimit: 50,
    businessProfilesLimit: 3,
    customerLimit: 2000,
    calendarWeekPlanLimit: 8
  }
};

export const usageGuard = {
  getPlanLimits(plan: PlanTier) {
    return PLAN_LIMITS[plan] || PLAN_LIMITS.trial;
  },

  getActionCost(actionType: AIActionType): number {
    return (AI_ACTION_COSTS as any)[actionType] || 1;
  },

  isActionAllowedForPlan(plan: PlanTier, actionType: AIActionType): boolean {
    const limits = this.getPlanLimits(plan);
    
    // Trial logic is strict
    if (plan === 'trial') {
      return limits.allowedActions.includes(actionType as string);
    }

    // Pro and Max allowed all unless explicitly blocked (unlikely if * is used)
    if (limits.allowedActions && limits.allowedActions.includes("*")) {
      if (limits.blockedActions && limits.blockedActions.includes(actionType as string)) {
        return false;
      }
      return true;
    }

    return limits.allowedActions.includes(actionType as string);
  },

  checkRateLimit(user: User, actionType: AIActionType): { can: boolean; reason?: string } {
    const usage = user.usage;
    const now = new Date();
    
    if (usage.rateLimit?.blockedUntil && new Date(usage.rateLimit.blockedUntil) > now) {
      return { can: false, reason: "Muitas solicitações. Aguarde um minuto." };
    }

    if (usage.rateLimit?.lastRequestAt) {
      const last = new Date(usage.rateLimit.lastRequestAt);
      const diffMs = now.getTime() - last.getTime();
      
      const rates = {
        trial: { minute: 1, hour: 1 },
        essential: { minute: 3, hour: 10 },
        pro: { minute: 10, hour: 80 },
        max: { minute: 20, hour: 150 }
      };
      const limit = rates[user.plan] || rates.trial;

      if (usage.rateLimit.requestsLastMinute >= limit.minute && diffMs < 60000) {
        return { can: false, reason: "Muitas solicitações em pouco tempo. Aguarde um minuto." };
      }
      
      if (usage.rateLimit.requestsLastHour >= limit.hour && diffMs < 3600000) {
        return { can: false, reason: "Limite de solicitações por hora atingido." };
      }
    }
    
    return { can: true };
  },

  canUseAI(user: User | null, actionType: AIActionType): { can: boolean; reason?: string; errorCode?: string; cost?: number } {
    if (!user) return { can: false, reason: 'Usuário não autenticado.', errorCode: 'AUTH_REQUIRED' };

    const cost = this.getActionCost(actionType);
    const planLimits = this.getPlanLimits(user.plan);
    const isImageAction = actionType === 'image_generation' || actionType === 'image_editing';

    // 1. Rate Limiting
    const rateCheck = this.checkRateLimit(user, actionType);
    if (!rateCheck.can) {
      return { can: false, reason: rateCheck.reason, errorCode: 'RATE_LIMITED' };
    }

    // 2. Action Allowed for Plan
    if (!this.isActionAllowedForPlan(user.plan, actionType)) {
      return { can: false, reason: 'Esse recurso não está disponível no seu plano atual.', errorCode: 'ACTION_UNAVAILABLE' };
    }

    // 3. Trial Logic
    if (user.plan === 'trial') {
      if (user.usage.trialUsed) {
        return { can: false, reason: 'Seu teste grátis (1 criação) já foi concluído.', errorCode: 'TRIAL_EXHAUSTED' };
      }
      return { can: true, cost: 1 };
    }

    // 4. Paid Plan Logic
    if (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'test') {
      return { can: false, reason: 'Sua assinatura precisa estar ativa para usar este recurso.', errorCode: 'INACTIVE_SUB' };
    }

    // Check specific Image Limits if it's an image action
    if (isImageAction) {
      const remainingMonthlyImages = (planLimits.imageCreditsLimit || 0) - (user.usage.monthlyImagesUsed || 0);
      const remainingExtraImages = (user.usage.extraImagesLimit || 0) - (user.usage.extraImagesUsed || 0);
      
      if (remainingMonthlyImages <= 0 && remainingExtraImages <= 0) {
        return { can: false, reason: 'Você atingiu seu limite de imagens. Adquira créditos extras ou aguarde o próximo mês.', errorCode: 'IMAGE_LIMIT_REACHED' };
      }
    }

    // Check generic credits
    const remainingMonthly = planLimits.totalCredits - (user.usage.monthlyCreditsUsed || 0);
    const remainingExtra = (user.usage.extraCreditsLimit || 0) - (user.usage.extraCreditsUsed || 0);
    const totalRemaining = remainingMonthly + remainingExtra;

    if (totalRemaining < cost) {
      return { can: false, reason: 'Créditos insuficientes. Adquira um pacote extra ou aguarde o reset mensal.', errorCode: 'INSUFFICIENT_CREDITS' };
    }

    return { can: true, cost };
  },

  getUserUsage(user: User): UserUsage {
    return user.usage;
  },

  getUsageSummary(user: User) {
    if (user.plan === 'trial') {
      const used = user.usage.trialUsed ? 1 : 0;
      return {
        text: `${used} / 1 usado`,
        label: used ? 'Teste Esgotado' : 'Teste Grátis: 1 criação'
      };
    }
    const limits = this.getPlanLimits(user.plan);
    const used = user.usage.monthlyCreditsUsed || 0;
    const extraUsed = user.usage.extraCreditsUsed || 0;
    const extraLimit = user.usage.extraCreditsLimit || 0;
    
    return {
      text: `${used + extraUsed} de ${limits.totalCredits + extraLimit} créditos usados`,
      label: user.plan.toUpperCase(),
      monthlyUsed: used,
      monthlyLimit: limits.totalCredits,
      extraUsed,
      extraLimit,
      imagesUsed: (user.usage.monthlyImagesUsed || 0) + (user.usage.extraImagesUsed || 0),
      imagesLimit: (limits.imageCreditsLimit || 0) + (user.usage.extraImagesLimit || 0)
    };
  },

  resetMonthlyUsageIfNeeded(user: User): User {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (user.plan === 'trial' || user.usage.usageMonth === currentMonth) {
      return user;
    }

    let cloned: User = JSON.parse(JSON.stringify(user));
    cloned.usage.monthlyCreditsUsed = 0;
    cloned.usage.monthlyImagesUsed = 0;
    cloned.usage.actionUsage = {};
    cloned.usage.usageMonth = currentMonth;
    
    // Legacy reset
    cloned.usage.usedCredits = 0;
    cloned.usage.currentMonthCampaigns = 0;

    return cloned;
  },

  consumeCredits(user: User, actionType: AIActionType, resultId?: string): User {
    const cost = this.getActionCost(actionType);
    const isImage = actionType === 'image_generation' || actionType === 'image_editing';
    const now = new Date().toISOString();
    
    let updatedUser: User = JSON.parse(JSON.stringify(user));
    const limits = this.getPlanLimits(updatedUser.plan);

    if (!updatedUser.usage.actionUsage) updatedUser.usage.actionUsage = {};
    if (!updatedUser.usage.rateLimit) updatedUser.usage.rateLimit = { requestsLastMinute: 0, requestsLastHour: 0 };

    if (updatedUser.plan === 'trial') {
      updatedUser.usage.trialUsed = true;
      updatedUser.usage.trialUsedAt = now;
      updatedUser.usage.trialActionType = actionType;
      updatedUser.usage.trialOutputId = resultId;
    } else {
      // 1. Handle Images if applicable
      if (isImage) {
        const remainingMonthlyImages = (limits.imageCreditsLimit || 0) - (updatedUser.usage.monthlyImagesUsed || 0);
        if (remainingMonthlyImages > 0) {
          updatedUser.usage.monthlyImagesUsed = (updatedUser.usage.monthlyImagesUsed || 0) + 1;
        } else {
          updatedUser.usage.extraImagesUsed = (updatedUser.usage.extraImagesUsed || 0) + 1;
        }
      }

      // 2. Handle Credits
      let remainingCost = cost;
      
      const remainingMonthly = limits.totalCredits - (updatedUser.usage.monthlyCreditsUsed || 0);
      if (remainingMonthly > 0) {
        const consumeFromMonthly = Math.min(remainingMonthly, remainingCost);
        updatedUser.usage.monthlyCreditsUsed = (updatedUser.usage.monthlyCreditsUsed || 0) + consumeFromMonthly;
        remainingCost -= consumeFromMonthly;
      }
      
      if (remainingCost > 0) {
        updatedUser.usage.extraCreditsUsed = (updatedUser.usage.extraCreditsUsed || 0) + remainingCost;
      }
      
      // Update legacy fields
      updatedUser.usage.usedCredits = (updatedUser.usage.usedCredits || 0) + cost;
    }

    updatedUser.usage.actionUsage[actionType as string] = (updatedUser.usage.actionUsage[actionType as string] || 0) + 1;
    updatedUser.usage.rateLimit.lastRequestAt = now;
    updatedUser.usage.rateLimit.requestsLastMinute++;
    updatedUser.usage.rateLimit.requestsLastHour++;
    
    return updatedUser;
  },

  saveUsageEvent(event: Partial<UsageEvent>) {
    // Front-end: just log to console or localStorage.
    // In backend this would save to DB.
    const newEvent: UsageEvent = {
        id: uuidv4(),
        userId: event.userId || 'unknown',
        createdAt: new Date().toISOString(),
        actionType: event.actionType || 'unknown',
        module: event.module || 'unknown',
        cost: event.cost || 0,
        plan: event.plan || 'unknown',
        allowed: !!event.allowed,
        deniedReason: event.deniedReason,
        resultId: event.resultId,
        aiMode: event.aiMode || 'real_ai',
        success: !!event.success
    };
    
    try {
        const events = JSON.parse(localStorage.getItem('fotomax_usage_events') || '[]');
        events.push(newEvent);
        localStorage.setItem('fotomax_usage_events', JSON.stringify(events));
    } catch(e) { /* ignore */ }
  }
};
