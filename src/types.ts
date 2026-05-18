export type BusinessType = 'pizzaria' | 'hamburgueria' | 'acaiteria' | 'salao' | 'barbearia' | 'estetica' | 'loja_roupa' | 'mercado' | 'outro';
export type Tone = 'direto' | 'premium' | 'popular' | 'engracado' | 'urgente' | 'elegante' | 'provocativo';
export type Goal = 'vender_hoje' | 'lotar_agenda' | 'divulgar_promocao' | 'recuperar_cliente' | 'lancar_novidade' | 'produto_parado' | 'produto_lucrativo' | 'aumentar_ticket' | 'dia_fraco' | 'fim_de_semana' | 'prova_social' | 'objecao_preco' | 'campanha_premium' | 'campanha_popular' | 'campanha_whatsapp';
export type Channel = 'instagram_feed' | 'story' | 'whatsapp_status' | 'whatsapp_msg' | 'todos';

export type PlanTier = 'trial' | 'essential' | 'pro' | 'max';

export const AI_ACTION_COSTS = {
  // Texto e estratégia
  offer_generation: 2,
  campaign_generation: 2,
  zap_message: 1,
  cardapio_generation: 2,
  vitrine_generation: 2,
  agenda_message: 1,
  old_customer_message: 1,
  product_stuck_offer: 2,
  module_adjustment: 1,
  improvement: 1,
  variation: 1,

  // Criativos
  creative_brief: 2,
  image_prompt: 2,
  visual_diagnosis: 2,
  image_generation: 8,
  image_editing: 8,

  // Consultor e calendário
  business_diagnosis: 3,
  consultor_question: 1,
  calendar_day_idea: 1,
  calendar_week_plan: 4,
  calendar_month_plan: 8,
  weekly_report: 3,

  // Clientes
  customer_followup_message: 1,
  customer_reactivation_message: 1,
  customer_objection_reply: 1,
  customer_segment_campaign: 2,

  // Outros
  offer_improvement: 1,
  offer_diagnosis: 2,
  offer_variation: 1,
  campaign_improvement: 1,
  campaign_variation: 1,
  campaign_channel_adaptation: 1,
  zap_followup: 1,
  zap_objection_reply: 1,
  zap_broadcast: 1,
  zap_status: 1,
  dna_summary: 1,
  dna_diagnosis: 2,
  dna_recommendations: 1,
  action_plan_generation: 3,
  library_adapt_to_dna: 1,
  library_personalize_template: 1,
  package_adapt_to_dna: 3,
  performance_analysis: 2
};

export interface ValueProofResult {
  niche: string;
  score: number;
  results: {
    actionType: string;
    content: string;
    score: number;
    feedback: string;
  }[];
  summary: {
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  };
  status: 'pending' | 'rejected' | 'partial' | 'approved';
  testedAt: string;
}

export type NicheId = 'pizzaria' | 'acaiteria' | 'hamburgueria' | 'barbearia' | 'salao' | 'estetica' | 'loja' | 'servico';

export interface NicheScenario {
  id: NicheId;
  name: string;
  city: string;
  type: string;
  mainProduct: string;
  price: string;
  highProfitProduct: string;
  stagnantProduct: string;
  audience: string;
  objection: string;
  differential: string;
  mainChannel: string;
  weakDay: string;
  goal: string;
}

export interface BetaLead {
  id: string;
  createdAt: string;
  name: string;
  businessName: string;
  businessType: string;
  whatsapp: string;
  email: string;
  source: string;
  status: "new" | "contacted" | "converted";
}

export type AppEnv = 'development' | 'beta' | 'production';

export interface UserFeedback {
  id: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  tryingToDo: string;
  worked: boolean;
  confusion: string;
  missingFeature: string;
  rating: number;
}

export type AIActionType = keyof typeof AI_ACTION_COSTS;

export interface UsageEvent {
  id: string;
  userId: string;
  createdAt: string;
  actionType: string;
  module: string;
  cost: number;
  plan: string;
  allowed: boolean;
  deniedReason?: string;
  resultId?: string;
  aiMode: string;
  success: boolean;
}

export interface UserUsage {
  userId?: string;
  plan?: PlanTier;
  subscriptionStatus?: 'inactive' | 'active' | 'past_due' | 'cancelled' | 'test' | 'pending';
  trialUsed: boolean;
  trialUsedAt?: string;
  trialActionType?: string;
  trialOutputId?: string;
  usageMonth?: string;
  
