import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Flame, 
  Scissors, 
  Sparkles, 
  ShoppingBag, 
  Wrench, 
  Store,
  ChevronRight,
  ArrowRight,
  Target,
  Smartphone,
  Star
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { aiCore } from '../services/aiCore';
import { BUSINESS_KITS, BusinessNiche } from '../lib/data/businessKits';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function FirstVictory() {
  const navigate = useNavigate();
  const { user, saveBusinessDNA, incrementUsage, canGenerateCampaign, saveCampaign } = useStorage() as any;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [niche, setNiche] = useState<BusinessNiche>('alimentacao');
  const [selectedAction, setSelectedAction] = useState<string>('');
  
  const [formData, setFormData] = useState({
    businessName: user?.businessDNA?.basics?.businessName || '',
    productOrService: '',
    price: '',
    city: user?.businessDNA?.basics?.city || '',
    observation: ''
  });

  const kit = BUSINESS_KITS[niche] || BUSINESS_KITS.outro;
  const actions = kit.actions.slice(0, 5);

  const handleCreate = async () => {
    if (!formData.productOrService) return alert("Diga o que você quer divulgar.");
    
    setLoading(true);
    try {
      // Create a partial DNA if not exists
      if (!user?.businessDNA) {
        const partialDna = {
          basics: {
            businessName: formData.businessName,
            businessType: niche,
            city: formData.city,
          },
          products: {
            mainProducts: formData.productOrService,
            bestSellerProduct: formData.productOrService
          }
        };
        saveBusinessDNA(partialDna);
      }

      const payload = {
        actionType: 'first_victory',
        niche,
        action: selectedAction,
        ...formData
      };

      const result = await aiCore.run('campaign_generation', {
        input: payload,
        businessProfile: user?.businessDNA || { basics: { businessType: niche, businessName: formData.businessName } },
        businessKit: kit
      });

      if (result.success) {
        const campaign = {
          id: 'vitoria_' + Date.now(),
          name: `Primeira Vitória: ${selectedAction}`,
          type: 'vitoria',
          status: 'ready',
          createdAt: new Date().toISOString(),
          inputs: payload,
          outputs: result.data.result,
          score: result.data.quality?.finalScore || 85
        };
        
        saveCampaign(campaign);
        incrementUsage();
        navigate(`/campanha/${campaign.id}`);
      } else {
        alert("Erro na geração. Tente novamente.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao processar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-6 md:p-12 pb-32">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" /> Primeira Vitória
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Vamos criar sua primeira <span className="text-amber-500">divulgação pronta</span>
          </h1>
          <p className="text-zinc-500 text-sm">Em menos de 3 minutos você terá material pronto para usar no seu negócio.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 md:p-6 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Star className="w-40 h-40" />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 relative z-10"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold uppercase italic tracking-tight">Qual o seu tipo de negócio?</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'alimentacao', label: 'Alimentação', icon: Flame, color: 'text-orange-500' },
                    { id: 'barbearia', label: 'Barbearia', icon: Scissors, color: 'text-cyan-500' },
                    { id: 'beleza', label: 'Salão / Estética', icon: Sparkles, color: 'text-amber-500' },
                    { id: 'loja', label: 'Loja Física', icon: ShoppingBag, color: 'text-pink-500' },
                    { id: 'servicos', label: 'Serviços', icon: Wrench, color: 'text-emerald-500' },
                    { id: 'outro', label: 'Outro', icon: Store, color: 'text-zinc-400' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setNiche(item.id as BusinessNiche); setStep(2); }}
                      className={cn(
                        "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 text-center bg-zinc-950",
                        niche === item.id ? "border-amber-500 bg-amber-500/5" : "border-zinc-800 hover:border-zinc-700"
                      )}
                    >
                      <item.icon className={cn("w-6 h-6", item.color)} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 relative z-10"
              >
                <div className="text-center">
                  <button onClick={() => setStep(1)} className="text-zinc-500 text-[10px] font-bold uppercase mb-4 hover:text-white flex items-center justify-center gap-1 mx-auto">
                    Mudar tipo de negócio
                  </button>
                  <h3 className="text-xl font-bold uppercase italic tracking-tight">O que você quer fazer agora?</h3>
                </div>

                <div className="grid gap-3">
                  {actions.map((act, index) => (
                    <button
                      key={`action-${niche}-${index}`}
                      onClick={() => { setSelectedAction(act.title); setStep(3); }}
                      className="group p-5 rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-left flex justify-between items-center"
                    >
                      <div>
                        <span className="block text-sm font-bold text-white mb-1">{act.title}</span>
                        <span className="block text-xs text-zinc-500">{act.desc}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-amber-500" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 relative z-10"
              >
                <div className="text-center">
                  <button onClick={() => setStep(2)} className="text-zinc-500 text-[10px] font-bold uppercase mb-4 hover:text-white flex items-center justify-center gap-1 mx-auto">
                    Trocar ação
                  </button>
                  <h3 className="text-xl font-bold uppercase italic tracking-tight">Só o essencial para começar</h3>
                  <p className="text-zinc-500 text-xs">Preencha o básico e a IA faz o resto.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Nome do Negócio</label>
                    <input 
                      type="text" 
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm"
                      placeholder="Ex: Pizzaria do João"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                       {niche === 'alimentacao' ? 'Prato ou Item da Oferta' : 
                        niche === 'barbearia' ? 'Serviço ou Combo' : 
                        'O que você vai divulgar?'}
                    </label>
                    <input 
                      type="text" 
                      value={formData.productOrService}
                      onChange={(e) => setFormData({...formData, productOrService: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm"
                      placeholder="Ex: Combo Pizza G + Refri"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Preço (Opcional)</label>
                      <input 
                        type="text" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm"
                        placeholder="Ex: 49,90"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Local (Opcional)</label>
                      <input 
                        type="text" 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm"
                        placeholder="Cidade/Bairro"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleCreate}
                      disabled={loading}
                      className="w-full bg-amber-500 text-black p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {loading ? 'Processando...' : (
                        <>
                          Criar minha primeira ação <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="flex items-center gap-3 justify-center text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
           <Smartphone className="w-4 h-4" />
           Perfeito para Status do WhatsApp, Instagram e Facebook.
        </div>
      </div>
    </div>
  );
}
