import React from 'react';
import { motion } from 'motion/react';
import { Target, Zap, Globe, Users, ShoppingBag, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface StrategyNexusProps {
  profile: any;
}

export function StrategyNexus({ profile }: StrategyNexusProps) {
  const nodes = [
    { id: 'business', label: 'NEGÓCIO', val: profile.businessName, icon: Globe, pos: 'lg:top-[12%] lg:left-[50%] top-[10%] left-[50%]' },
    { id: 'audience', label: 'PÚBLICO', val: profile.targetAudience, icon: Users, pos: 'lg:top-[40%] lg:left-[22%] top-[30%] left-[25%]' },
    { id: 'product', label: 'PRODUTO', val: profile.bestSellerProduct, icon: ShoppingBag, pos: 'lg:top-[40%] lg:right-[22%] top-[30%] right-[25%]' },
    { id: 'value', label: 'VALOR', val: profile.whatCustomersValueMost, icon: ShieldCheck, pos: 'lg:bottom-[12%] lg:left-[42%] bottom-[10%] left-[30%]' },
    { id: 'channel', label: 'CANAL', val: profile.mainSalesChannel, icon: Zap, pos: 'lg:bottom-[12%] lg:right-[42%] bottom-[10%] right-[30%]' },
  ];

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] bg-black border border-white/5 overflow-hidden group">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px:32px]" />
      
      {/* Central Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 lg:w-48 lg:h-48 rounded-none border border-brand-yellow/10 flex items-center justify-center">
        <div className="w-24 h-24 lg:w-32 lg:h-32 border border-brand-yellow/20 flex items-center justify-center animate-pulse">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-brand-yellow/5 border border-brand-yellow/30 flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-yellow/5 blur-xl animate-pulse" />
            <Target className="text-brand-yellow w-6 h-6 lg:w-8 lg:h-8 relative z-10" />
          </div>
        </div>
      </div>

      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 p-4 lg:p-6 bg-black border border-white/5 space-y-2 z-10 hover:border-brand-yellow hover:bg-zinc-950 transition-all w-36 lg:w-48 shadow-2xl shadow-black",
            node.pos
          )}
        >
          <div className="flex items-center gap-2 lg:gap-3">
             <node.icon className="w-3 h-3 lg:w-4 lg:h-4 text-brand-yellow/50" />
             <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-zinc-600">{node.label}</span>
          </div>
          <p className="text-[9px] lg:text-[10px] font-black text-white uppercase italic leading-tight line-clamp-2">{node.val || 'NULL'}</p>
        </motion.div>
      ))}

      {/* Connection Lines (Simulated via overlay for robustness) */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/5 -translate-y-1/2 pointer-events-none" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/5 -translate-x-1/2 pointer-events-none" />

      <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 space-y-1">
         <span className="text-[8px] font-black uppercase tracking-[0.4em] text-brand-yellow/50 italic leading-none">OPERATIONAL STATUS</span>
         <h4 className="text-sm lg:text-xl font-black italic text-white uppercase tracking-tighter">NEXUS SYNCHRONIZED</h4>
      </div>
    </div>
  );
}