  // Créditos Principais
  monthlyCreditsUsed: number;
  monthlyCreditsLimit: number;
  
  // Créditos Extras (comprados)
  extraCreditsUsed: number;
  extraCreditsLimit: number;
  
  // Imagens
  monthlyImagesUsed: number;
  monthlyImagesLimit: number;
  extraImagesUsed: number;
  extraImagesLimit: number;

  actionUsage?: Record<string, number>;
  rateLimit?: {
    lastRequestAt?: string;
    requestsLastMinute: number;
    requestsLastHour: number;
    blockedUntil?: string;
  };
  abuseFlags?: string[];
  updatedAt?: string;
  
  // legacy compatibility
  totalCredits: number;
  usedCredits: number;
  currentMonthCampaigns?: number;
  totalCampaigns?: number;
  aiRequestsLastMinute: number;
  aiRequestsLastHour: number;
  lastAIRequestAt?: string;
}

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  createdAt: string;
  type: "monthly_usage" | "extra_purchase" | "refund" | "admin_adjustment" | "reset";
  actionType?: string;
  creditsChanged: number;
  imageCreditsChanged: number;
  balanceAfter: {
    monthly: number;
    extra: number;
    images: number;
    extraImages: number;
  };
  reason: string;
  relatedResultId?: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  imageCredits: number;
  validDays: number;
  active: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: "user" | "admin";
  businessName?: string;
  businessType?: BusinessType;
  plan: PlanTier;
  subscriptionStatus: 'active' | 'inactive' | 'past_due' | 'cancelled' | 'pending' | 'test';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  lastPaymentStatus?: string;
  lastPaymentAt?: string;
  trialUsed: boolean;
  usage: UserUsage;
  pendingActivation?: {
    planRequested: PlanTier;
    requestedAt: string;
    whatsapp: string;
    name: string;
  };
  businessProfile?: BusinessProfile;
  businessDNA?: BusinessDNA;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  provider: "stripe";
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  plan: string;
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
  updatedAt: string;
  lastEventId?: string;
}

export interface ProcessedStripeEvent {
  eventId: string;
  type: string;
  createdAt: string;
}

export interface BusinessDNA {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

  basics: {
    businessName: string;
    ownerName: string;
    businessType: string;
    niche: string;
    subNiche: string;
    city: string;
    neighborhood: string;
    serviceArea: string;
    whatsapp: string;
    instagram: string;
    operatingModel: 'fisico' | 'delivery' | 'agenda' | 'online' | 'hibrido';
    businessStage: 'ideia' | 'iniciante' | 'crescimento' | 'consolidado';
  };

  products: {
    mainProducts: string;
    bestSellerProduct: string;
    highestProfitProduct: string;
    lowRotationProduct: string;
    entryOfferProduct: string;
    premiumProduct: string;
    averageTicket: string;
    minimumPrice: string;
    maximumPrice: string;
    deliveryAvailable: boolean;
    productDifferentials: string;
    paymentMethods: string[];
  };

  audience: {
    targetAudience: string;
    primaryCustomerProfile: string;
    ageRange: string;
    incomeLevel: string;
    buyingMotivation: string;
    buyingFrequency: string;
    customerPainPoints: string;
    customerDesires: string;
    customerObjections: string;
    whatCustomersValueMost: string;
  };

  positioning: {
    mainCompetitors: string;
    competitorWeakness: string;
    competitorStrength: string;
    whyChooseUs: string;
    uniqueSellingPoint: string;
    localAdvantage: string;
    pricePositioning: 'barato' | 'medio' | 'premium' | 'luxo';
  };

  brandVoice: {
    brandTone: string;
    forbiddenTone: string;
    wordsToUse: string;
    wordsToAvoid: string;
    brandPersonality: string;
    visualStyle: string;
    mainColors: string;
    emotionalPromise: string;
    rationalPromise: string;
  };

  sales: {
    mainSalesChannel: string;
    secondarySalesChannels: string;
    bestSalesDays: string[];
    worstSalesDays: string[];
    bestSalesHours: string;
    currentBiggestProblem: string;
    currentPriority: Goal;
    weeklyGoal: string;
    monthlyGoal: string;
  };

  proof: {
    testimonials: string;
    beforeAfterAvailable: boolean;
    socialProofAssets: string;
    numberOfCustomers: string;
    yearsInBusiness: string;
    trustElements: string;
  };

