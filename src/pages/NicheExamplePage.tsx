import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStorage } from '../hooks/useStorage';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Utensils, 
  Scissors, 
  Star, 
  ShoppingBag, 
  Hammer,
  Zap,
  MessageSquare,
  Package,
  Layout
} from 'lucide-react';
import { Logo } from '../components/Logo';

const NICHE_DATA = {
  alimentacao: {
    title: 'Alimentação',
    tagline: 'Pizzarias, Hamburguerias, Açaíterias e Delivery',
    icon: Utensils,
    pains: [
      'Dificuldade para criar o cardápio do dia',
      'Produto parado que precisa girar rápido',
      'Clientes que pedem preço e não respondem',
      'Status do WhatsApp sem fotos ou textos atraentes'
    ],
    creations: [
      { t: 'Cardápio Digital', d: 'Crie um cardápio simples e direto para enviar no WhatsApp.' },
      { t: 'Combos Lucrativos', d: 'Monte pacotes que aumentam o valor médio de cada venda.' },
      { t: 'Oferta Relâmpago', d: 'Ações para vender o que está parado agora mesmo.' }
    ],
    examples: [
      {
        input: 'Frango com catupiry, R$39,90, delivery grátis à noite.',
        output: 'Bateu a fome e não quer cozinhar? 🍗 Nossa Pizza de Frango com Catupiry está saindo hoje por R$39,90 com entrega grátis no bairro. É só pedir pelo WhatsApp e esperar chegar. Quer que eu te mande o cardápio?'
      },
      {
        input: 'Combo 2 burguers + refri 2L.',
        output: 'Noite de combo em família! 🍔 Pegando 2 clássicos hoje, o refri de 2L é por nossa conta. Ideal para resolver a janta rápido e sem bagunça. Quantos vocês são aí hoje?'
      },
      {
        input: 'Açaí 500ml com 3 acompanhamentos.',
        output: 'Calor pedindo um açaí geladinho? 🍨 Monte o seu de 500ml com 3 acompanhamentos por preço especial de hoje. Chama no zap e eu te mando os adicionais disponíveis!'
      }
    ]
  },
  barbearia: {
    title: 'Barbearia',
    tagline: 'Cortes, Barba e Estilo Masculino',
    icon: Scissors,
    pains: [
      'Horários vazios no meio da semana',
      'Cliente antigo que não volta faz tempo',
      'Dificuldade para divulgar combos de serviço',
      'Status do WhatsApp sem movimentação'
    ],
    creations: [
      { t: 'Agenda Aberta', d: 'Recupere horários vagos com mensagens persuasivas.' },
      { t: 'Resgate de Cliente', d: 'Mensagens automáticas para quem sumiu da cadeira.' },
      { t: 'Visual Branding', d: 'Ideias de como mostrar seu trabalho no Instagram.' }
    ],
    examples: [
      {
        input: 'Vaga para corte hoje às 15h.',
        output: 'Fala mestre! Abriu um horário aqui às 15h para você sair alinhado hoje. Quem chega primeiro leva. Quer que eu garanta essa vaga para você?'
      },
      {
        input: 'Combo Corte + Barba + Sobrancelha.',
        output: 'Pacote completo para quem quer dar aquele trato geral. Corte, barba e sobrancelha com valor especial de terça a quinta. Quer ver os horários disponíveis?'
      },
      {
        input: 'Cliente antigo que não aparece.',
        output: 'Fala [Nome]! Vi que faz tempo que não passa aqui. A cadeira está te esperando para aquele talento. Tem algum dia dessa semana que fica bom para você?'
      }
    ]
  },
  salao: {
    title: 'Salão & Estética',
    tagline: 'Beleza, Manicure e Cuidados Pessoais',
    icon: Star,
    pains: [
      'Agenda difícil de preencher na segunda e terça',
      'Pacotes de serviços que ninguém conhece',
      'Confiança das novas clientes',
      'Falta de tempo para criar posts bonitos'
    ],
    creations: [
      { t: 'Pacotes Mensais', d: 'Crie ofertas recorrentes para fidelizar clientes.' },
      { t: 'Prova Social', d: 'Aprenda a pedir e divulgar feedbacks reais.' },
      { t: 'Story Estratégico', d: 'O que postar durante o procedimento para atrair mais gente.' }
    ],
    examples: [
      {
        input: 'Escova e hidratação na promoção de terça.',
        output: 'Dia de se cuidar sem pesar no bolso! ✨ Escova + Hidratação com valor especial só hoje. Poucas vagas disponíveis. Quer garantir a sua?'
      },
      {
        input: 'Manicure e Pedicure com horário livre.',
        output: 'Unhas perfeitas para a semana! Tenho um horário livre para manicure e pedicure hoje à tarde. Vamos agendar?'
      },
      {
        input: 'Limpeza de pele profunda.',
        output: 'Sua pele merece esse cuidado. Agende sua limpeza de pele profunda e sinta a diferença na hora. Quer saber mais sobre o procedimento?'
      }
    ]
  },
  loja: {
    title: 'Loja Física',
    tagline: 'Roupas, Acessórios e Varejo Local',
    icon: ShoppingBag,
    pains: [
      'Estoque parado que não gira',
      'Clientes que olham o Status mas não chamam',
      'Novidades que chegam e ninguém vê',
      'Dificuldade para montar looks que vendem'
    ],
    creations: [
      { t: 'Vitrine Virtual', d: 'Transforme fotos simples em vitrines que vendem.' },
      { t: 'Últimas Peças', d: 'Crie urgência real para limpar o estoque.' },
      { t: 'Atendimento Pró-ativo', d: 'O que mandar para a cliente quando chega algo do estilo dela.' }
    ],
    examples: [
      {
        input: 'Chegaram blusas novas de viscose.',
        output: 'Acabaram de chegar peças fresquinhas por aqui! 🌸 Blusas em viscose, cores lindas e caimento perfeito. Quer que eu te mande fotos das cores no seu tamanho?'
      },
      {
        input: 'Vestidos com 20% de desconto.',
        output: 'Últimas unidades dos nossos vestidos favoritos com 20% de desconto para fechar o estoque. Restam poucos tamanhos. Quer ver se o seu ainda está aqui?'
      },
      {
        input: 'Look completo para o fim de semana.',
        output: 'Fim de semana chegando e você merece um look novo. Montei esse conjunto pensando em praticidade e estilo. Gostou? Me chama que eu te passo os valores!'
      }
    ]
  },
  servicos: {
    title: 'Serviços Locais',
    tagline: 'Consertos, Manutenção e Assistência',
    icon: Hammer,
    pains: [
      'Explicar o valor do serviço para quem acha caro',
      'Clientes que somem depois do orçamento',
      'Insegurança do cliente com serviço técnico',
      'Divulgar que você atende em domicílio'
    ],
    creations: [
      { t: 'Orçamento Profissional', d: 'Textos que transmitem confiança e autoridade.' },
      { t: 'Follow-up de Venda', d: 'Como cobrar o cliente que não respondeu o preço.' },
      { t: 'Antes e Depois', d: 'Exiba a qualidade do seu trabalho de forma impactante.' }
    ],
    examples: [
      {
        input: 'Troca de tela de celular em 1 hora.',
        output: 'Celular quebrado não dá para esperar. 📱 Trocamos sua tela em até 1 hora com garantia e peças de qualidade. Quer que eu veja um horário para você trazer agora?'
      },
      {
        input: 'Manutenção de ar condicionado.',
        output: 'O calor não perdoa ar condicionado sujo. ❄️ Garanta o conforto da sua família com uma limpeza completa e revisão. Quer um orçamento rápido por aqui?'
      },
      {
        input: 'Serviço de encanador 24h.',
        output: 'Emergência com vazamento? Atendemos 24h em toda a região com agilidade e preço justo. Me chama aqui que resolvemos seu problema agora.'
      }
    ]
  }
};

