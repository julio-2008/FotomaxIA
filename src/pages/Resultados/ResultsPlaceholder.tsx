import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ResultsPlaceholder({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate('/resultados')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition">
         <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <h1 className="text-3xl font-black text-white uppercase mb-8">{title}</h1>
      
      <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-12 rounded-3xl text-center">
         <p className="text-zinc-400 font-bold text-lg mb-4">Esta visualização está em desenvolvimento.</p>
         <p className="text-zinc-500">Logo você poderá acompanhar métricas profundas de cada módulo.</p>
      </div>
    </div>
  );
}