  offerRules: {
    acceptsDiscounts: boolean;
    maxDiscountAllowed: string;
    preferredPromotionType: string;
    bonusCanOffer: string;
    urgencyLevelAllowed: boolean;
    scarcityAllowed: boolean;
    guaranteeAvailable: string;
    freeDeliveryAvailable: boolean;
  };

  restrictions: {
    thingsNeverToPromise: string;
    legalOrEthicalLimits: string;
    stockLimitations: string;
    deliveryLimitations: string;
    scheduleLimitations: string;
    wordsOrClaimsToAvoid: string;
  };
}

export interface BusinessProfile {
  // DADOS BÁSICOS
  businessName: string;
  ownerName: string;
  businessType: BusinessType;
  niche: string;
  subNiche: string;
  city: string;
  neighborhood: string;
  serviceArea: string;
  whatsapp: string;
  instagram: string;
  website?: string;
  operatingModel: 'fisico' | 'delivery' | 'agenda' | 'online' | 'hibrido';
  businessStage: 'comecando' | 'crescimento' | 'estabilizado' | 'escalando';

  // PRODUTOS E SERVIÇOS
  mainProducts: string;
  bestSellerProduct: string;
  highestProfitProduct: string;
  lowRotationProduct: string;
  entryOfferProduct: string;
  premiumProduct: string;
  averageTicket: string;
  minimumPrice: string;
  maximumPrice: string;
  deliveryAvailable: boolean;
  paymentMethods: string[];
  productDifferentials: string;

  // PÚBLICO
  targetAudience: string;
  primaryCustomerProfile: string;
  ageRange: string;
  genderFocus: 'todos' | 'feminino' | 'masculino';
  incomeLevel: 'popular' | 'medio' | 'alto' | 'luxo';
  buyingMotivation: string;
  buyingFrequency: string;
  customerPainPoints: string;
  customerDesires: string;
  customerObjections: string;
  whatCustomersValueMost: string;

  // CONCORRÊNCIA
  mainCompetitors: string;
  competitorWeakness: string;
  competitorStrength: string;
  whyChooseUs: string;
  uniqueSellingPoint: string;
  localAdvantage: string;
  pricePositioning: 'barato' | 'medio' | 'premium' | 'luxo_acessivel' | 'popular_agressivo';

  // MARCA E COMUNICAÇÃO
  brandTone: Tone;
  forbiddenTone: string;
  wordsToUse: string;
  wordsToAvoid: string;
  brandPersonality: string;
  visualStyle: string;
  mainColors: string[];
  emotionalPromise: string;
  rationalPromise: string;

  // VENDAS E OBJETIVOS
  mainSalesChannel: 'whatsapp' | 'instagram' | 'loja_fisica' | 'delivery_app' | 'site';
  secondarySalesChannels: string[];
  bestSalesDays: string[];
  worstSalesDays: string[];
  bestSalesHours: string;
  salesGoal: string;
  weeklyGoal: string;
  monthlyGoal: string;
  currentBiggestProblem: string;
  currentPriority: Goal;

  // PROVA SOCIAL E RESTRIÇÕES
  testimonials?: string;
  beforeAfterAvailable: boolean;
  socialProofAssets: string[];
  yearsInBusiness: string;
  thingsNeverToPromise: string;
  legalOrEthicalLimits: string;
  
  // PROMOÇÕES
  acceptsDiscounts: boolean;
  maxDiscountAllowed: string;
  preferredPromotionType: string;
}

export interface BusinessInsights {
  diagnosis: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recommendedOfferTypes: string[];
  recommendedCampaignAngles: string[];
  suggestedWeeklyActions: string[];
  contentWarnings: string[];
  score: number;
  level: 'fraco' | 'basico' | 'bom' | 'forte' | 'estrategico';
}

export interface CampaignOutput {
  campaignName: string;
  headline: string;
  shortCaption: string;
  longCaption: string;
  storySequence: { story: number; text: string; visualDirection: string; cta: string }[];
  whatsappStatus: string;
  whatsappDirectMessage: string;
  whatsappBroadcastMessage: string;
  followUpMessage: string;
  recoveryMessage: string;
  videoScript15s: string;
  audioScriptWhatsapp: string;
  hookOptions: string[];
  ctaOptions: string[];
  visualBrief: string;
  hashtags: string[];
  postingInstructions: string;
}

