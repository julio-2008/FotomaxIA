import { PlanTier } from './types';

export const ADMIN_EMAILS = ['jlzin2603@gmail.com', 'admin@fotomax.com.br'];

export const PLAN_LIMITS: Record<PlanTier, {
  monthlyCredits: number;
  imageLimit: number;
  businessProfiles: number;
  libraryAccess: 'basic' | 'standard' | 'premium' | 'complete';
  zapRapido: 'basic' | 'full';
  calendar: 'none' | 'weekly' | 'monthly';
  creativeLab: boolean;
  advancedScripts: boolean;
  customerLimit: number;
}> = {
  trial: {
    monthlyCredits: 1,
    imageLimit: 0,
    businessProfiles: 1,
    libraryAccess: 'basic',
    zapRapido: 'basic',
    calendar: 'none',
    creativeLab: false,
    advancedScripts: false,
    customerLimit: 0,
  },
  essential: {
    monthlyCredits: 30,
    imageLimit: 0,
    businessProfiles: 1,
    libraryAccess: 'standard',
    zapRapido: 'full',
    calendar: 'weekly',
    creativeLab: false,
    advancedScripts: false,
    customerLimit: 100,
  },
  pro: {
    monthlyCredits: 80,
    imageLimit: 5,
    businessProfiles: 1,
    libraryAccess: 'premium',
    zapRapido: 'full',
    calendar: 'monthly',
    creativeLab: true,
    advancedScripts: true,
    customerLimit: 500,
  },
  max: {
    monthlyCredits: 180,
    imageLimit: 20,
    businessProfiles: 3,
    libraryAccess: 'complete',
    zapRapido: 'full',
    calendar: 'monthly',
    creativeLab: true,
    advancedScripts: true,
    customerLimit: 2000,
  },
};

export const PRICING_PLANS = [
  {
    id: 'trial' as PlanTier,
    name: 'Teste Grátis',
    price: 'R$0',
    desc: 'Conheça o poder do Fotomax IA',
    features: [
      '1 criação textual única',
      'Perfil do Negócio básico',
      'Sem geração de imagens',
      'Sem calendário ou CRM',
      'Ideal para testar a qualidade'
    ],
  },
  {
    id: 'essential' as PlanTier,
    name: 'Essencial',
    price: 'R$97',
    period: '/mês',
    desc: 'Para quem quer divulgar e vender mais',
    features: [
      '30 créditos mensais',
      'Perfil do Negócio completo',
      'Ofertas, Combos e Divulgações',
      'Zap Rápido (mensagens prontas)',
      'Cardápio e Vitrine Digital',
      'Até 100 clientes salvos',
      'Sem imagens reais por IA'
    ],
  },
  {
    id: 'pro' as PlanTier,
    name: 'Pro',
    price: 'R$147',
    period: '/mês',
    desc: 'Aceleração total com imagens e estratégia',
    highlight: true,
    features: [
      '80 créditos mensais',
      'Tudo do Essencial',
      'Até 5 imagens reais por IA',
      'Diagnóstico Comercial',
      'Calendário semanal completo',
      'Criativos textuais avançados',
      'Até 500 clientes no CRM'
    ],
  },
  {
    id: 'max' as PlanTier,
    name: 'Max',
    price: 'R$247',
    period: '/mês',
    desc: 'Domínio de mercado e multi-unidades',
    features: [
      '180 créditos mensais',
      'Tudo do Pro',
      'Até 20 imagens reais por IA',
      'Até 3 perfis de negócio',
      'Biblioteca VIP completa',
      'Relatórios de performance',
      'Até 2000 clientes no CRM'
    ],
  },
];
