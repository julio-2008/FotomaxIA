import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Info } from 'lucide-react';

const MODELS = [
  { id: 'vender_hoje', label: 'Vender Hoje', desc: 'Campanha direta focada em converter agora. Ideal para dias de pico ou quando precisa de caixa rápido.', structure: 'Gancho Forte + Oferta Base + Escassez Real + CTA Imediato' },
  { id: 'recuperar_cliente', label: 'Mesa de Recuperação', desc: 'Foque em resgatar quem já comprou de você mas não voltou mais. Custa menos que atrair novos.', structure: 'Perguntar como foi a última vez + Novidade + Condição Cliente VIP + CTA de Resposta' },
  { id: 'produto_parado', label: 'Girar Estoque', desc: 'Acabe com produtos parados usando âncoras de preço e combos.', structure: 'Problema que o produto foca + Bônus inegável + Preço Ancorado + CTA Limitado' },
  { id: 'aumentar_ticket', label: 'Upsell / Aumentar Ticket', desc: 'Foque em oferecer o premium ou um complemento pro cliente atual.', structure: 'Gancho de Upgrade + Mostre o cenário ideal + Condição na troca + CTA' },
  { id: 'lotar_agenda', label: 'Lotar Agenda Vazia', desc: 'Mude o foco para o resultado do serviço, cobrindo buracos na agenda.', structure: 'Mostre o problema do cliente HOJE + Vantagem de resolver rápido + Últimos horários + CTA de Agendamento' },
  { id: 'dia_fraco', label: 'Injeção no Dia Fraco', desc: 'Crie uma promoção exclusiva para "terças tristes" ou dias de baixo movimento.', structure: 'Nomeie o dia + Mostre a vantagem de ir hoje + Regra restrita + CTA' },
  { id: 'fim_de_semana', label: 'Especial Fim de Semana', desc: 'Foque em lazer, recompensa por trabalho duro ou consumo por impulso.', structure: 'Clima de Final de Semana + Desejo de Recompensa + Oferta Família/Dupla + CTA' },
  { id: 'objecao_preco', label: 'Desancorar Preço', desc: 'Quando o cliente acha caro. Foque no longo prazo.', structure: 'Mostre o custo de NÃO comprar + Divida o valor final + Reforce a qualidade + CTA' },
  { id: 'campanha_premium', label: 'Premium (Sem Desconto)', desc: 'Venda luxo, status ou exclusividade sem abaixar preço.', structure: 'Mostre a transformação VIP + Reforce o diferencial raro + Seleção + CTA Exclusivo' },
];

export function CampaignModels() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="pb-8 border-b border-zinc-800">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2 flex items-center gap-3">
             Modelos por Problema
          </h1>
          <p className="text-zinc-400">Escolha o problema que você quer resolver e adaptaremos para o seu negócio.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MODELS.map(m => (
            <div key={m.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between">
               <div>
                  <h3 className="font-bold text-xl mb-2 text-white flex items-center gap-2"><Target className="w-4 h-4 text-amber-500" /> {m.label}</h3>
                  <p className="text-sm text-zinc-400 mb-4">{m.desc}</p>
                  
                  <div className="bg-black/50 p-4 rounded-xl border border-zinc-800/50 mb-6">
                     <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                       <Info className="w-3 h-3" /> Estrutura da Campanha
                     </span>
                     <p className="text-xs text-zinc-300 font-mono leading-relaxed">{m.structure}</p>
                  </div>
               </div>
               
               <button 
                 onClick={() => navigate('/campanhas/nova', { state: { template: m.id } })}
                 className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition-colors"
               >
                 Usar este modelo
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
