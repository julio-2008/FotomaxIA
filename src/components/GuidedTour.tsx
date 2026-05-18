import React, { useState } from 'react';
import { X, ChevronRight, Brain, Target, Zap, MessageSquare, BarChart3 } from 'lucide-react';

export function GuidedTour({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const tourSteps = [
    {
      title: 'DNA Comercial',
      desc: 'Onde você ensina à IA tudo sobre seu negócio, produtos e clientes.',
      icon: Brain,
      color: 'text-indigo-500'
    },
    {
      title: 'Máquina de Ofertas',
      desc: 'Crie ofertas irresistíveis baseadas em psicologia de vendas.',
      icon: Target,
      color: 'text-amber-500'
    },
    {
      title: 'Campanha Pronta',
      desc: 'Gere legendas, posts e artes completas em segundos.',
      icon: Zap,
      color: 'text-amber-500'
    },
    {
      title: 'Zap Rápido',
      desc: 'Mensagens prontas para converter no WhatsApp sem esforço.',
      icon: MessageSquare,
      color: 'text-indigo-400'
    },
    {
      title: 'Resultados',
      desc: 'Acompanhe o que funcionou e receba recomendações inteligentes.',
      icon: BarChart3,
      color: 'text-rose-500'
    }
  ];

  const current = tourSteps[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
           <button onClick={onComplete} className="text-zinc-600 hover:text-white transition">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
           <div className={`w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-inner`}>
              <current.icon className={`w-8 h-8 ${current.color}`} />
           </div>
           <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Tour do App • {step + 1}/{tourSteps.length}</span>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{current.title}</h2>
              <p className="text-zinc-500 font-medium text-sm leading-relaxed">{current.desc}</p>
           </div>
        </div>

        <div className="flex gap-3 pt-4">
           {step < tourSteps.length - 1 ? (
             <button 
               onClick={() => setStep(step + 1)}
               className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition flex items-center justify-center gap-2"
             >
               Próximo Passo <ChevronRight className="w-4 h-4" />
             </button>
           ) : (
             <button 
               onClick={onComplete}
               className="flex-1 bg-amber-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition"
             >
               Começar a Usar
             </button>
           )}
        </div>

        <button onClick={onComplete} className="w-full text-zinc-600 hover:text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center transition">
           Pular Tour
        </button>
      </div>
    </div>
  );
}
