import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Check, Rocket, ArrowRight, Share2, MessageSquare, PlusCircle, Target } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

export function FirstWinResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStorage() as any;
  const [copied, setCopied] = useState(false);
  
  const state = location.state as any;
  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
         <Rocket className="w-12 h-12 text-zinc-700 mb-4" />
         <h1 className="text-2xl font-black mb-4 uppercase">Nenhum resultado encontrado</h1>
         <button onClick={() => navigate('/onboarding')} className="px-6 py-3 bg-white text-black rounded-xl font-bold uppercase tracking-widest">Recomeçar</button>
      </div>
    );
  }

  const handleCopy = () => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDisplayText = () => {
    if (typeof result === 'string') return result;
    // Handle campaign object
    if (result.outputs) {
      const o = result.outputs;
      return `HEADLINE: ${o.headline || ''}\n\nLEGENDA: ${o.shortCaption || o.longCaption || ''}\n\nDIREÇÃO VISUAL: ${o.visualDirection || o.visualBrief || ''}\n\nCTA: ${o.whatsappDirect || ''}`;
    }
    // Handle generic object
    return result.text || result.content || JSON.stringify(result, null, 2);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-6 md:p-12 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                 <Rocket className="w-5 h-5 text-white" />
               </div>
               <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Primeira Vitória Alcançada</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
               Sua ação está pronta,<br/>{user?.email?.split('@')[0] || 'Empreendedor'}.
             </h1>
             <p className="text-zinc-400 font-medium">O Fotomax IA analisou seu problema de "<span className="text-amber-500">{profile?.currentProblem}</span>" e criou esta estratégia:</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest transition shadow-lg ${copied ? 'bg-amber-500 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-8 md:p-6 md:p-12 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] -z-10 group-hover:bg-amber-500/10 transition-colors duration-700" />
                 <pre className="text-zinc-300 font-medium text-lg whitespace-pre-wrap leading-relaxed">
                   {getDisplayText()}
                 </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                 <button onClick={() => navigate('/dashboard')} className="flex-1 px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition flex items-center justify-center gap-2">
                   Finalizar e Ir ao Dashboard <ArrowRight className="w-4 h-4" />
                 </button>
                 <button onClick={() => navigate('/dna-comercial')} className="flex-1 px-8 py-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500/20 transition flex items-center justify-center gap-2">
                   Completar meu DNA <Share2 className="w-4 h-4" />
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-3xl space-y-4">
                 <h3 className="text-amber-500 font-black uppercase tracking-widest text-xs">Transformar em:</h3>
                 <button onClick={() => navigate('/campanhas')} className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-amber-500/50 transition group">
                    <div className="flex items-center gap-3">
                      <PlusCircle className="w-5 h-5 text-zinc-500 group-hover:text-amber-500 transition" />
                      <span className="font-bold text-sm">Campanha</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-700" />
                 </button>
                 <button onClick={() => navigate('/ofertas')} className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-amber-500/50 transition group">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-zinc-500 group-hover:text-amber-500 transition" />
                      <span className="font-bold text-sm">Oferta</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-700" />
                 </button>
                 <button onClick={() => navigate('/zap-rapido')} className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-amber-500/50 transition group">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-zinc-500 group-hover:text-amber-500 transition" />
                      <span className="font-bold text-sm">Mensagem Zap</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-700" />
                 </button>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-3xl">
                <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2">Atenção</p>
                <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                  Seu teste grátis foi utilizado para gerar esta ação estratégica. Para continuar criando conteúdos personalizados, escolha um plano.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
