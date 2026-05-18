import React, { useMemo } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Target, 
  Zap, 
  Search, 
  AlertTriangle, 
  ChevronRight,
  Sparkles,
  BarChart3,
  Lightbulb,
  MessageCircle,
  TrendingUp,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { generateCommercialDiagnosis, calculateDNAScore } from '../services/dnaManager';
import { cn } from '../lib/utils';

export function DNADiagnostico() {
  const navigate = useNavigate();
  const { user } = useStorage();
  
  const diagnosis = useMemo(() => {
    if (!user?.businessDNA) return null;
    return generateCommercialDiagnosis(user.businessDNA);
  }, [user?.businessDNA]);

  const score = useMemo(() => {
    if (!user?.businessDNA) return null;
    return calculateDNAScore(user.businessDNA);
  }, [user?.businessDNA]);

  if (!diagnosis) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center mx-auto mb-8">
           <AlertTriangle className="text-amber-500 w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">DNA COMERCIAL NÃO ENCONTRADO</h1>
        <p className="text-zinc-500 font-medium">Você precisa criar seu DNA Comercial primeiro para gerar um diagnóstico estratégico do seu negócio.</p>
        <button 
          onClick={() => navigate('/dna-comercial/onboarding')}
          className="bg-amber-500 text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10"
        >
          Criar DNA Comercial Agora
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
           <button 
             onClick={() => navigate('/dna-comercial')}
             className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all"
           >
             <ArrowLeft className="w-5 h-5" />
           </button>
           <div className="space-y-1">
             <h1 className="text-4xl font-black title-display italic uppercase tracking-tighter leading-none">Diagnóstico Comercial</h1>
             <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">{user?.businessDNA?.basics.businessName} • AI Analysis</p>
           </div>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl">
           <div className="text-right">
             <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">DNA Score</p>
             <p className="text-sm font-black italic">{score?.total}/100</p>
           </div>
           <div className="w-px h-8 bg-zinc-800" />
           <div className="text-left">
             <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Nível</p>
             <p className="text-sm font-black italic text-amber-500">{score?.level}</p>
           </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 p-6 md:p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-all">
            <Zap className="w-64 h-64" />
         </div>
         <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
               <Sparkles className="w-3.5 h-3.5" /> RESUMO ESTRATÉGICO
            </div>
            <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-zinc-200">
               "{diagnosis.summary}"
            </p>
         </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
         {/* Main Cards */}
         <div className="md:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Strengths */}
               <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 group hover:border-amber-500/20 transition-all">
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="w-6 h-6 text-amber-500" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500/50">Forças</span>
                  </div>
                  <div className="space-y-4">
                    {diagnosis.strengths.map((s, i) => (
                      <p key={i} className="text-xs font-bold text-zinc-300 leading-relaxed italic">"{s}"</p>
                    ))}
                  </div>
               </div>

               {/* Risks / Warnings */}
               <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 group hover:border-red-500/20 transition-all">
                  <div className="flex items-center justify-between">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500/50">Alertas</span>
                  </div>
                  <div className="space-y-4">
                    {diagnosis.salesWarnings.length > 0 ? (
                      diagnosis.salesWarnings.map((w, i) => (
                        <p key={i} className="text-xs font-bold text-zinc-300 leading-relaxed italic">"{w}"</p>
                      ))
                    ) : (
                      <p className="text-xs font-bold text-zinc-500 italic">Nenhum alerta crítico detectado no momento.</p>
                    )}
                  </div>
               </div>
            </div>

            {/* Opportunities Section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden">
               <div className="absolute bottom-0 right-0 p-8 opacity-[0.02]">
                  <TrendingUp className="w-40 h-40 font-black" />
               </div>
               
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black border border-zinc-800 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Oportunidades da Semana</h3>
               </div>

               <div className="grid gap-4">
                  {diagnosis.weeklyOpportunities.map((op, i) => (
                    <div key={i} className="bg-black/50 border border-zinc-800 p-6 rounded-3xl flex items-center justify-between group hover:border-amber-500/30 transition-all">
                       <span className="text-sm font-bold text-zinc-200">{op}</span>
                       <button className="p-2 rounded-lg group-hover:bg-amber-500 transition-all">
                          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-black transition-colors" />
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            {/* Angles & Offers */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-2 flex items-center gap-2">
                  <Target className="w-3 h-3" /> Ângulos de Campanha
                </h4>
                <div className="space-y-3">
                   {diagnosis.bestCampaignAngles.map((a, i) => (
                     <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-xs font-bold text-zinc-400">
                        {a}
                     </div>
                   ))}
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-2 flex items-center gap-2">
                  <Package className="w-3 h-3" /> Tipos de Oferta
                </h4>
                <div className="space-y-3">
                   {diagnosis.bestOfferTypes.map((o, i) => (
                     <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-xs font-bold text-zinc-400">
                        {o}
                     </div>
                   ))}
                </div>
              </div>
            </div>
         </div>

         {/* Sidebar Actions */}
         <div className="md:col-span-4 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-10">
               <h3 className="text-lg font-black uppercase italic tracking-tighter border-b border-zinc-800 pb-4">Próximas Ações</h3>
               
               <div className="space-y-4">
                  {diagnosis.nextBestActions.map((action, i) => (
                    <button 
                      key={i}
                      onClick={() => navigate((action || '').toLowerCase().includes('campanha') ? '/campanha-pronta' : '/dna-comercial/onboarding')}
                      className="w-full bg-black border border-zinc-800 p-6 rounded-3xl flex items-center gap-4 hover:border-amber-500/50 transition-all text-left text-xs font-black uppercase tracking-widest group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
                         <Zap className="w-4 h-4 text-zinc-700 group-hover:text-amber-500 transition-colors" />
                      </div>
                      {action}
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-amber-500 p-10 rounded-[3rem] text-black space-y-6 relative overflow-hidden group shadow-2xl shadow-amber-500/20">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-all">
                  <Sparkles className="w-24 h-24" />
               </div>
               <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight relative z-10">Transforme este diagnóstico em lucro.</h3>
               <p className="text-xs font-bold leading-relaxed relative z-10">Use agora estas recomendações para criar sua próxima campanha de alta conversão.</p>
               <button 
                onClick={() => navigate('/campanha-pronta')}
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-900 transition-all shadow-2xl shadow-black/20 relative z-10"
               >
                 Usar DNA na Campanha
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
