import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { History, ArrowLeft, PenTool, Trash2, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function OfferHistory() {
  const navigate = useNavigate();
  const { offers, deleteOffer } = useStorage();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/ofertas')} className="text-zinc-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <History className="w-8 h-8 text-amber-500" />
            Histórico de Ofertas
          </h1>
          <p className="text-lg text-zinc-400 mt-2">
            Todas as ofertas que você já criou.
          </p>
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800/50 p-6 md:p-12 rounded-3xl text-center">
          <Zap className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Histórico vazio</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Você ainda não criou nenhuma oferta.
          </p>
          <button 
            onClick={() => navigate('/ofertas/nova')}
            className="bg-amber-500 text-black px-6 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-amber-400 transition-colors"
          >
            Criar Primeira Oferta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map(offer => (
            <div key={offer.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white">{offer.input?.productOrService || 'Oferta'}</h3>
                    <p className="text-sm text-zinc-400 mt-1">{offer.strategy?.offerType || 'Padrão'}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-zinc-500 uppercase">Score</span>
                    <span className={`font-black text-lg ${offer.quality.finalScore >= 80 ? 'text-green-500' : 'text-amber-500'}`}>
                      {offer.quality.finalScore}
                    </span>
                  </div>
                </div>
                
                <div className="bg-zinc-800/50 p-3 rounded-xl mb-4 text-sm text-zinc-300">
                  <span className="font-bold">Objetivo:</span> {offer.input?.objective?.replace('_', ' ') || 'Vender'}
                </div>

                <p className="text-xs text-zinc-500 mb-6">
                  Gerada em {format(new Date(offer.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/ofertas/diagnostico', { state: { offer } })}
                  className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-zinc-700 transition-colors"
                >
                  Abrir
                </button>
                <button 
                  onClick={() => navigate('/campanhas/nova')}
                  className="bg-amber-500 text-black px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                >
                  <PenTool className="w-4 h-4" /> Campanha
                </button>
                <button 
                  onClick={() => deleteOffer(offer.id)}
                  className="bg-red-500/10 text-red-500 px-4 py-3 rounded-xl font-bold hover:bg-red-500/20 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