export interface CampaignStrategy {
  problemSolved: string;
  campaignType?: string;
  campaignAngle: string;
  offerAngle?: string;
  whyThisCampaign?: string;
  targetAudience: string;
  targetMoment?: string;
  emotionalTrigger?: string;
  rationalArgument?: string;
  mainObjection: string;
  objectionBreak: string;
  trustElement?: string;
  reasonWhyNow: string;
  ctaStrategy: string;
  riskWarnings?: string;
}

export interface ChannelAdaptations {
  instagramFeed: string;
  instagramStories: string;
  whatsappStatus: string;
  whatsappDirect: string;
  broadcastList: string;
  videoScript: string;
}

export interface CampaignQuality {
  specificityScore: number;
  persuasionScore: number;
  clarityScore: number;
  channelFitScore: number;
  actionabilityScore: number;
  trustScore: number;
  finalScore: number;
  warnings: string[];
}

export interface CampaignInput {
  campaignObjective: string;
  productOrService: string;
  price: string;
  promotion: string;
  targetAudience: string;
  channel: string;
  tone: string;
  urgencyLevel: string;
  desiredAction: string;
  mainObjection: string;
  desiredResult?: string;
  restrictions: string;
}

export interface Campaign {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

  source: "manual" | "dna" | "offer" | "library" | "calendar";
  businessDNAId?: string;
  businessDNASnapshot?: BusinessDNA;
  offerId?: string;
  offerSnapshot?: Offer;

  input: CampaignInput;
  strategy: CampaignStrategy;
  outputs: CampaignOutput;
  quality: CampaignQuality;
  channelAdaptations?: ChannelAdaptations;
  
  personalizationProof?: {
    usedBusinessDNA: boolean;
    usedOffer: boolean;
    usedProduct: boolean;
    usedAudience: boolean;
    usedObjection: boolean;
    usedDifferential: boolean;
    usedChannel: boolean;
  };
  missingContext?: string[];

  // Legacy mappings
  content?: GeneratedContent;
  businessName?: string;
  businessType?: BusinessType;
  product?: string;
  price?: string;
  offer?: string;
  tonality?: Tone;
  goal?: Goal;
  origin?: 'campaign' | 'zap' | 'legenda' | 'calendar' | 'library';
  businessProfileSnapshot?: BusinessProfile;
  profileScoreAtGeneration?: number;
}

export interface GeneratedContent {
  strategySummary: string;
  offerAngle: string;
  targetAudience: string;
  mainObjection: string;
  objectionBreak: string;
  campaign: {
    headline: string;
    instagramCaptionShort: string;
    instagramCaptionLong: string;
    storyText: string;
    whatsappStatus: string;
    whatsappDirectMessage: string;
    broadcastMessage: string;
    videoScript15s: string;
    audioScriptWhatsapp: string;
    ctaOptions: string[];
    hookOptions: string[];
    visualIdeas: string[];
    hashtags: string[];
    bestPostingTime: string;
    followUpMessage: string;
  };
  personalizationProof: {
    usedBusinessName: boolean;
    usedProduct: boolean;
    usedAudience: boolean;
    usedLocation: boolean;
    usedDifferential: boolean;
    usedObjection: boolean;
  };
  warnings: string[];
  missingContext: string[];
  qualityScore: number;
  isAI: boolean;
  // Legacy compatibility fields (optional or mapped)
  mainOffer?: string;
  instagramCaption?: string;
  whatsappDirect?: string;
  impactCall?: string;
  videoScript?: string;
  ctaVariations?: string[];
  imageIdeas?: string[];
  aggressiveness?: 'baixa' | 'media' | 'alta';
}

export interface BusinessSettings {
  name: string;
  type: BusinessType;
  defaultTone: Tone;
  whatsapp: string;
  city: string;
  targetAudience: string;
  instagram?: string;
  mainProduct?: string;
  highProfitProduct?: string;
  mainObjection?: string;
  weakDays?: string;
}

export interface OfferInput {
  productOrService: string;
  originalPrice: string;
  desiredPrice: string;
  objective: string;
  targetAudience: string;
  channel: string;
  availableBonus: string;
  discountAllowed: boolean;
  maxDiscount: string;
  stockLimit: string;
  deadline: string;
  deliveryAvailable: boolean;
  guaranteeAvailable: string;
  mainObjection: string;
  desiredTone: string;
}

export interface OfferStrategy {
  offerType: string;
  offerAngle: string;
  valueStack: string[];
  mainBenefit: string;
  emotionalBenefit: string;
  rationalBenefit: string;
  urgencyMechanism: string;
  scarcityMechanism: string;
  objectionBreak: string;
  riskReversal: string;
  perceivedValue: string;
  cta: string;
  reasonWhyNow: string;
}

