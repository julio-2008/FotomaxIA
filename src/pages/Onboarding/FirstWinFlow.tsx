import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { onboardingEngine } from '../../services/onboardingEngine';
import { ChevronRight, ChevronLeft, Loader2, Rocket, Store, Target, User, MapPin, Send } from 'lucide-react';

export function FirstWinFlow() {
  const navigate = useNavigate();
  const { user, saveOnboardingProfile, saveBusinessDNA, canGenerateCampaign, incrementUsage } = useStorage() as any;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: '',
    businessType: 'serviços',
    currentProblem: 'vender hoje',
    productOrService: '',
    price: '',
    targetAudience: '',
    mainObjection: '',
    city: '',
    channel: 'whatsapp'
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleGenerate = async () => {
    if (!canGenerateCampaign()) {
      alert("Seu teste grátis acabou. Assine para continuar.");
      return;
    }

    setLoading(true);
    try {
      const profile = {
        ...form,
        id: 'onb_' + Date.now(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create mini DNA
      const miniDNA = onboardingEngine.createMiniDNAFromOnboarding(profile, user.id);
      saveBusinessDNA(miniDNA);
      saveOnboardingProfile(profile);

      // Generate action
      const result = await onboardingEngine.generateFirstWin(profile, user);
      incrementUsage('campaign_generation'); // Default to campaign cost for now
      
      // Navigate to result with the data
      navigate('/onboarding/resultado', { state: { result: result.result || result, profile: form } });
    } catch (e) {
      console.error(e);
      alert("Houve um erro na geração.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Seu Negócio', icon: Store },
    { title: 'Seu Objetivo', icon: Target },
    { title: 'Seu Produto', icon: Rocket },
    { title: 'Seu Público', icon: User },
    { title: 'Canal', icon: Send }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-8">
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8">
           {steps.map((s, i) => (
             <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step > i + 1 ? 'bg-amber-500 text-white' : step === i + 1 ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                   {step > i + 1 ? <CheckIcon /> : <s.icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step === i + 1 ? 'text-white' : 'text-zinc-600'}`}>{s.title}</span>
             </div>
           ))}
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <h2 className="text-2xl font-black uppercase mb-2">Qual seu tipo de negócio?</h2>
                <p className="text-zinc-500 text-sm font-medium">Isso ajuda a IA a definir o tom da sua marca.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Alimentação', 'Beleza', 'Moda', 'Serviços', 'Barbearia', 'Saúde', 'Pet Shop', 'Outro'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setForm({...form, businessType: type})}
                    className={`p-4 rounded-xl font-bold text-sm text-left border transition ${form.businessType === type ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-400 border-transparent hover:border-zinc-700'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div>
                 <label className="block text-zinc-500 font-bold uppercase text-[10px] mb-2">Nome do Negócio</label>
                 <input 
                   type="text"
                   value={form.businessName}
                   onChange={e => setForm({...form, businessName: e.target.value})}
                   className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none focus:border-amber-500 transition"
                   placeholder="Ex: Fotografia do João"
                 />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div>
                <h2 className="text-2xl font-black uppercase mb-2">O que quer resolver?</h2>
                <p className="text-zinc-500 text-sm font-medium">Escolha seu maior desafio hoje.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'vender hoje', label: 'Vender hoje (Ação rápida)' },
                  { id: 'criar oferta', label: 'Criar uma oferta nova' },
                  { id: 'recuperar cliente', label: 'Recuperar clientes sumidos' },
                  { id: 'lotar agenda', label: 'Lotar minha agenda' },
                  { id: 'mensagem para WhatsApp', label: 'Criar mensagem para WhatsApp' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setForm({...form, currentProblem: opt.id})}
                    className={`p-4 rounded-xl font-bold text-sm text-left border transition flex items-center justify-between ${form.currentProblem === opt.id ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-400 border-transparent hover:border-zinc-700'}`}
                  >
                    {opt.label}
                    {form.currentProblem === opt.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div>
                <h2 className="text-2xl font-black uppercase mb-2">O que você vende?</h2>
                <p className="text-zinc-500 text-sm font-medium">Foque no produto ou serviço principal dessa ação.</p>
              </div>
              <div className="space-y-4">
                 <div>
                   <label className="block text-zinc-500 font-bold uppercase text-[10px] mb-2">Produto ou Serviço</label>
                   <input 
                     type="text"
                     value={form.productOrService}
                     onChange={e => setForm({...form, productOrService: e.target.value})}
                     className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none focus:border-amber-500 transition"
                     placeholder="Ex: Ensaio Smash the Cake"
                   />
                 </div>
                 <div>
                   <label className="block text-zinc-500 font-bold uppercase text-[10px] mb-2">Preço (Opcional)</label>
                   <input 
                     type="text"
                     value={form.price}
                     onChange={e => setForm({...form, price: e.target.value})}
                     className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none focus:border-amber-500 transition"
                     placeholder="Ex: R$ 297,00"
                   />
                 </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div>
                <h2 className="text-2xl font-black uppercase mb-2">Quem compra?</h2>
                <p className="text-zinc-500 text-sm font-medium">Quem é seu cliente ideal?</p>
              </div>
              <div className="space-y-4">
                 <div>
                   <label className="block text-zinc-500 font-bold uppercase text-[10px] mb-2">Público Principal</label>
                   <input 
                     type="text"
                     value={form.targetAudience}
                     onChange={e => setForm({...form, targetAudience: e.target.value})}
                     className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none focus:border-amber-500 transition"
                     placeholder="Ex: Mães com bebês de 1 ano"
                   />
                 </div>
                 <div>
                   <label className="block text-zinc-500 font-bold uppercase text-[10px] mb-2">Principal Objeção</label>
                   <input 
                     type="text"
                     value={form.mainObjection}
                     onChange={e => setForm({...form, mainObjection: e.target.value})}
                     className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none focus:border-amber-500 transition"
                     placeholder="Ex: Acham que é caro ou não têm tempo"
                   />
                 </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div>
                <h2 className="text-2xl font-black uppercase mb-2">Onde vai usar?</h2>
                <p className="text-zinc-500 text-sm font-medium">Escolha o canal de divulgação.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'whatsapp', label: 'WhatsApp (Conversa Direta)' },
                  { id: 'instagram', label: 'Instagram (Feed/Stories)' },
                  { id: 'status', label: 'Status do WhatsApp' },
                  { id: 'todos', label: 'Todos os canais' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setForm({...form, channel: opt.id})}
                    className={`p-4 rounded-xl font-bold text-sm text-left border transition flex items-center justify-between ${form.channel === opt.id ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-400 border-transparent hover:border-zinc-700'}`}
                  >
                    {opt.label}
                    {form.channel === opt.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button 
              onClick={handleBack}
              className="px-6 py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-700 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {step < 5 ? (
            <button 
              onClick={handleNext}
              disabled={step === 1 && !form.businessName}
              className="flex-1 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Próximo <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 px-8 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(245,158,11,0.2)]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Rocket className="w-5 h-5" /> Gerar Minha Primeira Ação</>}
            </button>
          )}
        </div>

        <div className="flex justify-center flex-col items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-widest transition">
            Pular e ir para o Dashboard
          </button>
          {loading && (
            <p className="text-zinc-500 text-[10px] font-bold animate-pulse text-center leading-relaxed">
              O Fotomax IA está processando seu DNA Comercial<br/>para criar algo único para o seu negócio.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  );
}
