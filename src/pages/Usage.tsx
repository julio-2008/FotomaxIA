import React, { useMemo } from 'react';
import { useStorage } from '../hooks/useStorage';
import { usageGuard } from '../services/usageGuard';
import { isFirebaseReady } from '../lib/config/envValidator';
import { 
  Database, 
  History, 
  CreditCard, 
  TrendingUp, 
  Image as ImageIcon, 
  Zap, 
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';

export function Usage() {
  const { user } = useStorage();
  const firebaseReady = useMemo(() => isFirebaseReady(), []);
  
  if (!user) return null;
  
  const summary = usageGuard.getUsageSummary(user);
  const limits = usageGuard.getPlanLimits(user.plan);
  
  const monthlyProgress = (summary.monthlyUsed / summary.monthlyLimit) * 100;
  const extraProgress = summary.extraLimit > 0 ? (summary.extraUsed / summary.extraLimit) * 100 : 0;
  const imageProgress = summary.imagesLimit > 0 ? (summary.imagesUsed / summary.imagesLimit) * 100 : 0;

  return (
    <div className="space-y-12 pb-24 animate-fade-in">
      {!firebaseReady && (
        <div className="bg-brand-yellow/10 border border-brand-yellow/20 p-8 flex items-center gap-6 group">
          <div className="w-16 h-16 bg-brand-yellow flex items-center justify-center border-4 border-black shrink-0">
            <ShieldAlert className="text-black w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-brand-yellow font-black uppercase tracking-[0.2em] text-[10px]">OPERATIONAL STATUS: LOCAL STORAGE</h4>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-tight leading-relaxed">
              O Firebase não está configurado. Seus créditos e dados estão sendo salvos apenas neste navegador.
            </p>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:p-12 border-b border-zinc-900 pb-12">
        <div className="space-y-4">
          <span className="text-editorial-label text-zinc-700">Analytics</span>
          <h1 className="text-editorial-h2 text-white">CONSUMO DE <br /><span className="text-brand-yellow">CONTA</span></h1>
        </div>
        <div className="bg-brand-yellow text-black px-6 py-2 border-2 border-black font-black uppercase italic tracking-tighter flex items-center gap-2">
          <Zap className="w-4 h-4 fill-black" />
          PLANO_{user.plan.toUpperCase()}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-900 bg-zinc-900">
        {/* Créditos Mensais */}
        <div className="bg-black p-10 space-y-10 border-r border-b border-zinc-900 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 translate-x-4 group-hover:translate-x-0 transition-all">
            <Database className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                <Database className="w-5 h-5 text-brand-yellow" />
              </div>
              <h3 className="text-xs uppercase font-black tracking-widest text-zinc-500">Créditos Mensais</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter tracking-tight">{summary.monthlyUsed}</span>
                <span className="text-zinc-800 font-black mb-1">/ {summary.monthlyLimit}</span>
              </div>
              <div className="h-1.5 bg-zinc-900 border border-zinc-900">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, monthlyProgress)}%` }}
                  className={`h-full ${monthlyProgress > 90 ? 'bg-red-600' : 'bg-brand-yellow'}`}
                />
              </div>
            </div>
            
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-tight leading-tight">
              Inclusos no seu plano comercial. Renovam automaticamente.
            </p>
          </div>
        </div>

        {/* Créditos Extras */}
        <div className="bg-black p-10 space-y-10 border-r border-b border-zinc-900 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 translate-x-4 group-hover:translate-x-0 transition-all">
            <Zap className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand-yellow" />
              </div>
              <h3 className="text-xs uppercase font-black tracking-widest text-zinc-500">Créditos Extras</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">{summary.extraUsed}</span>
                <span className="text-zinc-800 font-black mb-1">/ {summary.extraLimit}</span>
              </div>
              <div className="h-1.5 bg-zinc-900 border border-zinc-900">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, extraProgress)}%` }}
                  className="h-full bg-brand-yellow"
                />
              </div>
            </div>
            
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-tight leading-tight">
              Adquiridos sob demanda. Sem data de expiração.
            </p>
          </div>
        </div>

        {/* Imagens */}
        <div className="bg-black p-10 space-y-10 border-r border-b border-zinc-900 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 translate-x-4 group-hover:translate-x-0 transition-all">
            <ImageIcon className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-brand-yellow" />
              </div>
              <h3 className="text-xs uppercase font-black tracking-widest text-zinc-500">Imagens Geradas</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">{summary.imagesUsed}</span>
                <span className="text-zinc-800 font-black mb-1">/ {summary.imagesLimit}</span>
              </div>
              <div className="h-1.5 bg-zinc-900 border border-zinc-900">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, imageProgress)}%` }}
                  className="h-full bg-brand-yellow"
                />
              </div>
            </div>
            
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-tight leading-tight">
              Recurso intensivo de hardware. Alinhado ao seu plano de mídia.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
        <div className="bg-black p-6 md:p-12 space-y-12">
          <div className="space-y-4">
            <span className="text-editorial-label text-zinc-700">Journal</span>
            <h2 className="text-editorial-h3 text-white">HISTÓRICO</h2>
          </div>
          
          <div className="bg-zinc-950 border border-zinc-900 p-6 md:p-16 text-center">
            <History className="w-12 h-12 text-zinc-900 mx-auto mb-6" />
            <h3 className="text-xs uppercase font-black text-zinc-700 tracking-widest">Nenhuma atividade registrada</h3>
          </div>
        </div>

        <div className="bg-black p-6 md:p-12 space-y-12">
          <div className="space-y-4">
            <span className="text-editorial-label text-zinc-700">Tariffs</span>
            <h2 className="text-editorial-h3 text-white">TABELA DE CUSTOS</h2>
          </div>
          
          <div className="space-y-1">
            {[
              { icon: Zap, title: 'Oferta / Campanha', sub: 'Texto e Estratégia', cost: '2' },
              { icon: ArrowRight, title: 'Follow-up / Zap', sub: 'Mensagens Curtas', cost: '1' },
              { icon: ImageIcon, title: 'IA Image Generation', sub: 'Criativo Visual', cost: '8' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-6 bg-zinc-950 border border-zinc-900 group hover:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black border border-zinc-900 flex items-center justify-center group-hover:border-brand-yellow transition-colors">
                    <item.icon className="w-5 h-5 text-zinc-800" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white uppercase italic tracking-tight">{item.title}</div>
                    <div className="text-[9px] text-zinc-700 uppercase tracking-widest font-black">{item.sub}</div>
                  </div>
                </div>
                <div className="text-xs font-black text-brand-yellow bg-black border border-zinc-900 px-4 py-1 italic">{item.cost} Créditos</div>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-zinc-950 flex justify-between items-baseline">
            <span className="text-[10px] text-zinc-800 font-black uppercase tracking-widest">RESET PREVISTO</span>
            <span className="text-sm font-black text-white italic tracking-tighter italic">01/06/2026</span>
          </div>
        </div>
      </div>

      {/* Buy Credits Banner */}
      <div className="bg-brand-yellow p-6 md:p-12 md:p-6 md:p-16 border-4 border-black relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:p-12">
          <div className="space-y-6">
            <h3 className="text-editorial-h2 text-black leading-none italic uppercase">PRECISA DE <br />MAIS CRÉDITOS?</h3>
            <p className="text-lg md:text-xl font-bold text-black/80 max-w-lg leading-tight uppercase italic">
              Não deixe sua operação comercial parar. Adquira créditos sob demanda agora.
            </p>
          </div>
          <button 
            className="brand-button bg-black text-white px-6 md:px-12 py-5 hover:bg-zinc-900 shadow-2xl transition-all w-full md:w-auto"
            onClick={() => window.location.href = '/billing'}
          >
            COMPRAR_AGORA
          </button>
        </div>
      </div>
    </div>
  );
}
