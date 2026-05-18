import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  Copy, 
  ExternalLink, 
  Check,
  Smartphone,
  Users,
  Search,
  ShoppingCart,
  Zap,
  ArrowRight,
  Sparkles,
  RefreshCcw,
  Fingerprint,
  Target,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { cn } from '../lib/utils';
import { aiCore } from '../services/aiCore';
import { usageGuard } from '../services/usageGuard';
import { AIActionType } from '../types';

export function ZapRapido() {
  const { settings, user, saveUser, offers, campaigns } = useStorage() as any;
  const location = useLocation();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [customTexts, setCustomTexts] = useState<Record<string, string>>({});
  
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [selectedSourceType, setSelectedSourceType] = useState<'offer' | 'campaign' | ''>('');

  useEffect(() => {
    if (location.state?.message) {
      setCustomTexts(prev => ({
        ...prev,
        'avulso': location.state.message
      }));
    }
  }, [location.state]);

  const dna = user?.businessDNA || user?.businessProfile;

  const templates = [
    ...(location.state?.message ? [{
      id: 'avulso',
      title: 'Mensagem Trazida',
      icon: MessageCircle,
      color: 'text-amber-500',
      goal: 'vender_hoje',
      text: location.state.message
    }] : []),
    {
      id: 'novo',
      title: 'Cliente Novo',
      icon: Smartphone,
      color: 'text-amber-500',
      goal: 'vender_hoje',
      text: `Olá! Seja muito bem-vindo á [Nome do Negócio]. É um prazer te atender! 🍕\n\nComo posso te ajudar hoje? Se quiser conhecer nossas ofertas do dia, basta pedir nosso cardápio digital clicando aqui: [Link]`
    },
    {
      id: 'antigo',
      title: 'Cliente Antigo',
      icon: Users,
      color: 'text-blue-500',
      goal: 'recuperar_cliente',
      text: "Oi, tudo bem? Sentimos sua falta por aqui! 🏠\n\nPreparamos um cupom exclusivo de 10% OFF para sua próxima compra como forma de agradecimento pela parceria. \n\nCupom: VOLTEI10\nVálido até amanhã!"
    },
    {
      id: 'transmissao',
      title: 'Lista VIP',
      icon: Zap,
      color: 'text-purple-500',
      goal: 'vender_hoje',
      text: `🔥 OFERTA SURPRESA DA SEMANA!\n\nSomente para quem está na nossa lista VIP: [Produto] com desconto especial.\n\nRestam poucas unidades em estoque. Responda EU QUERO para reservar o seu agora!`
    },
    {
      id: 'sumiu',
      title: 'Pediu Preço e Sumiu',
      icon: Search,
      color: 'text-zinc-400',
      goal: 'recuperar_cliente',
      text: `Oi! Vi que você se interessou pelo [Produto] mais cedo, mas ainda não finalizou seu pedido. 🧐\n\nFicou com alguma dúvida sobre o tamanho, entrega ou pagamento? Estou aqui para te ajudar a garantir o seu!`
    },
    {
      id: 'pos_venda',
      title: 'Pós-Venda',
      icon: Check,
      color: 'text-green-500',
      goal: 'recuperar_cliente',
      text: `Olá! Passando para saber o que achou do seu pedido que chegou hoje. ⭐\n\nSua satisfação é muito importante para nós. Se puder nos avaliar com uma foto, seria incrível!`
    }
  ];

  const handlePersonalize = async (template: any) => {
    const actionType: AIActionType = 'zap_message';
    const check = usageGuard.canUseAI(user, actionType);
    
    if (!check.can) {
      alert(check.reason);
      return;
    }
    
    setLoadingId(template.id);
    
    let contextData = null;
    if (selectedSourceType === 'offer') {
       contextData = offers.find((o: any) => o.id === selectedSourceId);
    } else if (selectedSourceType === 'campaign') {
       contextData = campaigns.find((c: any) => c.id === selectedSourceId);
    }

    try {
      // Consume credits
      const updatedUser = usageGuard.consumeCredits(user, actionType);
      saveUser(updatedUser);

      const result = await aiCore.run(actionType, {
        input: {
           stage: template.title,
           goal: template.goal,
           businessName: dna?.businessName || dna?.basics?.businessName || settings?.name || 'Seu Negócio',
           product: dna?.highestProfitProduct || dna?.products?.mainProducts?.[0]?.name || 'nosso produto',
           tone: dna?.brandTone || dna?.strategy?.brandTone || 'direto'
        },
        businessProfile: dna,
        sourceAction: contextData
      });
      
      if (result.success) {
         setCustomTexts(prev => ({
           ...prev,
           [template.id]: result.data.result?.message || result.data.result?.shortMessage || result.data.result?.whatsapp_message || 'Erro ao extrair mensagem do JSON.'
         }));
      } else {
         alert("Erro na IA: " + result.error);
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao comunicar com IA');
    } finally {
      setLoadingId(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    let finalText = customTexts[id] || text;
    const businessName = dna?.businessName || settings?.name;
    if (businessName) {
      finalText = finalText.replace(/\[Nome do Negócio\]/g, businessName);
    }
    
    navigator.clipboard.writeText(finalText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenWhatsApp = (text: string, id: string) => {
    let finalText = customTexts[id] || text;
    const businessName = dna?.businessName || settings?.name;
    if (businessName) {
      finalText = finalText.replace(/\[Nome do Negócio\]/g, businessName);
    }

    // Usually we would need phone number, but users generate links to copy to their Whatsapp Web
    // So we just copy text for now if no specific client number is defined
    navigator.clipboard.writeText(finalText);
    alert("Mensagem copiada! Abra o WhatsApp Web e cole para a pessoa.");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32 animate-fade-in px-4 md:px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-16 pt-12">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
                <span className="text-editorial-label text-green-500/50">Module Direct Response / v3.0</span>
              </div>
              <h1 className="text-editorial-h2 text-white italic tracking-tighter uppercase font-black leading-[0.8]">
                ZAP <br /> <span className="text-green-500 text-glow">RÁPIDO</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/10" />
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic leading-relaxed max-w-sm">
                HIGH CONVERSION MESSAGES FOR 1 TO 1 PROTOCOLS.
              </p>
            </div>
          </div>
          
          {dna && (
           <div className="flex items-center gap-4 bg-zinc-950 p-6 border border-white/5">
             <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-green-500" />
             </div>
             <div className="space-y-1">
               <span className="block text-[8px] font-black text-zinc-700 uppercase tracking-widest">DNA STATUS</span>
               <span className="block text-[10px] font-black text-green-500 uppercase tracking-[0.2em] italic">SYNCHRONIZED ACTIVE</span>
             </div>
           </div>
          )}
        </header>

        {/* Source Selector: Sharp Grid Look */}
        <div className="bg-white/5 border border-white/5 p-[1px] grid grid-cols-1 lg:grid-cols-2">
           <div className="bg-black p-10 space-y-6">
              <div className="flex items-center gap-3">
                 <RefreshCcw className="w-4 h-4 text-zinc-700" />
                 <h3 className="text-editorial-label text-zinc-600 uppercase">Input Neural Context</h3>
              </div>
              <div className="flex gap-[1px] bg-white/5 border border-white/5">
                <select
                   value={selectedSourceType}
                   onChange={(e: any) => { setSelectedSourceType(e.target.value); setSelectedSourceId(''); }}
                   className="flex-1 bg-black p-5 text-[10px] font-black uppercase tracking-widest italic text-white outline-none hover:bg-zinc-950 transition-all cursor-pointer appearance-none"
                >
                   <option value="">-- NO SOURCE --</option>
                   {offers?.length > 0 && <option value="offer">LOAD OFFER</option>}
                   {campaigns?.length > 0 && <option value="campaign">LOAD CAMPAIGN</option>}
                </select>
                <div className="w-12 flex items-center justify-center bg-zinc-900 border-l border-white/5">
                   <Target className="w-4 h-4 text-zinc-700" />
                </div>
              </div>
           </div>

           <div className="bg-black p-10 space-y-6 lg:border-l border-white/5">
              {selectedSourceType ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-brand-yellow" />
                    <h3 className="text-editorial-label text-zinc-600 uppercase">Selected Data Packet</h3>
                  </div>
                  <select
                    value={selectedSourceId}
                    onChange={(e) => setSelectedSourceId(e.target.value)}
                    className="w-full bg-zinc-950 p-5 text-[10px] font-black uppercase tracking-widest italic text-white outline-none hover:bg-black transition-all border border-white/5 appearance-none"
                  >
                    <option value="">SELECIONE A FONTE DE DADOS...</option>
                    {selectedSourceType === 'offer' 
                      ? offers.map((o: any) => <option key={o.id} value={o.id}>{o.outputs?.offerName || o.input?.productOrService}</option>)
                      : campaigns.map((c: any) => <option key={c.id} value={c.id}>{c.outputs?.headline || c.input?.productOrService}</option>)
                    }
                  </select>
                </>
              ) : (
                <div className="h-full flex items-center justify-center opacity-30">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">WAITING FOR SOURCE SELECTION</p>
                </div>
              )}
           </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {templates.map((t) => (
            <div key={t.id} className="flex flex-col h-full bg-zinc-950 border border-white/5 hover:border-green-500/50 transition-all group relative overflow-hidden">
              <div className="bg-black p-8 flex-1 space-y-8 flex flex-col">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className={cn("w-12 h-12 flex items-center justify-center border border-white/5 transition-colors group-hover:bg-zinc-950", t.color)}>
                          <t.icon className="w-5 h-5" />
                       </div>
                       <h3 className="text-sm font-black uppercase italic tracking-tighter text-white">{t.title}</h3>
                    </div>
                 </div>

                 <div className="flex-1 bg-zinc-950/50 border border-white/5 p-6 relative group/inner">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-20 group-hover/inner:opacity-100 transition-opacity">
                       <div className="w-1 h-1 bg-green-500" />
                       <div className="w-1 h-1 bg-green-500 animate-pulse" />
                    </div>
                    {loadingId === t.id ? (
                      <div className="h-40 flex flex-col items-center justify-center gap-4">
                        <RefreshCcw className="w-6 h-6 text-green-500 animate-spin" />
                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest italic animate-pulse">CALIBRATING ZAP...</span>
                      </div>
                    ) : (
                      <p className="text-[11px] font-black uppercase italic tracking-widest text-zinc-500 group-hover:text-zinc-300 leading-relaxed whitespace-pre-wrap transition-colors">
                        {customTexts[t.id] || t.text.replace(/\[Nome do Negócio\]/g, settings?.name || '[SEU NEGÓCIO]')}
                      </p>
                    )}
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => handlePersonalize(t)}
                     disabled={loadingId === t.id}
                     className="bg-black border border-white/5 p-4 flex flex-col items-center gap-2 hover:bg-brand-yellow hover:text-black transition-all group/btn disabled:opacity-30"
                   >
                     <Sparkles className="w-4 h-4 text-brand-yellow group-hover/btn:text-black transition-colors" />
                     <span className="text-[8px] font-black uppercase tracking-widest">PERSONALIZE</span>
                   </button>
                   
                   <button 
                     onClick={() => handleCopy(t.text, t.id)}
                     className="bg-green-500 text-black p-4 flex flex-col items-center gap-2 hover:bg-white transition-all group/btn"
                   >
                     {copiedId === t.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                     <span className="text-[8px] font-black uppercase tracking-widest">{copiedId === t.id ? 'SYNKED!' : 'COPY PROTO'}</span>
                   </button>
                 </div>
              </div>
              
              <div className="h-1 bg-white/5 group-hover:bg-green-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
