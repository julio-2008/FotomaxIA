import React from 'react';
import { 
  BarChart3, 
  Target, 
  Zap, 
  MessageSquare, 
  Users, 
  DollarSign, 
  ArrowRight,
  Edit3,
  FileText,
  Download,
  Upload,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { calculateProfileScore, getProfileLevel } from '../../services/businessInsights';
import { motion } from 'motion/react';

export function DNAHome() {
  const navigate = useNavigate();
  const { user, exportBusinessProfile, importBusinessProfile } = useStorage();
  const profile = user?.businessProfile;
  const score = profile ? calculateProfileScore(profile) : 0;
  const level = getProfileLevel(score);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (importBusinessProfile(text)) {
          alert('DNA Comercial importado com sucesso!');
        } else {
          alert('Erro ao importar. Verifique o arquivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  const getLevelColor = (l: string) => {
    switch(l) {
      case 'estrategico': return 'text-amber-500';
      case 'forte': return 'text-green-500';
      case 'bom': return 'text-blue-500';
      case 'basico': return 'text-zinc-400';
      default: return 'text-red-500';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">DNA Comercial</h1>
          <p className="text-zinc-500 font-medium">A inteligência estratégica por trás das suas campanhas.</p>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2 hover:bg-zinc-800 transition-all text-zinc-400">
            <Upload className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Importar</span>
            <input type="file" className="hidden" accept=".json" onChange={handleImport} />
          </label>
          <button 
            onClick={exportBusinessProfile}
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2 hover:bg-zinc-800 transition-all text-zinc-400"
          >
            <Download className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Exportar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Score Card */}
        <div className="md:col-span-4 bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
             <motion.div 
               className="h-full bg-amber-500"
               initial={{ width: 0 }}
               animate={{ width: `${score}%` }}
               transition={{ duration: 1.5 }}
             />
          </div>

          <div className="relative mb-8">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-zinc-800"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * score) / 100}
                className="text-amber-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{score}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Score</span>
            </div>
          </div>

          <p className={cn("text-xl font-black uppercase tracking-tighter mb-2 italic", getLevelColor(level))}>
            Perfil {level.replace('_', ' ')}
          </p>
          <p className="text-zinc-500 text-xs font-medium mb-8 max-w-[200px]">
            {score < 50 
              ? 'Seu perfil está raso. Suas campanhas podem sair genéricas demais.' 
              : 'Seu perfil está sólido! A IA gera textos muito mais persuasivos assim.'}
          </p>

          <button 
            onClick={() => navigate('/perfil-comercial/onboarding')}
            className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
          >
            <Edit3 className="w-4 h-4" /> {profile ? 'Melhorar DNA' : 'Criar DNA Comercial'}
          </button>
        </div>

        {/* Diagnostic & Info */}
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-amber-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 md:p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Zap className="w-48 h-48" />
            </div>
            
            <div>
              <div className="bg-amber-500/10 w-fit px-4 py-1.5 rounded-full border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
                Inteligência Comercial
              </div>
              <h2 className="text-3xl font-black text-white leading-tight mb-4 uppercase italic">Diagnóstico <br /> Estratégico</h2>
              <p className="text-zinc-500 text-sm font-medium mb-8 max-w-sm">
                Analise os pontos fortes e riscos do seu negócio com base nos dados do seu DNA Comercial.
              </p>
            </div>

            <button 
              onClick={() => navigate('/perfil-comercial/diagnostico')}
              disabled={!profile}
              className={cn(
                "w-fit px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all",
                profile ? "bg-amber-500 text-black hover:bg-amber-400 shadow-xl shadow-amber-500/10" : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
              )}
            >
              Ver Diagnóstico Completo <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-zinc-700 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-inner">
                  <Target className="w-6 h-6 text-zinc-500" />
                </div>
                {!profile?.uniqueSellingPoint && <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Diferencial</p>
                <p className="text-sm font-bold text-zinc-300">
                  {profile?.uniqueSellingPoint || 'Não definido'}
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-zinc-700 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-inner">
                  <MessageSquare className="w-6 h-6 text-zinc-500" />
                </div>
                {!profile?.brandTone && <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Tom de Voz</p>
                <p className="text-sm font-bold text-zinc-300 uppercase italic">
                  {profile?.brandTone || 'Não definido'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist de Completude */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10">
        <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-3">
          <ShieldCheck className="text-amber-500 w-6 h-6" /> Próximos Passos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StepItem 
            title="Dados Básicos" 
            done={!!(profile?.businessName && profile?.city)} 
            desc="Cidade, bairro e canais de contato."
          />
          <StepItem 
            title="Mix de Produtos" 
            done={!!(profile?.bestSellerProduct && profile?.highestProfitProduct)} 
            desc="O que dá giro vs o que dá lucro."
          />
          <StepItem 
            title="Avatar do Cliente" 
            done={!!(profile?.targetAudience && profile?.customerPainPoints)} 
            desc="Dores, desejos e objeções reais."
          />
          <StepItem 
            title="Posicionamento" 
            done={!!(profile?.uniqueSellingPoint && profile?.pricePositioning)} 
            desc="Por que escolher você e não o outro."
          />
          <StepItem 
            title="Manual Verbal" 
            done={!!(profile?.brandTone && profile?.wordsToUse)} 
            desc="Palavras que vendem seu negócio."
          />
          <StepItem 
            title="Foco da Semana" 
            done={!!(profile?.currentPriority)} 
            desc="Qual meta queremos bater hoje."
          />
        </div>
      </div>
    </div>
  );
}

function StepItem({ title, done, desc }: { title: string, done: boolean, desc: string }) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate('/perfil-comercial/onboarding')}
      className={cn(
        "p-6 rounded-[2rem] border transition-all cursor-pointer group",
        done ? "bg-green-500/5 border-green-500/20" : "bg-zinc-950 border-zinc-800 hover:border-amber-500/30"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className={cn("text-xs font-black uppercase tracking-widest", done ? "text-green-500" : "text-zinc-500")}>{title}</h4>
        {done ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-amber-500" />}
      </div>
      <p className="text-xs text-zinc-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
