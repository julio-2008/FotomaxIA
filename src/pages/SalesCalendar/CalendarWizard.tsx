import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { calendarEngine } from '../../services/calendarEngine';
import { Loader2, ArrowRight } from 'lucide-react';
import { SalesCalendar } from '../../types';

export function CalendarWizard() {
  const navigate = useNavigate();
  const { user, saveCalendar, incrementUsage, canGenerateCampaign, businessDNA, offers, campaigns, calendars } = useStorage() as any;
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    objective: 'vender_mais',
    focusProducts: '',
    channels: 'instagram',
    intensity: 'normal',
    restrictions: ''
  });

  const generate = async () => {
    if (!canGenerateCampaign()) {
      alert("Seu plano atingiu o limite de gerações via IA. Faça upgrade.");
      return;
    }
    
    setLoading(true);
    try {
      const context = calendarEngine.buildCalendarContext(user, businessDNA || null, offers || [], campaigns || [], calendars || [], input);
      const result = await calendarEngine.generateWeeklyPlan(context, user);
      
      const newCalendar: SalesCalendar = {
        id: 'cal_' + Date.now(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        periodType: 'week',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'ai',
        businessDNAId: businessDNA?.id,
        businessDNASnapshot: businessDNA,
        strategySummary: result.result?.strategy?.whyThisPlan || result.strategy?.whyThisPlan || 'Plano gerado pela IA.',
        weeklyGoal: result.result?.strategy?.mainGoal || result.strategy?.mainGoal || input.objective,
        focusProducts: result.result?.strategy?.focusProducts || result.strategy?.focusProducts || [input.focusProducts],
        days: (result.result?.days || result.days || []).map((d: any, i: number) => ({
          ...d,
          id: 'day_' + Date.now() + '_' + i,
          status: 'planned'
        })),
        quality: result.quality
      };

      saveCalendar(newCalendar);
      incrementUsage('calendar_week_plan' as any);
      navigate('/calendario/semana');
    } catch (e) {
      console.error(e);
      alert("Houve um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl mt-12">
      <h1 className="text-2xl font-black uppercase text-white mb-6">Configurar Semana</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">Objetivo da Semana</label>
          <select value={input.objective} onChange={e => setInput({...input, objective: e.target.value})} className="w-full bg-zinc-800 text-white p-3 rounded-lg">
            <option value="vender_mais">Vender Mais Hoje</option>
            <option value="manter_constancia">Manter Constância</option>
            <option value="recuperar_clientes">Recuperar Clientes</option>
            <option value="produto_parado">Vender Produto Parado</option>
            <option value="aumentar_ticket">Aumentar Ticket Médio</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">Produto em Foco</label>
          <input type="text" value={input.focusProducts} onChange={e => setInput({...input, focusProducts: e.target.value})} placeholder="Pizzas salgadas, progressiva, etc." className="w-full bg-zinc-800 text-white p-3 rounded-lg" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">Canal Principal</label>
          <select value={input.channels} onChange={e => setInput({...input, channels: e.target.value})} className="w-full bg-zinc-800 text-white p-3 rounded-lg">
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="todos">Todos</option>
          </select>
        </div>

        <button 
          onClick={generate}
          disabled={loading}
          className="w-full bg-amber-500 text-black p-4 rounded-xl font-black uppercase flex items-center justify-center gap-2 hover:bg-amber-400 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gerar Calendário da Semana'}
        </button>
      </div>
    </div>
  );
}
