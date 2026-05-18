import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { libraryEngine } from '../../services/libraryEngine';
import { Bookmark, Star } from 'lucide-react';

export function LibraryFavorites() {
  const navigate = useNavigate();
  const { libraryFavorites } = useStorage() as any;
  const allTemplates = libraryEngine.getAllTemplates();
  const favorites = allTemplates.filter(t => libraryFavorites.includes(t.id));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-black text-white uppercase flex items-center gap-3 mb-8">
        <Bookmark className="w-8 h-8 text-amber-500" />
        Favoritos
      </h1>

      {favorites.length === 0 ? (
         <div className="text-zinc-500">Nenhum modelo favoritado ainda.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(template => (
             <div key={template.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col cursor-pointer hover:border-amber-500/50 transition" onClick={() => navigate('/biblioteca/modelos', { state: { template } })}>
                <Star className="w-4 h-4 text-amber-500 absolute top-4 right-4 fill-current" />
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-wider mb-2 block">{template.category}</span>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">{template.title}</h3>
                <p className="text-zinc-400 text-xs mb-4 flex-1">{template.description}</p>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
