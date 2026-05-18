import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Target, Navigation, Users, Clock, History, Library, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { cn } from '../lib/utils';

export function CampaignDashboard() {
  const navigate = useNavigate();
  const { campaigns } = useStorage();

  const recentCampaigns = campaigns.slice(0, 3);

  return (
    <div className="space-y-12 pb-24 animate-fade-in">
      <div className="max-w-[1600px] mx-auto space-y-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:p-12 pb-12 border-b border-zinc-900">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-editorial-label text-brand-yellow">Módulo Ativo</span>
            </div>
            <h1 className="text-editorial-h2 text-white">DIVULGAÇÕES <br /><span className="text-brand-yellow">PRONTAS</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-tight max-w-xl text-xs leading-relaxed">Transforme ofertas em materiais de venda. Nossa IA analisa o seu perfil para criar stories, cardápios e mensagens que vendem.</p>
          </div>
          <button 
            onClick={() => navigate('/campanhas/nova')}
            className="brand-button bg-brand-yellow text-black px-6 md:px-12 py-5 flex items-center justify-center gap-4 group"
          >
            <Sparkles className="w-5 h-5" /> 
            <span>NOVA DIVULGAÇÃO</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
           <div 
             className="bg-black p-6 md:p-12 space-y-8 hover:bg-zinc-950 transition-all cursor-crosshair group relative overflow-hidden" 
             onClick={() => navigate('/campanhas/modelos')}
           >
              <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-brand-yellow transition-colors">
                <Library className="w-6 h-6 text-zinc-800 group-hover:text-brand-yellow transition-colors" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">RESOLVER PROBLEMAS</h3>
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest leading-tight">Vender hoje, recuperar inativos ou lotar agenda. Modelos orientados a conversão.</p>
              </div>
           </div>

           <div 
             className="bg-black p-6 md:p-12 space-y-8 hover:bg-zinc-950 transition-all cursor-crosshair group relative overflow-hidden" 
             onClick={() => navigate('/campanhas/historico')}
           >
              <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-brand-yellow transition-colors">
                <History className="w-6 h-6 text-zinc-800 group-hover:text-brand-yellow transition-colors" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">HISTÓRICO</h3>
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest leading-tight">Revise e reuse as <span className="text-brand-yellow">{campaigns.length} divulgações</span> que a inteligência já desenhou.</p>
              </div>
           </div>

           <div 
             className="bg-black p-6 md:p-12 space-y-8 hover:bg-zinc-950 transition-all cursor-crosshair group relative overflow-hidden" 
             onClick={() => navigate('/campanhas/calendario')}
           >
              <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-brand-yellow transition-colors">
                <Calendar className="w-6 h-6 text-zinc-800 group-hover:text-brand-yellow transition-colors" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">PLANEJAMENTO</h3>
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest leading-tight">Organize as divulgações da semana para manter a consistência do seu negócio.</p>
              </div>
           </div>
        </div>

        {recentCampaigns.length > 0 && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-900 pb-8 gap-8">
              <div className="space-y-4">
                <span className="text-editorial-label text-zinc-700">Recent Outputs</span>
                <h2 className="text-editorial-h3 text-white uppercase italic">Últimas Composições</h2>
              </div>
              <button 
                onClick={() => navigate('/campanhas/historico')}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-brand-yellow transition-colors"
              >
                VER_ACERVO_COMPLETO
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
              {recentCampaigns.map((c, i) => (
                <div key={c.id} className="bg-black p-10 space-y-10 border-b border-zinc-900 hover:bg-zinc-950 transition-all group flex flex-col h-full">
                   <div className="flex justify-between items-baseline">
                     <span className="text-[10px] font-black tracking-widest text-zinc-800">
                       {new Date(c.createdAt).toLocaleDateString()}
                     </span>
                     <span className="text-xs font-black italic text-brand-yellow">
                        SCORE_{c.quality?.finalScore || 'N/A'}
                     </span>
                   </div>
                   
                   <div className="flex-grow space-y-4">
                     <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-white group-hover:text-brand-yellow transition-colors">
                       {c.input?.productOrService || 'Campanha Estratégica'}
                     </h3>
                     <div className="space-y-1">
                        <span className="text-[9px] uppercase font-black tracking-[0.2em] text-zinc-800">OBJECTIVE</span>
                        <p className="text-[11px] font-bold uppercase text-zinc-600 leading-tight line-clamp-2">
                           {c.input?.campaignObjective || 'Comunicação Comercial'}
                        </p>
                     </div>
                   </div>
                   
                   <button 
                     onClick={() => navigate('/campanhas/diagnostico', { state: { campaignId: c.id } })}
                     className="w-full bg-black border-2 border-zinc-900 text-white font-black text-xs tracking-widest uppercase py-5 hover:border-brand-yellow hover:text-brand-yellow transition-all flex items-center justify-between px-8"
                   >
                     <span>ABRIR RELATÓRIO</span>
                     <ArrowRight className="w-5 h-5" />
                   </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
