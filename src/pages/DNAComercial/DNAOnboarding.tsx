import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  CheckCircle2, 
  Rocket,
  Target,
  Users,
  MessageSquare,
  DollarSign,
  Zap,
  Globe,
  Store,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';
import { BusinessProfile, BusinessType, Tone, Goal } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const STEPS = [
  { id: 1, title: 'Básico', icon: Store, desc: 'Identidade do negócio' },
  { id: 2, title: 'Mercado', icon: DollarSign, desc: 'Produtos e preços' },
  { id: 3, title: 'Público', icon: Users, desc: 'Quem compra de você' },
  { id: 4, title: 'Diferencial', icon: Target, desc: 'Por que escolher você' },
  { id: 5, title: 'Voz', icon: MessageSquare, desc: 'Como sua marca fala' },
  { id: 6, title: 'Objetivo', icon: Zap, desc: 'O que quer agora' },
];

export function DNAOnboarding() {
  const navigate = useNavigate();
  const { user, updateBusinessProfile } = useStorage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BusinessProfile>>(user?.businessProfile || {
    businessName: user?.businessName || '',
    businessType: user?.businessType || 'outro',
    operatingModel: 'fisico',
    businessStage: 'comecando',
    genderFocus: 'todos',
    incomeLevel: 'medio',
    brandTone: 'direto',
    mainSalesChannel: 'whatsapp',
    currentPriority: 'vender_hoje',
    bestSalesDays: [],
    worstSalesDays: [],
    paymentMethods: [],
    mainColors: ['#000000'],
  });

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
    else handleFinish();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleFinish = () => {
    updateBusinessProfile(formData as BusinessProfile);
    navigate('/dna-comercial/resumo');
  };

  const updateField = (field: keyof BusinessProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const progress = (currentStep / 6) * 100;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">DNA Comercial</h1>
          <p className="text-zinc-500 text-sm font-medium">Etapa {currentStep} de 6 — {STEPS[currentStep - 1].title}</p>
        </div>
        <div className="w-48 h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <motion.div 
            className="h-full bg-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 md:p-6 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Step 1: Básico */}
              {currentStep === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500"><Store className="w-5 h-5" /></div>
                      Identidade do Negócio
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nome do Negócio *</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.businessName}
                      onChange={e => updateField('businessName', e.target.value)}
                      placeholder="Ex: Pizzaria do Vale"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Cidade e Bairros *</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.city}
                      onChange={e => updateField('city', e.target.value)}
                      placeholder="Ex: São Paulo - Pinheiros e região"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Modelo de Operação</label>
                    <select 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium appearance-none"
                      value={formData.operatingModel}
                      onChange={e => updateField('operatingModel', e.target.value)}
                    >
                      <option value="fisico">Loja Física</option>
                      <option value="delivery">100% Delivery</option>
                      <option value="agenda">Atendimento por Agenda</option>
                      <option value="online">Venda Online</option>
                      <option value="hibrido">Híbrido (Físico + Digital)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">WhatsApp de Contato</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.whatsapp}
                      onChange={e => updateField('whatsapp', e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Produtos e Dinheiro */}
              {currentStep === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-xl text-green-500"><DollarSign className="w-5 h-5" /></div>
                      Produtos e Dinheiro
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Produto que Mais Venda *</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.bestSellerProduct}
                      onChange={e => updateField('bestSellerProduct', e.target.value)}
                      placeholder="Ex: Pizza de Calabresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Produto com Mais Lucro *</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.highestProfitProduct}
                      onChange={e => updateField('highestProfitProduct', e.target.value)}
                      placeholder="Ex: Vinho da Casa"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Ticket Médio (Gasto por Cliente)</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.averageTicket}
                      onChange={e => updateField('averageTicket', e.target.value)}
                      placeholder="Ex: R$ 85,00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Aceita Dar Descontos?</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => updateField('acceptsDiscounts', true)}
                        className={cn("flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all", formData.acceptsDiscounts ? "bg-amber-500 text-black border-amber-500" : "bg-zinc-950 border-zinc-800 text-zinc-500")}
                      >Sim</button>
                      <button 
                        onClick={() => updateField('acceptsDiscounts', false)}
                        className={cn("flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all", formData.acceptsDiscounts === false ? "bg-amber-500 text-black border-amber-500" : "bg-zinc-950 border-zinc-800 text-zinc-500")}
                      >Não</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Público */}
              {currentStep === 3 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><Users className="w-5 h-5" /></div>
                      Quem Compra de Você
                    </h2>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Descrição do Público Ideal *</label>
                    <textarea 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium h-24"
                      value={formData.targetAudience}
                      onChange={e => updateField('targetAudience', e.target.value)}
                      placeholder="Ex: Famílias de classe média que buscam praticidade e sabor no jantar..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Maior Medo/Objeção ao Comprar</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.customerObjections}
                      onChange={e => updateField('customerObjections', e.target.value)}
                      placeholder="Ex: 'É caro', 'Vai demorar', 'Não é de qualidade'"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">O que eles MAIS Valorizam?</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.whatCustomersValueMost}
                      onChange={e => updateField('whatCustomersValueMost', e.target.value)}
                      placeholder="Ex: Velocidade, Atendimento, Status, Preço"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Diferencial */}
              {currentStep === 4 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><Target className="w-5 h-5" /></div>
                      Seu Diferencial Único
                    </h2>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Por que escolher você e não o concorrente? *</label>
                    <textarea 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium h-24"
                      value={formData.uniqueSellingPoint}
                      onChange={e => updateField('uniqueSellingPoint', e.target.value)}
                      placeholder="Ex: Nossa massa é fermentada por 48h, sendo a mais leve e crocante da cidade."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Fraqueza do Concorrente</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.competitorWeakness}
                      onChange={e => updateField('competitorWeakness', e.target.value)}
                      placeholder="Ex: Atendimento ruim e demora na entrega"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Posicionamento de Preço</label>
                    <select 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium appearance-none"
                      value={formData.pricePositioning}
                      onChange={e => updateField('pricePositioning', e.target.value)}
                    >
                      <option value="barato">Mais Barato da Cidade</option>
                      <option value="popular_agressivo">Popular Agressivo</option>
                      <option value="medio">Preço Médio / Mercado</option>
                      <option value="premium">Premium / Gourmet</option>
                      <option value="luxo_acessivel">Luxo Acessível</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 5: Voz da Marca */}
              {currentStep === 5 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-pink-500/10 rounded-xl text-pink-500"><MessageSquare className="w-5 h-5" /></div>
                      Como sua Marca Fala
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Tom de Voz Principal *</label>
                    <select 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium appearance-none"
                      value={formData.brandTone}
                      onChange={e => updateField('brandTone', e.target.value)}
                    >
                      <option value="direto">Direto e Objetivo</option>
                      <option value="popular">Popular e Amigável</option>
                      <option value="premium">Premium e Exclusivo</option>
                      <option value="elegante">Elegante e Educado</option>
                      <option value="engracado">Engraçado e Divertido</option>
                      <option value="provocativo">Provocativo e Ousado</option>
                      <option value="urgente">Urgente e Escasso</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Personalidade da Marca</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.brandPersonality}
                      onChange={e => updateField('brandPersonality', e.target.value)}
                      placeholder="Ex: Como um mestre pizzaiolo experiente mas acessível"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Palavras que COMBINAM</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.wordsToUse}
                      onChange={e => updateField('wordsToUse', e.target.value)}
                      placeholder="Ex: Tradição, Sabor, Família, Crocante"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Palavras PROIBIDAS</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.wordsToAvoid}
                      onChange={e => updateField('wordsToAvoid', e.target.value)}
                      placeholder="Ex: Promoção, Grátis, Barato (Se for Premium)"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Objetivo */}
              {currentStep === 6 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500"><Zap className="w-5 h-5" /></div>
                      O que Você Quer Agora
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Prioridade de Venda *</label>
                    <select 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium appearance-none"
                      value={formData.currentPriority}
                      onChange={e => updateField('currentPriority', e.target.value)}
                    >
                      <option value="vender_hoje">Vender Agora (Urgência)</option>
                      <option value="lotar_agenda">Lotar Agenda da Semana</option>
                      <option value="recuperar_cliente">Recuperar Clientes Inativos</option>
                      <option value="lancar_novidade">Lançar Novo Produto/Serviço</option>
                      <option value="divulgar_promocao">Dar Giro em Estoque Parado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Maior Problema Atual</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.currentBiggestProblem}
                      onChange={e => updateField('currentBiggestProblem', e.target.value)}
                      placeholder="Ex: Meio de semana muito parado"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Anos de Mercado</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.yearsInBusiness}
                      onChange={e => updateField('yearsInBusiness', e.target.value)}
                      placeholder="Ex: 5 anos"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Cidade e Bairros Atendidos</label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium"
                      value={formData.serviceArea}
                      onChange={e => updateField('serviceArea', e.target.value)}
                      placeholder="Ex: Pinheiros, Vila Madalena, Itaim"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between pt-8 border-t border-zinc-800/50">
            <button 
              onClick={handleBack}
              disabled={currentStep === 1}
              className={cn(
                "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all",
                currentStep === 1 ? "opacity-0 pointer-events-none" : "bg-zinc-950 text-zinc-400 hover:text-white"
              )}
            >
              <ChevronLeft className="w-5 h-5" /> Voltar
            </button>

            <button 
              onClick={handleNext}
              className="px-10 py-5 bg-amber-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-amber-400 shadow-xl shadow-amber-500/10 transition-all"
            >
              {currentStep === 6 ? (
                <>Finalizar Perfil <Save className="w-5 h-5" /></>
              ) : (
                <>Próxima Etapa <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Dica */}
      <div className="mt-8 text-center bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
        <div className="flex items-center justify-center gap-3 text-amber-500 mb-2">
          <Sparkles className="w-5 h-5" />
          <p className="text-[10px] font-black uppercase tracking-widest">Dica Estratégica</p>
        </div>
        <p className="text-sm text-zinc-500 font-medium italic">
          "Quanto mais específico você for, mais poderosa será a IA ao gerar seus anúncios. Use detalhes reais do seu dia a dia."
        </p>
      </div>
    </div>
  );
}
