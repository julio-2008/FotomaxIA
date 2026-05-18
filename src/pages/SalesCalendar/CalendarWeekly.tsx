import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { CheckCircle2, Copy, MessageCircle, ExternalLink, Calendar as CalIcon } from 'lucide-react';
import { SalesCalendar } from '../../types';

export function CalendarWeekly() {
  const navigate = useNavigate();
  const { calendars } = useStorage();
  
  const calendar: SalesCalendar = calendars[0]; // Assuming latest
  
  if (!calendar) {
    return (
       <div className="p-6">
         <p className="text-zinc-500">Nenhum calendário ativo.</p>
         <button onClick={() => navigate('/calendario/nova-ideia')} className="text-amber-500 font-bold mt-4">Gerar agora</button>
       </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
       <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-6">
         <div>
           <h1 className="text-3xl font-black uppercase text-white my-2 italic tracking-tight">O que postar nesta semana</h1>
           <p className="text-zinc-400">Plano de ação: {calendar.weeklyGoal}</p>
         </div>
       </div>
       
       <div className="space-y-6">
         {(calendar.days || []).map((day) => (
           <div key={day.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative group hover:border-zinc-700 transition">
              <div className="bg-amber-500/10 text-amber-500 px-3 py-1 text-xs font-black uppercase rounded absolute -top-3 left-6">
                {day.weekday}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
                <div className="md:col-span-1">
                  <h3 className="font-bold text-white text-lg">{day.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500 uppercase font-black">
                     <span className="bg-zinc-800 px-2 py-1 rounded">{day.channel}</span>
                     <span className="bg-zinc-800 px-2 py-1 rounded">{day.actionType}</span>
                  </div>
                </div>
                
                <div className="md:col-span-2 text-sm text-zinc-300">
                  <p className="mb-2"><strong className="text-white">O que fazer:</strong> {day.idea}</p>
                  <p className="mb-4"><strong className="text-white">Por que:</strong> {day.reasonWhy}</p>
                  
                  <div className="bg-black/50 p-4 rounded-lg font-mono text-zinc-400 text-xs whitespace-pre-wrap">
                    {(day.channel || '').toLowerCase().includes('whatsapp') ? day.whatsappDraft : day.contentDraft}
                  </div>
                </div>
                
                <div className="md:col-span-1 flex flex-col gap-2 justify-end border-l border-zinc-800 pl-4">
                   <button 
                     onClick={() => navigator.clipboard.writeText((day.channel || '').toLowerCase().includes('whatsapp') ? day.whatsappDraft : day.contentDraft)}
                     className="flex items-center justify-center gap-2 p-2 bg-amber-500/10 text-amber-500 rounded font-bold text-xs uppercase hover:bg-amber-500 hover:text-black transition"
                   >
                     <Copy className="w-3 h-3" /> Copiar Texto
                   </button>
                   <button onClick={() => navigate('/campanhas/nova', { state: { initialText: day.contentDraft } })} className="flex items-center justify-center gap-2 p-2 bg-zinc-800 text-white rounded font-bold text-xs uppercase hover:bg-zinc-700 transition">
                     <ExternalLink className="w-3 h-3" /> Usar na Campanha
                   </button>
                   <button onClick={() => navigate('/zap-rapido', { state: { initialText: day.whatsappDraft } })} className="flex items-center justify-center gap-2 p-2 bg-zinc-800 text-white rounded font-bold text-xs uppercase hover:bg-zinc-700 transition">
                     <MessageCircle className="w-3 h-3" /> Enviar Zap
                   </button>
                </div>
              </div>
           </div>
         ))}
       </div>
    </div>
  );
}
