import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  Settings, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Search,
  ArrowRight,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Beaker,
  Database
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { cn } from '../lib/utils';
import { PLAN_LIMITS } from '../constants';
import { PlanTier } from '../types';

export function Admin() {
  const navigate = useNavigate();
  const { user, pendingActivations, adminUpdateUserPlan, clearPendingActivations, isAdmin } = useStorage();
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'settings'>('requests');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin()) return null;

  // Multi-user demo logic (mocking more users)
  const mockUsers = [
    { id: user?.id || '1', email: user?.email || 'admin@demo.com', plan: user?.plan || 'free', usage: user?.usage?.currentMonthCampaigns || 0 },
    { id: '2', email: 'joao@loja.com', plan: 'essential', usage: 12 },
    { id: '3', email: 'maria@beauty.com', plan: 'pro', usage: 45 },
    { id: '4', email: 'agencia@marketing.com', plan: 'max', usage: 89 },
  ];

  const handleActivate = (requestId: string, userId: string, plan: PlanTier) => {
    adminUpdateUserPlan(userId, plan);
    alert(`Plano ${plan.toUpperCase()} ativado com sucesso!`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold title-display tracking-tight flex items-center gap-3 italic uppercase">
            <ShieldCheck className="text-amber-500 w-8 h-8" /> Painel de Controle
          </h1>
          <p className="text-zinc-500 font-medium">Gestão de acessos, assinaturas e limites do ecossistema.</p>
        </div>
        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <button 
            onClick={() => navigate('/admin/config')}
            className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all text-amber-500"
          >
            <Settings className="w-4 h-4" />
            Config
          </button>
          <button 
            onClick={() => navigate('/admin/prontidao')}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber-500/50 transition-all text-zinc-400 hover:text-amber-500"
          >
            <ShieldCheck className="w-4 h-4" />
            Prontidão
          </button>
          <button 
            onClick={() => navigate('/admin/auditoria')}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber-500/50 transition-all text-zinc-400 hover:text-amber-500"
          >
            <Database className="w-4 h-4" />
            Auditoria
          </button>
          <button 
            onClick={() => navigate('/admin/teste-nicho')}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber-500/50 transition-all text-zinc-400 hover:text-amber-500"
          >
            <Beaker className="w-4 h-4" />
            Nichos
          </button>
          <button 
            onClick={() => navigate('/admin/beta')}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber-500/50 transition-all text-zinc-400 hover:text-amber-500"
          >
            <TrendingUp className="w-4 h-4" />
            BETA
          </button>
          <div className="flex bg-zinc-900 p-1.5 rounded-[1.25rem] border border-zinc-800 shadow-inner">
            <button 
              onClick={() => setActiveTab('requests')}
              className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'requests' ? "bg-amber-500 text-black shadow-lg" : "text-zinc-500 hover:text-white")}
            >
              Solicitações ({pendingActivations.length})
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'users' ? "bg-amber-500 text-black shadow-lg" : "text-zinc-500 hover:text-white")}
            >
              Usuários
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'settings' ? "bg-amber-500 text-black shadow-lg" : "text-zinc-500 hover:text-white")}
            >
              Sistema
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-[2rem] flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-1">Área Administrativa Temporária</p>
          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.05em]">Esta interface utiliza LocalStorage para controle demo. Proteja com autenticação real antes da produção final.</p>
        </div>
      </div>

      {activeTab === 'requests' && (
        <div className="space-y-6">
          {pendingActivations.length > 0 ? (
            <div className="grid gap-4">
              {pendingActivations.map((req, i) => (
                <div key={i} className="glass-card p-8 bg-zinc-900 border-zinc-800 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-inner">
                      <CreditCard className="text-amber-500 w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tighter italic">{req.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-widest">
                        <span>{req.email || user?.email}</span>
                        <span className="text-zinc-800">/</span>
                        <span>{req.whatsapp}</span>
                        <span className="text-zinc-800">/</span>
                        <span>{new Date(req.requestedAt || req.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1 italic">Solicitado</p>
                      <p className="font-black text-amber-500 uppercase text-lg tracking-tighter">{req.planRequested || req.plan}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleActivate(i.toString(), user?.id || '', req.planRequested || req.plan)}
                        className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-green-500/10"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Ativar
                      </button>
                      <button className="p-3 bg-zinc-800 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 rounded-2xl transition-all border border-zinc-700">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={clearPendingActivations}
                className="text-center py-6 text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-amber-500 transition-colors"
              >
                Limpar Banco de Dados de Solicitações
              </button>
            </div>
          ) : (
            <div className="text-center py-24 bg-zinc-950/30 rounded-[3rem] border border-dashed border-zinc-800">
              <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-zinc-800">
                <CheckCircle2 className="w-10 h-10 text-zinc-800" />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Tudo em dia</h3>
              <p className="text-zinc-500 text-sm font-medium">Nenhuma solicitação pendente de ativação no momento.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card overflow-hidden bg-zinc-900 border-zinc-800 rounded-[2.5rem] shadow-sm">
          <div className="p-8 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
              <input type="text" placeholder="Buscar por email ou ID..." className="w-full bg-zinc-950 border border-zinc-800 py-4 pl-12 pr-4 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all font-medium" />
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
              <span>{mockUsers.length} Logins Ativos</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/50 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">
                  <th className="px-8 py-6">IDENTIFICAÇÃO</th>
                  <th className="px-8 py-6">STATUS PLANO</th>
                  <th className="px-8 py-6">USO DO ENGINE</th>
                  <th className="px-8 py-6 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-black text-sm uppercase italic tracking-tight">{u.email}</div>
                      <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">UUID: {u.id}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border tracking-widest",
                        u.plan === 'trial' ? "bg-zinc-800 text-zinc-500 border-zinc-700" : "bg-green-500/10 text-green-500 border-green-500/20"
                      )}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                          <div 
                            className="bg-amber-500 h-full rounded-full" 
                            style={{ width: `${(u.usage / PLAN_LIMITS[u.plan as PlanTier].monthlyCredits) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-black text-zinc-500 tracking-widest">{u.usage} / {PLAN_LIMITS[u.plan as PlanTier].monthlyCredits}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => adminUpdateUserPlan(u.id, 'pro')}
                        className="p-3 bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:text-amber-500 rounded-xl transition-all"
                        title="Forçar Upgrade Pro"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-10 space-y-8 bg-zinc-900 border-zinc-800 rounded-[2.5rem] shadow-sm">
            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <CreditCard className="text-amber-500 w-6 h-6" /> Links Estruturais
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Checkout Plano Essencial</label>
                <input type="text" placeholder="URL Stripe/Mercado Pago..." className="w-full bg-zinc-950 border border-zinc-800 py-4 px-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all font-mono" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Checkout Plano Pro</label>
                <input type="text" placeholder="URL Stripe/Mercado Pago..." className="w-full bg-zinc-950 border border-zinc-800 py-4 px-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all font-mono" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Checkout Plano Max</label>
                <input type="text" placeholder="URL Stripe/Mercado Pago..." className="w-full bg-zinc-950 border border-zinc-800 py-4 px-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all font-mono" />
              </div>
              <button className="w-full py-5 bg-amber-500 text-black font-black uppercase text-xs tracking-widest rounded-3xl mt-4 hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10">Atualizar Portões de Pagamento</button>
            </div>
          </div>
          
          <div className="glass-card p-10 bg-zinc-900 border-zinc-800 rounded-[2.5rem] shadow-sm space-y-8">
            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <TrendingUp className="text-amber-500 w-6 h-6" /> Status de Rede
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-zinc-950 rounded-3xl border border-zinc-800 group hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800"><Settings className="w-5 h-5 text-zinc-600" /></div>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Variáveis de Ambiente</span>
                </div>
                <button 
                  onClick={() => navigate('/admin/config')}
                  className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-500/10 px-4 py-2 rounded-xl transition-all"
                >
                  Configurar
                </button>
              </div>
              <div className="flex items-center justify-between p-6 bg-zinc-950 rounded-3xl border border-zinc-800 group hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800"><RefreshCw className="w-5 h-5 text-zinc-600" /></div>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Modo de Manutenção</span>
                </div>
                <div className="w-12 h-6 bg-zinc-900 rounded-full relative border border-zinc-800 shadow-inner cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-700 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-6 bg-zinc-950 rounded-3xl border border-zinc-800 group hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800"><BarChart3 className="w-5 h-5 text-zinc-600" /></div>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Sistema de Logs</span>
                </div>
                <button className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-500/10 px-4 py-2 rounded-xl transition-all">Monitorar</button>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800">
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-4">Versão do Engine: CP-AI-v1.2.0</p>
              <button className="w-full py-4 bg-zinc-800 text-zinc-500 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-zinc-700 hover:text-zinc-300 transition-all cursor-not-allowed">Resetar Servidor de Cache</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
