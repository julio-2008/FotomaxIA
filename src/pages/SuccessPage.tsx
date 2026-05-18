import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Share2, Download } from 'lucide-react';

export function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 md:p-6 md:p-12 animate-fade-in text-center space-y-16 bg-black">
      <div className="relative">
        <div className="w-40 h-40 bg-brand-yellow flex items-center justify-center relative overflow-hidden">
          <CheckCircle2 className="text-black w-20 h-20" strokeWidth={3} />
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 border border-white/10 flex items-center justify-center">
           <div className="w-1.5 h-1.5 bg-brand-yellow animate-ping" />
        </div>
      </div>

      <div className="space-y-6">
        <h1 className="text-editorial-h2 text-white italic leading-[0.9] tracking-tighter uppercase font-black">
          PRONTO PARA <br /><span className="text-brand-yellow">DOMINAR O MERCADO</span>
        </h1>
        <div className="flex items-center justify-center gap-4">
           <div className="h-px w-8 bg-zinc-800" />
           <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[9px] max-w-sm italic">
             CORE STRATEGY SYNCHRONIZED SUCCESSFULLY
           </p>
           <div className="h-px w-8 bg-zinc-800" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 w-full max-w-3xl">
        <Link to="/history" className="bg-white text-black px-6 md:px-12 py-10 font-black uppercase italic tracking-tighter text-xl flex flex-col items-center justify-center gap-4 group hover:bg-brand-yellow transition-all">
          <span className="text-[10px] tracking-[0.3em] opacity-50">VIEW ARCHIVE</span>
          ACESSAR HISTÓRICO 
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </Link>
        <button className="bg-black text-white px-6 md:px-12 py-10 font-black uppercase italic tracking-tighter text-xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all group border-l border-white/5">
          <span className="text-[10px] tracking-[0.3em] text-zinc-700">DISTRIBUTE NODE</span>
          ENVIAR RELATÓRIO
          <Share2 className="w-6 h-6 text-brand-yellow group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="pt-20 border-t border-zinc-900 w-full max-w-3xl flex justify-between items-center opacity-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">ID SYNC 00492 ALFA VER</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">SYSTEM VERIFIED SECURE</span>
      </div>
    </div>
  );
}
