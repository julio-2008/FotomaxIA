import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PlusCircle, 
  History, 
  Library, 
  Calendar, 
  Settings, 
  CreditCard,
  LogOut,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Fingerprint,
  Target,
  X,
  Palette,
  Brain,
  BarChart3,
  MessageSquare // Added for feedback
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStorage } from '../hooks/useStorage';
import { PLAN_LIMITS } from '../constants';
import { Logo } from './Logo';
import { FeedbackModal } from './FeedbackModal'; // Added

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, isAdmin } = useStorage();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  const menuGroups = [
    {
      title: 'CENTRAL DE COMANDO',
      items: [
        { icon: LayoutDashboard, label: 'Início', path: '/dashboard' },
        { icon: Brain, label: 'Consultoria Estratégica', path: '/consultor' },
        { icon: Fingerprint, label: 'DNA do Negócio', path: '/dna-comercial' },
      ]
    },
    {
      title: 'MÓDULOS DE VENDA',
      items: [
        { icon: Target, label: 'Ofertas e Combos', path: '/ofertas' },
        { icon: PlusCircle, label: 'Divulgações Prontas', path: '/campanhas' },
        { icon: Calendar, label: 'Calendário de Vendas', path: '/calendario' },
      ]
    },
    {
      title: 'FERRAMENTAS OPERACIONAIS',
      items: [
        { icon: Palette, label: 'Imagens e Criativos', path: '/criativos' },
        { icon: MessageCircle, label: 'Zap Rápido', path: '/zap-rapido' },
        { icon: Library, label: 'Acervo Inteligente', path: '/biblioteca' },
      ]
    },
    {
      title: 'DADOS E HISTÓRICO',
      items: [
        { icon: BarChart3, label: 'Resultados de Venda', path: '/resultados' },
        { icon: History, label: 'Histórico de Ações', path: '/history' },
      ]
    },
    {
      title: 'CONFIGURAÇÕES',
      items: [
        { icon: CreditCard, label: 'Minha Assinatura', path: '/billing' },
        { icon: Settings, label: 'Configurações', path: '/settings' },
      ]
    }
  ];

  const showAdmin = isAdmin();
  
  const currentPlanLabels: Record<string, string> = {
    trial: 'Teste Grátis',
    essential: 'Plano Essencial',
    pro: 'Plano Pro',
    max: 'Plano Max'
  };

  const usage = (user?.usage?.monthlyCreditsUsed || 0) + (user?.usage?.extraCreditsUsed || 0);
  const limit = (user?.usage?.monthlyCreditsLimit || 0) + (user?.usage?.extraCreditsLimit || 0);
  const usagePercent = limit > 0 ? (usage / limit) * 100 : (user?.plan === 'trial' && user?.usage?.trialUsed ? 100 : 0);

  const adminMenu = showAdmin ? {
    title: 'ADMIN ACCESS',
    items: [{ icon: ShieldCheck, label: 'Painel Admin', path: '/admin' }]
  } : null;

  return (
    <>
      <aside 
        id="sidebar" 
        className={cn(
          "w-72 h-screen bg-black border-r border-white/5 flex flex-col fixed left-0 top-0 z-[60] transition-transform duration-500 ease-editorial",
          isOpen ? "translate-x-0 shadow-[40px_0_100px_rgba(0,0,0,1)]" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="p-10 border-b border-white/5 bg-zinc-950/20 backdrop-blur-md sticky top-0 z-10">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-4 group">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 relative transition-all group-hover:scale-110">
               <div className="absolute inset-0 bg-brand-yellow/10 group-hover:bg-brand-yellow/20 rounded-none transition-all blur-xl" />
               <Logo className="text-brand-yellow w-full h-full relative z-10" />
            </div>
            <div className="space-y-1">
              <span className="block font-black text-2xl uppercase tracking-tighter italic text-white leading-none">
                FM<span className="text-brand-yellow"> AX</span>
              </span>
              <span className="block text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] italic leading-none">
                V PRO.NODE 01
              </span>
            </div>
          </Link>
          <button onClick={onClose} className="md:hidden absolute top-10 right-10 p-2 text-zinc-700 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar-sidebar pb-4 flex flex-col">
          {/* Navigation Section */}
          <nav className="flex-1">
            <div className="p-6 space-y-10">
              {[...menuGroups, ...(adminMenu ? [adminMenu] : [])].map((group, gIndex) => (
              <div key={group.title} className="space-y-2">
                <div className="flex items-center gap-4 px-4 mb-4">
                  <div className="h-px bg-white/5 flex-1" />
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-800 italic">
                    {group.title}
                  </span>
                </div>
                <div className="space-y-[1px]">
                  {group.items.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-5 px-5 py-3.5 transition-all group relative overflow-hidden",
                          isActive 
                            ? "bg-brand-yellow text-black" 
                            : "text-zinc-600 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-black animate-slide-right" />
                        )}
                        <item.icon className={cn("w-4 h-4 shrink-0 transition-all duration-300", 
                          isActive ? "text-black scale-110" : "text-zinc-800 group-hover:text-brand-yellow group-hover:scale-110"
                        )} />
                        <span className="text-[10px] uppercase font-black tracking-[0.2em] italic">
                          {item.label}
                        </span>
                        {!isActive && (
                          <div className="ml-auto w-1 h-1 bg-zinc-900 group-hover:bg-brand-yellow transition-all" />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="mt-auto p-8 space-y-8 bg-zinc-950 border-t border-white/5 relative group/footer flex flex-col items-center">
           <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-yellow/30 to-transparent opacity-0 group-hover/footer:opacity-100 transition-opacity" />
           
           {/* Feedback Button */}
           <button 
            onClick={() => setIsFeedbackOpen(true)}
            className="w-full flex items-center justify-center px-6 py-4 border border-white/5 text-zinc-700 hover:text-brand-yellow hover:border-brand-yellow/30 transition-all bg-black/50 group"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">DÊ SEU FEEDBACK</span>
            </div>
          </button>

          {/* Usage Stats */}
          <div className="space-y-4 px-2 w-full flex flex-col items-center text-center">
             <div className="flex flex-col items-center gap-1">
               <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 italic">CAPACIDADE NEURAL</span>
               <span className="text-[10px] font-black text-brand-yellow tabular-nums italic">
                {usage.toString().padStart(2, '0')} / {limit.toString().padStart(2, '0')} U.
               </span>
             </div>
             <div className="w-full h-[1px] bg-zinc-900 relative overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000 ease-out relative z-10",
                    usagePercent > 90 ? "bg-red-500" : usagePercent > 70 ? "bg-amber-500" : "bg-brand-yellow"
                  )} 
                  style={{ width: `${Math.min(100, usagePercent)}%` }}
                />
                <div className="absolute inset-0 bg-white/5 opacity-20" />
             </div>
             <div className="flex flex-col items-center gap-2">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-800 italic text-center">
                  {user ? currentPlanLabels[user.plan] : 'CALIBRATING...'}
                </p>
                <div className="flex gap-1 justify-center">
                   <div className="w-1 h-1 bg-brand-yellow animate-pulse" />
                   <div className="w-1 h-1 bg-brand-yellow animate-pulse delay-75" />
                   <div className="w-1 h-1 bg-brand-yellow animate-pulse delay-150" />
                </div>
             </div>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={() => {
              localStorage.removeItem('cp_user');
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center p-5 border border-zinc-900 text-zinc-800 hover:text-white hover:bg-red-600/10 hover:border-red-600/30 transition-all font-black text-[10px] uppercase tracking-[0.5em] italic"
          >
            SAIR DO SISTEMA
          </button>
        </div>
        </div>
      </aside>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </>
  );
}
