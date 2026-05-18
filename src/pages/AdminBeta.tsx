import React from 'react';
import { Users, Star, MessageSquare, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AdminBeta() {
  const { feedbacks = [], history = [], user } = useStorage() as any;

  // Mock data for other users if only current user exists, for visualization
  const users = [
    { email: user?.email, plan: user?.plan, createdAt: new Date().toISOString() },
    { email: 'barbearia_silva@email.com', plan: 'trial', createdAt: '2026-05-01T10:00:00Z' },
    { email: 'pizzaria_bella@email.com', plan: 'essential', createdAt: '2026-05-02T15:30:00Z' },
  ];

  const stats = [
    { label: 'Usuários Beta', value: users.length, icon: Users, color: 'text-blue-500' },
    { label: 'Feedbacks', value: feedbacks.length, icon: MessageSquare, color: 'text-amber-500' },
    { label: 'Ações Geradas', value: history.length, icon: Star, color: 'text-purple-500' },
    { label: 'Trials Esgotados', value: users.filter(u => u.plan === 'trial').length, icon: AlertTriangle, color: 'text-rose-500' }
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
        <h1 className="text-4xl font-black title-display italic uppercase tracking-tighter">
          Dashboard <span className="text-amber-500">Beta Controlado</span>
        </h1>
        <p className="text-zinc-500 font-medium">Acompanhe os primeiros passos dos usuários reais no Fotomax IA.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800 p-6 rounded-[2rem] space-y-2">
            <div className="flex justify-between items-start">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <TrendingUp className="w-4 h-4 text-zinc-800" />
            </div>
            <div className="space-y-0.5">
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recentes Feedbacks */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-[3rem] p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black uppercase italic tracking-tight">Feedback dos Usuários</h2>
            <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Recent</div>
          </div>

          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <div className="py-12 text-center text-zinc-600 font-medium italic">Nenhum feedback recebido ainda.</div>
            ) : (
              feedbacks.map((f: any) => (
                <div key={f.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{f.userEmail}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${f.rating >= s ? 'text-amber-500 fill-amber-500' : 'text-zinc-800'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-zinc-200">"{f.tryingToDo}"</p>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <span className={f.worked ? 'text-green-500' : 'text-rose-500'}>
                      {f.worked ? 'FUNCIONOU' : 'NÃO FUNCIONOU'}
                    </span>
                    <span className="text-zinc-600">
                      {format(new Date(f.createdAt), "dd MMM HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Atividade de Registro */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-[3rem] p-8 space-y-6">
          <h2 className="text-xl font-black uppercase italic tracking-tight">Novos Registros</h2>
          <div className="space-y-4">
             {users.map((u, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                         <Users className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-white">{u.email}</p>
                         <p className="text-[10px] text-zinc-500 uppercase font-black">{u.plan}</p>
                      </div>
                   </div>
                   <span className="text-[10px] font-mono text-zinc-600">
                      {format(new Date(u.createdAt), "dd/MM") }
                   </span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