export function NicheExamplePage() {
  const { nicheId } = useParams<{ nicheId: string }>();
  const navigate = useNavigate();
  const { saveActivityEvent } = useStorage();
  const data = NICHE_DATA[nicheId as keyof typeof NICHE_DATA];

  React.useEffect(() => {
    saveActivityEvent({
      type: 'page_view',
      page: `example_niche_${nicheId}`,
      timestamp: new Date().toISOString()
    });
  }, [nicheId]);

  if (!data) return <div>Nicho não encontrado</div>;

  const handleStart = () => {
    saveActivityEvent({
      type: 'click_cta',
      label: 'testar_gratis_niche',
      source: `niche_${nicheId}`,
      timestamp: new Date().toISOString()
    });
    navigate('/register');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black min-h-screen text-white"
    >
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 md:gap-2 hover:text-amber-500 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">Voltar</span>
          </button>
          
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg flex items-center justify-center">
              <Logo className="text-white" />
            </div>
            <span className="text-base md:text-lg font-black title-display tracking-tighter uppercase italic">Fotomax IA</span>
          </div>

          <button 
            onClick={() => navigate('/register')}
            className="bg-amber-500 text-black px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all"
          >
            Começar
          </button>
        </div>
      </nav>

      <main className="pt-24 md:pt-32 pb-12 md:pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-20">
          {/* Header */}
          <div className="text-center space-y-4 md:space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500/10 border border-amber-500/20 rounded-2xl md:rounded-[2rem] flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-2xl shadow-amber-500/5">
              <data.icon className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl md:text-7xl font-black title-display uppercase italic tracking-tighter leading-tight">
              Fotomax para <br className="md:hidden" /> {data.title}
            </h1>
            <p className="text-zinc-500 text-base md:text-xl font-medium italic px-4 md:px-0">
              {data.tagline}
            </p>
          </div>

          {/* Pains */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl md:rounded-[3rem] p-6 md:p-16 space-y-8 md:space-y-12">
            <div className="space-y-2 md:space-y-4">
              <h2 className="text-2xl md:text-3xl font-black title-display uppercase italic tracking-tighter text-white leading-tight">Problemas comuns</h2>
              <p className="text-zinc-500 text-xs md:text-sm font-medium">O dono de {data.title.toLowerCase()} enfrenta desafios reais.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {data.pains.map((pain, i) => (
                <div key={i} className="flex items-start gap-3 md:gap-4 bg-black/20 p-4 rounded-xl border border-zinc-800/50">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                  <p className="text-zinc-400 text-[11px] md:text-sm font-medium leading-relaxed">{pain}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Creations */}
          <section className="space-y-8 md:space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black title-display uppercase italic tracking-tighter">O que o Fotomax cria</h2>
              <p className="text-zinc-500 text-xs md:text-sm font-medium">Ações práticas para usar no seu dia.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {data.creations.map((item, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] space-y-3 md:space-y-4">
                   <div className="w-10 h-10 bg-black rounded-xl border border-zinc-800 flex items-center justify-center">
                      <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                   </div>
                   <h4 className="text-base md:text-lg font-black uppercase italic tracking-tight">{item.t}</h4>
                   <p className="text-[11px] md:text-xs text-zinc-500 font-medium leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Examples */}
          <section className="space-y-8 md:space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-black title-display uppercase italic tracking-tighter">Exemplos Práticos</h2>
              <p className="text-zinc-500 text-xs md:text-sm font-medium">Divulgações que você pode copiar e usar.</p>
            </div>
            <div className="space-y-4 md:space-y-6">
              {data.examples.map((ex, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row">
                  <div className="p-6 md:p-8 md:w-1/3 bg-black/40 border-b md:border-b-0 md:border-r border-zinc-800">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Sua entrada:</p>
                    <p className="text-xs md:text-sm font-medium text-zinc-400 italic">"{ex.input}"</p>
                  </div>
                  <div className="p-6 md:p-8 flex-1 bg-zinc-900/50">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">Sugestão Pronta:</p>
                    <p className="text-xs md:text-sm font-medium text-zinc-200 leading-relaxed italic">"{ex.output}"</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className="text-center bg-zinc-900 p-8 md:p-6 md:p-16 rounded-[2rem] md:rounded-[4rem] border-2 border-amber-500 space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-4xl font-black title-display uppercase italic tracking-tighter leading-tight shrink-0">Pronto para acelerar seu {data.title.toLowerCase()}?</h2>
            <p className="text-zinc-500 text-sm md:text-base font-medium">Crie sua primeira ação grátis agora.</p>
            <button 
              onClick={handleStart}
              className="w-full sm:w-auto bg-amber-500 text-black px-10 md:px-6 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-3 mx-auto"
            >
              Testar Grátis Agora <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </section>
        </div>
      </main>
    </motion.div>
  );
}
