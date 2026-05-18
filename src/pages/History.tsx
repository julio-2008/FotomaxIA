import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Trash2, 
  Copy, 
  Archive,
  X,
  Calendar,
  Zap,
  Target,
  Check,
  Fingerprint
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { cn } from '../lib/utils';
import { Campaign } from '../types';

export function History() {
  const navigate = useNavigate();
  const { campaigns, deleteCampaign } = useStorage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredCampaigns = campaigns.filter(c => 
    (c.product || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
    (c.businessName || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-500';
    if (score > 50) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold title-display tracking-tight">Histórico de Campanhas</h1>
          <p className="text-zinc-500 font-medium font-sans">Acesso rápido a todos os conteúdos gerados.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-inner">
          <Archive className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-black uppercase text-zinc-400">{campaigns.length} Itens</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por produto ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-amber-500 transition-all font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-zinc-600 transition-all">
          <Filter className="w-4 h-4 text-amber-500" /> Filtrar
        </button>
      </div>

      {filteredCampaigns.length > 0 ? (
        <div className="grid gap-4">
          {filteredCampaigns.map((camp) => (
            <div key={camp.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-500/30 transition-all group bg-zinc-900/50 shadow-sm border-zinc-800">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform relative">
                  {camp.type === 'pizzaria' ? '🍕' : camp.type === 'hamburgueria' ? '🍔' : '🚀'}
                  {camp.businessProfileSnapshot && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1 border-2 border-zinc-950">
                      <Fingerprint className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight group-hover:text-amber-500 transition-colors uppercase">{camp.product}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-xs text-zinc-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(camp.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span className="hidden md:inline text-zinc-800">|</span>
                    <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> {camp.goal.replace('_', ' ')}</span>
                    {camp.profileScoreAtGeneration !== undefined && (
                      <>
                        <span className="hidden md:inline text-zinc-800">|</span>
                        <span className={cn("flex items-center gap-1.5", getScoreColor(camp.profileScoreAtGeneration))}>
                          DNA {camp.profileScoreAtGeneration}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedCampaign(camp)}
                  className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
                >
                  Abrir Detalhes
                </button>
                <button 
                  onClick={() => deleteCampaign(camp.id)}
                  className="p-3 bg-zinc-950 hover:bg-red-500 hover:text-white rounded-xl border border-zinc-800 transition-all text-zinc-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-950/30 rounded-[3rem] border border-dashed border-zinc-800 flex flex-col items-center">
          <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-zinc-800">
            <Archive className="w-10 h-10 text-zinc-800" />
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Nenhuma campanha salva ainda</h3>
          <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-sm font-medium leading-relaxed">
            As campanhas, mensagens e ideias que você salvar aparecerão aqui para acesso rápido.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/generate')}
              className="bg-amber-500 text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Criar Campanha
            </button>
            <button 
              onClick={() => navigate('/library')}
              className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all border border-zinc-700"
            >
              Abrir Biblioteca
            </button>
            <button 
              onClick={() => navigate('/zap-rapido')}
              className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all border border-zinc-700"
            >
              Zap Rápido
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCampaign(null)} />
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900 z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl"><Zap className="text-amber-500 w-6 h-6" /></div>
                  <div>
                    <h3 className="font-black text-xl uppercase tracking-tighter">{selectedCampaign.product}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{selectedCampaign.businessName}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCampaign(null)} className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto">
                {selectedCampaign.content.strategySummary && (
                  <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Estratégia Aplicada</p>
                    <p className="text-xs text-zinc-300 font-medium leading-relaxed italic">{selectedCampaign.content.strategySummary}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Conteúdo Principal</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase text-zinc-700">Legenda Instagram</p>
                      <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 text-xs text-zinc-400 font-medium whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {selectedCampaign.content.campaign?.instagramCaptionLong || selectedCampaign.content.instagramCaption}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase text-zinc-700">WhatsApp</p>
                      <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 text-xs text-zinc-400 font-medium whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {selectedCampaign.content.campaign?.whatsappDirectMessage || selectedCampaign.content.whatsappDirect}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5">
                      <Fingerprint className="w-3 h-3 text-amber-500" />
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">PERSONALIZAÇÃO: {selectedCampaign.content.qualityScore}%</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const text = selectedCampaign.content.campaign?.instagramCaptionLong || selectedCampaign.content.instagramCaption || '';
                      handleCopy(text);
                    }}
                    className="bg-white text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200"
                  >
                    Copiar Capa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence } from 'motion/react';
