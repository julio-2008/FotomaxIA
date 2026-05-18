import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { analyticsEngine } from '../../services/analyticsEngine';
import { BarChart3, Plus, ArrowRight, Zap, Target, Loader2 } from 'lucide-react';
import { usageGuard } from '../../services/usageGuard';
import { AIActionType } from '../../types';

export function ResultsDashboard() {
  const navigate = useNavigate();
  const { user, businessDNA, activityEvents = [], resultRecords = [], saveLearningProfile, saveUser } = useStorage() as any;
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const executionScore = React.useMemo(() => analyticsEngine.calculateExecutionScore(activityEvents, resultRecords), [activityEvents, resultRecords]);

  const handleRunAnalysis = async () => {
    const actionType: AIActionType = 'performance_analysis';
    const check = usageGuard.canUseAI(user, actionType);
    
    if (!check.can) {
      alert(check.reason);
      if (check.errorCode === 'INSUFFICIENT_CREDITS') navigate('/uso');
      return;
    }

    setLoadingAnalysis(true);
    try {
      // Consume credits
      const updatedUser = usageGuard.consumeCredits(user, actionType);
      saveUser(updatedUser);

      const resp = await analyticsEngine.runPerformanceAnalysis({
        eventsCount: activityEvents.length,
        resultsCount: resultRecords.length,
        score: executionScore
      }, user);
      
      setAnalysis(resp.result || resp);
      
      const newProfile = analyticsEngine.updateLearningProfileLocally(activityEvents, resultRecords, user);
      saveLearningProfile({ ...newProfile, recommendations: [resp.result?.summary?.mainInsight] });

    } catch (e) {
      console.error(e);
      alert("Erro ao rodar análise.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const salesCount = resultRecords.filter((r:any) => r.type === 'sale').length;
  const leadsCount = resultRecords.filter((r:any) => r.type === 'lead' || r.type === 'reply').length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-amber-500" />
            Resultados
          </h1>
          <p className="text-zinc-400 mt-2">Veja o que você fez, o que funcionou e o que repetir.</p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => navigate('/resultados/relatorios')} className="brand-button">
             Relatório Semanal
           </button>
           <button onClick={() => navigate('/resultados/registrar')} className="brand-button">
             <Plus className="w-4 h-4" /> Registrar 
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
           <span className="text-zinc-500 uppercase font-black tracking-widest text-[10px] mb-2 block">Vendas Reg.</span>
           <p className="text-3xl font-black text-white">{salesCount}</p>
         </div>
         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
           <span className="text-zinc-500 uppercase font-black tracking-widest text-[10px] mb-2 block">Respostas/Leads</span>
           <p className="text-3xl font-black text-white">{leadsCount}</p>
         </div>
         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
           <span className="text-zinc-500 uppercase font-black tracking-widest text-[10px] mb-2 block">Ações Totais</span>
           <p className="text-3xl font-black text-white">{activityEvents.length}</p>
         </div>
         <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
           <span className="text-amber-500 uppercase font-black tracking-widest text-[10px] mb-2 block">Score de Exec.</span>
           <p className="text-3xl font-black text-white">{executionScore}/100</p>
         </div>
      </div>

      {activityEvents.length === 0 && resultRecords.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-12 rounded-3xl text-center flex flex-col items-center">
           <BarChart3 className="w-12 h-12 text-zinc-600 mb-4" />
           <p className="text-zinc-400 font-bold mb-6 text-lg">Você ainda não registrou resultados.<br/>Comece marcando o que aconteceu depois de usar o app.</p>
           <button onClick={() => navigate('/resultados/registrar')} className="brand-button">
             Registrar primeiro resultado
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                 <div className="flex items-center justify-between mb-6">
                   <h2 className="text-xl font-black text-white flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Análise Inteligente</h2>
                   {!analysis && (
                     <button onClick={handleRunAnalysis} disabled={loadingAnalysis} className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-bold text-sm hover:bg-indigo-400 flex items-center gap-2">
                       {loadingAnalysis ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Descobrir Oportunidades'}
                     </button>
                   )}
                 </div>

                 {analysis ? (
                   <div className="space-y-6 animate-in fade-in">
                      <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl">
                        <span className="text-indigo-400 font-black uppercase tracking-widest text-[10px] block mb-2">Insight Principal</span>
                        <p className="text-white font-medium text-lg leading-relaxed">{analysis.summary?.mainInsight}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                           <span className="text-amber-500 font-black uppercase tracking-widest text-[10px] mb-1 block">O que está funcionando</span>
                           <p className="text-zinc-300 text-sm">{analysis.summary?.whatIsWorking}</p>
                        </div>
                        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                           <span className="text-rose-500 font-black uppercase tracking-widest text-[10px] mb-1 block">Maior Vazamento</span>
                           <p className="text-zinc-300 text-sm">{analysis.summary?.biggestLeak}</p>
                        </div>
                      </div>

                      {analysis.recommendations?.length > 0 && (
                        <div>
                           <h3 className="text-zinc-400 font-black uppercase tracking-widest text-[10px] mb-4">Plano de Melhoria</h3>
                           <div className="space-y-3">
                              {(analysis.recommendations || []).map((rec: any, i: number) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-xl gap-4">
                                   <div>
                                     <h4 className="text-white font-bold">{rec.title}</h4>
                                     <p className="text-zinc-500 text-sm">{rec.reason}</p>
                                   </div>
                                   <button 
                                      onClick={() => navigate('/' + rec.moduleToUse)}
                                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-bold text-xs uppercase hover:bg-indigo-400 shrink-0"
                                   >
                                     {rec.action || 'Executar'}
                                   </button>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                 ) : (
                   <p className="text-zinc-500 font-medium">O Fotomax IA precisa analisar seus dados recentes para entender o que repetir e o que evitar. Clique no botão acima para gerar a análise.</p>
                 )}
              </div>
           </div>

           <div className="space-y-4">
             <div onClick={() => navigate('/resultados/campanhas')} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 cursor-pointer flex justify-between items-center group transition">
               <div>
                  <h3 className="text-white font-bold">Campanhas</h3>
                  <p className="text-zinc-500 text-sm">Visualizar detalhes</p>
               </div>
               <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition" />
             </div>
             <div onClick={() => navigate('/resultados/ofertas')} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 cursor-pointer flex justify-between items-center group transition">
               <div>
                  <h3 className="text-white font-bold">Ofertas</h3>
                  <p className="text-zinc-500 text-sm">Visualizar detalhes</p>
               </div>
               <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition" />
             </div>
             <div onClick={() => navigate('/resultados/whatsapp')} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 cursor-pointer flex justify-between items-center group transition">
               <div>
                  <h3 className="text-white font-bold">WhatsApp</h3>
                  <p className="text-zinc-500 text-sm">Visualizar detalhes</p>
               </div>
               <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition" />
             </div>
           </div>
        </div>
      )}

    </div>
  );
}
