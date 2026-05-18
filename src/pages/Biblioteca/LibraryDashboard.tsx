import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { libraryEngine } from '../../services/libraryEngine';
import { Library, Search, Star, Lock, Zap, Clock, Bookmark, Plus } from 'lucide-react';
import { LibraryTemplate } from '../../types';

export function LibraryDashboard() {
  const navigate = useNavigate();
  const { user, businessDNA, libraryFavorites } = useStorage() as any;
  const [searchTerm, setSearchTerm] = useState('');
  
  const allTemplates = libraryEngine.getAllTemplates();
  const recommended = libraryEngine.recommendTemplatesForUser(user, businessDNA, []);
  
  const filteredTemplates = searchTerm 
    ? allTemplates.filter(t => (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (t.niche || []).some(n => (n || '').toLowerCase().includes(searchTerm.toLowerCase())))
    : allTemplates.slice(0, 10); // show a few latest
    
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Library className="w-8 h-8 text-amber-500" />
            Biblioteca Inteligente
          </h1>
          <p className="text-zinc-400 mt-2">Modelos comerciais prontos para adaptar ao seu negócio.</p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => navigate('/biblioteca/favoritos')} className="p-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition">
             <Bookmark className="w-5 h-5" />
           </button>
           <button onClick={() => navigate('/biblioteca/historico')} className="brand-button">
             Histórico
           </button>
           <button onClick={() => navigate('/biblioteca/criar')} className="brand-button">
             <Plus className="w-4 h-4" /> Criar Modelo
           </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar modelos por objetivo, nicho ou canal..." 
            className="w-full bg-zinc-900 border border-zinc-800 pl-12 pr-4 py-4 rounded-xl text-white outline-none focus:border-amber-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {!searchTerm && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Recomendados para o seu DNA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.slice(0,3).map(template => (
              <TemplateCard key={template.id} template={template} isFav={Boolean(libraryFavorites?.includes(template.id))} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          {searchTerm ? 'Resultados da Busca' : 'Navegar por Modelos'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
             <TemplateCard key={template.id} template={template} isFav={Boolean(libraryFavorites?.includes(template.id))} />
          ))}
          {filteredTemplates.length === 0 && <p className="text-zinc-500">Nenhum modelo encontrado.</p>}
        </div>
      </div>
    </div>
  );
}

const TemplateCard: React.FC<{ template: LibraryTemplate, isFav: boolean }> = ({ template, isFav }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col hover:border-zinc-700 transition relative">
       {isFav && <Star className="w-4 h-4 text-amber-500 absolute top-4 right-4 fill-current" />}
       {template.accessLevel === 'pro' || template.accessLevel === 'max' ? (
         <div className="absolute top-4 right-4 bg-zinc-800 p-1.5 rounded-md">
            <Lock className="w-3 h-3 text-zinc-400" />
         </div>
       ) : null}
       <span className="text-amber-500 text-[10px] font-black uppercase tracking-wider mb-2 block">{template.category}</span>
       <h3 className="text-lg font-bold text-white mb-2 leading-tight">{template.title}</h3>
       <p className="text-zinc-400 text-xs mb-4 flex-1">{template.description}</p>
       
       <div className="flex items-center gap-2 text-xs text-zinc-500 font-bold uppercase mb-4">
         <span className="bg-zinc-800 px-2 py-1 rounded">{template.objective}</span>
         {template.channel && <span className="bg-zinc-800 px-2 py-1 rounded line-clamp-1">{template.channel}</span>}
       </div>
       
       <button 
         onClick={() => navigate('/biblioteca/modelos', { state: { template } })}
         className="w-full py-2 bg-amber-500/10 text-amber-500 font-black text-xs uppercase tracking-wider rounded-lg hover:bg-amber-500 hover:text-black transition flex justify-center items-center gap-2"
       >
         Ver e Adaptar <Zap className="w-3 h-3" />
       </button>
    </div>
  );
}
