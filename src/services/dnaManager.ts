import { BusinessDNA, Goal } from '../types';

export function calculateDNAScore(dna: BusinessDNA): { 
  total: number; 
  breakdown: Record<string, number>;
  level: string;
} {
  const breakdown = {
    identidade: dna.basics.niche && dna.basics.city ? 10 : 0,
    produtos: dna.products.mainProducts && dna.products.bestSellerProduct ? 15 : 0,
    cliente: dna.audience.targetAudience && dna.audience.customerObjections ? 20 : 0,
    posicionamento: dna.positioning.whyChooseUs ? 15 : 0,
    voz: dna.brandVoice.brandTone ? 15 : 0,
    vendas: dna.sales.currentPriority ? 15 : 0,
    regras: dna.offerRules.acceptsDiscounts !== undefined ? 10 : 0
  };

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  let level = 'DNA Fraco';
  if (total > 90) level = 'DNA Estratégico';
  else if (total > 70) level = 'DNA Forte';
  else if (total > 50) level = 'DNA Bom';
  else if (total > 25) level = 'DNA Básico';

  return { total, breakdown, level };
}

export function getDNARecommendations(dna: BusinessDNA): string[] {
  const recs: string[] = [];
  
  if (!dna.products.highestProfitProduct) {
    recs.push("Adicione o produto mais lucrativo para a IA priorizar campanhas que dão mais retorno.");
  }
  if (!dna.audience.customerObjections) {
    recs.push("Adicione objeções dos clientes para a IA quebrar resistência na campanha.");
  }
  if (!dna.restrictions.wordsOrClaimsToAvoid) {
    recs.push("Adicione palavras proibidas para evitar textos que não combinam com sua marca.");
  }
  if (dna.sales.worstSalesDays.length === 0) {
    recs.push("Adicione dias fracos para criar campanhas de recuperação de movimento.");
  }
  if (!dna.positioning.mainCompetitors) {
    recs.push("Adicione diferencial contra concorrentes para fugir de texto genérico.");
  }

  return recs;
}

export interface CommercialDiagnosis {
  summary: string;
  strengths: string[];
  risks: string[];
  bestCampaignAngles: string[];
  bestOfferTypes: string[];
  bestProductsToPromote: string[];
  objectionsToBreak: string[];
  weeklyOpportunities: string[];
  salesWarnings: string[];
  recommendedTone: string;
  recommendedChannels: string[];
  nextBestActions: string[];
}

export function generateCommercialDiagnosis(dna: BusinessDNA): CommercialDiagnosis {
  const diagnosis: CommercialDiagnosis = {
    summary: `O negócio ${dna.basics.businessName} opera no modelo ${dna.basics.operatingModel} em ${dna.basics.city} com foco em ${dna.basics.niche}.`,
    strengths: dna.positioning.whyChooseUs ? [dna.positioning.whyChooseUs] : [],
    risks: [],
    bestCampaignAngles: ['Conveniência', 'Qualidade Local'],
    bestOfferTypes: ['Desconto Progressivo', 'Bônus de Fidelidade'],
    bestProductsToPromote: [dna.products.bestSellerProduct],
    objectionsToBreak: [dna.audience.customerObjections],
    weeklyOpportunities: [],
    salesWarnings: [],
    recommendedTone: dna.brandVoice.brandTone,
    recommendedChannels: [dna.sales.mainSalesChannel],
    nextBestActions: ['Gerar campanha de WhatsApp', 'Atualizar DNA']
  };

  if (dna.products.lowRotationProduct) {
    diagnosis.weeklyOpportunities.push(`Campanha de giro para o produto: ${dna.products.lowRotationProduct}`);
  }

  if (dna.products.highestProfitProduct) {
    diagnosis.bestProductsToPromote.push(dna.products.highestProfitProduct);
    diagnosis.bestCampaignAngles.push('Valor e Exclusividade');
  }

  if ((dna.audience?.customerObjections || '').toLowerCase().includes('preço')) {
    diagnosis.objectionsToBreak.push('Prova de valor real', 'Comparação de benefício');
  }

  dna.sales.worstSalesDays.forEach(day => {
    diagnosis.weeklyOpportunities.push(`Campanha de recuperação para ${day}`);
  });

  if ((dna.brandVoice?.brandTone || '').includes('premium')) {
    diagnosis.salesWarnings.push('Evitar descontos agressivos ou tom de desespero');
  }

  if (dna.products.deliveryAvailable) {
    diagnosis.bestCampaignAngles.push('Entrega Rápida e Conforto');
  }

  return diagnosis;
}
