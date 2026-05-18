import React from 'react';
import { useNavigate } from 'react-router-dom';

export function ConsultantProblems() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl mt-12">
       <button onClick={() => navigate('/consultor')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition">
         Voltar
       </button>
       <h1 className="text-2xl font-black uppercase text-white mb-6">Problemas Comuns (Em Desenvolvimento)</h1>
    </div>
  );
}

export function ConsultantActionPlan() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl mt-12">
       <button onClick={() => navigate('/consultor')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition">
         Voltar
       </button>
       <h1 className="text-2xl font-black uppercase text-white mb-6">Plano de Ação (Em Desenvolvimento)</h1>
    </div>
  );
}
