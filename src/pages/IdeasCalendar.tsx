import React, { useState } from 'react';
import { 
  Lightbulb, 
  ArrowRight, 
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export function IdeasCalendar() {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const days = [
    { id: 1, day: 'Seg', date: '01', idea: 'Dica do dia: Como economizar [Recurso] usando nosso [Produto].', type: 'Conteúdo', detail: 'Foque em resolver um problema real do seu cliente de forma rápida.' },
    { id: 2, day: 'Ter', date: '02', idea: 'Mostre os bastidores: O processo de embalagem ou preparo do [Produto].', type: 'Conexão', detail: 'Humanize a marca mostrando que existe cuidado em cada detalhe.' },
    { id: 3, day: 'Qua', date: '03', idea: 'Prova Social: O que a [Nome de Cliente] disse sobre nosso atendimento.', type: 'Prova Social', detail: 'Use prints de WhatsApp ou comentários do Instagram.' },
    { id: 4, day: 'Qui', date: '04', idea: 'TBT: Onde tudo começou. Mostre sua primeira logo ou primeira venda.', type: 'História', detail: 'Gere conexão emocional através da sua jornada de superação.' },
    { id: 5, day: 'Sex', date: '05', idea: 'Oferta Relâmpago: Combo [A] + [B] com 15% OFF somente até as 22h.', type: 'Venda', detail: 'Use escassez de tempo para gerar pedidos imediatos.' },
    { id: 6, day: 'Sáb', date: '06', idea: 'Estilo de Vida: Como o [Produto] se encaixa no seu final de semana perfeito.', type: 'Venda', detail: 'Venda o benefício e o momento, não apenas as características.' },
    { id: 7, day: 'Dom', date: '07', idea: 'Interação: Qual seu [Produto] favorito para começar a semana bem?', type: 'Engajamento', detail: 'Use enquetes ou caixinhas de perguntas nos Stories.' },
    { id: 8, day: 'Seg', date: '08', idea: 'Checklist: 5 coisas que você precisa saber antes de comprar [Categoria].', type: 'Dica', detail: 'Eduque seu cliente para que ele valorize seu produto premium.' },
    { id: 9, day: 'Ter', date: '09', idea: 'Mito ou Verdade: Verdades sobre o [Nicho] que ninguém te conta.', type: 'Autoridade', detail: 'Quebre objeções comuns de forma descontraída.' },
    { id: 10, day: 'Qua', date: '10', idea: 'Lançamento/Novidade: Vem coisa boa por aí! Quem adivinha o que é?', type: 'Antecipação', detail: 'Gere curiosidade sem revelar o produto final ainda.' }
  ];

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUseIdea = (idea: string) => {
    navigate('/generate', { state: { initialContext: idea } });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold title-display tracking-tight">Calendário de Ideias</h1>
          <p className="text-zinc-500 font-medium font-sans">Sugestões diárias para você nunca ficar sem postar.</p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl shadow-inner">
          <button className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-bold px-4 text-xs uppercase tracking-widest text-zinc-400">Maio, 2024</span>
          <button className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {days.map((d) => (
          <div key={d.id} className={cn(
            "glass-card p-5 flex flex-col min-h-[220px] transition-all hover:border-amber-500/30 bg-zinc-900 shadow-sm relative group",
            d.type === 'Venda' && "bg-amber-500/[0.02] border-amber-500/10"
          )}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{d.day}</span>
              <span className={cn("text-xl font-black tracking-tighter", d.type === 'Venda' ? 'text-amber-500' : 'text-zinc-300')}>{d.date}</span>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className={cn(
                "text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit border",
                d.type === 'Venda' ? "bg-amber-500/20 text-amber-500 border-amber-500/30" : "bg-zinc-950 text-zinc-500 border-zinc-800"
              )}>
                {d.type}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                {d.idea}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleUseIdea(d.idea)}
                className="flex-1 bg-amber-500 text-black py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Usar
              </button>
              <button 
                onClick={() => handleCopy(d.idea, d.id)}
                className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white"
              >
                {copiedId === d.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="glass-card p-10 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-transparent border-amber-500/20 rounded-[2.5rem] relative overflow-hidden group border-dashed">
        <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 scale-150 rotate-12 group-hover:scale-[1.6] transition-transform duration-700">
          <Lightbulb className="w-32 h-32" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="bg-amber-500 w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-amber-500/30">
            <Lightbulb className="text-black w-10 h-10 fill-current" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-extrabold mb-2 tracking-tighter">Calendário sob medida?</h3>
            <p className="text-zinc-400 mb-8 max-w-xl font-medium leading-relaxed">Nossa Inteligência Artificial pode criar um cronograma de 30 dias focado no seu nicho, cidade e feriados locais.</p>
            <Link to="/billing" className="bg-white text-black px-10 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all inline-flex items-center gap-3 shadow-xl hover:-translate-y-1">
              <span>Desbloquear 30 Dias</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
