import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { Copy, Image as ImageIcon, X, AlertCircle, ArrowLeft, Download } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CreativeHistory() {
  const { creatives } = useStorage() as any;
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCreativeId, setSelectedCreativeId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setSelectedCreativeId(location.state.id);
    } else if (creatives && creatives.length > 0) {
      setSelectedCreativeId(creatives[0].id);
    }
  }, [location.state, creatives]);

  const creative = creatives?.find((c: any) => c.id === selectedCreativeId) || creatives?.[0];

  if (!creatives || creatives.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 md:p-6 md:p-12 animate-fade-in pt-12">
        <button onClick={() => navigate('/criativos')} className="text-zinc-600 hover:text-brand-yellow flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] italic mb-12 transition-all">
          <ArrowLeft className="w-5 h-5" /> REBOOT DASHBOARD
        </button>
        <div className="bg-black border border-white/5 p-24 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-yellow/[0.02] blur-3xl pointer-events-none" />
          <div className="w-24 h-24 bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-8 relative z-10">
             <AlertCircle className="w-10 h-10 text-zinc-800" />
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-editorial-h3 text-white italic uppercase tracking-tighter">NULL DATA DETECTED</h3>
            <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] italic">Você ainda não gerou nenhuma direção criativa ou imagem.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-8 pb-32 animate-fade-in pt-16 flex flex-col lg:flex-row gap-1">
      {/* Sidebar List */}
      <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
        <button onClick={() => navigate('/criativos')} className="text-zinc-600 hover:text-brand-yellow flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] italic mb-8 transition-all">
          <ArrowLeft className="w-5 h-5" /> SYSTEM RETURN
        </button>
        
        <div className="space-y-px bg-white/5 border border-white/5">
          {creatives.map((c: any) => (
             <button
               key={c.id}
               onClick={() => setSelectedCreativeId(c.id)}
               className={cn(
                 "w-full text-left p-10 transition-all relative overflow-hidden group",
                 selectedCreativeId === c.id ? 'bg-brand-yellow text-black' : 'bg-black text-white hover:bg-white/[0.02]'
               )}
             >
               <div className="flex items-center justify-between mb-4">
                 <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] italic px-3 py-1 border", 
                    selectedCreativeId === c.id ? "bg-black text-white border-black" : "bg-white/5 text-brand-yellow border-white/5")}>
                   {c.mode || 'GEN CORE'}
                 </span>
                 <span className={cn("text-[8px] font-black uppercase tracking-widest", selectedCreativeId === c.id ? "text-black/50" : "text-zinc-700")}>
                   {new Date(c.createdAt).toLocaleDateString()}
                 </span>
               </div>
               <h4 className="font-black text-lg text-current uppercase italic tracking-tighter leading-none mb-2 truncate">{c.input?.productOrService || 'NULL TITLE'}</h4>
               <p className={cn("text-[9px] uppercase font-black tracking-widest italic truncate", selectedCreativeId === c.id ? "text-black/60" : "text-zinc-600")}>{c.input?.creativeGoal || 'STANDBY'}</p>
             </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white/5 border border-white/5">
        {creative ? (
          <div className="bg-black p-6 md:p-12 min-h-screen">
            <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 pb-12 border-b border-white/5">
               <div className="space-y-6">
                 <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-brand-yellow tracking-[0.4em] italic leading-none">OUTPUT NEXUS VISUAL</span>
                    <h2 className="text-editorial-h2 text-white italic leading-none">{creative.input?.productOrService}</h2>
                 </div>
                 <div className="flex flex-wrap gap-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-white/5 px-4 py-2 italic border border-white/5">MODE: {creative.mode}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-white/5 px-4 py-2 italic border border-white/5">DEVICE: {creative.input?.channel}</span>
                 </div>
               </div>
               {creative.quality?.warnings?.length > 0 && (
                 <div className="flex items-center gap-3 bg-red-950/20 text-red-600 px-6 py-4 border border-red-900/20 text-[10px] font-black uppercase tracking-widest italic">
                    <AlertCircle className="w-4 h-4" /> RECALIBRATION NEEDED
                 </div>
               )}
            </header>

            {/* Display Generated Image if available */}
            {creative.output?.generatedImageUrl && (
              <div className="mb-20">
                 <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 italic block mb-8">AI RENDERED ASSET</label>
                 <div className="bg-black border border-white/5 overflow-hidden relative group">
                   <img src={creative.output.generatedImageUrl} alt="Gerada" className="w-full h-auto object-contain max-h-[700px]" />
                   <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                      <a href={creative.output.generatedImageUrl} download target="_blank" rel="noreferrer" className="brand-button h-20 px-16 text-lg italic tracking-tighter">
                         <Download className="w-6 h-6 mr-3" /> EXPORT HIGH RES ASSET
                      </a>
                   </div>
                 </div>
              </div>
            )}

            <div className="grid lg:grid-cols-12 gap-6 md:p-12">
               <div className="lg:col-span-12 space-y-20">
                  {/* Strategy Context */}
                  {creative.strategy?.mainFocus && (
                    <div className="space-y-8">
                       <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 italic block">STRATEGY PROTOCOL</label>
                       <div className="bg-white/5 border-l-4 border-brand-yellow p-6 md:p-12 italic text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-tight">
                          "{creative.strategy.mainFocus}"
                       </div>
                    </div>
                  )}

                  {/* Layout / Briefing */}
                  {creative.output?.creativeBrief && (
                    <div className="space-y-8">
                       <div className="flex items-center justify-between">
                         <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 italic block">VISUAL STAGE BRIEFING</label>
                         <button onClick={() => navigator.clipboard.writeText(JSON.stringify(creative.output.creativeBrief, null, 2))} className="text-[10px] uppercase font-black italic text-brand-yellow hover:text-white flex items-center gap-2 transition-all">
                           <Copy className="w-4 h-4" /> CLONE RAW DATA
                         </button>
                       </div>
                       <div className="bg-white/[0.02] border border-white/5 p-6 md:p-12 text-sm text-zinc-400 font-black italic uppercase tracking-widest whitespace-pre-wrap leading-relaxed shadow-2xl">
                         {typeof creative.output.creativeBrief === 'string' 
                           ? creative.output.creativeBrief 
                           : JSON.stringify(creative.output.creativeBrief, null, 2)}
                       </div>
                    </div>
                  )}

                  {/* Image Prompt */}
                  {creative.output?.imagePrompt && (
                    <div className="space-y-8">
                       <div className="flex items-center justify-between">
                         <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 italic block">IMAGE GEN SEED PROMPT</label>
                         <button onClick={() => navigator.clipboard.writeText(creative.output.imagePrompt)} className="text-[10px] uppercase font-black italic text-brand-yellow hover:text-white flex items-center gap-2 transition-all">
                           <Copy className="w-4 h-4" /> CLONE PROMPT
                         </button>
                       </div>
                       <div className="bg-zinc-950 border border-white/5 p-6 md:p-12 text-sm text-zinc-500 font-mono italic leading-relaxed break-words">
                         {creative.output.imagePrompt}
                       </div>
                    </div>
                  )}

                  {/* Texts Section */}
                  {creative.output?.textOnCreative && Object.keys(creative.output.textOnCreative).length > 0 && (
                    <div className="space-y-12">
                       <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 italic block">INTEGRATED COPY LAYERS</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
                          {Object.entries(creative.output.textOnCreative).map(([key, val]) => (
                             <div key={key} className="bg-black p-6 md:p-12 space-y-4 hover:bg-white/[0.02] transition-all">
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-2 block">{key}</span>
                                <p className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight bg-white/5 p-6 border-l-2 border-brand-yellow">{String(val)}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="mt-32 pt-16 border-t border-white/5 flex justify-between items-center">
               <button 
                onClick={() => navigate('/criativos/novo')}
                className="brand-button h-20 px-16 text-lg italic tracking-tighter"
               >
                 INITIALIZE_NEW_SEQUENCE
               </button>
               <div className="text-right hidden md:block">
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-900 leading-relaxed italic">
                    FOTOMAX X NEURAL / v2.9<br />
                    SECURE STORAGE ACTIVE
                  </p>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-screen bg-black">
             <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-white/5 border border-white/5 flex items-center justify-center mx-auto animate-pulse">
                  <AlertCircle className="w-8 h-8 text-zinc-800" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800 italic">SELECT CORE FOR ANALYSIS</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
