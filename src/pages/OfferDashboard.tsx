import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus, History, Library, Target, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';

export function OfferDashboard() {
  const navigate = useNavigate();
  const { offers } = useStorage();

  const recentOffers = offers.slice(0, 3);
  const bestScore = offers.reduce((acc, curr) => Math.max(acc, curr.quality?.finalScore || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-500" />
            Ofertas e Combos
          </h1>
          <p className="text-lg text-zinc-400 mt-2">
            Crie combinações, promoções e queima de estoque antes de postar.
          </p>
        </div>
        <button 
          onClick={() => navigate('/ofertas/nova')}
          className="bg-amber-500 text-black px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Nova Oferta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <History className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-500 uppercase">Ofertas Criadas</p>
              <h3 className="text-3xl font-black text-white">{offers.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-500 uppercase">Melhor Score</p>
              <h3 className="text-3xl font-black text-white">{bestScore > 0 ? `${bestScore}/100` : '-'}</h3>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
              <Library className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-zinc-500 uppercase mb-2">Modelos</p>
              <button 
                onClick={() => navigate('/ofertas/modelos')}
                className="w-full bg-zinc-800 text-white text-xs font-bold py-2 rounded-lg hover:bg-zinc-700"
              >
                Ver Biblioteca
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white uppercase tracking-wide">Últimas Ofertas</h2>
          <button 
            onClick={() => navigate('/ofertas/historico')}
            className="text-amber-500 font-bold text-sm tracking-wide hover:text-amber-400"
          >
            Ver Histórico Completo
          </button>
        </div>

        {recentOffers.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800/50 p-6 md:p-12 rounded-3xl text-center">
            <Zap className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Sua esteira está vazia</h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Campanha fraca geralmente nasce de uma oferta fraca. Crie sua primeira oferta estruturada agora.
            </p>
            <button 
              onClick={() => navigate('/ofertas/nova')}
              className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-zinc-700 transition-colors"
            >
              Criar Primeira Oferta
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOffers.map(offer => (
              <div key={offer.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{offer.input?.productOrService || 'Oferta'}</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    {offer.strategy?.offerType || 'Oferta Padrão'} • Objetivo: {offer.input?.objective?.replace('_', ' ') || 'Vender'}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="block text-xs font-bold text-zinc-500 uppercase">Score</span>
                    <span className={`font-black ${offer.quality.finalScore >= 80 ? 'text-green-500' : 'text-amber-500'}`}>
                      {offer.quality.finalScore}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate('/ofertas/diagnostico', { state: { offer } })}
                    className="bg-zinc-800 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-zinc-700"
                  >
                    Ver Diagnóstico
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
