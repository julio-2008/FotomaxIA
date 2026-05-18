import { LibraryTemplate } from '../types';

const baseTemplates: Partial<LibraryTemplate>[] = [
  {
    category: "Campanhas",
    subCategory: "Vendas Diretas",
    objective: "vender hoje",
    problemSolved: "Falta de vendas diárias e caixa rápido",
    channel: "Instagram Feed",
    moduleTarget: "campaign",
    accessLevel: "free",
    difficulty: "easy",
    estimatedTime: "5 min",
    whenToUse: "Quando precisar girar estoque ou gerar caixa rápido.",
    whenNotToUse: "Em lançamentos premium longos.",
    structure: "Atenção -> Promessa Rápida -> Oferta -> Escassez -> CTA",
    templateContent: "Hoje liberamos uma condição especial para [produto/serviço]. Apenas para quem mandar mensagem agora.",
    requiredContext: ["produto", "oferta"],
    optionalContext: ["escassez"],
    examples: [],
    outputType: "text",
    linkedActions: ["offer"]
  },
  {
    category: "WhatsApp",
    subCategory: "Recuperação",
    objective: "recuperar clientes",
    problemSolved: "Clientes que compraram uma vez e sumiram",
    channel: "Mensagem WhatsApp",
    moduleTarget: "zap",
    accessLevel: "essential",
    difficulty: "easy",
    estimatedTime: "2 min",
    whenToUse: "Sextou ou dia fraco da semana.",
    whenNotToUse: "Com quem comprou ontem.",
    structure: "Saudação Natural -> Lembrança -> Oferta/Novidade -> CTA",
    templateContent: "Oi [nome], tudo bem? Estava aqui organizando e vi que faz um tempo que não pede [produto]. Temos uma novidade que acho que você vai gostar...",
    requiredContext: ["oferta"],
    optionalContext: [],
    examples: [],
    outputType: "text",
    linkedActions: ["offer"]
  },
  {
    category: "Criativos",
    subCategory: "Prova Social",
    objective: "gerar prova social",
    problemSolved: "Falta de confiança do cliente",
    channel: "Story",
    moduleTarget: "creative",
    accessLevel: "pro",
    difficulty: "medium",
    estimatedTime: "10 min",
    whenToUse: "Para aquecer o público de quem ainda não comprou.",
    whenNotToUse: "Como única postagem da semana.",
    structure: "Print do depoimento realçado -> Texto seu agradecendo -> CTA para agendar/comprar",
    templateContent: "Arte com fundo escuro. No meio, o print de um cliente elogiando [produto].",
    requiredContext: ["depoimento", "produto"],
    optionalContext: [],
    examples: [],
    outputType: "brief",
    linkedActions: ["image_generation"]
  },
  {
    category: "Objeções",
    subCategory: "Preço",
    objective: "quebrar objeção de preço",
    problemSolved: "Cliente acha caro ou compara com concorrente",
    channel: "WhatsApp",
    moduleTarget: "objection",
    accessLevel: "free",
    difficulty: "easy",
    estimatedTime: "2 min",
    whenToUse: "Sempre que disserem 'tá caro'.",
    whenNotToUse: "Quando o erro for atendimento ruim.",
    structure: "Entendimento -> Reenquadramento -> Comparação de valor -> Pergunta",
    templateContent: "Eu entendo que parece um valor mais alto. Mas a grande diferença é que aqui você não terá dor de cabeça com [dor]. Prefere economizar hoje e gastar depois?",
    requiredContext: ["diferencial"],
    optionalContext: [],
    examples: [],
    outputType: "text",
    linkedActions: []
  },
  {
    category: "Calendário",
    subCategory: "Semana Fraca",
    objective: "vender no dia fraco",
    problemSolved: "Terça e Quarta sem movimento",
    channel: "Story",
    moduleTarget: "calendar",
    accessLevel: "essential",
    difficulty: "medium",
    estimatedTime: "15 min",
    whenToUse: "Para estruturar a semana.",
    whenNotToUse: "Quando a agenda já está lotada a semana toda.",
    structure: "Terça: Prova. Quarta: Bastidor. Quinta: Oferta.",
    templateContent: "Segunda: planejamento. Terça a Quinta: post com oferta diretas. Sexta: urgência.",
    requiredContext: ["oferta"],
    optionalContext: [],
    examples: [],
    outputType: "calendar",
    linkedActions: []
  }
];

const niches = [
  "pizzaria", "hamburgueria", "açaíteria", "doceria", "restaurante", "delivery",
  "barbearia", "salão de beleza", "estética", "loja de roupas", "moda feminina",
  "moda masculina", "mercado", "pet shop", "academia", "oficina", "assistência técnica",
  "ótica", "clínica popular", "profissionais autônomos", "serviços locais", "geral"
];

function generateLibraryItems(): LibraryTemplate[] {
  let items: LibraryTemplate[] = [];
  let idCounter = 1;
  const levels = ["free", "essential", "pro", "max"];

  for (const base of baseTemplates) {
    for (const niche of niches) {
      // Just a mock generation to have sufficient data matching search queries
      items.push({
        ...base,
        id: `lib_${idCounter++}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: `${base.category} rápido para ${niche.charAt(0).toUpperCase() + niche.slice(1)}`,
        description: `Estratégia de ${base.objective} voltada para ${niche}`,
        niche: [niche, 'geral'],
        businessTypes: ['local_business'],
        qualityScore: 80,
        accessLevel: base.accessLevel as any,
        tags: [niche, base.objective!.replace(/ /g, '_')]
      } as LibraryTemplate);
    }
  }

  // Multiply further for variations
  const currentCount = items.length;
  // Around 100 items. Let's make it 310 manually by just iterating more variants.
  for(let i=0; i<3; i++){
     for(let item of items.slice(0, 100)) {
         let newId = idCounter++;
         items.push({
           ...item,
           id: `lib_${newId}`,
           title: `${item.title} - Variação ${i+1}`,
           accessLevel: levels[newId % 4] as any,
         });
     }
  }

  return items;
}

export const initialLibraryTemplates: LibraryTemplate[] = generateLibraryItems();
