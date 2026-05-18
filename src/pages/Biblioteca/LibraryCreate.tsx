import React from 'react';
import { useNavigate } from 'react-router-dom';

export function LibraryCreate() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl mt-12">
      <h1 className="text-2xl font-black uppercase text-white mb-6">Criar Modelo Próprio</h1>
      <p className="text-zinc-400 mb-6">Módulo em desenvolvimento para liberar criação ilimitada e pacotes personalizados no plano Max.</p>
      <button onClick={() => navigate(-1)} className="px-6 py-3 bg-zinc-800 text-white rounded-xl">Voltar</button>
    </div>
  );
}
