import React, { useState, useEffect } from 'react';
import { useStorage } from '../hooks/useStorage';
import { UsageEvent } from '../types';
import { Activity, AlertTriangle, Battery, ShieldAlert, Zap } from 'lucide-react';

export function AdminUsage() {
  const { user, isAdmin } = useStorage();
  const [events, setEvents] = useState<UsageEvent[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fotomax_usage_events');
      if (stored) {
        setEvents(JSON.parse(stored).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch(e) {}
  }, []);

  if (!isAdmin()) {
    return <div className="p-6 md:p-12 text-white">Acesso Negado</div>;
  }

  const handleResetManualUsage = () => {
    if (window.confirm("Isso reseta os limites locais do usuário atual para testes. Continuar?")) {
      const u = JSON.parse(localStorage.getItem('cp_user') || '{}');
      if (u.usage) {
         u.usage.usedCredits = 0;
         u.usage.monthlyCreditsUsed = 0;
         u.usage.trialUsed = false;
         u.usage.rateLimit = {
           requestsLastMinute: 0,
           requestsLastHour: 0
         };
         localStorage.setItem('cp_user', JSON.stringify(u));
         window.location.reload();
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-black title-display tracking-tight uppercase italic flex items-center gap-2">
             <ShieldAlert className="text-amber-500 w-8 h-8" />
             Admin Usage
           </h1>
           <p className="subtitle-mono text-zinc-500">Monitoramento global de limites e uso de IA (Mock LocalStorage)</p>
        </div>
        <button 
           onClick={handleResetManualUsage}
           className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black border border-amber-500/20 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition"
        >
          Dev: Resetar Uso Local
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Logs</span>
          <p className="text-3xl font-black text-white mt-1">{events.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Bloqueados</span>
          <p className="text-3xl font-black text-rose-500 mt-1">{events.filter(e => !e.allowed).length}</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
         <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" /> Histórico de Uso
            </h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
               <thead className="bg-zinc-950/50 text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Data</th>
                    <th className="p-4">Usuário</th>
                    <th className="p-4">Plano</th>
                    <th className="p-4">Ação</th>
                    <th className="p-4">Custo</th>
                    <th className="p-4">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800">
                  {events.slice(0, 100).map((ev, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30 transition">
                      <td className="p-4 text-zinc-400">{new Date(ev.createdAt).toLocaleString()}</td>
                      <td className="p-4 text-white truncate max-w-[150px]">{ev.userId}</td>
                      <td className="p-4 text-zinc-400">{ev.plan}</td>
                      <td className="p-4 text-zinc-300">{ev.actionType}</td>
                      <td className="p-4 font-black">{ev.cost}</td>
                      <td className="p-4">
                        {ev.allowed ? (
                           <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Permitido</span>
                        ) : (
                           <span className="text-rose-500 bg-rose-500/10 px-2 py-1 rounded">Bloqueado: {ev.deniedReason?.substring(0, 30)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
