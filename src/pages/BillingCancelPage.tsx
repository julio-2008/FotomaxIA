import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';

export function BillingCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-8">
        <XCircle className="text-red-500 w-12 h-12" />
      </div>
      
      <h1 className="text-4xl font-black title-display mb-4 text-white uppercase tracking-tighter">
        Pagamento Cancelado
      </h1>
      
      <p className="text-zinc-500 mb-10 max-w-sm font-medium">
        Pagamento cancelado. Nenhuma cobrança foi concluída.
      </p>

      <div className="space-y-4 w-full max-w-xs">
        <button 
          onClick={() => navigate('/billing')}
          className="w-full bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all"
        >
          <RefreshCcw className="w-4 h-4" /> Voltar aos planos
        </button>
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-3 h-3" /> Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}
