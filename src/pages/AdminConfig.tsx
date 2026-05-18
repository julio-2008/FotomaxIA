
import React from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Image as ImageIcon, 
  CreditCard, 
  Terminal,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { getEnvironmentStatus } from '../lib/config/envValidator';
import { cn } from '../lib/utils';
import { AppAlert } from '../components/ui/AppAlert';

export function AdminConfig() {
  const status = getEnvironmentStatus();

  const maskSecret = (key?: string) => {
    if (!key || key === 'not_configured') return <span className="text-red-500 font-bold uppercase italic">Faltando</span>;
    return <span className="text-zinc-400 font-mono italic">{key.substring(0, 8)}...{key.substring(key.length - 4)}</span>;
  };

  const ConfigSection = ({ title, icon: Icon, children, ready }: { title: string, icon: any, children: React.ReactNode, ready: boolean }) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", ready ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{title}</h3>
        </div>
        {ready ? (
          <div className="bg-green-500/10 text-green-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">Online</div>
        ) : (
          <div className="bg-red-500/10 text-red-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">Offline</div>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const Param = ({ label, value, ready = true }: { label: string, value: any, ready?: boolean }) => (
    <div className="flex justify-between items-center py-2 border-b border-zinc-800/50 last:border-0">
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{value}</span>
        {ready ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-fade-in">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Status da Configuração</h1>
          <p className="text-zinc-500 font-medium">Verifique as chaves e provedores do ambiente.</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl">
          <Database className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Database: <span className="text-white">{status.databaseProvider}</span></span>
        </div>
      </div>

      {!status.firebase.ready && (
        <AppAlert 
           type="warning"
           title="Firebase Desconfigurado"
           message="O sistema está operando em modo local (localStorage). As alterações não serão salvas na nuvem e o login real está desativado."
        />
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <ConfigSection title="Firebase Auth & DB" icon={ShieldCheck} ready={status.firebase.ready}>
          <Param label="API Key" value={maskSecret(import.meta.env.VITE_FIREBASE_API_KEY)} ready={!status.firebase.invalid.includes('VITE_FIREBASE_API_KEY')} />
          <Param label="Auth Domain" value={import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Faltando'} ready={!status.firebase.invalid.includes('VITE_FIREBASE_AUTH_DOMAIN')} />
          <Param label="Project ID" value={import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Faltando'} />
          <Param label="App ID" value={import.meta.env.VITE_FIREBASE_APP_ID || 'Faltando'} />
          
          <div className="mt-6 p-6 bg-black/40 rounded-2xl border border-zinc-800 space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" /> Checklist Firebase
             </h4>
             <ul className="space-y-2">
                {[
                  "Provedor Email/Senha ativado no Auth",
                  "Firestore Database criado em modo produção",
                  "Regras de segurança publicadas",
                  "Domínio do app autorizado (Configurações > Auth)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    {item}
                  </li>
                ))}
             </ul>
             <a 
               href="https://console.firebase.google.com" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:underline mt-2"
             >
               Abrir Firebase Console <ExternalLink className="w-3.5 h-3.5" />
             </a>
          </div>
        </ConfigSection>

        <ConfigSection title="Inteligência Artificial" icon={Cpu} ready={status.ai.ready}>
           <Param label="Gemini API Key" value={maskSecret(import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : ''))} />
           <Param label="AI Provider" value="Google Gemini" />
           <Param label="Model" value="Gemini-1.5-Flash" />
        </ConfigSection>

        <ConfigSection title="Geração de Imagens" icon={ImageIcon} ready={import.meta.env.VITE_IMAGE_ENABLED === 'true'}>
           <Param label="Habilitado" value={import.meta.env.VITE_IMAGE_ENABLED === 'true' ? 'Sim' : 'Não'} />
           <Param label="Provider" value={import.meta.env.VITE_IMAGE_PROVIDER || 'Não definido'} />
           <Param label="Models" value="Imagen / DALL-E" />
        </ConfigSection>

        <ConfigSection title="Pagamentos & Billing" icon={CreditCard} ready={status.stripe.ready}>
           <Param label="Stripe Key" value={maskSecret(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)} />
           <Param label="Preço Trial" value={import.meta.env.VITE_STRIPE_PRICE_TRIAL || 'Faltando'} />
           <Param label="Preço VIP" value={import.meta.env.VITE_STRIPE_PRICE_VIP || 'Faltando'} />
        </ConfigSection>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[2.5rem] flex items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-500 rounded-[2rem] flex items-center justify-center">
            <AlertTriangle className="text-black w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase text-white mb-1">Precisa alterar as variáveis?</h3>
            <p className="text-zinc-500 text-sm font-medium">As chaves devem ser configuradas no painel de ambiente do seu provedor de hospedagem (Vercel, Railway, AI Studio, etc).</p>
          </div>
        </div>
        <button 
           className="bg-amber-500 text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all"
           onClick={() => window.location.reload()}
        >
          Recarregar App
        </button>
      </div>
    </div>
  );
}
