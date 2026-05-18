import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { consultantEngine } from '../../services/consultantEngine';
import { Loader2, ArrowLeft, ArrowRight, ShieldAlert, Target, Info } from 'lucide-react';
import { BusinessDiagnosis } from '../../types';

export function ConsultantDiagnosis() {
  const navigate = useNavigate();
  const { user, businessDNA, offers, campaigns, calendars, creatives, saveDiagnosis, incrementUsage, canGenerateCampaign } = useStorage() as any;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [diagnosis, setDiagnosis] = useState<BusinessDiagnosis | null>(null);

  const [input, setInput] = useState({
    currentGoal: 'vender_mais',
    currentProblem: 'pouca_constancia'
  });

  const handleGenerate = async () => {
    if (!canGenerateCampaign()) {
      setError("Limite de uso atingido. Faça upgrade para gerar diagnósticos.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const summary = consultantEngine.buildSummary(offers, campaigns, calendars, creatives);
      const resp = await consultantEngine.runDiagnosis(input, businessDNA, summary, user);
      
      const newDiagnosis: BusinessDiagnosis = {
        id: 'diag_' + Date.now(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'ai',
        businessDNAId: businessDNA?.id,
        input,
        analyzedData: summary,
        diagnosis: resp.diagnosis || resp.result?.diagnosis,
        actionPlan: resp.actionPlan || resp.result?.actionPlan,
        scores: resp.scores || resp.result?.scores,
        warnings: resp.warnings || resp.result?.warnings || [],
        nextBestActions: resp.nextBestActions || resp.result?.nextBestActions || [],
        missingContext: resp.missingContext || resp.result?.missingContext || []
      };

      saveDiagnosis(newDiagnosis);
      incrementUsage('business_diagnosis');
      setDiagnosis(newDiagnosis);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Erro ao gerar diagnóstico.");
    } finally {
      setLoading(false);
    }
  };

  if (diagnosis) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate('/consultor')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-8 mb-8 animate-in fade-in">
           <h1 className="text-3xl font-black text-indigo-500 mb-2">Diagnóstico Concluído</h1>
           <p className="text-zinc-300 font-medium text-lg leading-relaxed">{diagnosis.diagnosis.summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <span className="text-rose-500 font-black uppercase text-xs tracking-widest mb-2 block">Problema Principal</span>
              <p className="text-white font-bold">{diagnosis.diagnosis.mainProblem}</p>
              <p className="text-zinc-400 text-sm mt-2">{diagnosis.diagnosis.rootCause}</p>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <span className="text-amber-500 font-black uppercase text-xs tracking-widest mb-2 block">Maior Oportunidade</span>
              <p className="text-white font-bold">{diagnosis.diagnosis.biggestOpportunity}</p>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <span className="text-amber-500 font-black uppercase text-xs tracking-widest mb-2 block">O Que Parar de Fazer</span>
              <p className="text-white font-bold">{diagnosis.diagnosis.whatToStopDoing}</p>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <span className="text-indigo-400 font-black uppercase text-xs tracking-widest mb-2 block">O Que Começar</span>
              <p className="text-white font-bold">{diagnosis.diagnosis.whatToStartDoing}</p>
           </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
           <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
             <Target className="w-6 h-6 text-indigo-500" /> Plano de Ação Imediato
           </h2>
           <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/20 mb-8">
              <span className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-2 block">Ação de Hoje</span>
              <h3 className="text-xl font-bold text-white mb-2">{diagnosis.actionPlan.todayAction.title}</h3>
              <p className="text-zinc-300 mb-4">{diagnosis.actionPlan.todayAction.why}</p>
              <button 
                onClick={() => navigate('/' + diagnosis.actionPlan.todayAction.moduleToUse)}
                className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-black uppercase text-sm hover:bg-indigo-400 transition"
              >
                {diagnosis.actionPlan.todayAction.buttonAction || 'Executar Ação Agora'}
              </button>
           </div>

           <h3 className="text-zinc-400 font-bold uppercase text-xs mb-4">Próximos Passos (3 dias)</h3>
           <div className="space-y-4">
             {diagnosis.actionPlan.next3Actions.map((act, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold flex-shrink-0">
                    {i+1}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{act.title}</h4>
                    <p className="text-zinc-500 text-sm mt-1">{act.how}</p>
                  </div>
                </div>
             ))}
           </div>
        </div>

        {diagnosis.missingContext && diagnosis.missingContext.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl mb-8 flex items-start gap-4">
             <ShieldAlert className="w-6 h-6 text-amber-500 flex-shrink-0" />
             <div>
               <h4 className="text-amber-500 font-bold mb-1">Para um diagnóstico melhor da próxima vez:</h4>
               <ul className="list-disc list-inside text-amber-400/80 text-sm">
                 {diagnosis.missingContext.map((c, i) => <li key={i}>{c}</li>)}
               </ul>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl mt-12">
       <button onClick={() => navigate('/consultor')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      <h1 className="text-2xl font-black uppercase text-white mb-6">Diagnóstico Comercial</h1>
      <p className="text-zinc-400 mb-8">Baseado nos dados do seu DNA Comercial, ofertas e campanhas, o Consultor IA apontará os gargalos de vendas.</p>
      
      {error && (
        <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl mb-6 font-bold text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">Objetivo Atual</label>
          <select value={input.currentGoal} onChange={e => setInput({...input, currentGoal: e.target.value})} className="w-full bg-zinc-800 text-white p-3 rounded-lg">
            <option value="vender_mais">Vender mais no dia a dia</option>
            <option value="atrair_novos">Atrair novos clientes</option>
            <option value="recuperar_lucro">Aumentar lucro por venda</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">Maior Dificuldade Hoje</label>
          <select value={input.currentProblem} onChange={e => setInput({...input, currentProblem: e.target.value})} className="w-full bg-zinc-800 text-white p-3 rounded-lg">
            <option value="pouca_constancia">Não consigo postar / ter constância</option>
            <option value="so_querem_barato">Clientes só compram com desconto</option>
            <option value="nao_respondem">Mando mensagem mas não respondem</option>
            <option value="produto_parado">Estoque ou agenda parada</option>
          </select>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-indigo-500 text-white p-4 rounded-xl font-black uppercase flex items-center justify-center gap-2 hover:bg-indigo-400 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gerar Diagnóstico'}
        </button>
      </div>
    </div>
  );
}
