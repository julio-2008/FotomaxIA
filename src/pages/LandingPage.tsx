import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Smartphone, 
  Layout, 
  Search, 
  Library, 
  BarChart3, 
  Star,
  ShieldCheck,
  MessageCircle,
  Lightbulb,
  Lock,
  Utensils,
  Scissors,
  ShoppingBag,
  Hammer,
  HelpCircle,
  Info,
  XCircle,
  Plus,
  Send,
  MessageSquare,
  Package,
  Calendar,
  Image as ImageIcon,
  Clock,
  User,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { cn } from '../lib/utils';
import { Logo } from '../components/Logo';
import { PRICING_PLANS } from '../constants';

export function LandingPage() {
  const navigate = useNavigate();
  const { saveBetaLead, saveActivityEvent } = useStorage();
  const [showBetaForm, setShowBetaForm] = useState(false);
  const [betaSent, setBetaSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    whatsapp: '',
    businessType: 'alimentacao'
  });

  React.useEffect(() => {
    document.title = "Fotomax IA | Divulgações Prontas para Negócios Locais";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Crie divulgações, cardápios, imagens e mensagens prontas para vender no seu negócio local com inteligência artificial.');
    }
  }, []);

  React.useEffect(() => {
    saveActivityEvent({
      type: 'page_view',
      page: 'landing_page',
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleStart = () => {
    saveActivityEvent({
      type: 'click_cta',
      label: 'testar_gratis',
      source: 'landing_page',
      timestamp: new Date().toISOString()
    });
    navigate('/register');
  };

  const handleBetaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveBetaLead({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: formData.name,
      businessName: formData.businessName,
      businessType: formData.businessType,
      whatsapp: formData.whatsapp,
      email: '', // Not authenticated yet
      source: 'landing_page_beta_interest',
      status: 'new'
    });
    saveActivityEvent({
      type: 'form_submit',
      formId: 'beta_interest',
      timestamp: new Date().toISOString()
    });
    setBetaSent(true);
    setTimeout(() => {
      setShowBetaForm(false);
      setBetaSent(false);
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black text-white selection:bg-amber-500/30 font-sans"
    >
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 h-16 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-yellow flex items-center justify-center">
              <Logo className="text-black w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-display font-black uppercase tracking-tighter">FOTOMAX<span className="text-brand-yellow">_IA</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#exemplos" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-brand-yellow transition-colors">EXEMPLOS</a>
            <a href="#precos" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-brand-yellow transition-colors">PLANOS</a>
            <button 
              onClick={() => navigate('/login')}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-brand-yellow transition-all flex items-center gap-2"
            >
              ENTRAR <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <button 
            onClick={handleStart}
            className="brand-button text-[10px] py-4 px-8 h-auto bg-brand-yellow text-black"
          >
            TESTAR AGORA
          </button>
        </div>
      </nav>

      {/* Hero Section - Swiss Editorial Layout */}
      <section className="pt-32 pb-12 md:pt-56 md:pb-32 px-6 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Title Block */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            <div className="flex flex-col gap-4 animate-reveal">
               <span className="text-editorial-label text-brand-yellow flex items-center gap-3">
                 <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse" />
                 Acesso Exclusivo 2026
               </span>
               <h1 className="text-editorial-h1 text-white leading-[0.9] tracking-tighter uppercase font-black">
                 CRIE DIVULGAÇÕES <br className="hidden md:block" /> 
                 <span className="text-brand-yellow italic">PROFISSIONAIS</span> PARA <br className="hidden md:block" />
                 NEGÓCIOS LOCAIS.
               </h1>
            </div>

            <p className="max-w-xl text-zinc-400 text-lg md:text-2xl font-medium leading-tight animate-reveal [animation-delay:200ms]">
              Elimine o amadorismo. O Fotomax IA gera ofertas, combos e cardápios estratégicos em segundos, otimizados para converter no WhatsApp e Instagram.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-8 animate-reveal [animation-delay:400ms]">
              <button 
                onClick={handleStart}
                className="brand-button text-sm md:text-base py-5 px-6 md:px-12 group"
              >
                COMEÇAR AGORA <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#exemplos"
                className="brand-button-outline text-sm md:text-base py-5 px-6 md:px-12"
              >
                VER EXEMPLOS
              </a>
            </div>
          </div>

          {/* Side Info Block */}
          <div className="lg:col-span-4 lg:pt-12 space-y-12 hidden lg:block animate-reveal [animation-delay:600ms]">
             <div className="border-t-2 border-brand-yellow pt-8">
                <span className="text-editorial-label text-zinc-500 mb-4 block">Foco Comercial</span>
                <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                  Não criamos apenas "posts". Criamos gatilhos de venda otimizados para o comportamento de consumo local.
                </p>
             </div>
             
             <div className="border-t-2 border-zinc-800 pt-8">
                <span className="text-editorial-label text-zinc-500 mb-4 block">Velocidade</span>
                <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                   O dono de negócio não tem tempo. Entregamos a cópia e o briefing em menos de 10 segundos.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Numerical Marquee / Grid Banner */}
      <section className="py-12 md:py-20 border-y border-white/5 bg-black overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />
        <div className="flex animate-scroll whitespace-nowrap gap-6 md:p-12 font-display font-black text-4xl md:text-4xl md:text-9xl opacity-5 tracking-tighter uppercase select-none">
          <span>PIZZARIAS</span>
          <span>BARBEARIAS</span>
          <span>ESTÉTICA</span>
          <span>MODA FEMININA</span>
          <span>DELIVERY</span>
          <span>AUTO CENTER</span>
        </div>
      </section>

      {/* Feature Grid - Modular Swiss Style */}
      <section className="py-24 md:py-40 px-6">
        <div className="max-w-[1600px] mx-auto space-y-24">
          <div className="swiss-grid">
             <div className="col-span-12 md:col-span-6 space-y-4">
                <span className="text-editorial-label text-brand-yellow">Capacidades</span>
                <h2 className="text-editorial-h2 text-white">FERRAMENTAS <br /> DE EXECUÇÃO.</h2>
             </div>
             <div className="col-span-12 md:col-span-6 lg:col-start-9 lg:col-span-4 flex items-end">
                <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                   Módulos específicos para cada ação do seu dia. Da abertura da loja ao último horário vago da agenda.
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {[
              { icon: Zap, t: "Oferta do Dia", d: "Ações directas para Story ou Status." },
              { icon: Package, t: "Combos", d: "Monte pacotes que aumentam o ticket médio." },
              { icon: Layout, t: "Cardápios", d: "Cardápio textual pragmático p/ WhatsApp." },
              { icon: MessageSquare, t: "Mensagens Zap", d: "Textos de atração e cobrança inteligente." },
              { icon: Smartphone, t: "Status Pro", d: "Gere curiosidade e desejo no seu círculo local." },
              { icon: ImageIcon, t: "Briefing Visual", d: "Descrição exacta para sua I.A. de imagem." },
              { icon: ShoppingBag, t: "Giro de Stock", d: "Liquide o que está parado com inteligência." },
              { icon: Clock, t: "Last Minute", d: "Preencha horários de cancelamento em segundos." }
            ].map((item, i) => (
              <div key={i} className="bg-black p-10 space-y-8 hover:bg-zinc-900 transition-all group cursor-pointer border border-transparent hover:border-white/5">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-brand-yellow transition-all">
                  <item.icon className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none">{item.t}</h4>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Niches Section */}
      <section className="py-24 md:py-40 px-6 bg-black border-t border-white/5">
        <div className="max-w-[1600px] mx-auto space-y-24">
          <div className="swiss-grid">
             <div className="col-span-12 md:col-span-6 space-y-4">
                <span className="text-editorial-label text-brand-yellow">Verticals</span>
                <h2 className="text-editorial-h2 text-white">SOLUÇÕES <br /> SECTORIAIS.</h2>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/5 border border-white/5">
            {[
              { id: 'alimentacao', icon: Utensils, t: "Alimentação", d: "Cardápio, combo e oferta do dia." },
              { id: 'barbearia', icon: Scissors, t: "Barbearia", d: "Horários, combos e resgate." },
              { id: 'salao', icon: Star, t: "Estética", d: "Agenda, pacotes e prova social." },
              { id: 'loja', icon: ShoppingBag, t: "Loja Física", d: "Vitrine, promoção e giro." },
              { id: 'servicos', icon: Hammer, t: "Serviços", d: "Orçamentos e divulgação." }
            ].map((niche, i) => (
              <div key={i} className="bg-black p-10 flex flex-col items-center text-center space-y-8 hover:bg-brand-yellow group transition-all cursor-pointer">
                <div className="w-16 h-16 bg-white/5 flex items-center justify-center group-hover:bg-black transition-colors">
                  <niche.icon className="w-8 h-8 text-brand-yellow group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-display font-black uppercase italic tracking-tight text-white group-hover:text-black">{niche.t}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed group-hover:text-black/70">{niche.d}</p>
                </div>
                <button 
                  onClick={() => navigate(`/exemplos/${niche.id}`)}
                  className="brand-button text-[9px] py-4 px-8 h-auto opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white italic tracking-tighter"
                >
                  VER EXEMPLO
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section - The AI Difference */}
      <section className="py-24 md:py-40 px-6 bg-brand-yellow text-black overflow-hidden relative">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-8 md:p-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-editorial-label text-black/50">Diferencial</span>
              <h2 className="text-editorial-h2 text-black leading-none animate-reveal">O APP PENSA <br /> PARA VOCÊ.</h2>
              <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-lg animate-reveal [animation-delay:200ms]">
                Não somos um chat genérico. Somos um motor comercial que entende o bairro, o produto e a urgência do dia.
              </p>
            </div>
            
            <button className="brand-button bg-black text-white px-6 md:px-12 py-5 hover:bg-zinc-900 transition-all animate-reveal [animation-delay:400ms]">
              USAR INTELIGÊNCIA AGORA
            </button>
          </div>
          
          <div className="bg-black p-6 md:p-12 space-y-12 shadow-2xl animate-reveal [animation-delay:600ms]">
              <div className="space-y-4">
                <span className="text-editorial-label text-zinc-600">Mensagem Comum</span>
                <div className="border-l-4 border-zinc-800 pl-6 text-zinc-500 text-lg italic uppercase font-bold">
                  "Hoje tem pizza de calabresa em promoção."
                </div>
              </div>
              <div className="space-y-4">
                <span className="text-editorial-label text-brand-yellow">Fotomax IA</span>
                <div className="border-l-4 border-brand-yellow pl-6 text-white text-xl italic uppercase font-black leading-tight">
                  "Sextou com preguiça de cozinhar? 🍕 Combo Família no Zap: Calabresa G + Refri 2L por R$49,90. Válido para os 10 primeiros!"
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Examples & Use Cases */}
      <section id="exemplos" className="py-24 md:py-40 px-6 bg-black border-y border-zinc-900">
        <div className="max-w-[1600px] mx-auto space-y-24">
          <div className="grid lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8">
               <h2 className="text-editorial-h2 text-white">SAÍDAS <br /> PRONTAS.</h2>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
            {/* Pizzaria Example */}
            <div className="bg-black p-6 md:p-12 space-y-10 group hover:bg-zinc-900 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-editorial-label text-brand-yellow">Pizzaria Juazeiro</span>
                    <h4 className="text-xl font-black uppercase text-white italic">Oferta do Fim de Semana</h4>
                  </div>
                  <Utensils className="w-8 h-8 text-zinc-800 group-hover:text-brand-yellow transition-colors" />
                </div>
                <div className="space-y-8">
                   <div className="p-10 bg-zinc-950 border border-white/5 space-y-4">
                      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">PEDIDO ORIGINAL</span>
                      <p className="text-lg font-medium text-zinc-400 italic">"Pizza Calabresa, R$49,90, delivery Juazeiro."</p>
                   </div>
                   <div className="p-10 bg-brand-yellow/5 border border-brand-yellow/30 space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-12 h-12 text-brand-yellow" />
                      </div>
                      <span className="text-[8px] font-black text-brand-yellow uppercase tracking-widest">RESULTADO DA IA</span>
                      <p className="text-xl font-black italic text-white leading-tight uppercase tracking-tighter">
                        "Hoje é dia de resolver a janta sem bagunça. Pizza de calabresa por R$49,90 para receber agora em Juazeiro. Quer o cardápio?"
                      </p>
                   </div>
                </div>
            </div>

            {/* Barber Example */}
            <div className="bg-black p-6 md:p-12 space-y-10 group hover:bg-zinc-900 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-editorial-label text-brand-yellow">Barbearia VIP</span>
                    <h4 className="text-xl font-black uppercase text-white italic">Horários Vagos</h4>
                  </div>
                  <Scissors className="w-8 h-8 text-zinc-800 group-hover:text-brand-yellow transition-colors" />
                </div>
                <div className="space-y-6">
                   <div className="p-8 bg-zinc-900/50 border border-zinc-800 space-y-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase">Input do Dono</span>
                      <p className="text-sm font-medium italic text-zinc-400">"Horários vagos hoje à tarde."</p>
                   </div>
                   <div className="p-8 bg-brand-yellow/5 border-2 border-brand-yellow space-y-4">
                      <span className="text-[10px] font-black text-brand-yellow uppercase">Output Fotomax (Status/Story)</span>
                      <p className="text-base font-black italic text-white leading-tight uppercase tracking-tight">
                        "Sexta chegando e ainda tem horário para sair alinhado hoje. Garante o seu as 16h ou 17:30? Chama no Direct!"
                      </p>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 md:py-40 px-6 bg-black border-t border-white/5">
        <div className="max-w-[1600px] mx-auto space-y-24">
          <div className="swiss-grid">
             <div className="col-span-12 md:col-span-6 space-y-4">
                <span className="text-editorial-label text-brand-yellow">Workflow</span>
                <h2 className="text-editorial-h2 text-white">PROCESSO <br /> PRAGMÁTICO.</h2>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {[
              { step: "01", t: "CONTEXTO", d: "Pizzaria, salão, loja ou serviço local." },
              { step: "02", t: "OBJETIVO", d: "Oferta, cardápio, mensagem ou status." },
              { step: "03", t: "DETALHES", d: "Produto, preço e bairro." },
              { step: "04", t: "EXECUÇÃO", d: "Copie e utilize no Status, Story ou Zap." }
            ].map((s, i) => (
              <div key={i} className="group bg-black p-10 space-y-8 hover:bg-brand-yellow group transition-all">
                 <div className="text-4xl md:text-6xl font-display font-black italic opacity-10 group-hover:opacity-100 group-hover:text-black transition-all leading-none">{s.step}</div>
                 <div className="space-y-2">
                    <h4 className="text-xl font-black text-white group-hover:text-black uppercase italic tracking-tight leading-none">{s.t}</h4>
                    <p className="text-[10px] text-zinc-500 group-hover:text-black/70 font-black uppercase tracking-[0.2em] italic">{s.d}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Board */}
      <section id="precos" className="py-24 md:py-40 px-6 bg-black">
        <div className="max-w-[1600px] mx-auto space-y-24">
          <div className="text-center space-y-4">
            <span className="text-editorial-label text-brand-yellow">Access Plans</span>
            <h2 className="text-editorial-h2 text-white">MOTORIZADO PELO RESULTADO.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-800">
            {PRICING_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={cn(
                  "flex flex-col p-6 md:p-12 space-y-10 border-r border-zinc-800 last:border-r-0 relative transition-all",
                  plan.highlight ? "bg-zinc-900 border-x-4 border-x-brand-yellow" : "bg-black"
                )}
              >
                <div className="space-y-4">
                  <span className="text-editorial-label text-zinc-500">{plan.id.toUpperCase()}</span>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">{plan.name}</h3>
                </div>

                <div className="text-4xl font-black italic uppercase text-brand-yellow">
                  {plan.price}<span className="text-xs font-bold text-zinc-600 tracking-widest ml-2">{plan.period || '/Total'}</span>
                </div>

                <ul className="space-y-4 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-[10px] font-bold uppercase tracking-tight text-zinc-400">
                      <div className="w-1.5 h-1.5 bg-brand-yellow mt-1 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={handleStart}
                  className={cn(
                    "brand-button w-full py-5",
                    plan.highlight ? "bg-brand-yellow text-black" : "brand-button-outline"
                  )}
                >
                  {plan.id === 'trial' ? 'EXPERIMENTAR' : 'ASSINAR AGORA'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="py-24 md:py-40 px-6 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-6 md:p-12">
          <div className="lg:col-span-4">
            <h2 className="text-editorial-h2 text-white">DUVIDAS <br /> COMUNS.</h2>
          </div>
          
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
            {[
              { q: "O Fotomax IA vende por mim?", a: "Não. Criamos os textos e ações prontas para você usar. A venda é executada por você." },
              { q: "Ele envia WhatsApp sozinho?", a: "Não. Você copia e cola para manter total controle e segurança da sua conta." },
              { q: "Serve para qualquer negócio?", a: "O foco é negócio físico e local: salão, barbearia, loja e delivery." },
              { q: "O teste grátis é real?", a: "Sim. Oferecemos 1 criação completa gratuita para validação técnica da qualidade." }
            ].map((faq, i) => (
              <div key={i} className="bg-black p-10 space-y-6 hover:bg-zinc-900 transition-colors">
                 <h4 className="text-lg font-black text-white uppercase italic tracking-tight">{faq.q}</h4>
                 <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Board */}
      <section className="bg-brand-yellow text-black py-24 md:py-56 px-6 text-center">
        <div className="max-w-[1600px] mx-auto space-y-12">
           <h2 className="text-editorial-h1">PARE DE PERDER <br /> O BALCÃO PARA <br /> O SILÊNCIO.</h2>
           <button 
             onClick={handleStart}
             className="brand-button bg-black text-white px-16 md:px-24 py-8 text-xl md:text-3xl shadow-2xl"
           >
              CRIAR MINHA OFERTA AGORA
           </button>
        </div>
      </section>

      {/* Footer System */}
      <footer className="py-20 md:py-32 border-t border-zinc-900 px-6 bg-black">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start gap-6 md:p-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Logo className="text-brand-yellow w-8 h-8" />
              <span className="text-2xl font-display font-black tracking-tighter uppercase italic">Fotomax IA</span>
            </div>
            <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.3em]">Built for the local economy.</p>
          </div>

          <div className="flex flex-wrap gap-6 md:p-12 md:gap-24">
             <div className="space-y-4">
               <span className="text-editorial-label text-white">Links</span>
               <ul className="space-y-4">
                 <li><a href="#exemplos" className="text-[10px] uppercase font-bold text-zinc-500 hover:text-brand-yellow transition-colors">Exemplos</a></li>
                 <li><a href="#precos" className="text-[10px] uppercase font-bold text-zinc-500 hover:text-brand-yellow transition-colors">Planos</a></li>
                 <li><a href="#" className="text-[10px] uppercase font-bold text-zinc-500 hover:text-brand-yellow transition-colors">Suporte</a></li>
               </ul>
             </div>
             <div className="space-y-4">
               <span className="text-editorial-label text-white">Legal</span>
               <ul className="space-y-4">
                 <li><a href="#" className="text-[10px] uppercase font-bold text-zinc-500 hover:text-brand-yellow transition-colors">Termos</a></li>
                 <li><a href="#" className="text-[10px] uppercase font-bold text-zinc-500 hover:text-brand-yellow transition-colors">Privacidade</a></li>
               </ul>
             </div>
          </div>
          
          <div className="text-zinc-800 text-[10px] font-black uppercase tracking-widest pt-12 md:pt-0 self-end">
            © 2026 Fotomax Comercial AI
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
