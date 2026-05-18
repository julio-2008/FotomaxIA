import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { Search, History, Filter } from 'lucide-react';

export function CampaignHistory() {
  const { campaigns } = useStorage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = campaigns.filter(c => 
    (c.input?.productOrService || '').toLowerCase().includes((search || '').toLowerCase()) || 
    (c.input?.campaignObjective || '').toLowerCase().includes((search || '').toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-800">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2 flex items-center gap-3">
               <History className="w-8 h-8" /> Histórico de Campanhas
            </h1>
            <p className="text-zinc-400">Todas as suas estratégias geradas salvas em um só lugar.</p>
          </div>
        </header>

        <div className="flex gap-4">
           <div className="flex-1 relative">
             <Search className="w-5 h-5 absolute left-4 top-4 text-zinc-500" />
             <input 
               type="text"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Buscar por produto ou objetivo..."
               className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 pl-12 outline-none focus:border-white transition-colors text-white"
             />
           </div>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && search === '' && (
             <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-12 text-center">
               <div className="w-20 h-20 bg-zinc-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                 <History className="w-8 h-8 text-zinc-500" />
               </div>
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Sem Campanhas Salvas</h3>
               <p className="text-zinc-500 font-medium max-w-sm mx-auto mb-8">Você ainda não gerou e salvou nenhuma campanha. Crie sua primeira estratégia baseada no seu DNA Comercial.</p>
               <button onClick={() => navigate('/campanhas/nova')} className="brand-button">Criar Primeira Campanha</button>
             </div>
          )}
          {filtered.length === 0 && search !== '' && (
             <div className="text-center py-12 text-zinc-500">
                Nenhuma campanha encontrada para essa busca.
             </div>
          )}
          {filtered.map(c => (
            <div key={c.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-colors">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                     </span>
                     <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-black ${c.quality?.finalScore >= 80 ? 'text-amber-500' : 'text-amber-500'}`}>
                        SCORE {c.quality?.finalScore || 0}
                     </span>
                     <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-black text-white/50 border border-zinc-800">
                        {c.source}
                     </span>
                  </div>
                  <h3 className="font-bold text-xl">{c.input?.productOrService || 'Sem nome'}</h3>
                  <p className="text-sm text-zinc-400">Objetivo: {c.input?.campaignObjective}</p>
               </div>
               
               <div className="shrink-0 flex items-center gap-3">
                  <button 
                    onClick={() => navigate('/campanhas/diagnostico', { state: { campaignId: c.id } })}
                    className="bg-white text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
                  >
                    Ver Resultado
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
