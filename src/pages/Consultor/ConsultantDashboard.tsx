import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { consultantEngine } from '../../services/consultantEngine';
import { Brain, Activity, ArrowRight, Zap, Target, Lock, Loader2, MessageSquare, Sparkles, AlertTriangle, TrendingUp, Presentation } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ConsultantDashboard() {
  const navigate = useNavigate();
  const { user, businessDNA, offers, campaigns, calendars, creatives, diagnoses } = useStorage() as any;
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const s = consultantEngine.buildSummary(offers, campaigns, calendars, creatives);
    setSummary(s);
    setScore(consultantEngine.calculateCommercialReadinessScore(businessDNA, s));
  }, [offers, campaigns, calendars, creatives, businessDNA]);

  const getScoreMessage = (s: number) => {
    if (s <= 25) return "Seu negócio ainda está sem direção comercial. A IA precisa de mais dados para tracionar.";
    if (s <= 50) return "Você tem peças soltas, mas falta uma sequência lógica para gerar vendas recorrentes.";
    if (s <= 70) return "Sua base está funcional. O próximo passo é não desperdiçar as oportunidades atuais.";
    if (s <= 85) return "Você tem uma estrutura boa. O foco agora é consistência para não depender de picos de venda.";
    return "Sua operação está sólida e orientada por dados. O foco exclusivo deve ser amplificar o alcance.";
  };

  const getScoreColor = (s: number) => {
    if (s <= 30) return "text-rose-500";
    if (s <= 60) return "text-amber-500";
    return "text-amber-500";
  };

  const latestDiagnosis = diagnoses?.length > 0 ? diagnoses[0] : null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            Consultor de IA
          </h1>
          <p className="text-zinc-400 font-medium mt-3 text-sm max-w-xl">
            Uma visão analítica da sua estrutura comercial. Use a inteligência para descobrir exatamente o que você precisa fazer agora para destravar seu próximo pico de vendas.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button onClick={() => navigate('/consultor/perguntar')} className="flex-1 md:flex-none px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group">
             <MessageSquare className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
             Chat Livre
           </button>
           <button onClick={() => navigate('/consultor/historico')} className="flex-1 md:flex-none px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all font-black text-[10px] uppercase tracking-widest">
             Histórico
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Main Score Area */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800/80 rounded-[3rem] p-8 md:p-6 md:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-between group">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
           <div className="absolute top-10 right-10 opacity-5 pointer-events-none group-hover:opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
             <TrendingUp className="w-64 h-64 text-indigo-500" />
           </div>

           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
               <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-full">
                 Análise em Tempo Real
               </div>
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                 <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Motor Operacional Conectado</span>
               </div>
             </div>
             
             <span className="text-zinc-600 font-black uppercase tracking-widest text-[10px] block mb-2">Tração Comercial Atual</span>
             <div className="flex items-end gap-2 mb-2">
               <span className={cn("text-4xl md:text-3xl md:text-8xl font-black leading-none tracking-tighter", getScoreColor(score))}>{score}</span>
               <span className="text-zinc-600 font-black text-2xl md:text-3xl pb-2">/100</span>
             </div>
             <p className="text-xl md:text-2xl font-bold text-white max-w-lg mt-4 leading-tight">{getScoreMessage(score)}</p>
           </div>
           
           <div className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
             {latestDiagnosis ? (
               <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 md:p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(99,102,241,0.2)]">
                 <div className="flex items-center gap-2 mb-4">
                   <Target className="w-5 h-5 text-indigo-200" />
                   <span className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">Ação Foco de Hoje</span>
                 </div>
                 <h3 className="text-white font-black text-2xl md:text-3xl leading-tight tracking-tight mb-4">{latestDiagnosis.actionPlan.todayAction.title}</h3>
                 <p className="text-indigo-100/90 text-sm font-medium leading-relaxed mb-8">{latestDiagnosis.actionPlan.todayAction.why}</p>
                 <button 
                   onClick={() => navigate('/' + latestDiagnosis.actionPlan.todayAction.moduleToUse)}
                   className="w-full py-4 bg-white text-indigo-900 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
                 >
                   Executar Agora <ArrowRight className="w-4 h-4" />
                 </button>
               </div>
             ) : (
               <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] flex flex-col items-start justify-center gap-6">
                 <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
                   <Presentation className="w-6 h-6 text-zinc-500" />
                 </div>
                 <div>
                   <p className="text-white font-black uppercase tracking-tighter text-xl mb-2">Comece o Diagnóstico</p>
                   <p className="text-zinc-500 font-medium text-sm leading-relaxed">Avalie o cenário de hoje no seu negócio e receba um plano prático com roteiros prontos sobre o que fazer agora.</p>
                 </div>
                 <button onClick={() => navigate('/consultor/diagnostico')} className="px-6 py-4 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition-all flex justify-between items-center w-full shadow-lg">
                   <span>Gerar Diagnóstico Foco</span>
                   <Sparkles className="w-4 h-4 text-amber-500" />
                 </button>
               </div>
             )}

             <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 md:p-8 rounded-[2rem] flex flex-col">
               <div className="flex items-center gap-2 mb-4">
                 <AlertTriangle className="w-4 h-4 text-zinc-500" />
                 <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Resolução de Impasses</span>
               </div>
               <p className="text-white font-black uppercase tracking-tighter text-2xl mb-3">Trava Específica?</p>
               <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-auto">Os clientes estão achando caro? Lançamento não converteu? O calendário não flui? Mostre à IA onde a corda arrebentou e ela dirá como consertar.</p>
               
               <button onClick={() => navigate('/consultor/problemas')} className="mt-8 bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-zinc-700 transition flex justify-between items-center group">
                 <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest group-hover:text-white transition-colors">Diagnosticar Problema Específico</span>
                 <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
               </button>
             </div>
           </div>
        </div>
        
        {/* Module Health Check */}
        <div className="lg:col-span-4 bg-zinc-900/20 border border-zinc-800/40 rounded-[3rem] p-6 md:p-8 flex flex-col shadow-inner">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
               <Activity className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-white font-black uppercase tracking-tight text-lg leading-none">Contexto</h2>
              <p className="text-zinc-500 font-bold text-[9px] uppercase tracking-widest">Base de Dados da IA</p>
            </div>
          </div>
          
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <ModuleCard 
              title="DNA Comercial" 
              count={businessDNA?.id || user?.businessProfile ? 1 : 0} 
              path="/dna-comercial" 
              emptyText="Vazio - Preencha urgente" 
              filledText="Identidade Ativa" 
              icon={Target} 
            />
            <ModuleCard 
              title="Máquina de Ofertas" 
              count={summary?.offersCount || 0} 
              path="/ofertas" 
              emptyText="Nenhuma oferta mapeada"
              filledText={summary?.offersCount === 1 ? "1 oferta validada" : `${summary?.offersCount} ofertas ativas`}
              icon={Zap} 
            />
            <ModuleCard 
              title="Campanhas" 
              count={summary?.campaignsCount || 0} 
              path="/campanhas" 
              emptyText="Sem histórico de comunicação"
              filledText={`${summary?.campaignsCount} narrativas criadas`}
              icon={Sparkles} 
            />
            <ModuleCard 
              title="Calendários" 
              count={summary?.calendarsCount || 0} 
              path="/calendario" 
              emptyText="Sem planejamento definido"
              filledText={`${summary?.calendarsCount} roteiros organizados`}
              icon={Activity} 
            />
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800/50">
             <p className="text-zinc-500 font-medium text-xs text-center leading-relaxed">
               A qualidade do seu consultor aumenta proporcionalmente ao uso dos outros módulos.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ title, count, path, emptyText = "0 cadastrados", filledText, icon: Icon }: any) {
  const navigate = useNavigate();
  const isFilled = count > 0;
  
  return (
    <div 
      onClick={() => navigate(path)} 
      className={cn(
        "bg-zinc-950/80 border p-4 lg:p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all relative overflow-hidden group",
        isFilled ? "border-zinc-800 hover:border-indigo-500/30" : "border-rose-900/30 hover:border-rose-500/50"
      )}
    >
        {isFilled && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
        {!isFilled && <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-100" />}

        <div className="flex items-center gap-4 relative z-10">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-colors",
            isFilled ? "bg-zinc-900 border border-zinc-800 group-hover:bg-zinc-800" : "bg-rose-950/50 border border-rose-900/30"
          )}>
            <Icon className={cn("w-4 h-4", isFilled ? "text-zinc-400 group-hover:text-amber-500" : "text-rose-500")} />
          </div>
          <div>
             <h3 className="text-white font-black uppercase text-[10px] tracking-widest">{title}</h3>
             <p className={cn("text-[11px] font-medium mt-0.5", isFilled ? "text-zinc-500" : "text-rose-400/80")}>
               {isFilled ? filledText : emptyText}
             </p>
          </div>
        </div>
        
        {!isFilled && (
          <div className="absolute right-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
          </div>
        )}
        {isFilled && (
          <div className="absolute right-5 text-zinc-700 group-hover:text-indigo-400 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
    </div>
  );
}
