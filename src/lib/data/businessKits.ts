
import { 
  Flame, 
  Target, 
  Layout, 
  Sparkles, 
  History, 
  Instagram, 
  Clock, 
  Zap, 
  MessageCircle, 
  TrendingUp,
  Scissors,
  Wrench,
  ShoppingBag,
  Store,
  CheckCircle2
} from 'lucide-react';

export type BusinessNiche = 'alimentacao' | 'barbearia' | 'beleza' | 'loja' | 'servicos' | 'outro';

export interface BusinessKit {
  name: string;
  pains: string[];
  actions: {
    title: string;
    desc: string;
    icon: any;
    path: string;
    color: string;
  }[];
  questions: {
    section: 'basics' | 'products' | 'audience' | 'positioning' | 'brandVoice' | 'sales' | 'offerRules' | 'restrictions';
    field: string;
    label: string;
    placeholder: string;
    type?: 'text' | 'textarea' | 'select';
  }[];
}

export const BUSINESS_KITS: Record<BusinessNiche, BusinessKit> = {
  alimentacao: {
    name: 'Alimentação',
    pains: ['Dia fraco', 'Baixo movimento no delivery', 'Produto parado', 'Cardápio confuso'],
    actions: [
      { title: 'Criar cardápio', desc: 'Menu e preços', icon: Layout, path: '/campanhas/nova?type=cardapio', color: 'text-emerald-500' },
      { title: 'Criar combo', desc: 'Aumente o ticket médio', icon: Target, path: '/ofertas/nova?type=combo', color: 'text-amber-500' },
      { title: 'Criar oferta do dia', desc: 'Promova algo hoje', icon: Flame, path: '/ofertas/nova?type=oferta-do-dia', color: 'text-orange-500' },
      { title: 'Criar status de delivery', desc: 'Poste no zap agora', icon: Instagram, path: '/campanhas/nova?type=story', color: 'text-pink-500' },
      { title: 'Melhorar foto do produto', desc: 'Deixe mais profissional', icon: Sparkles, path: '/criativos/novo?mode=photo_improvement', color: 'text-blue-500' },
      { title: 'Chamar clientes antigos', desc: 'Reative contatos', icon: History, path: '/campanhas/nova?type=recuperacao', color: 'text-zinc-300' },
    ],
    questions: [
      { section: 'basics', field: 'mainProducts', label: 'Quais pratos/produtos você vende?', placeholder: 'Pizzas, sanduíches, marmitex...', type: 'textarea' },
      { section: 'products', field: 'bestSellerProduct', label: 'Qual combo ou prato mais sai?', placeholder: 'Ex: Pizza de Calabresa', type: 'text' },
      { section: 'products', field: 'lowRotationProduct', label: 'Qual dia da semana é mais fraco?', placeholder: 'Ex: Terça-feira', type: 'text' },
    ],
  },
  barbearia: {
    name: 'Barbearia',
    pains: ['Horários vazios', 'Falta de agendamento', 'Cliente some após 30 dias'],
    actions: [
      { title: 'Divulgar horário vago', desc: 'Preencha a agenda', icon: Clock, path: '/campanhas/nova?type=agenda', color: 'text-cyan-500' },
      { title: 'Combo Corte + Barba', desc: 'Aumente o valor', icon: Target, path: '/ofertas/nova?type=combo', color: 'text-amber-500' },
      { title: 'Chamar cliente antigo', desc: 'Volte a alinhar', icon: History, path: '/campanhas/nova?type=recuperacao', color: 'text-zinc-300' },
      { title: 'Criar story de agenda', desc: 'Mostre disponibilidade', icon: Instagram, path: '/campanhas/nova?type=story', color: 'text-pink-500' },
      { title: 'Criar mensagem de retorno', desc: 'Lembrete automático', icon: MessageCircle, path: '/zap-rapido', color: 'text-green-500' },
      { title: 'Criar pacote mensal', desc: 'Receita recorrente', icon: Zap, path: '/ofertas/nova?type=combo', color: 'text-purple-500' },
    ],
    questions: [
      { section: 'basics', field: 'mainProducts', label: 'Quais serviços oferece?', placeholder: 'Corte, barba, pigmentação...', type: 'textarea' },
      { section: 'products', field: 'lowRotationProduct', label: 'Quais dias/horários ficam vazios?', placeholder: 'Ex: Terça de manhã', type: 'text' },
      { section: 'audience', field: 'buyingFrequency', label: 'Cliente volta em quanto tempo?', placeholder: 'Ex: 15 a 20 dias', type: 'text' },
    ],
  },
  beleza: {
    name: 'Salão e Estética',
    pains: ['Cancelamento', 'Agenda vazia', 'Guerra de preços'],
    actions: [
      { title: 'Divulgar agenda', desc: 'Preencha as vagas', icon: Clock, path: '/campanhas/nova?type=agenda', color: 'text-cyan-500' },
      { title: 'Criar pacote de serviço', desc: 'Fidelidade e lucro', icon: Target, path: '/ofertas/nova?type=combo', color: 'text-amber-500' },
      { title: 'Criar antes e depois', desc: 'Prova de qualidade', icon: Layout, path: '/campanhas/nova?type=prova_social', color: 'text-emerald-500' },
      { title: 'Chamar cliente sumida', desc: 'Novas mensagens', icon: History, path: '/campanhas/nova?type=recuperacao', color: 'text-zinc-300' },
      { title: 'Story de procedimento', desc: 'Gere desejo', icon: Instagram, path: '/campanhas/nova?type=story', color: 'text-pink-500' },
      { title: 'Mensagem de manutenção', desc: 'Pós-atendimento', icon: MessageCircle, path: '/zap-rapido', color: 'text-green-500' },
    ],
    questions: [
      { section: 'basics', field: 'mainProducts', label: 'Quais procedimentos realiza?', placeholder: 'Mechas, unhas, estética...', type: 'textarea' },
      { section: 'products', field: 'lowRotationProduct', label: 'Quais horários ficam vazios?', placeholder: 'Ex: Segunda e Terça', type: 'text' },
      { section: 'audience', field: 'customerObjections', label: 'Qual a maior dúvida delas?', placeholder: 'Ex: Preço, tempo do procedimento', type: 'text' },
    ],
  },
  loja: {
    name: 'Loja Física',
    pains: ['Estoque parado', 'Falta de novidades', 'Baixo movimento'],
    actions: [
      { title: 'Criar vitrine de produto', desc: 'Destaque no Status', icon: Layout, path: '/campanhas/nova?type=vitrine', color: 'text-emerald-500' },
      { title: 'Divulgar peça parada', desc: 'Gire o estoque', icon: TrendingUp, path: '/ofertas/nova?type=giro', color: 'text-red-500' },
      { title: 'Story de últimas unidades', desc: 'Gere urgência', icon: Instagram, path: '/campanhas/nova?type=story', color: 'text-pink-500' },
      { title: 'Mensagem para clientes', desc: 'Novidades no zap', icon: MessageCircle, path: '/zap-rapido', color: 'text-green-500' },
      { title: 'Criar banner de promoção', desc: 'Chame atenção', icon: Layout, path: '/criativos/novo?mode=briefing&format=banner', color: 'text-yellow-500' },
      { title: 'Combos e Looks', desc: 'Venda mais peças', icon: Target, path: '/ofertas/nova?type=combo', color: 'text-amber-500' },
    ],
    questions: [
      { section: 'basics', field: 'mainProducts', label: 'O que você vende?', placeholder: 'Moda feminina, sapatos, acessórios...', type: 'textarea' },
      { section: 'products', field: 'lowRotationProduct', label: 'Tem muita peça parada?', placeholder: 'O que está encalhado?', type: 'text' },
      { section: 'sales', field: 'currentPriority', label: 'Quer vender peça ou look?', placeholder: 'Ex: Montar looks completos', type: 'text' },
    ],
  },
  servicos: {
    name: 'Serviços Locais',
    pains: ['Orçamentos parados', 'Poucas indicações', 'Falta de confiança'],
    actions: [
      { title: 'Mensagem de orçamento', desc: 'Feche o serviço', icon: MessageCircle, path: '/zap-rapido', color: 'text-green-500' },
      { title: 'Divulgação de serviço', desc: 'O que você resolve', icon: Layout, path: '/campanhas/nova?type=servico', color: 'text-emerald-500' },
      { title: 'Criar antes e depois', desc: 'Resultado real', icon: Sparkles, path: '/campanhas/nova?type=prova_social', color: 'text-blue-500' },
      { title: 'Criar follow-up', desc: 'Não perca o contato', icon: History, path: '/zap-rapido', color: 'text-zinc-300' },
      { title: 'Mensagem de prova social', desc: 'Depoimentos', icon: CheckCircle2, path: '/campanhas/nova?type=prova_social', color: 'text-purple-500' },
      { title: 'Oferta de manutenção', desc: 'Previna problemas', icon: Target, path: '/ofertas/nova?type=combo', color: 'text-amber-500' },
    ],
    questions: [
      { section: 'basics', field: 'mainProducts', label: 'Que serviço presta?', placeholder: 'Limpeza, mecânica, elétrica...', type: 'textarea' },
      { section: 'audience', field: 'customerPainPoints', label: 'Qual problema você resolve?', placeholder: 'Ex: Ar condicionado quebrado', type: 'text' },
      { section: 'audience', field: 'customerObjections', label: 'Qual a maior objeção?', placeholder: 'Ex: Preço da mão de obra', type: 'text' },
    ],
  },
  outro: {
    name: 'Negócio Local',
    pains: ['Vendas baixas', 'Falta de tempo'],
    actions: [
      { title: 'Criar oferta do dia', desc: 'Promova algo hoje', icon: Flame, path: '/ofertas/nova?type=oferta-do-dia', color: 'text-orange-500' },
      { title: 'Criar combo', desc: 'Aumente o ticket', icon: Target, path: '/ofertas/nova?type=combo', color: 'text-amber-500' },
      { title: 'Mensagem para WhatsApp', desc: 'Pronta para o zap', icon: MessageCircle, path: '/zap-rapido', color: 'text-green-500' },
      { title: 'Criar story / status', desc: 'Poste agora', icon: Instagram, path: '/campanhas/nova?type=story', color: 'text-pink-500' },
      { title: 'Vender produto parado', desc: 'Gire o estoque', icon: TrendingUp, path: '/ofertas/nova?type=giro', color: 'text-red-500' },
      { title: 'Chamar clientes antigos', desc: 'Reativação', icon: History, path: '/campanhas/nova?type=recuperacao', color: 'text-zinc-300' },
    ],
    questions: [
      { section: 'basics', field: 'mainProducts', label: 'O que seu negócio faz?', placeholder: 'Ex: Vendo espetinho, Dou aulas...', type: 'textarea' },
      { section: 'basics', field: 'city', label: 'Qual sua cidade?', placeholder: 'Ex: Juazeiro-BA', type: 'text' },
    ],
  },
};
