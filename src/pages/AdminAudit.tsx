import React from 'react';
import { useStorage } from '../hooks/useStorage';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, Activity, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export function AdminAudit() {
  const { user, isAdmin } = useStorage();

  if (!user || (!isAdmin() && user.email !== 'jlzin2603@gmail.com')) {
      return <Navigate to="/dashboard" replace />;
  }

  const modules = [
    { name: 'Dashboard', status: 'parcial', problem: 'Métricas gerais ainda dependem de mais dados reais de uso; empty states podem ser melhorados.', action: 'Melhorar visualização de empty states e dados do DNA' },
    { name: 'DNA Comercial', status: 'funcional', problem: 'Validação de campos e diagnóstico geram resultados satisfatórios.', action: 'Nenhuma no momento. Revisar após uso contínuo.' },
    { name: 'Máquina de Ofertas', status: 'funcional', problem: 'Fluxo ok. A IA já estrutura a oferta e o copy.', action: 'Garantir que fallback funcione sempre que GEMINI_API_KEY falhar.' },
    { name: 'CampanhaPronta', status: 'funcional', problem: 'Estruturação baseada no DNA está ok. Requer uso do aiCore para garantia de qualidade.', action: 'Monitorar score de qualidade.' },
    { name: 'Zap Rápido', status: 'funcional', problem: 'Retorna copy funcional. Não tem automação de disparo.', action: 'Manter botão apenas como "Copiar" e "Abrir WhatsApp".' },
    { name: 'Lab de Criativos', status: 'parcial', problem: 'Briefing e prompt funcionais, mas geração de imagem depende de API que não está ativa no ambiente.', action: 'Botão de gerar imagem está bloqueado adequadamente.' },
    { name: 'Biblioteca', status: 'parcial', problem: 'Aplica recomendação, mas adaptação de template por IA precisa ser rigorosa.', action: 'Vincular aiCore para adaptar templates.' },
    { name: 'Calendário', status: 'fake', problem: 'Ainda usa muita simulação local.', action: 'Construir gerador de 7 a 30 dias via IA.' },
    { name: 'Consultor IA', status: 'fake', problem: 'Resposta hardcoded/fake.', action: 'Integrar aiCore ou esconder.' },
    { name: 'Clientes', status: 'funcional', problem: 'CRUD básico local.', action: 'Empty state orientativo adicionado.' },
    { name: 'Resultados', status: 'funcional', problem: 'CRUD básico local.', action: 'Empty state orientativo adicionado.' },
    { name: 'Assinatura', status: 'parcial', problem: 'Falta Stripe real. Pagamento manual removido.', action: 'Aguardar configuração final para lançamento.' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Auditoria do Sistema <span className="text-amber-500 text-sm align-middle tracking-widest">[Admin]</span></h1>
      </div>

      <div className="grid gap-4">
        {modules.map((m, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-48 flex-shrink-0">
              <h3 className="font-bold text-lg text-white mb-1">{m.name}</h3>
              <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-opacity-10 border", {
                  'text-amber-500 bg-amber-500 border-amber-500/20': m.status === 'parcial',
                  'text-green-500 bg-green-500 border-green-500/20': m.status === 'funcional',
                  'text-red-500 bg-red-500 border-red-500/20': m.status === 'fake',
                  'text-zinc-500 bg-zinc-500 border-zinc-500/20': m.status === 'bugado',
                  'text-purple-500 bg-purple-500 border-purple-500/20': m.status === 'depende_api'
                })}>
                {m.status === 'funcional' && <CheckCircle2 className="w-3 h-3" />}
                {m.status === 'parcial' && <AlertTriangle className="w-3 h-3" />}
                {m.status === 'fake' && <AlertTriangle className="w-3 h-3" />}
                {m.status === 'depende_api' && <Lock className="w-3 h-3" />}
                {m.status}
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Problema Encontrado</span>
                <span className="text-sm text-zinc-300">{m.problem}</span>
              </div>
              <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                <span className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest block mb-1">Ação Recomendada</span>
                <span className="text-sm text-amber-500/90">{m.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
