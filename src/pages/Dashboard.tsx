import React from 'react';
import { 
  TrendingUp, 
  Zap, 
  Instagram, 
  MessageCircle, 
  ArrowRight,
  Sparkles,
  Layout,
  Clock,
  ChevronRight,
  Fingerprint,
  Target,
  Rocket,
  Calendar,
  Palette,
  Library,
  Brain,
  BarChart3,
  Flame,
  CheckCircle2,
  Circle,
  RefreshCw,
  Star,
  Settings
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { ActivationChecklist } from '../components/ActivationChecklist';
import { GuidedTour } from '../components/GuidedTour';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { calculateProfileScore } from '../services/businessInsights';
import { usageGuard } from '../services/usageGuard';
import { BUSINESS_KITS, BusinessNiche } from '../lib/data/businessKits';
import { OpportunityRadar } from '../components/OpportunityRadar';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, campaigns, offers, history, settings, saveUser } = useStorage() as any;
  const dna = user?.businessDNA || user?.businessProfile;

  // Get niche from business DNA or Profile
  const businessNiche: BusinessNiche = dna?.basics?.businessType || dna?.businessType || 'outro';
  const kit = BUSINESS_KITS[businessNiche] || BUSINESS_KITS.outro;
  const actions = kit.actions;

  const [showTour, setShowTour] = React.useState(false);

  React.useEffect(() => {
    if (user && !user.tourCompleted && !user.tourSkipped && campaigns?.length === 0) {
      setShowTour(true);
    }
  }, [user, campaigns]);

  const handleTourComplete = () => {
    setShowTour(false);
    saveUser({ ...user, tourCompleted: true });
  };

  let usageText = '';
  let usageLabel = '';
  let progress = 0;
  
  if (user) {
    const summary = usageGuard.getUsageSummary(user);
    usageText = summary.text;
    usageLabel = summary.label;
    
    if (user.plan === 'trial') {
      const used = user.usage?.trialUsed ? 1 : 0;
      progress = used ? 100 : 0;
    } else {
      const limits = usageGuard.getPlanLimits(user.plan);
      const used = (user.usage?.monthlyCreditsUsed || 0) + (user.usage?.extraCreditsUsed || 0);
      const limit = limits.totalCredits + (user.usage?.extraCreditsLimit || 0);
      progress = Math.min((used / limit) * 100, 100);
    }
  }

  const profileScore = user?.businessDNA ? calculateProfileScore(user.businessDNA) : 0;
  const hasDNA = profileScore > 30;
  const hasOffer = offers && offers.length > 0;
  const hasCampaign = campaigns && campaigns.length > 0;

  return (
    <div className="min-h-screen bg-black text-white pb-32 animate-fade-in px-4 md:px-6 md:px-12">
      {showTour && <GuidedTour onComplete={handleTourComplete} />}
      
      <div className="max-w-[1440px] mx-auto space-y-24 pt-12">
        {/* Brand Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:p-12 border-b border-white/5 pb-10">
            <div className="space-y-8 text-center lg:text-left mx-auto lg:mx-0 flex flex-col items-center lg:items-start">
              <div className="space-y-0">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse" />
                  <span className="text-editorial-label text-brand-yellow/50 tracking-[0.2em]">Sistema Ativo & Conectado</span>
                </div>
                <h1 className="text-3xl lg:text-7xl xl:text-8xl text-white italic uppercase tracking-tighter leading-[0.85] font-black mt-4">
                  O QUE VAMOS <br /> <span className="text-brand-yellow text-glow">VENDER HOJE?</span>
                </h1>
              </div>
              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="h-px w-20 bg-white/10" />
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Sua infraestrutura de marketing comercial.</p>
              </div>
            </div>
            
            <div 
              onClick={() => navigate('/uso')}
              className="w-full lg:w-96 bg-zinc-950 p-[1px] group cursor-pointer relative overflow-hidden transition-all hover:bg-white/5"
            >
              <div className="bg-black p-6 md:p-12 space-y-10 relative z-10 border border-white/5 group-hover:border-brand-yellow/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-editorial-label text-zinc-700">POTENCIAL DE USO</span>
                    <div className="flex gap-1.5 justify-center lg:justify-start">
                      <div className="w-1 h-1 bg-brand-yellow" />
                      <div className="w-1 h-1 bg-brand-yellow/20" />
                    </div>
                  </div>
                  {user?.plan === 'trial' && (
                    <span className="text-[8px] border border-brand-yellow/50 text-brand-yellow px-2 py-0.5 font-black uppercase tracking-widest bg-brand-yellow/5">BETA TESTER</span>
                  )}
                </div>

                <div className="flex items-baseline gap-3">
                   <span className="text-4xl md:text-6xl font-black italic tracking-tighter text-white leading-none">
                     {usageText.split(' ')[0]}
                   </span>
                   <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">{usageText.split(' ')[1] || 'CRÉDITOS'}</span>
                </div>
                
                <div className="w-full h-1.5 bg-zinc-900 relative">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000 relative",
                      progress > 80 ? "bg-red-600" : "bg-brand-yellow shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                    )} 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
              
              {/* Background GLOW for resource card */}
              <div className="absolute inset-0 bg-brand-yellow/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>

        {/* Opportunity Radar - Futuristic Feature */}
        <section className="animate-reveal" style={{ animationDelay: '0.2s' }}>
          <OpportunityRadar />
        </section>

        {/* Primary Action - First Victory */}
        {!hasCampaign && (
          <div className="bg-brand-yellow border-[10px] border-black p-6 md:p-12 lg:p-24 relative overflow-hidden group shadow-[0_0_150px_rgba(250,204,21,0.1)]">
            <div className="absolute inset-0 bg-[radial-gradient(#000000_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10" />
            <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-6 transition-all duration-1000 hidden lg:block pointer-events-none">
               <Zap className="w-96 h-96 text-black" />
            </div>
            <div className="relative z-10 max-w-4xl space-y-12">
               <div className="inline-flex items-center gap-4 bg-black text-brand-yellow px-6 py-2.5 text-xs font-black uppercase tracking-[0.4em]">
                  <Sparkles className="w-5 h-5 animate-spin-slow" /> AÇÃO IMEDIATA RECOMENDADA
               </div>
               <h2 className="text-3xl lg:text-7xl xl:text-8xl text-black leading-[0.8] uppercase font-black tracking-tighter">
                  ATIVE SUA <br /> PRIMEIRA <span className="underline decoration-white decoration-[12px] underline-offset-[-4px] italic">ESTRATÉGIA</span>.
               </h2>
               <p className="text-lg md:text-2xl lg:text-3xl font-black text-black leading-tight uppercase italic max-w-2xl tracking-tight opacity-80 mx-auto lg:mx-0">
                  Seu motor comercial está pronto. Vamos gerar seu primeiro conjunto de ofertas agora.
               </p>
               <button 
                 onClick={() => navigate('/primeira-vitoria')}
                 className="h-24 px-16 bg-black text-white hover:bg-white hover:text-black transition-all font-black uppercase tracking-[0.2em] italic text-lg border-4 border-black group/btn inline-flex items-center gap-6"
               >
                 COMEÇAR AGORA <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-3 transition-transform" />
               </button>
            </div>
          </div>
        )}

        {/* DNA Alert - Refined */}
        {profileScore < 30 && (
          <div className="bg-black border border-white/5 p-10 lg:p-6 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-6 md:p-12 group relative overflow-hidden transition-all hover:bg-zinc-950">
            <div className="absolute -left-10 top-0 h-full w-2 bg-brand-yellow group-hover:left-0 transition-all duration-700" />
            <div className="flex flex-col lg:flex-row items-center gap-6 md:p-12 w-full lg:w-auto text-center lg:text-left">
              <div className="w-24 h-24 bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-yellow transition-all duration-700 relative">
                <div className="absolute inset-0 bg-brand-yellow opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                <Fingerprint className="text-white group-hover:text-black w-10 h-10 relative z-10 transition-colors" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <span className="text-[10px] font-black uppercase text-brand-yellow tracking-[0.5em] italic">Configuração Pendente</span>
                </div>
                <h3 className="text-3xl lg:text-6xl xl:text-7xl font-black uppercase italic tracking-tighter text-white leading-none">DNA DO SEU NEGÓCIO</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg italic">
                  Sincronize a inteligência comercial para desbloquear resultados reais. 
                  Sem o DNA, sua IA está operando apenas com 12% do potencial.
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/dna-comercial')}
              className="h-20 px-20 bg-white text-black font-black uppercase italic tracking-widest text-sm hover:bg-brand-yellow transition-all w-full lg:w-auto"
            >
              CONFIGURAR AGORA
            </button>
          </div>
        )}

        {/* Operational Modules - Grids with high contrast */}
        <section className="space-y-16 animate-reveal" style={{ animationDelay: '0.4s' }}>
           <div className="flex flex-col items-center lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-10 text-center lg:text-left">
              <div className="space-y-4">
                 <span className="text-editorial-label text-brand-yellow/50 tracking-[0.5em] md:tracking-[1em]">SYSTEM MODULES</span>
                 <h2 className="text-4xl lg:text-7xl xl:text-8xl text-white italic uppercase font-black tracking-tighter leading-none">CORE ACTIONS</h2>
              </div>
              <div className="flex items-center justify-center gap-6 h-full">
                <div className="h-24 w-px bg-white/5 hidden lg:block" />
                <p className="text-[10px] font-black text-zinc-700 italic uppercase tracking-[0.5rem] leading-tight max-w-[200px]">
                  BEYOND MARKETING. <br /> PURE COMMERCIAL <br /> ARCHITECTURE.
                </p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 border border-white/5 group/grid">
              {actions.map((action: any, i: number) => (
                <div 
                  key={i}
                  onClick={() => navigate(action.path)} 
                  className="group bg-black p-6 md:p-12 space-y-16 border border-white/5 relative transition-all hover:bg-white cursor-pointer overflow-hidden flex flex-col justify-between min-h-[400px] text-center md:text-left"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 translate-x-12 group-hover:translate-x-0 group-hover:rotate-0 rotate-12 transition-all duration-700 pointer-events-none">
                    <action.icon className="w-64 h-64 text-white group-hover:text-black transition-colors" />
                  </div>

                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-500">
                      <action.icon className={cn("w-7 h-7 transition-colors", 
                        action.color.replace('text-', 'group-hover:text-')
                      )} />
                    </div>
                    <span className="text-[10px] font-black italic text-zinc-800 group-hover:text-black/20 transition-colors">VERSION_4.0</span>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black text-brand-yellow group-hover:text-black/40 transition-colors">0{i+1} PROTO START</span>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white group-hover:text-black uppercase italic tracking-tighter leading-[0.9] transition-colors">{action.title}</h3>
                    </div>
                    <p className="text-xs text-zinc-500 group-hover:text-black/60 font-bold uppercase tracking-widest leading-relaxed transition-colors border-l border-white/10 group-hover:border-black/10 pl-6">
                      {action.desc}
                    </p>
                  </div>
                  
                  <div className="h-[2px] w-0 bg-brand-yellow group-hover:w-full transition-all duration-500 absolute bottom-0 left-0" />
                </div>
              ))}
           </div>
        </section>

        {/* Global Trend Radar */}
        <section className="space-y-16 animate-reveal" style={{ animationDelay: '0.6s' }}>
           <div className="flex flex-col md:flex-row items-center gap-6 border-b border-white/5 pb-10 text-center md:text-left">
              <div className="w-1.5 h-1.5 bg-brand-yellow hidden md:block" />
              <div className="space-y-2 mx-auto md:mx-0">
                <span className="text-editorial-label text-zinc-700 tracking-[0.4em]">MARKET PULSE</span>
                <h2 className="text-4xl lg:text-7xl xl:text-8xl text-white italic uppercase font-black tracking-tighter leading-none">MACRO TRENDS</h2>
              </div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1px] bg-white/10 border border-white/5 box-shadow-2xl">
              {[
                { 
                  icon: Flame, 
                  title: 'VÍDEOS CURTOS', 
                  color: 'text-orange-500', 
                  score: '9.8', 
                  desc: 'FORMATOS DE 7-12 SEGUNDOS COM ÁUDIOS DE RETENÇÃO ESTÃO CONVERTENDO 3X MAIS HOJE.', 
                  action: '/criativos/prompts', 
                  btn: 'USAR AGORA' 
                },
                { 
                  icon: Target, 
                  title: 'OFERTAS BUNDLE', 
                  color: 'text-brand-yellow', 
                  score: 'STRAT VAL', 
                  desc: 'AGRUPAR BÔNUS DE BAIXO CUSTO PERCEBIDO ESTÁ REDUZINDO OBJEÇÃO DE PREÇO NO SEU NICHO.', 
                  action: '/ofertas/nova', 
                  btn: 'MONTAR COMBO' 
                },
                { 
                  icon: MessageCircle, 
                  title: 'BR COPY LOCAL', 
                  color: 'text-green-500', 
                  score: 'SCORE 88', 
                  desc: 'TEXTOS MAIS INFORMAIS E COM GÍRIAS REGIONAIS ESTÃO GERANDO 40% MAIS CLIQUES EM 2026.', 
                  action: '/campanhas', 
                  btn: 'CALIBRAR COPY' 
                },
              ].map((trend, i) => (
                <div key={i} className="bg-black p-6 md:p-12 space-y-12 relative overflow-hidden group hover:bg-zinc-950 transition-all duration-500 border border-white/5">
                   <div className="flex justify-between items-start">
                      <trend.icon className={cn("w-12 h-12 transition-all duration-700 group-hover:scale-125 group-hover:rotate-6", trend.color)} />
                      <span className={cn("text-[10px] font-black uppercase tracking-[0.5em] px-4 py-2 border transition-all", 
                        trend.color.replace('text-', 'border-').replace('text-', 'text-'))}>
                        {trend.score}
                      </span>
                   </div>
                   <div className="space-y-8 text-center md:text-left">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black italic text-white uppercase tracking-tighter leading-[0.8] transition-colors group-hover:text-brand-yellow">{trend.title}</h3>
                      <p className="text-xs text-zinc-500 font-black uppercase tracking-[0.2em] leading-relaxed italic border-l-2 border-zinc-900 group-hover:border-brand-yellow transition-colors pl-6 text-left">
                        {trend.desc}
                      </p>
                   </div>
                   <div className="pt-10 border-t border-white/5">
                      <Link to={trend.action} className="text-brand-yellow font-black text-xs uppercase tracking-[0.4em] hover:text-white transition-all flex items-center gap-4 group/link">
                        <Zap className="w-5 h-5 group-hover/link:animate-bounce" /> {trend.btn}
                      </Link>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Secondary Navigation - Sharp horizontal strip */}
        <section className="pt-24 animate-reveal" style={{ animationDelay: '0.8s' }}>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-[1px] bg-white/5 border border-white/5 overflow-hidden">
            {[
              { icon: Brain, title: 'Consultor', path: '/consultor' },
              { icon: BarChart3, title: 'Resultados', path: '/resultados' },
              { icon: Library, title: 'Biblioteca', path: '/biblioteca' },
              { icon: Calendar, title: 'Agenda', path: '/calendario' },
              { icon: Settings, title: 'Perfil', path: '/settings' },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => navigate(item.path)} 
                className="bg-black py-16 flex flex-col items-center justify-center gap-6 cursor-pointer group hover:bg-zinc-950 transition-all border border-white/5"
              >
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-yellow group-hover:rotate-12 transition-all duration-500">
                    <item.icon className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors" />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 group-hover:text-white transition-colors">{item.title}</span>
                  </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
