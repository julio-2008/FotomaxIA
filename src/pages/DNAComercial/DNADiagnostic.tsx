import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  ShieldAlert, 
  Lightbulb, 
  Target, 
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';
import { generateBusinessInsights } from '../../services/businessInsights';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export function DNADiagnostic() {
  const navigate = useNavigate();
  const { user } = useStorage();
  const profile = user?.businessProfile;

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-zinc-900 border border-zinc-800 rounded-[3rem] border-dashed">
        <div className="w-20 h-20 bg-zinc-950 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-zinc-800">
          <ShieldAlert className="w-10 h-10 text-zinc-800" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">DNA Não Encontrado</h2>
        <p className="text-zinc-500 mb-8 max-w-xs font-medium">Você precisa completar seu DNA Comercial para ver o diagnóstico estratégico do seu negócio.</p>
        <button 
          onClick={() => navigate('/perfil-comercial/onboarding')}
          className="bg-amber-500 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10"
        >
          Criar DNA Comercial Agora
        </button>
      </div>
    );
  }

  const insights = generateBusinessInsights(profile);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Diagnóstico Estratégico</h1>
          <p className="text-zinc-500 font-medium">Análise de IA baseada na realidade atual do seu negócio.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Maturidade Comercial</span>
            <span className={cn(
              "text-xs font-black uppercase opacity-80",
              insights.score > 70 ? "text-green-500" : insights.score > 50 ? "text-amber-500" : "text-red-500"
            )}>{insights.level.replace('_', ' ')}</span>
          </div>
          <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shadow-inner text-amber-500 font-black">
            {insights.score}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Verdict */}
        <div className="md:col-span-8 bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-32 h-32" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Veredito da Inteligência
          </h3>
          <p className="text-2xl font-black text-white leading-relaxed mb-8 uppercase italic tracking-tight">
            "{insights.diagnosis}"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-2 block">Forças Identificadas</span>
              {insights.strengths.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-bold text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> {s}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-2 block">Pontos de Atenção</span>
              {insights.weaknesses.map((w, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-bold text-zinc-400">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" /> {w}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Actions Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] p-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Plano de Ação (Essa Semana)
            </h4>
            <div className="space-y-4">
              {insights.suggestedWeeklyActions.map((action, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-amber-500 flex-shrink-0 group-hover:bg-amber-500 group-hover:text-black transition-all">
                    {i + 1}
                  </div>
                  <p className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors leading-relaxed">
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Oportunidades Extra
            </h4>
            <div className="space-y-3">
              {insights.opportunities.map((opt, i) => (
                <div key={i} className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/5 px-3 py-2 rounded-lg border border-green-500/10">
                  + {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 hover:border-zinc-700 transition-all">
          <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 mb-6 shadow-inner">
            <MessageSquare className="w-6 h-6 text-zinc-500" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Ângulo de Campanha</h4>
          <div className="flex flex-wrap gap-2">
            {insights.recommendedCampaignAngles.map((angle, i) => (
              <span key={i} className="text-[9px] font-black px-2 py-1 bg-zinc-950 rounded-lg text-zinc-400 border border-zinc-800">
                {angle}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-500 font-medium italic">Baseado no seu tom de marca: {profile.brandTone}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 hover:border-zinc-700 transition-all">
          <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 mb-6 shadow-inner">
            <Target className="w-6 h-6 text-zinc-500" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Ofertas que Funcionam</h4>
          <div className="flex flex-wrap gap-2">
            {insights.recommendedOfferTypes.map((offer, i) => (
              <span key={i} className="text-[9px] font-black px-2 py-1 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/10">
                {offer}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-500 font-medium italic">Baseado no produto mais lucrativo: {profile.highestProfitProduct}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 hover:border-zinc-700 transition-all">
          <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 mb-6 shadow-inner">
            <AlertTriangle className="w-6 h-6 text-zinc-500" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Restrições e Alertas</h4>
          <div className="space-y-2">
            {insights.contentWarnings.length > 0 ? insights.contentWarnings.map((warn, i) => (
              <div key={i} className="text-[9px] font-bold text-red-400 flex items-start gap-2">
                <span className="w-1 h-1 bg-red-400 rounded-full mt-1.5 flex-shrink-0" /> {warn}
              </div>
            )) : <p className="text-[9px] text-zinc-600 italic">Nenhum alerta crítico para este perfil.</p>}
          </div>
          <p className="mt-4 text-xs text-zinc-500 font-medium italic">Baseado nas objeções e tom proibido.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter italic mb-1">Pronto para colocar em prática?</h3>
          <p className="text-zinc-500 text-sm font-medium">Use seu DNA Comercial agora mesmo para gerar uma campanha impossível de ser ignorada.</p>
        </div>
        <button 
          onClick={() => navigate('/generate')}
          className="px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-200 transition-all"
        >
          Ir para o Gerador <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
