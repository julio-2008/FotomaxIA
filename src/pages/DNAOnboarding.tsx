import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Zap, 
  Scissors,
  Wrench,
  ShoppingBag,
  Store,
  ChevronRight, 
  ChevronLeft, 
  Fingerprint, 
  Info,
  ArrowRight,
  Target,
  Brain,
  Rocket,
  Clock,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { BusinessDNA } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { BUSINESS_KITS, BusinessNiche } from '../lib/data/businessKits';

const STEPS = [
  { id: "identity", label: "IDENTIDADE", desc: "Quem você é no mercado?" },
  { id: "products", label: "PRODUTOS", desc: "O que gera lucro real?" },
  { id: "audience", label: "PÚBLICO", desc: "Para quem você fala?" },
  { id: "position", label: "DNA", desc: "Por que escolher você?" },
  { id: "voice", label: "VOZ", desc: "Como você se expressa?" },
  { id: "sales", label: "OBJETIVO", desc: "Qual o objetivo de hoje?" },
];

export function DNAOnboarding() {
  const navigate = useNavigate();
  const { user, saveBusinessDNA, saveActivityEvent } = useStorage();
  const [step, setStep] = useState(0);
  
  const [dna, setDna] = useState<Partial<BusinessDNA>>({
    basics: {
      businessName: user?.businessName || '',
      ownerName: '',
      businessType: '' as BusinessNiche,
      niche: '',
      subNiche: '',
      city: '',
      neighborhood: '',
      serviceArea: '',
      whatsapp: '',
      instagram: '',
      operatingModel: 'fisico',
      businessStage: 'iniciante'
    },
    products: {
      mainProducts: '',
      bestSellerProduct: '',
      highestProfitProduct: '',
      lowRotationProduct: '',
      entryOfferProduct: '',
      premiumProduct: '',
      averageTicket: '',
      minimumPrice: '',
      maximumPrice: '',
      deliveryAvailable: false,
      productDifferentials: '',
      paymentMethods: []
    },
    audience: {
      targetAudience: '',
      primaryCustomerProfile: '',
      ageRange: '',
      incomeLevel: '',
      buyingMotivation: '',
      buyingFrequency: '',
      customerPainPoints: '',
      customerDesires: '',
      customerObjections: '',
      whatCustomersValueMost: ''
    },
    positioning: {
      mainCompetitors: '',
      competitorWeakness: '',
      competitorStrength: '',
      whyChooseUs: '',
      uniqueSellingPoint: '',
      localAdvantage: '',
      pricePositioning: 'medio'
    },
    brandVoice: {
      brandTone: 'direto',
      forbiddenTone: '',
      wordsToUse: '',
      wordsToAvoid: '',
      brandPersonality: '',
      visualStyle: '',
      mainColors: '',
      emotionalPromise: '',
      rationalPromise: ''
    },
    sales: {
      mainSalesChannel: 'whatsapp',
      secondarySalesChannels: '',
      bestSalesDays: [],
      worstSalesDays: [],
      bestSalesHours: '',
      currentBiggestProblem: '',
      currentPriority: 'vender_hoje',
      weeklyGoal: '',
      monthlyGoal: ''
    },
    offerRules: {
      acceptsDiscounts: true,
      maxDiscountAllowed: '',
      preferredPromotionType: '',
      bonusCanOffer: '',
      urgencyLevelAllowed: true,
      scarcityAllowed: true,
      guaranteeAvailable: '',
      freeDeliveryAvailable: false
    }
  });

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleFinish();
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleFinish = () => {
    const finalDna = {
      ...dna,
      id: 'dna_' + Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as BusinessDNA;
    
    saveBusinessDNA(finalDna);
    navigate('/dna-comercial/resumo');
  };

  const updateSection = (section: keyof BusinessDNA, field: string, value: any) => {
    setDna(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof dna] as any),
        [field]: value
      }
    }));
  };

  const renderStep = () => {
    const businessNiche = dna.basics?.businessType as BusinessNiche;
    const kit = businessNiche ? BUSINESS_KITS[businessNiche] : null;

    switch (step) {
      case 0:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand-yellow font-black text-[10px] uppercase tracking-widest leading-none">Passo 01 / Identidade</span>
              <h3 className="text-EDITORIAL-H3 text-white italic">QUAL SEU <span className="text-brand-yellow">TERRITÓRIO?</span></h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
              {[
                { id: 'alimentacao' as BusinessNiche, label: 'ALIMENTAÇÃO', icon: Flame },
                { id: 'barbearia' as BusinessNiche, label: 'BARBEARIA', icon: Scissors },
                { id: 'beleza' as BusinessNiche, label: 'ESTÉTICA', icon: Sparkles },
                { id: 'loja' as BusinessNiche, label: 'LOJA FÍSICA', icon: ShoppingBag },
                { id: 'servicos' as BusinessNiche, label: 'SERVIÇOS', icon: Wrench },
                { id: 'outro' as BusinessNiche, label: 'OUTRO MODELO', icon: Store },
              ].map((niche) => (
                <button
                  key={niche.id}
                  onClick={() => updateSection('basics', 'businessType', niche.id)}
                  className={cn(
                    "group p-6 md:p-12 bg-black transition-all flex flex-col items-start gap-8 relative overflow-hidden border border-white/5",
                    dna.basics?.businessType === niche.id ? "bg-brand-yellow text-black" : "hover:bg-white/[0.02]"
                  )}
                >
                  <niche.icon className={cn("w-8 h-8", dna.basics?.businessType === niche.id ? "text-black" : "text-brand-yellow")} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{niche.label}</span>
                  {dna.basics?.businessType === niche.id && <div className="absolute top-6 right-6">
                     <div className="w-2 h-2 bg-black rounded-full" />
                  </div>}
                </button>
              ))}
            </div>

            {dna.basics?.businessType && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5"
              >
                <div className="bg-black p-6 md:p-12 space-y-6">
                  <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">NOME DO SEU NEGOCIO</label>
                  <input 
                    type="text" 
                    value={dna.basics?.businessName} 
                    onChange={(e) => updateSection('basics', 'businessName', e.target.value)}
                    className="w-full bg-black border-b border-white/5 p-4 font-black text-white focus:border-brand-yellow outline-none transition-all uppercase italic text-xl tracking-tighter"
                    placeholder="DIGITE O NOME AQUI..."
                  />
                </div>
                <div className="bg-black p-6 md:p-12 space-y-6">
                   <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">RAMO DE ATUAÇÃO</label>
                   <input 
                    type="text" 
                    value={dna.basics?.niche} 
                    onChange={(e) => updateSection('basics', 'niche', e.target.value)}
                    className="w-full bg-black border-b border-white/5 p-4 font-black text-white focus:border-brand-yellow outline-none transition-all uppercase italic text-xl tracking-tighter"
                    placeholder={dna.basics?.businessType === 'alimentacao' ? "EX: PIZZARIA, SUSHI..." : "EX: MODA FEMININA"}
                  />
                </div>
                <div className="bg-black p-6 md:p-12 space-y-6">
                   <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">SUA CIDADE</label>
                   <input 
                    type="text" 
                    value={dna.basics?.city} 
                    onChange={(e) => updateSection('basics', 'city', e.target.value)}
                    className="w-full bg-black border-b border-white/5 p-4 font-black text-white focus:border-brand-yellow outline-none transition-all uppercase italic text-xl tracking-tighter"
                    placeholder="DIGITE SUA CIDADE"
                  />
                </div>
                <div className="bg-black p-6 md:p-12 space-y-6">
                   <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">SEU BAIRRO PRINCIPAL</label>
                   <input 
                    type="text" 
                    value={dna.basics?.neighborhood} 
                    onChange={(e) => updateSection('basics', 'neighborhood', e.target.value)}
                    className="w-full bg-black border-b border-white/5 p-4 font-black text-white focus:border-brand-yellow outline-none transition-all uppercase italic text-xl tracking-tighter"
                    placeholder="DIGITE SEU BAIRRO"
                  />
                </div>
              </motion.div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand-yellow font-black text-[10px] uppercase tracking-widest leading-none">Passo 02 / Produtos</span>
              <h3 className="text-EDITORIAL-H3 text-white italic">O QUE GERA <span className="text-brand-yellow">LUCRO?</span></h3>
            </div>

            <div className="space-y-px bg-white/5 border border-white/5">
              <div className="bg-black p-6 md:p-12 space-y-6">
                <label className="text-[9px] font-black uppercase text-brand-yellow tracking-[0.4em] italic leading-none">SEU CARRO-CHEFE</label>
                <textarea 
                  value={dna.products?.mainProducts} 
                  onChange={(e) => updateSection('products', 'mainProducts', e.target.value)}
                  className="w-full bg-black border border-white/5 p-6 font-black text-white focus:border-brand-yellow outline-none min-h-[140px] uppercase italic text-xl tracking-tighter"
                  placeholder="QUAIS SÃO SEUS PRODUTOS OU SERVIÇOS MAIS VENDIDOS E QUE MAIS DEFINEM SEU NEGÓCIO HOJE?"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-px bg-white/5">
                <div className="bg-black p-6 md:p-12 space-y-6">
                  <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">PRODUTO DE MAIOR MARGEM</label>
                  <input 
                    type="text" 
                    value={dna.products?.highestProfitProduct} 
                    onChange={(e) => updateSection('products', 'highestProfitProduct', e.target.value)}
                    className="w-full bg-black border-b border-white/5 p-4 font-black text-white focus:border-brand-yellow outline-none transition-all uppercase italic text-lg tracking-tight"
                    placeholder="QUAL O PRODUTO DE MAIOR MARGEM?"
                  />
                </div>
                <div className="bg-black p-6 md:p-12 space-y-6">
                  <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">PRODUTO PARADO NO ESTOQUE</label>
                  <input 
                    type="text" 
                    value={dna.products?.lowRotationProduct} 
                    onChange={(e) => updateSection('products', 'lowRotationProduct', e.target.value)}
                    className="w-full bg-black border-b border-white/5 p-4 font-black text-white focus:border-brand-yellow outline-none transition-all uppercase italic text-lg tracking-tight"
                    placeholder="O QUE PRECISA GIRAR URGENTE?"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand-yellow font-black text-[10px] uppercase tracking-widest leading-none">Passo 03 / Público</span>
              <h3 className="text-EDITORIAL-H3 text-white italic">PARA QUEM <span className="text-brand-yellow">FALAMOS?</span></h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              <div className="bg-black p-6 md:p-12 space-y-6">
                <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">PERFIL DO CLIENTE IDEAL</label>
                <textarea 
                  value={dna.audience?.primaryCustomerProfile} 
                  onChange={(e) => updateSection('audience', 'primaryCustomerProfile', e.target.value)}
                  className="w-full bg-black border border-white/5 p-6 font-black text-white focus:border-brand-yellow outline-none min-h-[160px] uppercase italic text-xl tracking-tighter"
                  placeholder="QUEM É A PESSOA QUE MAIS ENTRA NA SUA LOJA OU CHAMA NO WHATSAPP? (IDADE, GOSTOS, PROFISSÃO)"
                />
              </div>
              <div className="bg-black p-6 md:p-12 space-y-6">
                <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">DESEJOS E PROBLEMAS</label>
                <textarea 
                  value={dna.audience?.customerPainPoints} 
                  onChange={(e) => updateSection('audience', 'customerPainPoints', e.target.value)}
                  className="w-full bg-black border border-white/5 p-6 font-black text-white focus:border-brand-yellow outline-none min-h-[160px] uppercase italic text-xl tracking-tighter"
                  placeholder="QUAL O MAIOR PROBLEMA QUE VOCÊ RESOLVE PARA ELES? O QUE ELES REALMENTE BUSCAM AO TE PROCURAR?"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand-yellow font-black text-[10px] uppercase tracking-widest leading-none">Passo 04 / Diferencial</span>
              <h3 className="text-EDITORIAL-H3 text-white italic">POR QUE <span className="text-brand-yellow">VOCÊ?</span></h3>
            </div>

            <div className="space-y-px bg-white/5 border border-white/5">
              <div className="bg-black p-6 md:p-12 space-y-6">
                <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">SEU MAIOR DIFERENCIAL</label>
                <textarea 
                  value={dna.positioning?.uniqueSellingPoint} 
                  onChange={(e) => updateSection('positioning', 'uniqueSellingPoint', e.target.value)}
                  className="w-full bg-black border border-white/5 p-6 font-black text-white focus:border-brand-yellow outline-none min-h-[140px] uppercase italic text-xl tracking-tighter"
                  placeholder="O QUE SÓ VOCÊ TEM QUE OS OUTROS NÃO TÊM?"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-px bg-white/5">
                <div className="bg-black p-6 md:p-12 space-y-6">
                  <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">FALHA DOS CONCORRENTES</label>
                  <textarea 
                    value={dna.positioning?.competitorWeakness} 
                    onChange={(e) => updateSection('positioning', 'competitorWeakness', e.target.value)}
                    className="w-full bg-black border border-white/5 p-6 font-bold text-white focus:border-brand-yellow outline-none h-32 uppercase italic tracking-tight"
                    placeholder="ONDE SEUS CONCORRENTES MAIS FALHAM?"
                  />
                </div>
                <div className="bg-black p-6 md:p-12 space-y-6">
                  <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">VANTAGEM DA LOCALIZAÇÃO</label>
                  <textarea 
                    value={dna.positioning?.localAdvantage} 
                    onChange={(e) => updateSection('positioning', 'localAdvantage', e.target.value)}
                    className="w-full bg-black border border-white/5 p-6 font-bold text-white focus:border-brand-yellow outline-none h-32 uppercase italic tracking-tight"
                    placeholder="EXISTE ALGO NO SEU BAIRRO/CIDADE QUE TE FAVORECE?"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand-yellow font-black text-[10px] uppercase tracking-widest leading-none">Passo 05 / Voz da Marca</span>
              <h3 className="text-EDITORIAL-H3 text-white italic">COMO <span className="text-brand-yellow">FALAR?</span></h3>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              {[
                { id: 'direto', label: 'DIRETO E OBJETIVO', desc: 'Curto, forte, sem enrolação' },
                { id: 'premium', label: 'PREMIUM E ELEGANTE', desc: 'Sofisticado, elegante, valor alto' },
                { id: 'popular', label: 'POPULAR E AMIGÁVEL', icon: Scissors, desc: 'Amigável, acessível, povão' },
                { id: 'emocional', label: 'HUMANO E INSPIRADOR', desc: 'Inspirador, humano, profundo' },
              ].map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => updateSection('brandVoice', 'brandTone', tone.id)}
                  className={cn(
                    "p-6 md:p-12 bg-black flex flex-col items-start gap-6 transition-all text-left border border-white/5",
                    dna.brandVoice?.brandTone === tone.id ? "bg-brand-yellow text-black" : "hover:bg-white/[0.02]"
                  )}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] italic leading-none">{tone.label}</span>
                  <p className={cn("text-[9px] uppercase font-black tracking-widest leading-relaxed italic", dna.brandVoice?.brandTone === tone.id ? "text-black/60" : "text-zinc-600")}>{tone.desc}</p>
                </button>
              ))}
            </div>

            <div className="bg-black p-6 md:p-12 space-y-6 border border-white/5">
              <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic leading-none">PALAVRAS PROIBIDAS</label>
              <input 
                type="text" 
                value={dna.brandVoice?.wordsToAvoid} 
                onChange={(e) => updateSection('brandVoice', 'wordsToAvoid', e.target.value)}
                className="w-full bg-black border-b border-white/5 p-4 font-black text-white focus:border-brand-yellow outline-none transition-all uppercase italic text-xl tracking-tighter"
                placeholder="PALAVRAS OU GÍRIAS PROIBIDAS..."
              />
            </div>
          </div>
        );
      case 5:
        return (
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-brand-yellow font-black text-[10px] uppercase tracking-widest leading-none">Step_06 / Goals</span>
                <h3 className="text-EDITORIAL-H3 text-white italic">QUAL O <span className="text-brand-yellow">ALVO?</span></h3>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
                {[
                  { id: 'vender_hoje', label: 'VENDER MAIS HOJE', icon: Zap, desc: 'Foco em caixa rápido' },
                  { id: 'lotar_agenda', label: 'LOTAR AGENDA SYNC', icon: Clock, desc: 'Preencher horários vazios' },
                  { id: 'recuperar_cliente', label: 'RECUPERAR CLIENTES CORE', icon: History, desc: 'Quem não compra há tempo' },
                  { id: 'lancar_novidade', label: 'LANÇAR NOVIDADE ALPHA', icon: Rocket, desc: 'Novos produtos ou serviços' },
                ].map((priority) => (
                  <button
                    key={priority.id}
                    onClick={() => updateSection('sales', 'currentPriority', priority.id)}
                    className={cn(
                      "p-6 md:p-12 bg-black flex flex-col items-center gap-6 transition-all text-center border border-white/5",
                      dna.sales?.currentPriority === priority.id ? "bg-brand-yellow text-black" : "hover:bg-white/[0.02]"
                    )}
                  >
                    <priority.icon className={cn("w-10 h-10", dna.sales?.currentPriority === priority.id ? "text-black" : "text-brand-yellow")} />
                    <div className="space-y-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] italic block">{priority.label}</span>
                       <p className={cn("text-[8px] uppercase font-black tracking-widest italic", dna.sales?.currentPriority === priority.id ? "text-black/60" : "text-zinc-700")}>{priority.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
      default:
        return (
          <div className="bg-zinc-950 p-8 md:p-20 text-center space-y-8 border border-zinc-900">
              <Fingerprint className="w-16 h-16 text-brand-yellow mx-auto opacity-50" />
              <h2 className="text-EDITORIAL-H3 text-white italic">CONTINUANDO O <span className="text-brand-yellow">MAPEAMENTO...</span></h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">A inteligência está sendo calibrada para seu nicho.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col pt-10 px-4 md:px-0">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col pb-32">
        
        {/* Navigation / Progress */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-6 md:p-12 border-b border-zinc-900 pb-8 md:pb-12 mb-8 md:mb-16">
          <div className="space-y-4">
            <span className="text-EDITORIAL-LABEL text-brand-yellow">Architectural Mapping</span>
            <h1 className="text-EDITORIAL-H2 text-white italic uppercase tracking-tighter leading-none">
              DNA <span className="text-brand-yellow font-black italic">ESTRATÉGICO</span>
            </h1>
            <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.3em] italic">Building your commercial brain</p>
          </div>
          
          <div className="w-full md:w-80 space-y-4">
             <div className="flex justify-between items-baseline mb-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">MAPPING PROGRESS</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-brand-yellow">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
             </div>
             <div className="h-1 bg-zinc-900 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  className="h-full bg-brand-yellow"
                />
             </div>
          </div>
        </div>

        {/* Dynamic Step Display */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-8 md:p-6 md:p-12 bg-black/80 backdrop-blur-3xl border-t border-zinc-900 z-50">
           <div className="max-w-5xl mx-auto flex items-center justify-between">
              <button 
                onClick={prevStep}
                disabled={step === 0}
                className={cn(
                  "p-5 font-black text-[10px] uppercase tracking-widest transition-all",
                  step === 0 ? "opacity-0" : "text-zinc-600 hover:text-white"
                )}
              >
                VOLTAR
              </button>

              <div className="flex items-center gap-6 md:p-12">
                 <button 
                   onClick={handleFinish}
                   className="hidden md:block text-[8px] font-black uppercase tracking-[0.3em] text-zinc-800 hover:text-zinc-400 transition-colors"
                 >
                   SALVAR E SAIR DEPOIS
                 </button>
                 <button 
                  onClick={nextStep}
                  className="brand-button h-16 px-16 group"
                 >
                  {step === STEPS.length - 1 ? 'FINALIZAR' : 'PRÓXIMO PASSO'} 
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
           </div>
        </div>

        {/* AI Insight Overlay */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-32 right-12 hidden lg:flex flex-col items-end gap-6 w-80 pointer-events-none"
        >
           <div className="bg-brand-yellow/5 border border-brand-yellow/10 p-8 backdrop-blur-xl relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-brand-yellow flex items-center justify-center">
                 <Brain className="w-4 h-4 text-black" />
              </div>
              <p className="text-[10px] text-brand-yellow/80 font-bold uppercase tracking-widest leading-relaxed italic">
                {step === 0 && "Definir o território mapeia os concorrentes e o tom de voz ideal para sua região automaticamente."}
                {step === 1 && "Identificar o Carro-Chefe permite que a IA crie escassez real baseada no seu volume de vendas."}
                {step === 2 && "Entender a Dor do cliente é a chave para transformar 'Preço' em 'Investimento' na copy."}
                {step >= 3 && "Quase lá. O motor estratégico está ganhando consciência comercial sobre seu ecossistema."}
              </p>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-brand-yellow rounded-full animate-ping" />
              <span className="text-[8px] font-black uppercase text-zinc-800 tracking-[0.3em]">IA ANALISANDO SEU NEGÓCIO</span>
           </div>
        </motion.div>

      </div>
    </div>
  );
}
