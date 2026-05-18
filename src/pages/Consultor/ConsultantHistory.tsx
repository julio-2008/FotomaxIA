import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { ArrowLeft, Brain } from 'lucide-react';
import { BusinessDiagnosis } from '../../types';

export function ConsultantHistory() {
  const navigate = useNavigate();
  const { diagnoses } = useStorage() as { diagnoses: BusinessDiagnosis[] };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate('/consultor')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition">
         <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <h1 className="text-3xl font-black text-white uppercase flex items-center gap-3 mb-8">
        <Brain className="w-8 h-8 text-indigo-500" />
        Histórico de Diagnósticos
      </h1>

      {(!diagnoses || diagnoses.length === 0) ? (
        <p className="text-zinc-500">Nenhum diagnóstico feito ainda.</p>
      ) : (
        <div className="space-y-6">
          {diagnoses.map(d => (
            <div key={d.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-start gap-4">
               <div>
                  <span className="text-indigo-500 text-[10px] font-black uppercase tracking-wider block mb-1">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-tight mb-2">Score Comercial: {d.scores.commercialReadinessScore}/100</h3>
                  <p className="text-zinc-400 text-sm max-w-2xl">{d.diagnosis.summary}</p>
               </div>
               <div className="flex gap-4">
                  <span className="bg-zinc-800 text-zinc-400 px-3 py-1 text-xs rounded uppercase font-bold">
                    Problema: {d.input.currentProblem}
                  </span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
