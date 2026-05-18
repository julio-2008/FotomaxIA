import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Target, ShoppingBag, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { aiCore } from '../services/aiCore';
import { usageGuard } from '../services/usageGuard';
import { AIActionType } from '../types';

import { BUSINESS_KITS, BusinessNiche } from '../lib/data/businessKits';

export function CampaignWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const flowType = searchParams.get('type');

  const { user, saveCampaign, saveUser, addLedgerEntry, offers, saveActivityEvent } = useStorage() as any;
  const [loading, setLoading] = useState(false);

  const dna = user?.businessDNA;
  const businessNiche: BusinessNiche = dna?.basics?.businessType || 'outro';
  const kit = BUSINESS_KITS[businessNiche] || BUSINESS_KITS.outro;
  const template = location.state?.template;

  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [formData, setFormData] = useState({
    objective: flowType || template || 'vender_hoje',
    productOrService: '',
    priceAndCondition: '',
    targetAudience: '',
    mainObjection: '',
    urgencyOffer: '',
    channels: 'ambos',
    tone: dna?.brandVoice?.brandTone || 'direto'
  });

  useEffect(() => {
    if (dna) {
      setFormData(prev => ({
        ...prev,
        targetAudience: dna.audience?.primaryCustomerProfile || prev.targetAudience,
        mainObjection: dna.audience?.customerObjections || prev.mainObjection,
        tone: dna.brandVoice?.brandTone || prev.tone,
        productOrService: template ? prev.productOrService : (dna.products?.bestSellerProduct || prev.productOrService),
      }));
    }
  }, [dna, template]);

  const handleOfferSelect = (id: string) => {
    setSelectedOfferId(id);
    const off = offers.find((o: any) => o.id === id);
    if (off && off.input) {
      setFormData(prev => ({
        ...prev,
        productOrService: off.input.productOrService || '',
        priceAndCondition: off.input.price || '',
        targetAudience: off.input.targetAudience || prev.targetAudience,
        mainObjection: off.input.mainObjection || prev.mainObjection,
        urgencyOffer: off.input.deadline || off.input.stockLimit || '',
        channels: off.input.channel || prev.channels,
        tone: off.input.tone || prev.tone,
        objective: off.input.objective || prev.objective
      }));
    }
  };

  const generateCampaign = async () => {
    const actionType: AIActionType = 'campaign_generation';
    const check = usageGuard.canUseAI(user, actionType);
    
    if (!check.can) {
      alert(check.reason);
      if (check.errorCode === 'INSUFFICIENT_CREDITS') navigate('/uso');
      return;
    }
    
    if (!formData.productOrService) {
      alert("Por favor, preencha o produto/serviço.");
      return;
    }

    setLoading(true);

    try {
      const selectedOffer = offers.find((o: any) => o.id === selectedOfferId);
      const payloadData = { ...formData };
      
      // Consume credits BEFORE AI call (Security First)
      // Note: If fails, we'll try to refund or log failure.
      let updatedUser = usageGuard.consumeCredits(user, actionType);
      saveUser(updatedUser);

      if (formData.objective === 'cardapio') {
         payloadData.productOrService += ` (Gere um cardápio atrativo contendo: Título do Cardápio, Categorias bem definidas, Produtos com descrições curtas e apetitosas, Preços e Combos Promocionais. Finalize com sugestão de texto para WhatsApp/Stories).`;
      } else if (formData.objective === 'story') {
         payloadData.productOrService += ` (Gere ideias visuais e texto rápido para 3 Stories encadeados).`;
      } else if (formData.objective === 'legenda') {
         payloadData.productOrService += ` (Apenas uma legenda curta e forte focada em conversão e engajamento no Instagram).`;
      }

      const result = await aiCore.run(actionType, {
         input: payloadData,
         businessProfile: dna,
         businessKit: kit,
         offer: selectedOffer
      });

      if (result.success) {
         const campaignId = 'cmp_' + Math.random().toString(36).substring(2, 9);
         
         const campaign = {
           id: campaignId,
           userId: user!.id,
           createdAt: new Date().toISOString(),
           type: 'campaign',
           businessProfileSnapshot: dna,
           offerSnapshot: selectedOffer,
           input: formData,
           outputs: result.data.result,
           strategy: result.data.strategy,
           quality: result.data.quality
         };

         saveCampaign(campaign as any);
         
         // Log Beta Analytics
         if (saveActivityEvent) {
           saveActivityEvent({
             id: 'evt_' + Math.random().toString(36).substring(2, 11),
             userId: user.id,
             type: 'first_action_generated',
             timestamp: new Date().toISOString(),
             metadata: { actionType, campaignId }
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
         
         // Log usage event
         usageGuard.saveUsageEvent({
           userId: user.id,
           actionType,
           module: 'Campanhas',
           cost: check.cost,
           plan: user.plan,
           allowed: true,
           resultId: campaignId,
           success: true
         });

         // Add ledger entry
         addLedgerEntry({
            userId: user.id,
            type: 'monthly_usage',
            actionType,
            creditsChanged: -(check.cost || 1),
            balanceAfter: (updatedUser.usage.monthlyCreditsLimit ?? 0) - (updatedUser.usage.monthlyCreditsUsed ?? 0),
            reason: 'Geração de Campanha: ' + formData.productOrService,
            relatedResultId: campaignId
         });

         navigate(`/campanhas/diagnostico`, { state: { campaignId: campaign.id } });
      } else {
         // REFUND or Log Failure
         // For now, let's just log failure. In a real system, we might refund here.
         alert("Erro ao validar ou gerar a campanha: " + result.error);
         usageGuard.saveUsageEvent({
           userId: user.id,
           actionType,
           module: 'Campanhas',
           cost: check.cost,
           plan: user.plan,
           allowed: true,
           success: false,
           deniedReason: result.error
         });
      }
    } catch (e) {
      alert("Erro de conexão ao criar campanha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 animate-fade-in px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/campanhas')} className="text-zinc-600 hover:text-brand-yellow transition-all border border-white/5 p-4 bg-zinc-950/50 backdrop-blur-md group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="space-y-2">
            <span className="text-editorial-label text-brand-yellow/50">Módulo de Estratégia / Creation</span>
            <h1 className="text-editorial-h3 text-white italic">CRIAR NOVA <br /><span className="text-brand-yellow">CAMPANHA</span></h1>
          </div>
        </div>
        <div className="hidden md:block text-right">
           <p className="text-[8px] font-black uppercase text-zinc-800 tracking-[0.4em] leading-relaxed">Neural Marketing System / v2.6<br />Awaiting Input Signal</p>
        </div>
      </header>

      <div className="bg-zinc-950/30 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="space-y-[1px] bg-white/5 relative z-10">
           {offers && offers.length > 0 && (
             <div className="bg-black p-10 space-y-6">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-brand-yellow" />
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">IMPORT EXISTING OFFER</label>
               </div>
               <select
                 value={selectedOfferId}
                 onChange={e => handleOfferSelect(e.target.value)}
                 className="w-full bg-zinc-950 border border-white/5 px-6 py-5 text-sm font-bold text-white focus:border-brand-yellow outline-none transition-all appearance-none cursor-pointer"
               >
                 <option value="">-- MANUAL MODE (Gera do Zero) --</option>
                 {offers.map((o: any) => (
                   <option key={o.id} value={o.id}>
                     {o.outputs?.offerName || o.input?.productOrService || 'Oferta sem nome'}
                   </option>
                 ))}
               </select>
             </div>
           )}

           <div className="grid md:grid-cols-2 gap-[1px] bg-white/5">
              <div className="bg-black p-10 lg:p-6 md:p-12 space-y-10 flex flex-col justify-between text-center md:text-left">
                <div className="space-y-10">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-brand-yellow" />
                    <h2 className="text-editorial-label text-white uppercase tracking-widest leading-none">Produto & Oferta</h2>
                  </div>
                  <div className="space-y-10">
                    <div className="group">
                      <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 group-focus-within:text-brand-yellow transition-colors">O que você vai vender hoje? *</label>
                      <input
                        value={formData.productOrService}
                        onChange={e => setFormData({ ...formData, productOrService: e.target.value })}
                        className="w-full bg-transparent border-b border-white/5 py-4 text-xl font-black text-white focus:border-brand-yellow outline-none transition-all placeholder:text-zinc-900"
                        placeholder="Ex: Pizza de Calabresa, Corte de Cabelo..."
                      />
                    </div>
                    <div className="group">
                      <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 group-focus-within:text-brand-yellow transition-colors">Preço ou Condição Especial</label>
                      <input
                        value={formData.priceAndCondition}
                        onChange={e => setFormData({ ...formData, priceAndCondition: e.target.value })}
                        className="w-full bg-transparent border-b border-white/5 py-4 text-lg font-bold text-white focus:border-brand-yellow outline-none transition-all placeholder:text-zinc-900"
                        placeholder="Ex: R$ 49,90 / 30% OFF"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black p-10 lg:p-6 md:p-12 space-y-10">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-brand-yellow" />
                  <h2 className="text-editorial-label text-white uppercase tracking-widest leading-none">Objetivo da Campanha</h2>
                </div>
                <div className="space-y-10">
                  <div className="group">
                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 group-focus-within:text-brand-yellow transition-colors">Qual a meta desta ação?</label>
                    <select
                      value={formData.objective}
                      onChange={e => setFormData({ ...formData, objective: e.target.value })}
                      className="w-full bg-transparent border-b border-white/5 py-4 text-lg font-black text-white focus:border-brand-yellow outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="vender_hoje">Vender Hoje (Ação Rápida)</option>
                      <option value="recuperacao">Recuperar Clientes Inativos</option>
                      <option value="cardapio">Criar Cardápio / Menu</option>
                      <option value="story">Criar Story / Status</option>
                      <option value="agenda">Divulgar Horário Vago</option>
                      <option value="legenda">Criar Legenda Simples</option>
                      <option value="produto_parado">Girar Produto Parado</option>
                      <option value="aumentar_ticket">Aumentar Ticket (Upsell)</option>
                      <option value="prova_social">Campanha de Prova Social</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 group-focus-within:text-brand-yellow transition-colors">Gatilho de Urgência</label>
                    <input
                      value={formData.urgencyOffer}
                      onChange={e => setFormData({ ...formData, urgencyOffer: e.target.value })}
                      className="w-full bg-transparent border-b border-white/5 py-4 text-base font-bold text-white focus:border-brand-yellow outline-none transition-all placeholder:text-zinc-900"
                      placeholder="Ex: Apenas hoje / 5 vagas"
                    />
                  </div>
                </div>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-[1px] bg-white/5">
              <div className="bg-black p-10 lg:p-6 md:p-12 space-y-10">
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5 text-brand-yellow" />
                  <h2 className="text-editorial-label text-white uppercase tracking-widest leading-none">Perfil do Cliente</h2>
                </div>
                <div className="space-y-10">
                  <div className="group">
                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 group-focus-within:text-brand-yellow transition-colors">Para quem vamos falar?</label>
                    <input
                      value={formData.targetAudience}
                      onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                      className="w-full bg-transparent border-b border-white/5 py-4 text-base font-bold text-white focus:border-brand-yellow outline-none transition-all placeholder:text-zinc-900"
                      placeholder="Ex: Clientes antigos, Moradores do bairro..."
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 group-focus-within:text-brand-yellow transition-colors">Qual a maior dúvida/objeção do cliente?</label>
                    <input
                      value={formData.mainObjection}
                      onChange={e => setFormData({ ...formData, mainObjection: e.target.value })}
                      className="w-full bg-transparent border-b border-white/5 py-4 text-base font-bold text-white focus:border-brand-yellow outline-none transition-all placeholder:text-zinc-900"
                      placeholder="Ex: Preço alto, Distância..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-black p-10 lg:p-6 md:p-12 space-y-10">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-brand-yellow" />
                  <h2 className="text-editorial-label text-white uppercase tracking-widest leading-none">Estilo de Voz</h2>
                </div>
                <div className="space-y-10">
                  <div className="group">
                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 group-focus-within:text-brand-yellow transition-colors">Tom de voz da marca</label>
                    <select
                      value={formData.tone}
                      onChange={e => setFormData({ ...formData, tone: e.target.value })}
                      className="w-full bg-transparent border-b border-white/5 py-4 text-lg font-black text-white focus:border-brand-yellow outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="direto">Direto e Objetivo</option>
                      <option value="premium">Premium / Elegante</option>
                      <option value="popular">Popular / Amigável</option>
                      <option value="emocional">Persuasivo / Emocional</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 group-focus-within:text-brand-yellow transition-colors">Onde você vai postar?</label>
                    <select
                      value={formData.channels}
                      onChange={e => setFormData({ ...formData, channels: e.target.value })}
                      className="w-full bg-transparent border-b border-white/5 py-4 text-lg font-black text-white focus:border-brand-yellow outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="instagram_feed">Instagram (Feed/Stories)</option>
                      <option value="whatsapp_msg">WhatsApp (Status/Mensagem)</option>
                      <option value="ambos">Instagram + WhatsApp</option>
                    </select>
                  </div>
                </div>
              </div>
           </div>

           <div className="p-[1px] bg-white/5">
              <button
                onClick={generateCampaign}
                disabled={loading}
                className="w-full h-24 bg-brand-yellow text-black font-black uppercase tracking-[0.3em] text-lg hover:bg-white transition-all active:scale-[0.99] flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-wait relative group"
              >
                {loading ? (
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                    CONSTRUINDO ESTRATÉGIA...
                  </div>
                ) : (
                  <>
                    GERAR CAMPANHA AGORA
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                  </>
                )}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
