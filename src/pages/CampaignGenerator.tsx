import React, { useState } from 'react';
import { 
  PlusCircle, 
  Target, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  Instagram, 
  Video, 
  Zap, 
  Layout, 
  Share2, 
  Copy, 
  Check, 
  AlertTriangle,
  RefreshCcw,
  Lightbulb,
  Clock,
  Fingerprint
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { commercialIntelligenceEngine, CampaignInputs } from '../services/commercialIntelligenceEngine';
import { GeneratedContent, Goal, Tone, BusinessType } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function CampaignGenerator() {
  const navigate = useNavigate();
  const { user, incrementUsage, canGenerateCampaign } = useStorage();
  const dna = user?.businessDNA;
  const settings = user?.businessProfile || {}; 
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState<CampaignInputs>({
    product: '',
    price: '',
    offer: '',
    goal: 'vender_hoje',
    tonality: 'direto',
    channel: 'Geral',
    businessName: dna?.basics?.businessName || (settings as any)?.businessName || '',
    type: (dna?.basics?.niche as any) || (settings as any)?.businessType || 'pizzaria'
  });

  const [result, setResult] = useState<GeneratedContent | null>(null);

  const isDNAIncomplete = !dna || !dna.basics || !dna.audience;

  const handleGenerate = async () => {
    if (!canGenerateCampaign()) return;
    
    setLoading(true);
    try {
      const campaign = await commercialIntelligenceEngine.generate(formData, dna as any, settings);
      setResult(campaign);
      incrementUsage('campaign_generation');
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    setLoading(true);
    try {
      const improved = await commercialIntelligenceEngine.generate(
        {
          ...formData,
          tonality: 'premium' as Tone
        },
        dna as any,
        settings
      );
      setResult(improved);
      incrementUsage('campaign_improvement');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const limitReached = !canGenerateCampaign();

  return (
    <div className="space-y-12 pb-24 animate-fade-in max-w-6xl mx-auto px-4 md:px-0">
      {/* Brand Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:p-12 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow italic">COMMERCIAL FORGE V3</span>
          <h1 className="text-3xl md:text-5xl font-display font-black text-white italic tracking-tighter leading-none">GERADOR DE <br /><span className="text-brand-yellow">CAMPANHAS</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-tight max-w-xl text-[10px] leading-relaxed italic">Engenharia de cópia de alta precisão. Gere materiais de venda validados por inteligência comercial em segundos.</p>
        </div>
        <div className="flex bg-white/5 p-1 border border-white/5">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={cn(
                "w-16 h-1 transition-all",
                step === s ? "bg-brand-yellow shadow-[0_0_10px_rgba(255,204,0,0.5)]" : step > s ? "bg-brand-yellow/30" : "bg-white/5"
              )} 
            />
          ))}
        </div>
      </header>

      {limitReached && step < 3 && (
        <div className="bg-black border-2 border-red-900 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="flex items-center gap-6">
            <AlertTriangle className="text-red-700 w-10 h-10" />
            <div className="space-y-1">
              <h3 className="text-editorial-label text-red-700">LIMIT REACHED</h3>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sua cota mensal de inteligência artificial foi atingida.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/billing')}
            className="brand-button bg-red-700 text-white"
          >
            UPGRADE_NOW
          </button>
        </div>
      )}

      {isDNAIncomplete && step < 3 && (
        <div className="bg-black border-2 border-brand-yellow/20 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="flex items-center gap-6">
            <Fingerprint className="text-brand-yellow w-10 h-10" />
            <div className="space-y-1">
              <h3 className="text-editorial-label text-brand-yellow">DNA FRAGMENTED</h3>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">DNA incompleto detectado. A precisão estratégica pode ser reduzida.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dna-comercial/onboarding')}
            className="brand-button bg-brand-yellow text-black"
          >
            FIX_STRATEGY
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5"
          >
            <div className="bg-black p-6 md:p-12 space-y-8 border-white/5">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 italic">METADATA SYNC</span>
               <div className="space-y-3">
                 <label className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em] block italic">BUSINESS NAME</label>
                 <input 
                   type="text" 
                   value={formData.businessName}
                   onChange={e => setFormData({...formData, businessName: e.target.value})}
                   className="w-full bg-black border border-white/5 px-6 py-5 text-white font-black uppercase italic tracking-tighter text-2xl placeholder:text-zinc-900 focus:border-brand-yellow outline-none transition-all"
                   placeholder="NOME DA EMPRESA"
                 />
               </div>
            </div>

            <div className="bg-black p-6 md:p-12 space-y-8">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 italic">CATEGORIZATION NEXUS</span>
               <div className="space-y-3">
                 <label className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em] block italic">INDUSTRY NICHE</label>
                 <select 
                   value={formData.type}
                   onChange={e => setFormData({...formData, type: e.target.value as BusinessType})}
                   className="w-full bg-black border border-white/5 px-6 py-6 text-white font-black uppercase italic tracking-tighter text-xl focus:border-brand-yellow outline-none transition-all appearance-none cursor-pointer"
                 >
                   <option value="pizzaria">PIZZARIA SYNC</option>
                   <option value="hamburgueria">HAMBURGUERIA SYNC</option>
                   <option value="salao">SALAO ESTETICA SYNC</option>
                   <option value="barbearia">BARBEARIA FLOW</option>
                   <option value="loja_roupa">VESTUARIO STAGED</option>
                   <option value="delivery">DELIVERY OMNICHANNEL</option>
                   <option value="outro">OTIMIZACAO CUSTOM</option>
                 </select>
               </div>
               <div className="pt-12 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={() => setStep(2)} 
                    className="brand-button bg-brand-yellow text-black px-6 md:px-12 py-5 italic tracking-tighter text-lg font-black"
                  >
                    CONTINUAR_PROCESSO <ArrowRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-px"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              <div className="bg-black p-6 md:p-12 space-y-12 border-white/5">
                <div className="space-y-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 italic">PRODUCT STAGING</span>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em] block italic">OFFER SUBJECT</label>
                    <input 
                      type="text" 
                      value={formData.product}
                      onChange={e => setFormData({...formData, product: e.target.value})}
                      className="w-full bg-black border border-white/5 px-6 py-5 text-white font-black uppercase italic tracking-tighter text-xl placeholder:text-zinc-900 focus:border-brand-yellow outline-none transition-all"
                      placeholder="EX: SERVIÇO OU PRODUTO"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em] block italic">VALUATION SYNC</label>
                    <input 
                      type="text" 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-black border border-white/5 px-6 py-5 text-white font-black uppercase italic tracking-tighter text-xl placeholder:text-zinc-900 focus:border-brand-yellow outline-none transition-all"
                      placeholder="R$ VALOR"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em] block italic">SPECIAL OFFER CONDITIONS</label>
                  <textarea 
                    value={formData.offer}
                    onChange={e => setFormData({...formData, offer: e.target.value})}
                    className="w-full bg-black border border-white/5 px-6 py-5 text-white font-bold uppercase text-[10px] placeholder:text-zinc-900 focus:border-brand-yellow outline-none transition-all h-40 resize-none italic"
                    placeholder="DETALHAMENTO DA OFERTA"
                  />
                </div>
              </div>

              <div className="bg-black p-6 md:p-12 space-y-12 flex flex-col justify-between text-center md:text-left">
                <div className="space-y-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 italic">PSYCHOLOGICAL GOAL</span>
                  <div className="grid grid-cols-2 gap-px bg-white/5">
                    {[
                      { id: 'vender_hoje', label: 'CASH FLOW', icon: Zap },
                      { id: 'lotar_agenda', label: 'APPOINTMENTS', icon: Target },
                      { id: 'divulgar_promocao', label: 'AWARENESS', icon: Sparkles },
                      { id: 'recuperar_cliente', label: 'RECLAIM', icon: RefreshCcw },
                    ].map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => setFormData({...formData, goal: goal.id as Goal})}
                        className={cn(
                          "p-10 text-center space-y-4 transition-all relative border border-white/5",
                          formData.goal === goal.id 
                            ? "bg-brand-yellow text-black" 
                            : "bg-black text-zinc-800 hover:text-white"
                        )}
                      >
                        <goal.icon className="w-8 h-8 mx-auto" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] block italic">{goal.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-12 border-t border-white/10 flex flex-col gap-8">
                   <div className="flex justify-between items-center bg-white/5 border border-white/5 px-8 py-6">
                      <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">TONALITY VOICE</span>
                      <div className="flex gap-6">
                        {['CORE', 'PREMIUM', 'DIRECT'].map((t) => (
                          <button
                            key={t}
                            onClick={() => setFormData({...formData, tonality: t.toLowerCase() as Tone})}
                            className={cn(
                              "text-[10px] font-black uppercase tracking-[0.3em] transition-colors",
                              formData.tonality === t.toLowerCase() ? "text-brand-yellow underline underline-offset-8" : "text-zinc-800"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                   </div>
                   <button 
                    onClick={handleGenerate} 
                    disabled={loading || !formData.product || limitReached}
                    className="brand-button bg-brand-yellow text-black w-full py-8 text-xl italic tracking-tighter font-black"
                  >
                    {loading ? 'SINCRO PROCESSANDO...' : 'EXECUTAR GERAÇÃO ESTRATÉGICA'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
          >
            {/* Success Header */}
            <div className="bg-brand-yellow p-6 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -mr-32 -mt-32 backdrop-blur-3xl" />
               <div className="flex items-center gap-8 relative z-10 text-black">
                  <div className="w-24 h-24 bg-black flex items-center justify-center">
                    <Check className="text-brand-yellow w-14 h-14" strokeWidth={3} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-4xl md:text-5xl font-display font-black italic leading-none">GERAÇÃO COMPLETA</h2>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/60 italic">INTELLIGENCE SCORE: {result.qualityScore}%_QUALIFIED</span>
                  </div>
               </div>
               <div className="flex gap-4 relative z-10">
                  <button onClick={() => setStep(1)} className="brand-button bg-black text-white px-6 md:px-12 py-5 italic tracking-tighter font-black h-auto">NEW_PROJECT</button>
                  <button onClick={handleImprove} className="brand-button border-4 border-black bg-transparent text-black px-6 md:px-12 py-5 italic tracking-tighter hover:bg-black hover:text-white transition-all font-black h-auto">REFINE SYNC</button>
               </div>
            </div>

            {/* Neural Insights */}
            <section className="space-y-10">
               <div className="flex items-baseline gap-6 border-b border-white/5 pb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow italic">NEURAL INFRA</span>
                  <h3 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase leading-none">STRATEGIC NEXUS ANALYSIS</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5 border border-white/5">
                  <div className="bg-black p-6 md:p-12 space-y-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-yellow italic">PSYCH ANGLE</span>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase leading-relaxed italic">{result.offerAngle}</p>
                  </div>
                  <div className="bg-black p-6 md:p-12 space-y-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-yellow italic">RATIONALE</span>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase leading-relaxed italic">{result.strategicRationale || 'Otimização de conversão por similaridade de nicho.'}</p>
                  </div>
                  <div className="bg-black p-6 md:p-12 space-y-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-yellow italic">DOMINANT TRIGGER</span>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase leading-relaxed italic">{result.conversionPsychology || 'Reciprocidade e Autoridade Técnica.'}</p>
                  </div>
                  <div className="bg-black p-6 md:p-12 space-y-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-yellow italic">OBJECTION NEUTRALIZED</span>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase leading-relaxed italic">{result.objectionBreak}</p>
                  </div>
               </div>
            </section>

            {/* Output Grid */}
            <section className="space-y-10">
               <div className="flex items-baseline gap-6 border-b border-white/5 pb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow italic">DELIVERABLES</span>
                  <h3 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase leading-none">OMNICHANNEL ASSETS</h3>
               </div>
               <div className="grid lg:grid-cols-2 gap-px bg-white/5 border border-white/5">
                  <LiquidGlassBox 
                    title="INSTAGRAM FEED SYNC" 
                    icon={Instagram} 
                    content={result.campaign.instagramCaptionLong} 
                    onCopy={() => copyToClipboard(result.campaign.instagramCaptionLong, 'instalong')}
                    isCopied={copied === 'instalong'}
                  />
                  <LiquidGlassBox 
                    title="WHATSAPP CONVERSION DIRECT" 
                    icon={MessageSquare} 
                    content={result.campaign.whatsappDirectMessage} 
                    onCopy={() => copyToClipboard(result.campaign.whatsappDirectMessage, 'wadirect')}
                    isCopied={copied === 'wadirect'}
                  />
                  <LiquidGlassBox 
                    title="STAGING VIDEO SCRIPT" 
                    icon={Video} 
                    content={result.campaign.videoScript15s} 
                    onCopy={() => copyToClipboard(result.campaign.videoScript15s, 'video')}
                    isCopied={copied === 'video'}
                  />
                  <LiquidGlassBox 
                    title="STORY SEQUENCE BLOCKS" 
                    icon={Layout} 
                    content={result.campaign.storyText} 
                    onCopy={() => copyToClipboard(result.campaign.storyText, 'story')}
                    isCopied={copied === 'story'}
                  />
               </div>
               
               {/* Extras */}
               <div className="grid lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
                  <div className="bg-black p-6 md:p-12 space-y-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 italic">TACTICAL TIMING</span>
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow italic">POSTING WINDOW</h4>
                       <div className="flex items-center gap-4 text-white font-black italic text-4xl tracking-tighter">
                          <Clock className="w-8 h-8 text-brand-yellow" /> {result.campaign.bestPostingTime}
                       </div>
                    </div>
                  </div>
                  <div className="bg-black p-6 md:p-12 space-y-8 lg:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 italic">DISCOVERY TAGS</span>
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow italic">HASHTAG SET</h4>
                       <div className="flex flex-wrap gap-3">
                          {result.campaign.hashtags?.map((h, i) => (
                            <span key={i} className="text-zinc-500 font-bold text-[10px] uppercase tracking-tighter border border-white/10 px-3 py-1 bg-white/5">#{h.replace('#', '')}</span>
                          ))}
                       </div>
                    </div>
                  </div>
                  <div className="bg-black p-6 md:p-12 space-y-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 italic">CONVERSION DRIVERS</span>
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow italic">CTA VARIATIONS</h4>
                       <div className="space-y-3">
                          {result.campaign.ctaOptions?.map((cta, i) => (
                            <div key={i} className="text-zinc-300 font-black italic text-[11px] uppercase tracking-tighter border-b border-white/5 pb-3 last:border-0">{cta}</div>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LiquidGlassBox({ title, icon: Icon, content, onCopy, isCopied }: any) {
  return (
    <div className="bg-black p-6 md:p-12 space-y-8 group transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-all">
        <Icon className="w-32 h-32 text-white" />
      </div>

      <div className="flex justify-between items-center relative z-10">
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-yellow italic">{title}</span>
        </div>
        <button 
          onClick={onCopy}
          className={cn(
            "w-12 h-12 flex items-center justify-center transition-all",
            isCopied ? "bg-white text-black" : "bg-zinc-950 text-zinc-700 hover:text-white border border-zinc-900"
          )}
        >
          {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      <div className="bg-zinc-950 p-8 border-l-2 border-zinc-900 text-sm font-bold text-zinc-400 uppercase tracking-tight whitespace-pre-wrap leading-relaxed italic group-hover:border-brand-yellow transition-all min-h-[120px]">
        {content}
      </div>
      
      <div className="pt-6 border-t border-zinc-950 flex justify-between items-center opacity-40">
         <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">INTEL VERIFIED OUTPUT</span>
         <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">STAGED</span>
         </div>
      </div>
    </div>
  );
}
