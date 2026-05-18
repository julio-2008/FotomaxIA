import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Target, 
  Zap, 
  Smartphone,
  Fingerprint,
  Edit3,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Network
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { calculateProfileScore } from '../services/businessInsights';
import { cn } from '../lib/utils';
import { aiCore } from '../services/aiCore';
import { StrategyNexus } from '../components/StrategyNexus';

export function DNACenter() {
  const navigate = useNavigate();
  const { user, incrementUsage } = useStorage();
  
  const profile = user?.businessProfile;
  const hasDNA = !!profile;
  const score = profile ? calculateProfileScore(profile) : 0;
  
  const missingProduct = !profile?.highestProfitProduct;
  const missingObjection = !profile?.customerObjections;
  const missingDifferential = !profile?.uniqueSellingPoint;
  const missingChannel = !profile?.mainSalesChannel;

  let scoreLabel = 'Fraco';
  if (score > 80) scoreLabel = 'Forte';
  else if (score > 60) scoreLabel = 'Bom';
  else if (score > 30) scoreLabel = 'Básico';

  const [improving, setImproving] = React.useState(false);

  const handleImproveWithAI = async () => {
     setImproving(true);
     try {
        const result = await aiCore.run('dna_recommendations', {
           businessProfile: profile
        });
        if (result.success) {
           alert("Sugestão da IA gerada no console (você pode integrar isto em um modal no futuro).");
           // Console log removido por segurança
           incrementUsage('consultor_question');
        } else {
           alert("Erro ao usar IA: " + result.error);
        }
     } catch(e) {
        alert("Erro ao acessar aiCore");
     } finally {
        setImproving(false);
     }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32 animate-fade-in px-4 md:px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-16 pt-12">
        {/* Brand Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10">
          <div className="space-y-6">
            <div className="space-y-2 text-center lg:text-left mx-auto lg:mx-0 flex flex-col items-center lg:items-start">
              <span className="text-editorial-label text-brand-yellow/50">Business Profile Sync / v1.5</span>
              <h1 className="text-3xl lg:text-6xl xl:text-8xl text-white italic tracking-tighter uppercase font-black leading-[0.85]">
                DNA <br /> <span className="text-brand-yellow text-glow">COMERCIAL</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/10" />
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic leading-relaxed max-w-sm">
                THE STRATEGIC CORE OF YOUR OPERATION. PRODUCT, AUDIENCE AND DIFFERENTIALS. 
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/dna-comercial/onboarding')}
            className="h-24 w-full md:h-28 lg:w-48 bg-white text-black flex flex-col items-center justify-center hover:bg-brand-yellow transition-all group gap-2"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">{hasDNA ? 'EDIT PROFILE' : 'CREATE DNA'}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </header>

        {!hasDNA ? (
          <div className="bg-black border border-white/5 p-8 md:p-20 text-center space-y-12 relative overflow-hidden group">
             <div className="absolute inset-0 bg-brand-yellow/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <Fingerprint className="w-32 h-32 text-zinc-900 mx-auto group-hover:text-brand-yellow transition-colors relative z-10" />
             <div className="space-y-6 relative z-10 flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl text-white italic uppercase tracking-tighter leading-none font-black">CONFIGURAÇÃO REQUERIDA</h2>
                <p className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] leading-relaxed max-w-sm md:max-w-md mx-auto">
                  BEFORE GENERATING OFFERS OR CAMPAIGNS, YOU MUST SYNC YOUR BUSINESS ESSENCE WITH THE CORTEX.
                </p>
             </div>
             <button 
              onClick={() => navigate('/dna-comercial/onboarding')}
              className="bg-brand-yellow text-black px-6 md:px-12 md:px-16 py-5 md:py-6 font-black uppercase italic tracking-widest text-[10px] md:text-xs hover:bg-white transition-all relative z-10 mx-auto"
            >
              INITIALIZE SYNC
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-[1px] bg-white/5 border border-white/5 overflow-hidden">
             {/* Sidebar Analytics */}
             <aside className="lg:col-span-4 bg-black p-6 md:p-12 space-y-12 lg:border-r border-white/5">
                <div className="space-y-10 text-center">
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">NEURAL AUDIT SCORE</span>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-56 h-56 -rotate-90">
                      <circle className="text-zinc-950" strokeWidth="2" stroke="currentColor" fill="transparent" r="90" cx="112" cy="112" />
                      <circle 
                        className={cn("transition-all duration-[2000ms] ease-editorial", score > 60 ? "text-brand-yellow" : "text-red-600")}
                        strokeWidth="12" 
                        strokeDasharray={565.5}
                        strokeDashoffset={565.5 - (565.5 * score) / 100}
                        strokeLinecap="butt" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="90" cx="112" cy="112" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0">
                       <span className="text-4xl md:text-7xl font-black italic tracking-tighter text-white leading-none">{score}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-800">PERCENT</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className={cn("text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none", score > 60 ? "text-brand-yellow" : "text-red-600")}>{scoreLabel.toUpperCase()} STRENGTH</h4>
                    {score < 60 && (
                       <p className="text-red-900 text-[10px] font-black uppercase tracking-widest leading-tight">
                         DNA FRAGMENTS DETECTED. RECALIBRATION RECOMMENDED.
                       </p>
                    )}
                  </div>
                </div>

                {/* Status List */}
                <div className="space-y-6 pt-12 border-t border-white/5">
                   <div className="flex items-center justify-between">
                     <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-700 italic">SYSTEM DIAGNOSTIC</span>
                     <div className="flex gap-1">
                        <div className="w-1 h-1 bg-brand-yellow animate-pulse" />
                        <div className="w-1 h-1 bg-brand-yellow animate-pulse delay-75" />
                     </div>
                   </div>
                   
                   <div className="space-y-[1px] bg-white/5 border border-white/5">
                      {[
                        { show: missingObjection, msg: 'Objeções não mapeadas' },
                        { show: missingDifferential, msg: 'Diferencial indefinido' },
                        { show: missingProduct, msg: 'Falta produto estrela' },
                        { show: missingChannel, msg: 'Canal de vendas não definido' },
                      ].map((item, i) => item.show ? (
                        <div key={i} className="flex items-center gap-4 p-5 bg-black">
                           <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                           <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest italic">{item.msg}</span>
                        </div>
                      ) : null)}
                      
                      {!missingObjection && !missingDifferential && !missingProduct && !missingChannel && (
                        <div className="flex items-center gap-4 p-5 bg-black">
                           <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />
                           <span className="text-[10px] text-brand-yellow font-black uppercase tracking-widest italic">STRATEGY SYNCHRONIZED</span>
                        </div>
                      )}
                   </div>

                   <button 
                    onClick={handleImproveWithAI}
                    disabled={improving}
                    className="w-full bg-zinc-950 border border-white/5 text-zinc-500 font-black uppercase italic text-[10px] tracking-widest py-5 hover:bg-white hover:text-black transition-all disabled:opacity-50 mt-6"
                   >
                     {improving ? 'PROCESSING LOGIC...' : 'OPTIMIZE CORE AI'}
                   </button>
                </div>
             </aside>

             {/* Data Grid */}
             <main className="lg:col-span-8 bg-zinc-950 space-y-[1px]">
                <div className="bg-black p-6 md:p-12 space-y-12">
                   <div className="flex justify-between items-end border-b border-white/5 pb-8">
                     <div className="space-y-4">
                       <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 italic">SYSTEM MAPPING</span>
                       <h3 className="text-editorial-h3 text-white italic uppercase tracking-tighter leading-none">NEXUS VISUAL</h3>
                     </div>
                     <Network className="w-6 h-6 text-brand-yellow/30" />
                   </div>

                   <StrategyNexus profile={profile} />
                               <div className="bg-black p-8 md:p-6 md:p-12 space-y-12 border-t border-white/5">
                   <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-white/5 pb-8 gap-4 text-center md:text-left">
                     <div className="space-y-4">
                       <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 italic block">COMMERCIAL SUMMARY</span>
                       <h3 className="text-3xl md:text-4xl lg:text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">DADOS ESTRUTURAIS</h3>
                     </div>
                     <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-yellow italic hidden md:block">OPERATIONAL DATA SYNCED</span>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/5 border border-white/5">
                     {[
                       { label: 'CORPORATION', val: profile.businessName },
                       { label: 'NICHE PROTOCOL', val: `${profile.businessType} / ${profile.niche}` },
                       { label: 'GEO LOCATION', val: `${profile.city} - ${profile.neighborhood}` },
                       { label: 'PRIME PRODUCT', val: profile.bestSellerProduct },
                       { label: 'AVATAR PROFILE', val: profile.targetAudience },
                       { label: 'UNIQUE USP', val: profile.whatCustomersValueMost },
                       { label: 'COMM CHANNEL', val: profile.mainSalesChannel },
                       { label: 'MISSION PRIORITY', val: profile.currentPriority?.replace('_', ' ') },
                     ].map((item, i) => (
                       <div key={i} className="bg-black p-10 space-y-4 hover:bg-zinc-950 transition-all group text-center md:text-left">
                         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-800 group-hover:text-brand-yellow/50 transition-colors italic block">{item.label}</span>
                         <p className="text-xs font-black text-white uppercase italic tracking-widest truncate max-w-full">{item.val || 'SYSTEM NULL'}</p>
                       </div>
                     ))}
                   </div>

                   <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row gap-8 items-center justify-between text-center md:text-left">
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-1.5 h-1.5 bg-brand-yellow animate-ping" />
                        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] max-w-sm italic leading-relaxed">
                          STRATEGIC CYCLE ACTIVE: CORE SYSTEM READY FOR OFFER GENERATION.
                        </p>
                     </div>
                     <button 
                       onClick={() => navigate('/ofertas')}
                       className="h-16 px-6 md:px-12 w-full md:w-auto bg-white text-black font-black uppercase italic tracking-widest text-[10px] md:text-xs hover:bg-brand-yellow transition-all whitespace-nowrap"
                     >
                       DEPLOY OFFER ENGINE
                     </button>
                   </div>    </div>
                </div>
             </main>
          </div>
        )}
      </div>
    </div>
  );
}
