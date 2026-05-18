import { BusinessProfile, BusinessInsights } from '../types';

export function calculateProfileScore(profile: BusinessProfile): number {
  let score = 0;

  // DADOS BÁSICOS (15 pts)
  if (profile.businessName && profile.businessType && profile.city) score += 15;
  else if (profile.businessName) score += 5;

  // PRODUTOS E PREÇOS (15 pts)
  if (profile.mainProducts && profile.bestSellerProduct && profile.averageTicket) score += 15;
  else if (profile.mainProducts) score += 5;

  // PÚBLICO E DORES (20 pts)
  if (profile.targetAudience && profile.customerPainPoints && profile.customerDesires) score += 20;
  else if (profile.targetAudience) score += 10;

  // DIFERENCIAIS (15 pts)
  if (profile.uniqueSellingPoint && profile.whyChooseUs) score += 15;
  else if (profile.uniqueSellingPoint) score += 7;

  // COMUNICAÇÃO (15 pts)
  if (profile.brandTone && profile.brandPersonality) score += 15;

  // OBJETIVOS E CANAIS (10 pts)
  if (profile.mainSalesChannel && profile.currentPriority) score += 10;

  // PROVA SOCIAL E RESTRIÇÕES (10 pts)
  if (profile.yearsInBusiness || profile.socialProofAssets?.length > 0) score += 10;

  return Math.min(score, 100);
}

export function getProfileLevel(score: number): BusinessInsights['level'] {
  if (score <= 30) return 'fraco';
  if (score <= 50) return 'basico';
  if (score <= 70) return 'bom';
  if (score <= 90) return 'forte';
  return 'estrategico';
}

export function generateBusinessInsights(profile: BusinessProfile): BusinessInsights {
  const score = calculateProfileScore(profile);
  const level = getProfileLevel(score);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const recommendedOfferTypes: string[] = [];
  const suggestedWeeklyActions: string[] = [];
  const contentWarnings: string[] = [];

  // Logic based on profile
  if (profile.businessType === 'pizzaria' || profile.businessType === 'hamburgueria') {
    if ((profile.worstSalesDays || []).includes('terça') || (profile.worstSalesDays || []).includes('quarta')) {
      opportunities.push('Campanha de meio de semana com combo exclusivo');
      suggestedWeeklyActions.push('Lançar "Combo Terça em Dobro" para aumentar giro');
    }
  }

  if (profile.lowRotationProduct) {
    recommendedOfferTypes.push('Queima de estoque / Bazar relâmpago');
    opportunities.push(`Giro de estoque para o produto: ${profile.lowRotationProduct}`);
  }

  if (profile.highestProfitProduct) {
    recommendedOfferTypes.push('Campanha Premium de alta margem');
    suggestedWeeklyActions.push(`Criar anúncio focado no valor do ${profile.highestProfitProduct}`);
  }

  if ((profile.customerObjections || '').toLowerCase().includes('preço')) {
    contentWarnings.push('Evitar focar apenas em desconto; justificar o valor e diferenciais');
  }

  if (profile.brandTone === 'premium') {
    contentWarnings.push('Evitar gatilhos de urgência agressivos ou linguagem popular');
  }

  // Generic Recommendations
  if (score < 50) {
    weaknesses.push('Perfil comercial raso; IA pode gerar conteúdo genérico');
  }

  if (!profile.customerPainPoints) {
    suggestedWeeklyActions.push('Identificar as 3 maiores dores do seu cliente');
  }

  return {
    diagnosis: `Seu perfil está no nível ${level.toUpperCase()}. ${score < 50 ? 'Precisamos aprofundar seus diferenciais para vender mais.' : 'Você tem uma base sólida para campanhas de alta conversão.'}`,
    strengths: strengths.length > 0 ? strengths : ['Nome do negócio definido', 'Nicho identificado'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Falta de prova social detalhada'],
    opportunities: opportunities.length > 0 ? opportunities : ['Campanha de indicação', 'Aumento de ticket médio'],
    recommendedOfferTypes: recommendedOfferTypes.length > 0 ? recommendedOfferTypes : ['Combo', 'Bônus por tempo limitado'],
    recommendedCampaignAngles: ['Autoridade', 'Curiosidade', 'Urgência ponderada'],
    suggestedWeeklyActions: suggestedWeeklyActions.length > 0 ? suggestedWeeklyActions : ['Postar 3 stories de bastidores', 'Enviar mensagem para 10 ex-clientes'],
    contentWarnings,
    score,
    level
  };
}