export interface OfferOutputs {
  offerName: string;
  shortOffer: string;
  completeOffer: string;
  whatsappOffer: string;
  instagramOffer: string;
  storyOffer: string;
  premiumVersion: string;
  aggressiveVersion: string;
  noDiscountVersion: string;
  bundleVersion: string;
  upsellSuggestion: string;
  crossSellSuggestion: string;
}

export interface OfferQuality {
  clarityScore: number;
  specificityScore: number;
  urgencyScore: number;
  valueScore: number;
  trustScore: number;
  riskScore: number;
  finalScore: number;
  warnings: string[];
}

export interface Offer {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  source: 'manual' | 'dna' | 'campaign' | 'library';
  businessDNAId?: string;
  businessDNASnapshot?: BusinessDNA;
  
  input: OfferInput;
  strategy: OfferStrategy;
  outputs: OfferOutputs;
  quality: OfferQuality;
}

export interface SalesCalendarDayItem {
  id: string;
  date: string;
  weekday: string;
  commercialGoal: string;
  actionType: string;
  channel: string;
  productOrService: string;
  offerId?: string;
  campaignId?: string;
  zapMessageId?: string;
  title: string;
  idea: string;
  reasonWhy: string;
  contentDraft: string;
  whatsappDraft: string;
  storyDraft: string;
  cta: string;
  suggestedTime: string;
  status: "planned" | "done" | "skipped" | "saved";
  priority: "low" | "medium" | "high";
  effortLevel: "easy" | "medium" | "hard";
  expectedImpact: "low" | "medium" | "high";
  warnings: string[];
}

export interface SalesCalendar {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  periodType: "week" | "month";
  startDate: string;
  endDate: string;
  source: "ai" | "manual" | "template";
  businessDNAId?: string;
  businessDNASnapshot?: BusinessDNA;
  strategySummary: string;
  weeklyGoal: string;
  monthlyGoal?: string;
  focusProducts: string[];
  focusOffers?: string[];
  days: SalesCalendarDayItem[];
  quality: {
    specificityScore: number;
    commercialScore: number;
    consistencyScore: number;
    channelFitScore: number;
    actionabilityScore: number;
    finalScore: number;
    warnings: string[];
  };
}

export interface CreativeProject {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

  mode: "briefing" | "prompt" | "photo_improvement" | "image_generation" | "image_editing";
  source: "manual" | "dna" | "offer" | "campaign" | "zap" | "calendar" | "photo";
  
  businessDNAId?: string;
  businessDNASnapshot?: BusinessDNA;
  offerId?: string;
  offerSnapshot?: Offer;
  campaignId?: string;
  campaignSnapshot?: Campaign;

  input: {
    creativeGoal: string;
    productOrService: string;
    productPhoto?: string;
    channel: string;
    format?: string;
    style?: string;
    offer?: string;
    headline?: string;
    cta?: string;
    brandColors?: string;
    preserveProduct: boolean;
    restrictions?: string;
    notes?: string;
  };

  strategy: {
    visualAngle?: string;
    commercialProblem?: string;
    audienceReactionWanted?: string;
    mainFocus?: string;
    hierarchy?: string;
    trustElement?: string;
    urgencyElement?: string;
    compositionDirection?: string;
    copyDirection?: string;
    riskWarnings?: string[];
  };

  output: {
    creativeBrief?: string;
    imagePrompt?: string;
    editingPrompt?: string;
    generatedImageUrl?: string;
    originalImageUrl?: string;
    analysis?: string;
    textOnCreative?: string;
    layoutInstructions?: string;
    canvaInstructions?: string;
    adText?: string;
    headlineOptions?: string[];
    ctaOptions?: string[];
    visualChecklist?: string[];
  };

  quality: {
    productFidelityScore?: number;
    commercialImpactScore?: number;
    clarityScore?: number;
    channelFitScore?: number;
    visualSpecificityScore?: number;
    riskScore?: number;
    finalScore: number;
    warnings: string[];
  };

  aiMode?: string;
  creditsUsed?: number;
}

