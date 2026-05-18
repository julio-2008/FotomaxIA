import { GeneratedContent, BusinessType, Goal, Tone, BusinessProfile } from '../types';

export function generateLocalCampaign(data: {
  businessName: string;
  type: BusinessType;
  product: string;
  price: string;
  offer: string;
  goal: Goal;
  tonality: Tone;
  businessProfile?: BusinessProfile;
  city?: string;
  instagram?: string;
  mainObjection?: string;
}): GeneratedContent {
  const { product, price, offer, type, goal, tonality, businessName, businessProfile } = data;
  
  const profile = businessProfile;
  const emojis: Record<string, string> = {
    pizzaria: '🍕',
    hamburgueria: '🍔',
    acaiteria: '🍧',
    salao: '💇‍♀️',
    barbearia: '💈',
    loja_roupa: '👕',
    mercado: '🛒',
    estetica: '✨',
    delivery: '📦',
    outro: '🚀'
  };

  const emoji = emojis[type] || '🚀';
  const city = profile?.city || data.city || 'nossa região';
  const objection = profile?.customerObjections || data.mainObjection || 'falta de tempo';
  const differential = profile?.uniqueSellingPoint || profile?.productDifferentials || 'nosso padrão de qualidade exclusiva';
  
  const headline = `${tonality === 'urgente' ? '⚡️ SÓ HOJE:' : tonality === 'premium' ? '✨ EXCLUSIVO:' : '🔥'} ${product} em ${city}`;

  const instagramCaptionLong = `${emoji} ${businessName.toUpperCase()} INFORMA:\n\nSabemos que quem mora em ${city} busca por ${product} de verdade, mas cansa de enfrentar ${objection}.\n\nPor isso, o ${product} da ${businessName} foi criado com ${differential}.\n\n💰 Investimento: R$ ${price}\n🎁 Bônus: ${offer}\n\n${tonality === 'urgente' ? '⚠️ ATENÇÃO: Essa condição é limitada. Quando o estoque acabar, voltamos ao preço normal.' : 'Aproveite o que há de melhor em ' + city + '.'}\n\n👇 Toque no botão e fale conosco!`;

  return {
    strategySummary: `Estratégia local para ${goal} focando em moradores de ${city}.`,
    offerAngle: `Ângulo de ${tonality} focado em resolver a objeção de ${objection}.`,
    targetAudience: profile?.targetAudience || 'Público local',
    mainObjection: objection,
    objectionBreak: `Usamos ${differential} para garantir que ${objection} não seja um problema.`,
    campaign: {
      headline,
      instagramCaptionShort: `🔥 ${product} em ${city} por R$ ${price}. +Info no link!`,
      instagramCaptionLong,
      storyText: `VOCÊ MERECE ${product.toUpperCase()} ${emoji}\n\n${offer.toUpperCase()}!\n\nSó R$ ${price}\n\nClica no link da Bio 🔗`,
      whatsappStatus: `⚡️ ${product} em ${city} por R$ ${price}. Garante o seu! ${emoji}`,
      whatsappDirectMessage: `Olá! 👋 Notamos seu interesse. Hoje o ${product} está com ${offer} por R$ ${price}. É a chance de ter ${differential} em ${city}.\n\nPosso reservar?`,
      broadcastMessage: `ALERTA ${businessName}: ${product} com ${offer} apenas hoje para clientes da lista VIP. R$ ${price}.`,
      videoScript15s: `[0-3s] "Cansado de ${objection} em ${city}?"\n[3-10s] "Conheça o ${product} da ${businessName}. ${differential}."\n[10-15s] "Aproveite: R$ ${price} + ${offer}. Link na bio!"`,
      audioScriptWhatsapp: `Oi! Passando pra avisar que separamos um ${product} pra você aqui em ${city}. Vem com ${offer} por R$ ${price}. Me avisa se quiser que eu segure um aqui.`,
      ctaOptions: ["Quero Garantir Agora", "Me manda mais detalhes", "Reservar Promoção"],
      hookOptions: [`Sabia que ${businessName} tem o melhor ${product} de ${city}?`, `Cansado de ${objection}?`],
      visualIdeas: [`Foto do ${product} ambientada em ${city}`, `Vídeo de 5s do bônus ${offer}`],
      hashtags: [`#${type}`, `#${city.replace(/\s+/g, '')}`, "#DNAcomercial"],
      bestPostingTime: "11:30 ou 18:30",
      followUpMessage: "Oi! Ainda tá interessado no bônus? Vou precisar liberar pra outra pessoa se não confirmar."
    },
    personalizationProof: {
      usedBusinessName: true,
      usedProduct: true,
      usedAudience: true,
      usedLocation: !!city,
      usedDifferential: true,
      usedObjection: true
    },
    warnings: ["Modo demo (sem IA avançada)"],
    missingContext: [],
    qualityScore: 75,
    isAI: false
  };
}
