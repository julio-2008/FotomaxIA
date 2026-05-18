import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Rocket, 
  ShieldCheck, 
  Database, 
  CreditCard,
  Zap,
  Smartphone,
  MessageSquare,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { useStorage } from '../hooks/useStorage';
import { getEnvironmentStatus } from '../lib/config/envValidator';
import { Link } from 'react-router-dom';

export function AdminReadiness() {
  const { user } = useStorage();
  const envStatus = getEnvironmentStatus();

  const sections = [
    {
      title: "Configuração de Ambiente",
      icon: ShieldCheck,
      items: [
        { label: "APP_ENV (beta/production)", status: import.meta.env.VITE_APP_ENV === 'production' ? 'ready' : 'warning' },
        { label: "GEMINI_API_KEY", status: envStatus.ai.ready ? 'ready' : 'danger' },
        { label: "FIREBASE_CONFIG", status: envStatus.firebase.ready ? 'ready' : 'danger' },
        { label: "STRIPE_KEY (Pagamento)", status: envStatus.stripe.ready ? 'ready' : 'info' },
        { label: "DATABASE_PROVIDER", status: envStatus.databaseProvider === 'firebase' ? 'ready' : 'warning' }
      ]
    },
    {
      title: "Produto & Fluxo",
      icon: Rocket,
      items: [
        { label: "Onboarding -> DNA -> Campanha", status: "ready" },
        { label: "Linguagem Local (sem lead/copy)", status: "ready" },
        { label: "Empty States orientativos", status: "ready" },
        { label: "Trial bloqueando real (1 uso)", status: "ready" },
        { label: "Mobile Polish (Formulários/Cards)", status: "ready" }
      ]
    },
    {
      title: "Segurança & Dados",
      icon: Database,
      items: [
        { label: "usageGuard antes de cada chamada IA", status: "ready" },
        { label: "Isolamento de dados por Usuário", status: "ready" },
        { label: "Admin Route protection", status: "ready" },
        { label: "Logs técnicos ocultos para usuário", status: "ready" }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'danger': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <AlertCircle className="w-5 h-5 text-zinc-500" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-zinc-800" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black title-display italic uppercase tracking-tighter">
            Status de <span className="text-amber-500">Publicação</span>
          </h1>
          <p className="text-zinc-500 font-medium font-mono text-xs">V1.0.0-BETA | AMBIENTE: {import.meta.env.VITE_APP_ENV?.toUpperCase() || 'DEVELOPMENT'}</p>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/admin/config"
            className="bg-zinc-800 text-white px-6 py-2 rounded-full border border-zinc-700 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configuração
          </Link>
          <div className="bg-amber-500/10 text-amber-500 px-6 py-2 rounded-full border border-amber-500/20 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 fill-amber-500" />
            Beta Controlado
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-950/50 border border-zinc-800 rounded-[3rem] p-8 space-y-6"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                <section.icon className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-[1.5rem] group hover:bg-zinc-900 transition-colors">
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-100 transition-colors">{item.label}</span>
                  {getStatusIcon(item.status)}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] p-10 space-y-6 relative overflow-hidden">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Próximos Passos Críticos</h2>
        <ul className="space-y-4 text-zinc-400 font-medium list-none">
          <li className="flex items-start gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
             <span>Configurar as chaves reais de Imagem e Stripe para remover o status de "Locked".</span>
          </li>
          <li className="flex items-start gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
             <span>Validar o webhook de pagamento em ambiente de teste do Stripe.</span>
          </li>
          <li className="flex items-start gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
             <span>Fazer teste final de 0 a 1 com um dono de negócio local real.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function BrainIcon(props: any) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 2.46-3.06H12M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0-2.46-3.06H12" />
    </svg>
  );
}
