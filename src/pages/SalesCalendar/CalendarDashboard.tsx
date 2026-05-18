import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { Calendar, Plus, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export function CalendarDashboard() {
  const navigate = useNavigate();
  const { user, calendars } = useStorage();

  const activeCalendar = calendars[0]; // simplistic assumption
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-amber-500" />
            Calendário de Vendas
          </h1>
          <p className="text-zinc-400 mt-2">Um plano diário e prático para o seu negócio.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/calendario/historico')} className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition font-bold text-sm">
            Histórico
          </button>
          <button onClick={() => navigate('/calendario/nova-ideia')} className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition font-black flex items-center gap-2 text-sm uppercase">
            <Plus className="w-4 h-4" /> Gerar Semana
          </button>
        </div>
      </div>

      {!activeCalendar ? (
        <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-12 rounded-3xl text-center">
          <Calendar className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white mb-4">Você ainda não tem plano de vendas.</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-8">
            Pare de abrir o Instagram sem saber o que postar. O Fotomax IA monta uma agenda de ações comerciais para você vender, recuperar clientes e manter o negócio aparecendo todos os dias.
          </p>
          <button 
            onClick={() => navigate('/calendario/nova-ideia')}
            className="px-8 py-4 bg-amber-500 text-black rounded-xl font-black uppercase tracking-tight hover:bg-amber-400 transition shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            Gerar minha semana de vendas
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-900/10 border border-amber-500/20 p-6 rounded-2xl">
             <div className="flex justify-between items-start">
               <div>
                 <h2 className="text-xl font-black text-amber-500 mb-2">Plano Semanal Ativo</h2>
                 <p className="text-zinc-300">Objetivo: {activeCalendar.weeklyGoal}</p>
                 <p className="text-zinc-400 text-sm mt-1">{activeCalendar.strategySummary}</p>
               </div>
               <button onClick={() => navigate('/calendario/semana')} className="brand-button">
                 Ver Calendário
               </button>
             </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mt-8 mb-4">Ação de Hoje</h3>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
             <div className="flex items-center gap-4 text-zinc-400">
               <Clock className="w-5 h-5" />
               <p>Nenhuma ação pendente ou hoje não há ação programada.</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
