import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Target, Zap, LayoutDashboard, Fingerprint, BarChart3, ChevronRight } from 'lucide-react';

export function OnboardingWelcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
      <div className="max-w-3xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.3)] rotate-3">
            <Rocket className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl md:text-6xl font-black uppercase tracking-tight leading-none bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
            Bem-vindo ao <br/>Fotomax IA
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium">
            Seu assistente para criar ofertas, campanhas, mensagens de WhatsApp e ideias comerciais usando o contexto real do seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
           <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
             <Fingerprint className="w-6 h-6 text-amber-500" />
             <span className="text-sm font-bold text-zinc-300">Monte seu DNA Comercial</span>
           </div>
           <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
             <Target className="w-6 h-6 text-amber-500" />
             <span className="text-sm font-bold text-zinc-300">Crie uma oferta irresistível</span>
           </div>
           <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
             <Zap className="w-6 h-6 text-indigo-500" />
             <span className="text-sm font-bold text-zinc-300">Gere campanhas prontas</span>
           </div>
           <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
             <BarChart3 className="w-6 h-6 text-rose-500" />
             <span className="text-sm font-bold text-zinc-300">Acompanhe seus resultados</span>
           </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => navigate('/onboarding/primeira-vitoria')}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition transform hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2"
          >
            Começar pela Primeira Vitória <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition hover:text-white"
          >
            Explorar o app
          </button>
        </div>

        <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
          Experimente agora o poder da IA no seu negócio local.
        </p>
      </div>
    </div>
  );
}
