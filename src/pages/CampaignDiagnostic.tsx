import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { 
  Copy, 
  AlertCircle, 
  TrendingUp, 
  Smartphone, 
  Instagram, 
  MessageCircle, 
  RefreshCw, 
  LayoutDashboard,
  Palette,
  Layout,
  History,
  Sparkles,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { campaignEngine } from '../services/campaignEngine';

export function CampaignDiagnostic() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { campaigns, saveCampaign, user, incrementUsage, canGenerateCampaign } = useStorage();
  
  const campaign = campaigns.find(c => c.id === state?.campaignId);
  const [improving, setImproving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
         <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-10 h-10 text-zinc-700" />
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Campanha não encontrada</h2>
            <button 
              onClick={() => navigate('/campanhas')} 
              className="bg-white text-black px-6 md:px-12 py-4 font-black uppercase tracking-widest text-xs hover:bg-brand-yellow transition-all"
            >
              VOLTAR AO PAINEL
            </button>
         </div>
      </div>
    );
  }

  const strategy = campaign.strategy || {};
  const outputs = campaign.outputs || {};
  const quality = campaign.quality || { finalScore: 0 };
  const score = quality?.finalScore || 0;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleImprove = async () => {
    if (!canGenerateCampaign()) {
      alert("Limite de IAs atingido. Faça upgrade.");
      return;
    }
    setImproving(true);
    try {
      const dna = user?.businessDNA;
      const context = campaignEngine.buildCampaignContext(campaign.input, dna || null, null);
      const improved = await campaignEngine.improveCampaign(campaign, context, user);
      await incrementUsage('campaign_improvement');

      const newCampaign = { ...campaign, outputs: improved.result || improved.campaign, quality: improved.quality, strategy: improved.strategy };
      saveCampaign(newCampaign);
    } catch (error) {
      alert("Erro ao melhorar campanha.");
    } finally {
      setImproving(false);
    }
  };

  const toZapRapido = () => {
    navigate('/zap-rapido', { state: { message: `${outputs.whatsappDirectMessage}\n\n${outputs.whatsappStatus}` } });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-48 animate-fade-in px-4 md:px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-12 pt-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-editorial-label text-brand-yellow">Estratégia Pronta</span>
              <h1 className="text-editorial-h2 text-white italic tracking-tighter uppercase font-black leading-[0.8] mb-4">
                RESULTADO <br /> <span className="text-brand-yellow">DA CAMPANHA</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/10" />
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic leading-none">
                CAMPANHA PARA {campaign.input.productOrService?.toUpperCase() || 'ALTO IMPACTO'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-zinc-950/50 border border-white/5 p-10 flex flex-col gap-6 min-w-[280px] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
                  <TrendingUp className="w-16 h-16 text-brand-yellow" />
               </div>
               <span className="text-editorial-label text-zinc-500 uppercase tracking-widest leading-none">Potencial de Venda</span>
               <div className={cn(
                 "text-4xl md:text-6xl font-black italic tracking-tighter transition-colors leading-none",
                 score >= 80 ? 'text-green-500' : score >= 60 ? 'text-brand-yellow' : 'text-red-500'
               )}>
                 {score}%
               </div>
               <div className="w-full h-1.5 bg-zinc-900 overflow-hidden relative">
                 <div 
                   className={cn("h-full transition-all duration-[1500ms] relative", score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-brand-yellow' : 'bg-red-500')} 
                   style={{ width: `${score}%` }} 
                 />
               </div>
            </div>
            <button 
              onClick={() => navigate('/campanhas')} 
              className="h-[156px] w-24 bg-zinc-950 border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-brand-yellow hover:text-black transition-all group"
            >
              <LayoutDashboard className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-[8px] font-black tracking-widest uppercase">Dashboard</span>
            </button>
          </div>
        </header>

        {/* Low Quality Alert */}
        {score < 75 && (
          <div className="bg-brand-yellow border-4 border-black p-8 md:p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform hidden md:block">
                <AlertCircle className="w-40 h-40 text-black" />
              </div>
             <div className="flex items-center gap-8 w-full md:w-auto relative z-10">
                <div className="w-16 h-16 bg-black flex items-center justify-center shrink-0 shadow-2xl">
                   <Zap className="text-brand-yellow w-8 h-8 group-hover:scale-110 transition-transform" />
                </div>
                <div className="space-y-4 text-center md:text-left">
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black leading-none">ESTA CAMPANHA PODE SER MELHOR</h3>
                   <p className="text-sm font-bold text-black/70 uppercase tracking-widest max-w-xl">
                      Nossa inteligência identificou que pequenos ajustes podem dobrar o impacto de venda desta campanha.
                   </p>
                </div>
             </div>
             <button 
               onClick={handleImprove}
               disabled={improving}
               className="h-16 px-16 bg-black text-white font-black uppercase tracking-widest text-xs italic hover:bg-zinc-900 transition-all min-w-full md:min-w-0 flex items-center justify-center gap-4"
             >
               {improving ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   CALIBRANDO...
                 </>
               ) : (
                 <>
                   <RefreshCw className="w-4 h-4" />
                   REFINAR ESTRATÉGIA
                 </>
               )}
             </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-white/5 border border-white/5 pt-[1px] pl-[1px]">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-[1px] bg-white/5">
            
            {/* Headlines Section */}
            <div className="bg-black p-6 md:p-12 space-y-10 group relative">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-brand-yellow rounded-full" />
                   <h3 className="text-editorial-label text-zinc-500 uppercase tracking-[0.2em]">Headline Recomendada</h3>
                 </div>
                 {copiedId === 'headline' && (
                   <div className="flex items-center gap-2 text-brand-yellow animate-reveal px-3 py-1 bg-brand-yellow/10">
                     <CheckCircle2 className="w-3 h-3" />
                     <span className="text-[10px] font-black uppercase">COPIADO</span>
                   </div>
                 )}
               </div>
               <div className="relative">
                  <p className="text-3xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-[0.85] border-l-8 border-brand-yellow pl-12 py-6">
                    {outputs.headline}
                  </p>
                  <button 
                    onClick={() => handleCopy(outputs.headline, 'headline')} 
                    className="absolute -top-4 -right-4 p-4 text-zinc-800 hover:text-brand-yellow transition-colors group/copy"
                  >
                     <Copy className="w-8 h-8 transition-transform group-hover:scale-110" />
                  </button>
               </div>
            </div>

            {/* Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/5">
              <div className="bg-black p-6 md:p-12 space-y-10 hover:bg-zinc-950/50 transition-colors">
                 <div className="flex items-center gap-3">
                   <TrendingUp className="w-4 h-4 text-brand-yellow" />
                   <h3 className="text-editorial-label text-zinc-500 uppercase tracking-widest">Matador de Objeções</h3>
                 </div>
                 <div className="space-y-4">
                    <p className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">O QUE DIZER AO CLIENTE</p>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                      {strategy.objectionBreak || 'Focar no benefício principal e urgência imediata.'}
                    </p>
                 </div>
              </div>

              <div className="bg-black p-6 md:p-12 space-y-10 hover:bg-zinc-950/50 transition-colors">
                 <div className="flex items-center gap-3">
                   <Sparkles className="w-4 h-4 text-brand-yellow" />
                   <h3 className="text-editorial-label text-zinc-500 uppercase tracking-widest">Lógica do Gatilho</h3>
                 </div>
                 <div className="space-y-4">
                    <p className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">POR QUE POSTAR AGORA?</p>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                      {strategy.reasonWhyNow || 'Aproveitar o momento de busca por esse tipo de solução.'}
                    </p>
                 </div>
              </div>
            </div>

            {/* Captions Section */}
            <div className="bg-black p-6 md:p-12 space-y-16">
               <div className="group space-y-10 pb-12 border-b border-white/5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-yellow/10 flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-brand-yellow" />
                      </div>
                      <h3 className="text-editorial-label text-zinc-500 uppercase tracking-widest">Legenda Curta (Instagram)</h3>
                    </div>
                    <button 
                      onClick={() => handleCopy(outputs.shortCaption, 'short')} 
                      className={cn(
                        "transition-all flex items-center gap-3 text-[10px] font-black uppercase px-4 py-2 border border-white/5",
                        copiedId === 'short' ? "bg-brand-yellow text-black border-brand-yellow" : "text-zinc-600 hover:text-brand-yellow hover:border-brand-yellow/30"
                      )}
                    >
                       {copiedId === 'short' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                       {copiedId === 'short' ? 'COPIADO' : 'COPIAR TEXTO'}
                    </button>
                  </div>
                  <p className="text-xl font-bold text-white leading-relaxed whitespace-pre-wrap pl-10 border-l border-zinc-900 italic">
                    {outputs.shortCaption || outputs.headline}
                  </p>
               </div>

               <div className="group space-y-10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-yellow/10 flex items-center justify-center">
                        <Layout className="w-5 h-5 text-brand-yellow" />
                      </div>
                      <h3 className="text-editorial-label text-zinc-500 uppercase tracking-widest">Legenda Completa (Venda Direta)</h3>
                    </div>
                    <button 
                      onClick={() => handleCopy(outputs.longCaption, 'long')} 
                      className={cn(
                        "transition-all flex items-center gap-3 text-[10px] font-black uppercase px-4 py-2 border border-white/5",
                        copiedId === 'long' ? "bg-brand-yellow text-black border-brand-yellow" : "text-zinc-600 hover:text-brand-yellow hover:border-brand-yellow/30"
                      )}
                    >
                       {copiedId === 'long' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                       {copiedId === 'long' ? 'COPIADO' : 'COPIAR TEXTO'}
                    </button>
                  </div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-[0.15em] leading-loose whitespace-pre-wrap pl-10 border-l border-zinc-900">
                    {outputs.longCaption || outputs.description}
                  </p>
               </div>
            </div>
          </div>

          {/* Sidebar / Messenger Column */}
          <div className="lg:col-span-4 bg-white/5 space-y-[1px]">
            <div className="bg-black p-10 space-y-10 group relative flex flex-col justify-between h-full lg:h-auto min-h-[400px] text-center md:text-left">
               <div className="space-y-8">
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <MessageCircle className="w-5 h-5 text-green-500" />
                     <h3 className="text-editorial-label text-zinc-500 uppercase tracking-widest">Mensagem Direta (WhatsApp)</h3>
                   </div>
                   <button onClick={() => handleCopy(outputs.whatsappDirectMessage, 'zap1')} className="text-zinc-800 hover:text-green-500 transition-colors">
                      <Copy className={cn("w-5 h-5", copiedId === 'zap1' && "text-green-500")} />
                   </button>
                 </div>
                 <div className="bg-zinc-950 p-8 border-l-4 border-green-500/30 font-bold text-sm text-zinc-300 leading-relaxed italic">
                   {outputs.whatsappDirectMessage}
                 </div>
               </div>
               <button 
                onClick={toZapRapido}
                className="w-full h-16 bg-green-600/10 text-green-500 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-4 group/zap"
               >
                 ENVIAR VIA ZAP RÁPIDO <ArrowRight className="w-5 h-5 group-hover/zap:translate-x-2 transition-transform" strokeWidth={3} />
               </button>
            </div>

            <div className="bg-black p-10 space-y-10 group relative min-h-[350px]">
               <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <Smartphone className="w-5 h-5 text-green-500" />
                   <h3 className="text-editorial-label text-zinc-500 uppercase tracking-widest">Stories / Status</h3>
                 </div>
                 <button onClick={() => handleCopy(outputs.whatsappStatus, 'status')} className="text-zinc-800 hover:text-green-500 transition-colors">
                    <Copy className={cn("w-5 h-5", copiedId === 'status' && "text-green-500")} />
                 </button>
               </div>
               <div className="bg-zinc-950 p-8 border-l-4 border-green-500/30 font-bold text-sm text-zinc-300 leading-relaxed italic">
                 {outputs.whatsappBroadcastMessage || outputs.whatsappStatus}
               </div>
            </div>

            <div className="bg-brand-yellow/5 p-10 space-y-10 group relative border border-brand-yellow/10">
               <div className="flex items-center gap-3">
                 <RefreshCw className="w-5 h-5 text-brand-yellow animate-spin-slow" />
                 <h3 className="text-editorial-label text-brand-yellow font-black uppercase tracking-widest">Protocolo de Recuperação</h3>
               </div>
               <p className="text-[10px] font-black text-brand-yellow/60 uppercase tracking-[0.2em] leading-relaxed italic">
                  USE ESTA MENSAGEM PARA CLIENTES QUE VISUALIZARAM E NÃO RESPONDERAM APÓS 4 HORAS.
               </p>
               <div className="bg-black/80 p-8 border-l-4 border-brand-yellow font-bold text-sm text-brand-yellow/90 leading-relaxed italic">
                 {outputs.recoveryMessage || 'Oi sumido! Temos uma novidade exclusiva para você...'}
               </div>
               <button 
                 onClick={() => handleCopy(outputs.recoveryMessage || 'Oi sumido!', 'recovery')}
                 className={cn(
                   "w-full h-14 border font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3",
                   copiedId === 'recovery' ? "bg-brand-yellow text-black border-brand-yellow" : "border-brand-yellow/20 text-brand-yellow hover:bg-brand-yellow hover:text-black"
                 )}
               >
                 {copiedId === 'recovery' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 {copiedId === 'recovery' ? 'COPIADO' : 'COPIAR RECUPERAÇÃO'}
               </button>
            </div>
          </div>
        </div>

        {/* Neural Adjuster Bar */}
        <div className="bg-zinc-950 border border-white/10 p-6 md:p-12 flex flex-col md:flex-row items-center gap-6 md:p-12 sticky bottom-8 z-30 shadow-[0_-50px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
           <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse" />
                 <h3 className="text-[11px] font-black uppercase text-white tracking-[0.4em]">Ajustador Neural de Campanha</h3>
              </div>
              <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.3em] italic leading-none truncate">
                Redefina o tom, foco ou alvo da campanha em tempo real.
              </p>
           </div>
           <div className="flex-[2] w-full relative">
              <input 
                type="text" 
                id="adjustInput"
                placeholder="REDEFINA O TOM OU FOCO DA CAMPANHA..." 
                className="w-full bg-black border-b border-white/10 px-0 py-5 text-lg font-black uppercase italic outline-none focus:border-brand-yellow placeholder:text-zinc-900 transition-all"
              />
           </div>
           <button 
             onClick={async () => {
               const inputEl = document.getElementById('adjustInput') as HTMLInputElement;
               if (!inputEl || !inputEl.value) return;
               setImproving(true);
               try {
                 const { aiCore } = await import('../services/aiCore');
                 const res = await (aiCore as any).run('adjustment', {
                   module: 'divulgacao',
                   originalResult: campaign.outputs,
                   adjustmentInstruction: inputEl.value,
                   businessDNA: user?.businessDNA
                 });
                 if (res.data) {
                   const newCampaign = { ...campaign, outputs: res.data.result, quality: res.data.quality };
                   saveCampaign(newCampaign);
                   alert("Ajuste neural aplicado com sucesso!");
                 }
               } catch(e) {
                 alert("Falha no ajuste neural.");
               } finally {
                 setImproving(false);
               }
             }}
             disabled={improving}
             className="h-16 px-16 bg-white text-black font-black uppercase tracking-widest text-xs italic hover:bg-brand-yellow transition-all min-w-full md:min-w-[240px] flex items-center justify-center gap-4"
           >
             {improving ? (
               <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
             ) : (
               <RefreshCw className="w-4 h-4" />
             )}
             APLICAR AJUSTE
           </button>
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

function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 L13 2 Z"/>
    </svg>
  );
}
