import React from 'react';
import { motion } from 'motion/react';
import { Target, Zap, TrendingUp, AlertCircle, ShoppingBag, Stars } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export function OpportunityRadar() {
  const navigate = useNavigate();
  
  const opportunities = [
    {
      id: 'opp1',
      title: 'BAIXA_ROTACAO_DETECTADA',
      desc: 'Seu estoque de Brincos está perdendo tração. Sugerimos campanha de liquidação relâmpago de 24h.',
      priority: 'high',
      icon: AlertCircle,
      action: '/campanhas/nova',
      label: 'ESTRATEGIA URGENTE'
    },
    {
      id: 'opp2',
      title: 'PICO_DE_DEMANDA_REGIONAL',
      desc: 'Aumento de buscas por "Presentes Dia das Mães" em sua cidade. Antecipe a oferta de combos.',
      priority: 'medium',
      icon: TrendingUp,
      action: '/ofertas/nova',
      label: 'TENDENCIA LOCAL'
    },
    {
      id: 'opp3',
      title: 'REATIVACAO_DE_CLIENTES',
      desc: '85 clientes não compram há 30 dias. Script de "Sentimos sua falta" com bônus gerado.',
      priority: 'high',
      icon: Zap,
      action: '/campanhas/nova',
      label: 'RECUPERACAO CASH'
    }
  ];

  return (
    <section className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-white/5 pb-8">
         <div className="flex items-baseline gap-4">
            <span className="text-editorial-label text-zinc-700">Predictive Engine</span>
            <h2 className="text-editorial-h2 text-white italic">OPPORTUNITY RADAR</h2>
         </div>
         <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">Scanning Local Market...</span>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/5 border border-white/10 group/grid">
         {opportunities.map((opp, i) => (
           <motion.div 
             key={opp.id}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
             className="bg-black p-10 space-y-10 group relative overflow-hidden h-full flex flex-col justify-between hover:bg-zinc-950 transition-colors duration-500"
           >
              {/* Animated Scan Line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-yellow/30 -translate-y-full group-hover:animate-[scan_3s_linear_infinite] pointer-events-none" />

              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                   <div className={cn(
                     "w-12 h-12 flex items-center justify-center border transition-all duration-500",
                     opp.priority === 'high' 
                       ? "border-red-900/50 bg-red-950/20 text-red-500 group-hover:border-red-500" 
                       : "border-brand-yellow/20 bg-brand-yellow/5 text-brand-yellow group-hover:border-brand-yellow"
                   )}>
                      <opp.icon className="w-5 h-5" />
                   </div>
                   <span className={cn(
                     "text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1.5 border transition-colors",
                     opp.priority === 'high' ? "border-red-900/50 text-red-500" : "border-white/10 text-zinc-500 group-hover:text-brand-yellow"
                   )}>
                     {opp.label}
                   </span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-[0.9] group-hover:text-brand-yellow transition-colors duration-300">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-3">
                    {opp.desc}
                  </p>
                </div>
              </div>

              <div className="pt-10 relative z-10">
                <button 
                  onClick={() => navigate(opp.action)}
                  className="w-full h-14 bg-zinc-900 text-zinc-400 group-hover:bg-brand-yellow group-hover:text-black font-black italic tracking-tighter text-[10px] uppercase transition-all duration-300 flex items-center justify-center gap-2"
                >
                  CONVERT_NOW <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Decorative background element */}
              <div className="absolute -bottom-16 -right-16 p-8 opacity-[0.01] group-hover:opacity-[0.04] transition-all duration-700 rotate-12 group-hover:rotate-0">
                 <opp.icon className="w-64 h-64 text-white" />
              </div>
           </motion.div>
         ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(800%); opacity: 0; }
        }
      `}} />
    </section>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
