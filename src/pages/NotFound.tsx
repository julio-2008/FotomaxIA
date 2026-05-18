import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-center">
      <Ghost className="w-24 h-24 text-zinc-900 mb-6 animate-bounce" />
      <h1 className="text-4xl font-bold title-display mb-2 tracking-tight">404 - Página Perdida</h1>
      <p className="text-zinc-500 mb-8 max-w-md font-medium">Ops! Parece que essa página se perdeu na nossa inteligência artificial.</p>
      <Link to="/" className="bg-amber-500 text-black px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">
        <Home className="w-5 h-5" /> Voltar para o Início
      </Link>
    </div>
  );
}
