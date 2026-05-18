import React, { useState } from 'react';
import { 
  BookOpen, 
  Star, 
  ArrowRight, 
  Pizza, 
  Beef, 
  Coffee, 
  Scissors, 
  Tag,
  ShoppingBag,
  Sparkles,
  Heart,
  Store,
  Calendar,
  Gift,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Zap,
  TrendingUp,
  MessageCircle,
  Stethoscope,
  Car,
  Camera,
  Music,
  ShoppingBasket
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';

export function Library() {
  const navigate = useNavigate();
  const { user } = useStorage();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = ['Todos', 'Alimentação', 'Beleza', 'Serviços', 'Varejo', 'Datas Comemorativas', 'Promoção'];
  
  const models = [
    // Alimentação
    { id: 1, category: 'Alimentação', title: 'Promoção de Feriado', niche: 'Pizzaria', type: 'Feed', icon: Pizza, color: 'text-orange-400', desc: 'Venda rápida para o jantar em feriados locais.', premium: false },
    { id: 2, category: 'Alimentação', title: 'Combo Duplo Família', niche: 'Hamburgueria', type: 'Story', icon: Beef, color: 'text-red-400', desc: 'Foco no ticket médio com combos familiares.', premium: false },
    { id: 3, category: 'Alimentação', title: 'Açaí no Calor', niche: 'Açaíteria', type: 'Status', icon: ShoppingBasket, color: 'text-indigo-400', desc: 'Gatilho de urgência baseado na temperatura.', premium: false },
    { id: 4, category: 'Alimentação', title: 'Happy Hour 2x1', niche: 'Restaurante/Bar', type: 'Feed', icon: Zap, color: 'text-yellow-400', desc: 'Lotar o estabelecimento em dias de baixo movimento.', premium: true },
    { id: 5, category: 'Alimentação', title: 'Marmita da Semana', niche: 'Delivery Saudável', type: 'WhatsApp', icon: ShoppingBag, color: 'text-green-500', desc: 'Fidelização através de planos semanais.', premium: true },
    
    // Beleza
    { id: 9, category: 'Beleza', title: 'Agenda de Sexta', niche: 'Salão/Barbearia', type: 'Status', icon: Scissors, color: 'text-blue-400', desc: 'Lotar os últimos horários do final de semana.', premium: false },
    { id: 10, category: 'Beleza', title: 'Combo Corte + Barba', niche: 'Barbearia', type: 'Feed', icon: Scissors, color: 'text-zinc-400', desc: 'Aumento de ticket com serviços combinados.', premium: false },
    { id: 11, category: 'Beleza', title: 'Estética Express', niche: 'Estética', type: 'Story', icon: Heart, color: 'text-pink-400', desc: 'Foco na praticidade e resultado imediato.', premium: true },
    
    // Varejo / Moda
    { id: 19, category: 'Varejo', title: 'Liquidação de Inverno', niche: 'Moda', type: 'Feed', icon: Tag, color: 'text-red-500', desc: 'Queima de estoque de final de estação.', premium: false },
    { id: 13, category: 'Varejo', title: 'Lançamento Coleção', niche: 'E-commerce', type: 'Story', icon: Camera, color: 'text-white', desc: 'Antecipação e desejo para novos produtos.', premium: true },
    
    // Serviços
    { id: 17, category: 'Serviços', title: 'Checkup Saúde', niche: 'Clínica', type: 'Status', icon: Stethoscope, color: 'text-cyan-400', desc: 'Prevenção e cuidado recorrente.', premium: true },
    { id: 18, category: 'Serviços', title: 'Limpeza Estofados', niche: 'Serviços', type: 'Feed', icon: TrendingUp, color: 'text-blue-500', desc: 'Antes e depois impactante.', premium: false },
    
    // Datas Comemorativas
    { id: 20, category: 'Datas Comemorativas', title: 'Dia dos Pais', niche: 'Geral', type: 'Todos', icon: Heart, color: 'text-red-400', desc: 'Campanha de impacto emocional e presente.', premium: true },
    { id: 21, category: 'Datas Comemorativas', title: 'Black Friday Antecipada', niche: 'Geral', type: 'Feed', icon: Zap, color: 'text-amber-500', desc: 'Gere caixa antes de todo o mercado.', premium: true },
  ];

  const filteredModels = activeCategory === 'Todos' ? models : models.filter(m => m.category === activeCategory);

  const handleUseModel = (model: any) => {
    if (model.premium && (user?.plan === 'trial' || user?.plan === 'free')) {
      navigate('/billing');
      return;
    }
    navigate('/generate', { state: { modelTitle: model.title, modelNiche: model.niche } });
  };

  const handleCopy = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isModelLocked = (premium: boolean) => {
    if (!premium) return false;
    return user?.plan === 'trial' || user?.plan === 'free';
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold title-display tracking-tight uppercase italic">Biblioteca de Modelos</h1>
          <p className="text-zinc-500 font-medium">Estruturas validadas para acelerar seus resultados.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-6 py-2.5 rounded-2xl text-amber-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <Star className="w-3.5 h-3.5 fill-current" /> Plano {user?.plan.toUpperCase() || 'ESSENTIAL'}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none snap-x h-16">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all snap-start flex-shrink-0",
              activeCategory === cat ? "bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/10" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => {
          const locked = isModelLocked(model.premium);
          return (
            <div key={model.id} className={cn(
              "glass-card p-8 border-zinc-800 hover:border-amber-500/50 transition-all group flex flex-col h-full bg-zinc-900 relative overflow-hidden rounded-[2.5rem]",
              locked && "grayscale-[0.8]"
            )}>
              {locked && (
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-amber-500/20">
                    <Lock className="w-6 h-6 text-black" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2 italic">Exclusivo Pro/Max</h4>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed mb-6">Este modelo avançado está bloqueado no seu plano atual.</p>
                  <button 
                    onClick={() => navigate('/billing')}
                    className="bg-amber-500 text-black px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-amber-400 transition-all"
                  >
                    Fazer Upgrade
                  </button>
                </div>
              )}

              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all translate-x-4 -translate-y-4">
                <model.icon className="w-24 h-24" />
              </div>
              
              <div className="flex items-center justify-between mb-8">
                <div className={cn("w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-inner flex items-center justify-center", model.color)}>
                  <model.icon className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">{model.type}</span>
                  {model.premium && !locked && (
                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10">Premium</span>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-h-[120px]">
                <h3 className="text-xl font-black mb-3 tracking-tighter group-hover:text-amber-500 transition-colors uppercase italic">{model.title}</h3>
                <p className="text-xs text-zinc-500 mb-6 font-medium leading-relaxed italic">{model.desc}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-950 border border-zinc-900 rounded-full text-zinc-400">{model.niche}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-950 border border-zinc-900 rounded-full text-zinc-400">{model.category}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-8">
                <button 
                  onClick={() => handleUseModel(model)}
                  className="flex-1 bg-amber-500 text-black px-4 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/10"
                >
                  {locked ? 'Upgrade' : 'Usar Modelo'} <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleCopy(model.id)}
                  disabled={locked}
                  className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed shadow-inner"
                >
                  {copiedId === model.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
