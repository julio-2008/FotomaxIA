import React from 'react';
import { useStorage } from '../../hooks/useStorage';

export function CalendarHistory() {
  const { calendars } = useStorage();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-black text-white uppercase italic">Histórico de Calendários</h1>
      <div className="mt-8 space-y-4">
        {calendars.map(c => (
           <div key={c.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
             <p className="font-bold text-white mb-2">{c.weeklyGoal}</p>
             <p className="text-sm">Início: {new Date(c.startDate).toLocaleDateString()}</p>
           </div>
        ))}
        {calendars.length === 0 && <p className="text-zinc-500">Nenhum calendário no histórico.</p>}
      </div>
    </div>
  );
}
