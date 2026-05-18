import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { Image, Search, Plus, Palette, FileText, Camera, Wand2, Lock, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CreativeDashboard() {
  const navigate = useNavigate();
  const { creatives } = useStorage() as any;
  const isImageAPIEnabled = import.meta.env.VITE_IMAGE_API_ENABLED === 'true';

  const modes = [
    {
      id: 'briefing',
      title: 'Briefing Visual',
      description: 'Crie a direção visual do criativo: composição, texto, canal, CTA e estilo.',
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      path: '/criativos/novo?mode=briefing'
    },
    {
      id: 'prompt',
      title: 'Prompt Avançado',
      description: 'Crie um prompt profissional para gerar imagem em IA visual.',
      icon: Wand2,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      path: '/criativos/novo?mode=prompt'
    },
    {
      id: 'photo_improvement',
      title: 'Melhorar Foto de Produto',
      description: 'Analise ou prepare uma melhoria visual preservando o produto.',
      icon: Camera,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      path: '/criativos/novo?mode=photo_improvement'
    },
    {
      id: 'image_generation',
      title: 'Gerar Imagem',
      description: 'Crie imagem comercial diretamente no Fotomax IA quando a API estiver ativa.',
      icon: Image,
      color: isImageAPIEnabled ? 'text-amber-500' : 'text-zinc-500',
      bg: isImageAPIEnabled ? 'bg-amber-500/10' : 'bg-zinc-800/50',
      borderColor: isImageAPIEnabled ? 'border-amber-500/20' : 'border-zinc-700',
      locked: !isImageAPIEnabled,
      path: '/criativos/novo?mode=image_generation'
    }
  ];

  return (
    <div className="space-y-12 pb-24 animate-fade-in">
      {/* Brand Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:p-12 border-b border-zinc-900 pb-12">
        <div className="space-y-4">
          <span className="text-editorial-label text-brand-yellow">Creative Engine</span>
          <h1 className="text-editorial-h2 text-white italic">LABORATÓRIO <br /><span className="text-brand-yellow">CRIATIVO</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-tight max-w-xl text-xs leading-relaxed">Desenvolva a direção visual e estética dos seus comerciais. Alta performance, preservando a identidade do seu produto.</p>
        </div>
        <button 
          onClick={() => navigate('/criativos/historico')}
          className="brand-button border-2 border-zinc-900 text-white px-6 md:px-12 py-5 flex items-center gap-4 hover:border-brand-yellow transition-all"
        >
          ACESSAR_ARQUIVO <FileText className="w-5 h-5" />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900">
        {modes.map((mode) => (
          <div
            key={mode.id}
            onClick={() => {
              if (mode.locked) {
                return;
              }
              navigate(mode.path);
            }}
            className={cn(
               "group bg-black p-10 space-y-10 border-r border-b border-zinc-900 relative transition-all cursor-crosshair overflow-hidden",
               !mode.locked && "hover:bg-brand-yellow",
               mode.locked && "opacity-40"
            )}
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-20 translate-x-4 group-hover:translate-x-0 transition-all">
              <mode.icon className="w-24 h-24 text-black" />
            </div>

            <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors">
              <mode.icon className={cn("w-6 h-6 transition-colors", 
                !mode.locked ? "text-brand-yellow group-hover:text-white" : "text-zinc-800"
              )} />
            </div>

            <div className="space-y-3 relative z-10">
              <h3 className="text-xl font-black text-white group-hover:text-black uppercase italic tracking-tighter leading-none">{mode.title}</h3>
              <p className="text-xs text-zinc-600 group-hover:text-black/60 font-bold uppercase tracking-widest leading-tight">{mode.description}</p>
              {mode.locked && (
                <div className="pt-4 flex items-center gap-2 text-[9px] font-black text-zinc-800 uppercase tracking-[0.2em]">
                  <Lock className="w-3 h-3" /> RESTRICTED ACCESS
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {creatives && creatives.length > 0 && (
         <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-900 pb-8 gap-8">
              <div className="space-y-4">
                <span className="text-editorial-label text-zinc-700">Recent Sandbox</span>
                <h2 className="text-editorial-h3 text-white uppercase italic">WORKSPACE</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
              {creatives.slice(0, 3).map((c: any) => (
                <div 
                  key={c.id} 
                  onClick={() => navigate('/criativos/historico', { state: { id: c.id } })}
                  className="bg-black p-10 space-y-10 border-b border-zinc-900 hover:bg-zinc-950 transition-all group flex flex-col h-full cursor-pointer"
                >
                   <div className="flex justify-between items-baseline">
                     <span className="text-[10px] font-black tracking-widest text-zinc-800 uppercase">
                       {c.mode || 'Criativo'}
                     </span>
                     <span className="text-xs font-black italic text-brand-yellow">
                        STAGED READY
                     </span>
                   </div>
                   
                   <div className="flex-grow space-y-4">
                     <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-white group-hover:text-brand-yellow transition-colors">
                       {c.input?.productOrService || 'Sem título'}
                     </h3>
                     <p className="text-[11px] font-bold uppercase text-zinc-600 leading-tight line-clamp-2">
                        {c.input?.creativeGoal || 'Objetivo indefinido'}
                     </p>
                   </div>
                   
                   <div className="pt-8 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">ID: {c.id.slice(0,8)}</span>
                      <ArrowRight className="w-4 h-4 text-brand-yellow" />
                   </div>
                </div>
              ))}
            </div>
         </section>
      )}
    </div>
  );
}
