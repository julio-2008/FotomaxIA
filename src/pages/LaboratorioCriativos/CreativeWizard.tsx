import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { creativeEngine } from '../../lib/creative/creativeEngine';
import { Loader2, ArrowLeft, Image as ImageIcon, Camera, Wand2, FileText, Upload, Sparkles, Target, Zap, Rocket, CheckCircle2, ArrowRight, Flame } from 'lucide-react';
import { CreativeProject } from '../../types';
import { cn } from '../../lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'motion/react';

export function CreativeWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialMode = (query.get('mode') as any) || 'briefing';
  const initialFormat = query.get('format') || 'feed_1x1';
  
  const { user, saveCreative, incrementUsage, businessDNA, offers, campaigns } = useStorage() as any;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  
  const isImageAPIEnabled = import.meta.env.VITE_IMAGE_API_ENABLED === 'true';

  const [input, setInput] = useState({
    creativeGoal: 'vender_hoje',
    productOrService: '',
    priceOrCondition: '',
    selectedOfferId: '',
    selectedCampaignId: '',
    channel: 'instagram_feed',
    format: initialFormat,
    style: 'premium',
    preserveProduct: true,
    restrictions: '',
    uploadedImage: null as string | null
  });

  const [mode, setMode] = useState<CreativeProject["mode"]>(initialMode);

  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setProgress((step / 4) * 100);
  }, [step]);

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handleBack = () => {
    if (step === 1) navigate('/criativos');
    else setStep(s => s - 1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Imagem deve ter no máximo 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setInput({ ...input, uploadedImage: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generate = async () => {
    setLoading(true);
    try {
      const selectedOffer = offers?.find((o: any) => o.id === input.selectedOfferId);
      const selectedCampaign = campaigns?.find((c: any) => c.id === input.selectedCampaignId);

      let actionType: any = "creative_brief";
      if (mode === 'prompt') actionType = "image_prompt";
      if (mode === 'photo_improvement') actionType = "visual_diagnosis";
      if (mode === 'image_generation') actionType = "image_generation";

      const payloadObj = {
        goal: input.creativeGoal,
        product: input.productOrService,
        price: input.priceOrCondition,
        channel: input.channel,
        format: input.format,
        style: input.style,
        preserveProduct: input.preserveProduct,
        restrictions: input.restrictions,
        photoIncluded: !!input.uploadedImage
      };

      if (actionType === 'image_generation' && !isImageAPIEnabled) {
         alert("O módulo de Geração de Imagem com IA está temporariamente inativo neste plano ou ambiente. Entre em contato com o suporte para habilitar.");
         setLoading(false);
         return;
      }

      let result: any;
      if (['creative_brief', 'image_prompt', 'visual_diagnosis'].includes(actionType)) {
        result = await creativeEngine.runCreativeGeneration(
          actionType, 
          payloadObj, 
          user, 
          businessDNA, 
          selectedOffer, 
          selectedCampaign
        );
      } else if (actionType === 'image_generation') {
        const payloadWithContext = {
           ...payloadObj,
           businessContext: businessDNA,
           offerContext: selectedOffer
        };
        result = await creativeEngine.generateImageReal(payloadWithContext, user);
      }

      if (result && result.success !== false) {
        const aiOutput = result.result || result;
        const newCreative: CreativeProject = {
          id: 'cp_' + uuidv4(),
          userId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mode,
          source: (selectedOffer ? 'offer' : selectedCampaign ? 'campaign' : input.uploadedImage ? 'photo' : 'manual'),
          businessDNAId: businessDNA?.id,
          businessDNASnapshot: businessDNA,
          offerId: selectedOffer?.id,
          offerSnapshot: selectedOffer,
          campaignId: selectedCampaign?.id,
          campaignSnapshot: selectedCampaign,
          input: {
            creativeGoal: input.creativeGoal,
            productOrService: input.productOrService,
            channel: input.channel,
            format: input.format,
            style: input.style,
            preserveProduct: input.preserveProduct,
            restrictions: input.restrictions,
            productPhoto: input.uploadedImage || undefined
          },
          strategy: result.strategy || {},
          output: {
            creativeBrief: actionType === 'creative_brief' || actionType === 'visual_diagnosis' ? aiOutput.creativeBrief || aiOutput.diagnosis : undefined,
            imagePrompt: aiOutput.imagePrompt,
            editingPrompt: aiOutput.editingPrompt,
            textOnCreative: aiOutput.textOnCreative,
            layoutInstructions: aiOutput.layoutInstructions || aiOutput.canvaInstructions,
            visualChecklist: aiOutput.visualChecklist,
            generatedImageUrl: actionType === 'image_generation' ? aiOutput.url : undefined
          },
          quality: result.quality || { finalScore: 90, warnings: [] },
          aiMode: 'real_ai'
        };

        saveCreative(newCreative);
        incrementUsage(actionType);
        navigate(`/criativos/historico`, { state: { id: newCreative.id } }); 
      }
    } catch (e) {
      console.error(e);
      alert("Houve um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand-yellow font-black text-[10px] uppercase tracking-[0.3em]">Module 01 / Visual Goal</span>
              <h3 className="text-EDITORIAL-H3 text-white italic">QUAL O <span className="text-brand-yellow">OBJETIVO?</span></h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              {[
                { val: 'vender_hoje', label: 'CONVERSÃO DIRETA', icon: Zap, desc: 'Foco em vendas rápidas' },
                { val: 'aumentar_clique', label: 'CTR MAXIMIZER', icon: Target, desc: 'Atrair o clique a qualquer custo' },
                { val: 'premium', label: 'PREMIUM GLOSS', icon: Sparkles, desc: 'Elevar valor percebido' },
                { val: 'apetitoso', label: 'VISUAL APPETITE', icon: Flame, desc: 'Desejo imediato pelo produto' },
                { val: 'prova_social', label: 'SOCIAL PROOF', icon: CheckCircle2, desc: 'Mostrar aceitação do mercado' },
                { val: 'inovacao', label: 'FUTURISTIC VIBE', icon: Rocket, desc: 'Diferenciação tecnológica' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => { setInput({...input, creativeGoal: opt.val}); handleNext(); }}
                  className={cn(
                    "group text-left p-6 md:p-12 bg-black transition-all relative overflow-hidden h-full flex flex-col justify-between border border-white/5",
                    input.creativeGoal === opt.val ? "bg-brand-yellow text-black" : "hover:bg-white/[0.02]"
                  )}
                >
                  <div className="space-y-8">
                    <opt.icon className={cn("w-8 h-8", input.creativeGoal === opt.val ? "text-black" : "text-brand-yellow")} />
                    <div className="space-y-3">
                       <p className="font-black text-sm uppercase tracking-[0.2em] italic">{opt.label}</p>
                       <p className={cn("text-[9px] uppercase font-black tracking-widest leading-relaxed italic", input.creativeGoal === opt.val ? "text-black/60" : "text-zinc-600")}>{opt.desc}</p>
                    </div>
                  </div>
                  {input.creativeGoal === opt.val && <div className="absolute top-6 right-6">
                     <CheckCircle2 className="w-5 h-5 text-black" strokeWidth={3} />
                  </div>}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-12">
             <div className="space-y-4">
              <span className="text-brand-yellow font-black text-[10px] uppercase tracking-[0.3em]">Module 02 / Analysis Context</span>
              <h3 className="text-EDITORIAL-H3 text-white italic">O QUE <span className="text-brand-yellow">ANALISAR?</span></h3>
            </div>
            
            <div className="space-y-px bg-white/5 border border-white/5">
               <div className="bg-black p-6 md:p-12 space-y-6">
                  <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic">PRODUCT FIELD NEXUS</label>
                  <input 
                    type="text" 
                    value={input.productOrService} 
                    onChange={e => setInput({...input, productOrService: e.target.value})} 
                    placeholder="DIGITE IDENTIFICADOR AQUI..." 
                    className="w-full bg-black border-b border-white/5 p-4 text-white font-black h-20 outline-none focus:border-brand-yellow transition-all uppercase italic text-xl tracking-tighter" 
                  />
               </div>

               <div className="bg-black p-6 md:p-12 space-y-6">
                  <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic">VALUE PROPOSITION SYNC</label>
                  <input 
                    type="text" 
                    value={input.priceOrCondition} 
                    onChange={e => setInput({...input, priceOrCondition: e.target.value})} 
                    placeholder="EX: R$ 99,90 OU 20% OFF SYNC" 
                    className="w-full bg-black border-b border-white/5 p-4 text-white font-black h-20 outline-none focus:border-brand-yellow transition-all uppercase italic text-xl tracking-tighter" 
                  />
               </div>

               {offers && offers.length > 0 && (
                <div className="bg-black p-6 md:p-12 space-y-6">
                  <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] italic">OFFER STAGING INJECTION</label>
                  <select 
                    value={input.selectedOfferId} 
                    onChange={e => setInput({...input, selectedOfferId: e.target.value})}
                    className="w-full bg-black border-b border-white/5 p-4 text-white font-black h-20 outline-none focus:border-brand-yellow transition-all uppercase italic text-xl tracking-tighter appearance-none cursor-pointer"
                  >
                    <option value="">-- [NULL SELECTION] --</option>
                    {offers.map((o: any) => <option key={o.id} value={o.id}>{o.outputs?.offerName || o.input?.productOrService}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-px bg-white/5 border border-white/5">
               <button onClick={handleBack} className="p-8 bg-black hover:bg-zinc-950 transition-all text-zinc-700 hover:text-white border-r border-white/5 w-24 flex items-center justify-center">
                  <ArrowLeft className="w-6 h-6" />
               </button>
               <button 
                  onClick={handleNext}
                  disabled={!input.productOrService}
                  className="flex-1 brand-button bg-brand-yellow text-black h-24 disabled:opacity-20 disabled:grayscale font-black text-lg italic tracking-tighter"
               >
                  RESUME ANALYSIS PROCESS
               </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand-yellow font-black text-[10px] uppercase tracking-[0.3em]">Module 03 / Visual Staging</span>
              <h3 className="text-EDITORIAL-H3 text-white italic">FOTO DO <span className="text-brand-yellow">PRODUTO?</span></h3>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-6 md:p-12 text-center border-dashed relative min-h-[300px] flex items-center justify-center group overflow-hidden">
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={handleImageUpload} 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
               />
               
               <AnimatePresence mode="wait">
                 {input.uploadedImage ? (
                   <motion.div 
                     key="preview"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="space-y-6 relative z-10"
                   >
                     <img src={input.uploadedImage} alt="Preview" className="mx-auto max-h-64 object-contain shadow-2xl border border-white/10" />
                     <p className="text-brand-yellow font-black text-[10px] uppercase tracking-widest">ASSET LOADED SUCCESSFULLY</p>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="placeholder"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="space-y-4 pointer-events-none relative z-10"
                   >
                     <div className="w-16 h-16 bg-zinc-900 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-zinc-700" />
                     </div>
                     <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">DROP OR CLICK TO UPLOAD</p>
                     <p className="text-zinc-800 text-[8px] uppercase tracking-widest">MAX SIZE 10MB / JPG PNG WEBP</p>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Design background element */}
               <div className="absolute inset-0 bg-brand-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div 
              onClick={() => setInput({...input, preserveProduct: !input.preserveProduct})}
              className={cn(
                "p-10 border transition-all cursor-pointer flex gap-8 items-center",
                input.preserveProduct ? "bg-brand-yellow text-black border-brand-yellow" : "bg-black border-zinc-900 text-zinc-500"
              )}
            >
               <div className={cn(
                 "w-6 h-6 border flex items-center justify-center shrink-0",
                 input.preserveProduct ? "border-black" : "border-zinc-800"
               )}>
                  {input.preserveProduct && <div className="w-2.5 h-2.5 bg-black" />}
               </div>
               <div className="space-y-2">
                  <p className="font-black text-xs uppercase tracking-widest leading-none">PRESERVAR PRODUTO RIGOROSO</p>
                  <p className={cn("text-[9px] uppercase font-bold tracking-tight", input.preserveProduct ? "text-black/60" : "text-zinc-700")}>
                    A IA cuidará da ambientação, luz e copy visual, mas não alterará seu produto real.
                  </p>
               </div>
            </div>

            <div className="flex gap-1 bg-zinc-900 border border-zinc-900">
               <button onClick={handleBack} className="p-8 bg-black hover:bg-zinc-950 transition-all text-zinc-500">
                  <ArrowLeft className="w-5 h-5" />
               </button>
               <button onClick={handleNext} className="flex-1 brand-button bg-brand-yellow text-black h-20">
                  NEXT PHASE
               </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand-yellow font-black text-[10px] uppercase tracking-[0.3em]">Module 04 / Output Engine</span>
              <h3 className="text-EDITORIAL-H3 text-white italic">O QUE <span className="text-brand-yellow">ENTREGAR?</span></h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-zinc-900 border border-zinc-900">
               {[
                 { val: 'feed_1x1', label: 'FEED SQUARE', icon: FileText },
                 { val: 'story_9x16', label: 'STORY VERTICAL', icon: ImageIcon },
                 { val: 'banner', label: 'HORIZONTAL BANNER', icon: Camera },
                 { val: 'todos', label: 'FULL ECOSYSTEM', icon: Wand2 }
               ].map(opt => (
                 <button
                   key={opt.val}
                   onClick={() => setInput({...input, format: opt.val})}
                   className={cn(
                     "p-10 text-left transition-all h-full flex flex-col justify-between gap-8",
                     input.format === opt.val ? "bg-brand-yellow text-black" : "bg-black text-white hover:bg-zinc-950"
                   )}
                 >
                   <opt.icon className="w-5 h-5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                 </button>
               ))}
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-10 space-y-6">
               <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">VISUAL TONE</label>
               <div className="flex flex-wrap gap-4">
                  {['PREMIUM', 'POPULAR', 'FOOD_FOCUSED', 'MINIMAL'].map(style => (
                    <button 
                      key={style}
                      onClick={() => setInput({...input, style: style.toLowerCase()})}
                      className={cn(
                        "px-6 py-2 border font-black text-[10px] uppercase tracking-widest transition-all",
                        input.style === style.toLowerCase() ? "bg-brand-yellow text-black border-brand-yellow" : "border-zinc-800 text-zinc-600 hover:border-zinc-500"
                      )}
                    >
                      {style}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex gap-1 bg-zinc-900 border border-zinc-900">
               <button onClick={handleBack} className="p-8 bg-black hover:bg-zinc-950 transition-all text-zinc-500">
                  <ArrowLeft className="w-5 h-5" />
               </button>
               <button 
                  onClick={generate}
                  disabled={loading}
                  className="flex-1 brand-button bg-brand-yellow text-black h-20 disabled:opacity-50"
               >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
                    <div className="flex items-center gap-3">
                      ENGAGE NEURAL ENGINE <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
               </button>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col pt-12 px-6 md:px-0">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col pb-32">
        
        {/* Progress System */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-[100]">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${progress}%` }}
             className="h-full bg-brand-yellow shadow-[0_0_15px_rgba(250,204,21,0.5)]"
           />
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Sidebar Decoration */}
        <div className="fixed right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 md:p-12 items-end opacity-20 hover:opacity-100 transition-opacity">
           <div className="space-y-2 text-right">
              <span className="text-[8px] font-black uppercase text-brand-yellow tracking-[0.4em]">CREATIVE STAGE</span>
              <p className="text-EDITORIAL-H2 text-white italic leading-none">{step < 10 ? `0${step}` : step}</p>
           </div>
           <div className="w-px h-64 bg-zinc-900 relative">
              <motion.div 
                animate={{ top: `${(step/4)*100}%` }}
                className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-yellow rounded-full" 
              />
           </div>
           <div className="text-right">
              <p className="text-[8px] font-black uppercase text-zinc-700 tracking-[0.2em] max-w-[120px]">
                {loading ? "PROCESSING NEURAL DATA..." : "AWAITING INPUT SIGNAL"}
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
