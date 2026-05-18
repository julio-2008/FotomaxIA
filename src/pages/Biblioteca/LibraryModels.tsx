import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { libraryEngine } from '../../services/libraryEngine';
import { LibraryTemplate } from '../../types';
import { Loader2, ArrowLeft, Star, StarOff, Copy } from 'lucide-react';

export function LibraryModels() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, businessDNA, canGenerateCampaign, incrementUsage, toggleLibraryFavorite, libraryFavorites } = useStorage() as any;
  const template = location.state?.template as LibraryTemplate;
  const [loading, setLoading] = useState(false);
  const [adapted, setAdapted] = useState<any>(null);

  if (!template) {
    return <div className="p-6 text-white">Template não encontrado.</div>;
  }

  const isFav = libraryFavorites?.includes(template.id);

  const handleAdapt = async () => {
    if (!canGenerateCampaign()) {
      alert("Limite de IA alcançado. Faça upgrade.");
      return;
    }
    
    setLoading(true);
    try {
      const context = { objective: template.objective };
      const resp = await libraryEngine.adaptTemplateToDNA(template, context, user);
      setAdapted(resp.adaptedOutput || resp.result?.adaptedOutput);
      incrementUsage('library_adapt_to_dna');
    } catch (e) {
      console.error(e);
      alert("Erro ao adaptar template.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
         <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-amber-500 font-bold uppercase text-xs tracking-wider">{template.category}</span>
              <h1 className="text-3xl font-black text-white mt-1">{template.title}</h1>
            </div>
            <button onClick={() => toggleLibraryFavorite(template.id)} className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition">
              {isFav ? <Star className="w-5 h-5 text-amber-500 fill-current" /> : <StarOff className="w-5 h-5 text-zinc-400" />}
            </button>
         </div>

         <p className="text-zinc-400 mb-6">{template.description}</p>
         
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-black/50 p-4 rounded-xl">
               <span className="block text-[10px] text-zinc-500 font-bold uppercase">Objetivo</span>
               <span className="text-sm text-white font-medium">{template.objective}</span>
            </div>
            <div className="bg-black/50 p-4 rounded-xl">
               <span className="block text-[10px] text-zinc-500 font-bold uppercase">Canal</span>
               <span className="text-sm text-white font-medium">{template.channel}</span>
            </div>
            <div className="bg-black/50 p-4 rounded-xl">
               <span className="block text-[10px] text-zinc-500 font-bold uppercase">Dificuldade</span>
               <span className="text-sm text-white font-medium capitalize">{template.difficulty}</span>
            </div>
            <div className="bg-black/50 p-4 rounded-xl">
               <span className="block text-[10px] text-zinc-500 font-bold uppercase">Tempo</span>
               <span className="text-sm text-white font-medium">{template.estimatedTime}</span>
            </div>
         </div>

         <div className="mb-8">
           <h3 className="text-zinc-500 font-bold uppercase text-xs mb-2">Estrutura Original:</h3>
           <div className="bg-zinc-800 p-4 rounded-xl text-zinc-300 font-mono text-sm">
             {template.structure}
           </div>
         </div>
         <div className="mb-8">
           <h3 className="text-zinc-500 font-bold uppercase text-xs mb-2">Conteúdo Base:</h3>
           <div className="bg-zinc-800 p-4 rounded-xl text-zinc-300 text-sm whitespace-pre-wrap">
             {template.templateContent}
           </div>
         </div>

         <button 
           onClick={handleAdapt}
           disabled={loading}
           className="w-full bg-amber-500 text-black py-4 rounded-xl font-black uppercase flex justify-center items-center gap-2 hover:bg-amber-400 disabled:opacity-50 transition"
         >
           {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Adaptar ao meu DNA Comercial'}
         </button>
      </div>

      {adapted && (
        <div className="bg-amber-900/10 border border-amber-500/20 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4">
           <h2 className="text-2xl font-black text-amber-500 mb-6">Versão Adaptada ao seu Negócio</h2>
           
           <div className="space-y-6">
             {adapted.campaign && (
               <div>
                  <h4 className="text-white font-bold mb-2">Campanha (Feed/Texto)</h4>
                  <div className="bg-black/50 p-4 rounded-xl text-zinc-300 whitespace-pre-wrap font-mono text-sm relative group">
                    {adapted.campaign}
                    <button onClick={() => navigator.clipboard.writeText(adapted.campaign)} className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-2 bg-zinc-800 rounded">
                      <Copy className="w-4 h-4 text-amber-500" />
                    </button>
                  </div>
               </div>
             )}
             {adapted.whatsapp && (
               <div>
                  <h4 className="text-white font-bold mb-2">WhatsApp / Status</h4>
                  <div className="bg-black/50 p-4 rounded-xl text-zinc-300 whitespace-pre-wrap font-mono text-sm relative group">
                    {adapted.whatsapp}
                    <button onClick={() => navigator.clipboard.writeText(adapted.whatsapp)} className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-2 bg-zinc-800 rounded">
                      <Copy className="w-4 h-4 text-amber-500" />
                    </button>
                  </div>
               </div>
             )}
             
             <div className="flex gap-4 mt-8">
               <button onClick={() => navigate('/campanhas/nova', { state: { initialText: adapted.campaign }})} className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-bold uppercase text-xs hover:bg-zinc-700 transition">
                 Criar em Campanhas
               </button>
               <button onClick={() => navigate('/zap-rapido', { state: { initialText: adapted.whatsapp }})} className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-bold uppercase text-xs hover:bg-zinc-700 transition">
                 Ir para Zap Rápido
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