export interface LibraryTemplate {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  niche: string[];
  businessTypes: string[];
  objective: string;
  problemSolved: string;
  channel: string;
  moduleTarget: "dna" | "offer" | "campaign" | "zap" | "calendar" | "creative" | "objection" | "video" | "diagnosis";
  accessLevel: "free" | "essential" | "pro" | "max";
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: string;
  whenToUse: string;
  whenNotToUse: string;
  structure: string;
  templateContent: string;
  requiredContext: string[];
  optionalContext: string[];
  examples: string[];
  outputType: string;
  linkedActions: string[];
  qualityScore: number;
  premiumReason?: string;
  ownerId?: string; // se for template criado pelo usuario
}

export interface LibraryPackage {
  id: string;
  title: string;
  description: string;
  forWhom: string;
  problemSolved: string;
  templates: string[]; // IDs dos templates incluídos
}

export interface BusinessDiagnosis {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

  source: "ai" | "fallback";
  businessDNAId?: string;
  businessDNASnapshot?: BusinessDNA;

  input: {
    currentProblem?: string;
    currentGoal?: string;
    selectedProduct?: string;
    selectedChannel?: string;
    userQuestion?: string;
    recentResults?: string;
    extraNotes?: string;
  };

  analyzedData: {
    dnaScore?: number;
    offersCount?: number;
    campaignsCount?: number;
    zapMessagesCount?: number;
    calendarActionsCount?: number;
    weakPoints?: string[];
    strongPoints?: string[];
    missingData?: string[];
    recentHistorySummary?: string;
  };

  diagnosis: {
    summary: string;
    mainProblem: string;
    rootCause: string;
    commercialRisk: string;
    priorityLevel: string;
    biggestOpportunity: string;
    whatToStopDoing: string;
    whatToStartDoing: string;
    whatToImprove: string;
    recommendedFocus: string;
  };

  actionPlan: {
    todayAction: {
      title: string;
      why: string;
      how: string;
      moduleToUse: string;
      buttonAction: string;
    };
    next3Actions: Array<{
      title: string;
      why: string;
      how: string;
      moduleToUse: string;
    }>;
    weeklyPlan: string[];
    recommendedOffer?: string;
    recommendedCampaign?: string;
    recommendedZapMessage?: string;
    recommendedCreative?: string;
    recommendedCalendarAction?: string;
  };

  scores: {
    dnaScore: number;
    offerScore: number;
    campaignScore: number;
    whatsappScore: number;
    calendarScore: number;
    creativeScore: number;
    consistencyScore: number;
    commercialReadinessScore: number;
    finalScore: number;
  };

  warnings: string[];
  nextBestActions: string[];
  opportunities?: string[];
  missingContext?: string[];
}

export interface OnboardingProfile {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  businessName: string;
  businessType: string;
  currentProblem: string;
  productOrService: string;
  price?: string;
  targetAudience: string;
  mainObjection: string;
  city?: string;
  channel: string;
  generatedFirstAction?: boolean;
  completedAt?: string;
  skippedAt?: string;
}

export interface ActivationChecklist {
  userId: string;
  firstActionCreated: boolean;
  dnaCompleted: boolean;
  firstOfferCreated: boolean;
  firstCampaignCreated: boolean;
  firstZapCreated: boolean;
  firstCustomerCreated: boolean;
  firstResultRegistered: boolean;
  dismissed: boolean;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  userId: string;
  createdAt: string;
  eventType: string; // e.g. campaign_created, offer_used, etc.
  module: string;
  sourceId?: string;
  sourceType?: string;
  title: string;
  description?: string;
  relatedCustomerId?: string;
  relatedOfferId?: string;
  relatedCampaignId?: string;
  relatedZapId?: string;
  relatedCalendarItemId?: string;
  relatedCreativeId?: string;
  metadata?: any;
  outcome?: string;
  value?: number;
  notes?: string;
}

export interface ResultRecord {
  id: string;
  userId: string;
  createdAt: string;
  type: "sale" | "lead" | "reply" | "booking" | "lost" | "interest" | "review" | "other";
  value?: number;
  customerId?: string;
  productOrService?: string;
  channel?: string;
  sourceModule?: string;
  sourceId?: string;
  campaignId?: string;
  offerId?: string;
  zapMessageId?: string;
  notes?: string;
  confidence?: "low" | "medium" | "high";
}

export interface LearningProfile {
  userId: string;
  updatedAt: string;
  topProducts?: string[];
  topChannels?: string[];
  frequentObjections?: string[];
  bestCampaignTypes?: string[];
  bestOfferTypes?: string[];
  bestZapTypes?: string[];
  activeCustomerSegments?: string[];
  weakDays?: string[];
  strongDays?: string[];
  recommendations?: string[];
}


