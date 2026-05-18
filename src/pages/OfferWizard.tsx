import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, Target, ShieldQuestion, ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { aiCore } from '../services/aiCore';
import { usageGuard } from '../services/usageGuard';
import { AIActionType } from '../types';

import { BUSINESS_KITS, BusinessNiche } from '../lib/data/businessKits';

import { cn } from '../lib/utils';

export function OfferWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const flowType = searchParams.get('type');
  
  const { user, saveOffer, saveUser, addLedgerEntry, saveActivityEvent } = useStorage() as any;
  const [loading, setLoading] = useState(false);

  const dna = user?.businessDNA || user?.businessProfile;
  const businessNiche: BusinessNiche = dna?.basics?.businessType || dna?.businessType || 'outro';
  const kit = BUSINESS_KITS[businessNiche] || BUSINESS_KITS.outro;
  const template = location.state?.template;

  const [formData, setFormData] = useState({
    productOrService: '',
    price: '',
    objective: flowType || template || 'oferta-do-dia',
    targetAudience: '',
    mainObjection: '',
    allowDiscount: dna?.offerRules?.acceptsDiscounts || false,
    maxDiscount: dna?.offerRules?.maxDiscountAllowed || '',
    bonus: dna?.offerRules?.bonusCanOffer || '',
    deadline: '',
    stockLimit: '',
    channel: dna?.sales?.mainSalesChannel || 'whatsapp',
    tone: dna?.brandVoice?.brandTone || 'direto'
  });

  useEffect(() => {
    if (dna) {
      setFormData(prev => ({
        ...prev,
        targetAudience: dna.audience?.primaryCustomerProfile || prev.targetAudience,
        mainObjection: dna.audience?.customerObjections || prev.mainObjection,
        tone: dna.brandVoice?.brandTone || prev.tone,
        channel: dna.sales?.mainSalesChannel || prev.channel,
        productOrService: template ? prev.productOrService : (dna.products?.bestSellerProduct || prev.productOrService),
      }));
    }
  }, [dna, template]);

  const generateOffer = async () => {
    const actionType: AIActionType = 'offer_generation';
    const check = usageGuard.canUseAI(user, actionType);
    
    if (!check.can) {
      alert(check.reason);
      if (check.errorCode === 'INSUFFICIENT_CREDITS') navigate('/uso');
      return;
    }
    
    if (!formData.productOrService) {
      alert("Por favor, informe o produto ou serviço.");
      return;
    }

    setLoading(true);

    try {
      // Consume credits
      const updatedUser = usageGuard.consumeCredits(user, actionType);
      saveUser(updatedUser);

      const payloadData = { ...formData };
      if (formData.objective === 'combo') {
        payloadData.productOrService += ` (Foque em criar uma oferta irresistível do tipo COMBO, agrupando produtos complementares para aumentar o ticket médio. Sugira o desconto ou vantagem do pacote).`;
      } else if (formData.objective === 'giro') {
        payloadData.productOrService += ` (Foque em criar uma estratégia agressiva para girar estoque desse produto parado. Foque em vantagem financeira clara ou queima de estoque).`;
      } else if (formData.objective === 'oferta-do-dia') {
        payloadData.productOrService += ` (Crie uma oferta exclusiva com forte chamada à ação para HOJE, gerando escassez e urgência imediata).`;
      }
      
      const result = await aiCore.run(actionType, {
         input: payloadData,
         businessProfile: dna,
         businessKit: kit
      });

      if (result.success) {
         const offerId = 'off_' + Math.random().toString(36).substring(2, 9);
         const offer = {
           id: offerId,
           userId: user!.id,
           createdAt: new Date().toISOString(),
           type: 'offer',
           businessProfileSnapshot: dna,
           input: formData,
           outputs: result.data.result,
           strategy: result.data.strategy,
           quality: result.data.quality
         };

         saveOffer(offer as any);

         // Log Beta Analytics
         if (saveActivityEvent) {
           saveActivityEvent({
             id: 'evt_' + Math.random().toString(36).substring(2, 11),
             userId: user.id,
             type: 'first_action_generated',
             timestamp: new Date().toISOString(),
             metadata: { actionType, offerId }
           });
           if (user.plan === 'trial') {
             saveActivityEvent({
               id: 'evt_' + Math.random().toString(36).substring(2, 11),
               userId: user.id,
               type: 'trial_used',
               timestamp: new Date().toISOString(),
               metadata: { actionType }
             });
           }
         }

         // Add ledger entry
         if (addLedgerEntry) {
            addLedgerEntry({
               userId: user.id,
               type: 'monthly_usage',
               actionType,
               creditsChanged: -(check.cost || 1),
               balanceAfter: (updatedUser.usage.monthlyCreditsLimit ?? 0) - (updatedUser.usage.monthlyCreditsUsed ?? 0),
               reason: 'Geração de Oferta: ' + formData.productOrService,
               relatedResultId: offerId
            });
         }

         navigate(`/ofertas/diagnostico`, { state: { offer } });
      } else {
         alert("Erro ao validar ou gerar a oferta: " + result.error);
      }
    } catch (e) {
      alert("Erro de conexão ao criar oferta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32 animate-fade-in px-4 md:px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 pt-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-editorial-label text-brand-yellow/50">Módulo de Ofertas Estratégicas</span>
              <h1 className="text-editorial-h2 text-white italic tracking-tighter uppercase font-black leading-[0.8]">
                GERADOR DE <br /> <span className="text-brand-yellow text-glow">OFERTAS</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/10" />
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">
                TRANSFORMANDO PRODUTOS EM DESEJO REAL
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/ofertas')} 
            className="h-28 w-20 bg-zinc-950 border border-white/5 flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-all group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-white/5 border border-white/5 pt-[1px] pl-[1px] overflow-hidden">
          
          {/* Main Configuration Section */}
          <div className="lg:col-span-8 space-y-[1px] bg-white/5">
            
            {/* Step 1: Core Product */}
            <div className="bg-black p-10 space-y-10 group relative">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-brand-yellow" />
                 <h3 className="text-editorial-label text-zinc-500 uppercase">IDENTIFICAÇÃO DO PRODUTO</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] italic">Nome do Produto ou Serviço</label>
                    <input
                      value={formData.productOrService}
                      onChange={e => setFormData({ ...formData, productOrService: e.target.value })}
                      className="w-full bg-black border-b border-white/10 px-0 py-4 text-white text-xl font-black uppercase italic outline-none focus:border-brand-yellow placeholder:text-zinc-900 transition-all"
                      placeholder="QUAL O SEU PRODUTO?"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] italic">Preço Normal (Âncora)</label>
                    <input
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-black border-b border-white/10 px-0 py-4 text-white text-xl font-black uppercase italic outline-none focus:border-brand-yellow placeholder:text-zinc-900 transition-all"
                      placeholder="EX: R$ 197,00"
                    />
                  </div>
               </div>
            </div>

            {/* Step 2: Strategic Goal */}
            <div className="bg-black p-10 space-y-10 group relative border-t border-white/5">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-brand-yellow" />
                 <h3 className="text-editorial-label text-zinc-500 uppercase">OBJETIVO ESTRATÉGICO</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1px] bg-white/5 pt-[1px] pl-[1px]">
                  {[
                    { id: 'oferta-do-dia', label: 'OFERTA DO DIA', desc: 'Maximizar Urgência' },
                    { id: 'combo', label: 'CRIAR COMBO', desc: 'Aumentar Ticket' },
                    { id: 'giro', label: 'GIRAR ESTOQUE', desc: 'Liquidado Rápido' },
                    { id: 'recuperar_cliente', label: 'RECUPERAR CLIENTE', desc: 'Volta de Inativos' },
                    { id: 'premium', label: 'OFERTA PREMIUM', desc: 'Posicionamento Luxo' },
                    { id: 'lotar_agenda', label: 'LOTAR AGENDA', desc: 'Preencher Vagas' }
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setFormData({ ...formData, objective: goal.id })}
                      className={cn(
                        "p-6 flex flex-col gap-4 text-left transition-all uppercase italic",
                        formData.objective === goal.id 
                          ? "bg-brand-yellow text-black" 
                          : "bg-black text-white hover:bg-zinc-950"
                      )}
                    >
                      <span className="text-xs font-black tracking-widest">{goal.label}</span>
                      <span className={cn("text-[8px] font-bold tracking-widest opacity-50", formData.objective === goal.id ? 'text-black' : 'text-zinc-500')}>
                        {goal.desc}
                      </span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Step 3: Audience & Objections */}
            <div className="bg-black p-10 space-y-10 border-t border-white/5">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-brand-yellow" />
                 <h3 className="text-editorial-label text-zinc-500 uppercase">PERFIL DE COMPRA</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] italic">Para quem é essa oferta?</label>
                    <input
                      value={formData.targetAudience}
                      onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                      className="w-full bg-black border-b border-white/10 px-0 py-4 text-white text-sm font-black uppercase italic outline-none focus:border-brand-yellow placeholder:text-zinc-900 transition-all"
                      placeholder="PARA QUEM É ISSO?"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] italic">Principal Dúvida ou Objeção</label>
                    <input
                      value={formData.mainObjection}
                      onChange={e => setFormData({ ...formData, mainObjection: e.target.value })}
                      className="w-full bg-black border-b border-white/10 px-0 py-4 text-white text-sm font-black uppercase italic outline-none focus:border-brand-yellow placeholder:text-zinc-900 transition-all"
                      placeholder="POR QUE NÃO COMPRAM?"
                    />
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar / Logic Conditions */}
          <div className="lg:col-span-4 bg-white/5">
            <div className="bg-black p-10 space-y-10">
               <div className="flex items-center gap-3">
                 <ShieldQuestion className="w-4 h-4 text-brand-yellow" />
                 <h3 className="text-editorial-label text-zinc-500 uppercase">REGRAS E LIMITES</h3>
               </div>
               
               <div className="space-y-8">
                 <div className="flex items-center gap-6 p-6 border border-white/5 hover:border-brand-yellow/30 transition-all cursor-pointer group"
                      onClick={() => setFormData({ ...formData, allowDiscount: !formData.allowDiscount })}>
                    <div className={cn(
                      "w-6 h-6 border-2 flex items-center justify-center transition-all",
                      formData.allowDiscount ? "bg-brand-yellow border-brand-yellow" : "border-white/10 group-hover:border-brand-yellow/50"
                    )}>
                      {formData.allowDiscount && <div className="w-2 h-2 bg-black rotate-45" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">HABILITAR DESCONTO EXTRA</span>
                 </div>
 
                 {formData.allowDiscount && (
                   <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                     <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] italic">Limite de Desconto</label>
                     <input
                       value={formData.maxDiscount}
                       onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })}
                       className="w-full bg-black border-b border-brand-yellow/50 px-0 py-4 text-white text-sm font-black uppercase italic outline-none"
                       placeholder="EX: 20% OFF"
                     />
                   </div>
                 )}
 
                 <div className="space-y-8 pt-4">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] italic">Bônus ou Brindes</label>
                      <input
                        value={formData.bonus}
                        onChange={e => setFormData({ ...formData, bonus: e.target.value })}
                        className="w-full bg-black border-b border-white/10 px-0 py-4 text-white text-sm font-black uppercase italic outline-none focus:border-brand-yellow transition-all"
                        placeholder="ALGO A MAIS?"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] italic">Escassez ou Prazo Final</label>
                      <input
                        value={formData.deadline}
                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full bg-black border-b border-white/10 px-0 py-4 text-white text-sm font-black uppercase italic outline-none focus:border-brand-yellow transition-all"
                        placeholder="QUANDO ACABA?"
                      />
                    </div>
                 </div>
               </div>
            </div>

            {/* Meta Configuration */}
            <div className="bg-black p-10 space-y-10 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-brand-yellow" />
                  <h3 className="text-editorial-label text-zinc-500 uppercase">DIREÇÃO DA IA</h3>
                </div>
                <div className="grid grid-cols-2 gap-[1px] bg-white/10">
                   <select
                     value={formData.tone}
                     onChange={e => setFormData({ ...formData, tone: e.target.value })}
                     className="bg-zinc-950 p-6 text-[10px] font-black uppercase tracking-widest italic text-white outline-none hover:bg-white hover:text-black transition-all appearance-none cursor-pointer"
                   >
                     <option value="direto">DIRETO E OBJETIVO</option>
                     <option value="premium">PREMIUM E LUXO</option>
                     <option value="popular">POPULAR E ACESSÍVEL</option>
                     <option value="elegante">ELITE E FORMAL</option>
                     <option value="urgente">FOCADO EM URGÊNCIA</option>
                   </select>
                   <select
                     value={formData.channel}
                     onChange={e => setFormData({ ...formData, channel: e.target.value })}
                     className="bg-zinc-950 p-6 text-[10px] font-black uppercase tracking-widest italic text-white outline-none hover:bg-white hover:text-black transition-all appearance-none cursor-pointer"
                   >
                     <option value="whatsapp">WHATSAPP (ZAP)</option>
                     <option value="instagram">INSTAGRAM (VISUAL)</option>
                     <option value="ambos">AMBOS (ZAP + IG)</option>
                   </select>
                </div>
            </div>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="bg-white border-4 border-black p-10 flex flex-col md:flex-row items-center gap-10 sticky bottom-8 z-30 shadow-[0_50px_100px_rgba(250,204,21,0.2)]">
           <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-black animate-pulse" />
                 <h3 className="text-[10px] font-black uppercase text-black tracking-[0.3em]">Cortex Generator Ready</h3>
              </div>
              <p className="text-[10px] text-black/50 font-bold uppercase tracking-widest italic leading-none">
                {formData.productOrService ? `PREPARING OFFER FOR: ${formData.productOrService.toUpperCase()}` : 'WAITING FOR CORE PRODUCT INPUT'}
              </p>
           </div>
           
           <button 
             onClick={generateOffer}
             disabled={loading || !formData.productOrService}
             className="h-16 px-16 bg-black text-white font-black uppercase tracking-[0.4em] text-xs italic hover:bg-zinc-900 transition-all min-w-full md:min-w-[300px] flex items-center justify-center gap-6 disabled:opacity-30 disabled:cursor-not-allowed group"
           >
             {loading ? 'CONSTRUINDO OFERTA...' : (
               <>
                 CRIAR OFERTA MESTRE
                 <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform text-brand-yellow" />
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
