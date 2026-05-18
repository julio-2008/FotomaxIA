import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { CheckCircle2, Circle, ArrowRight, Sparkles, X } from 'lucide-react';

export function ActivationChecklist() {
  const navigate = useNavigate();
  const { 
    user,
    activationChecklist, 
    saveActivationChecklist,
    campaigns = [],
    offers = [],
    activityEvents = [],
    resultRecords = [],
    businessDNA
  } = useStorage() as any;

  // Sync checklist state
  useEffect(() => {
    if (!activationChecklist) {
      saveActivationChecklist({
        userId: 'current',
        firstActionCreated: false,
        dnaCompleted: false,
        firstOfferCreated: false,
        firstCampaignCreated: false,
        firstZapCreated: false,
        firstCustomerCreated: false,
        firstResultRegistered: false,
        dismissed: false,
        updatedAt: new Date().toISOString()
      });
      return;
    }

    const updated = { ...activationChecklist };
    let changed = false;

    if (campaigns.length > 0 && !updated.firstCampaignCreated) {
      updated.firstCampaignCreated = true;
      changed = true;
    }
    if (offers.length > 0 && !updated.firstOfferCreated) {
      updated.firstOfferCreated = true;
      changed = true;
    }
    if ((businessDNA?.basics?.businessName || user?.businessProfile?.businessName) && !updated.dnaCompleted) {
       updated.dnaCompleted = true;
       changed = true;
    }
    if (resultRecords.length > 0 && !updated.firstResultRegistered) {
       updated.firstResultRegistered = true;
       changed = true;
    }
    // and so on...

    if (changed) {
      saveActivationChecklist(updated);
    }
  }, [campaigns, offers, businessDNA, resultRecords, activationChecklist]);

  if (!activationChecklist || activationChecklist.dismissed) return null;

  const items = [
    { key: 'dnaCompleted', label: 'Completar DNA Comercial', path: '/dna-comercial', desc: 'Melhora a inteligência do app.' },
    { key: 'firstCampaignCreated', label: 'Criar primeira campanha', path: '/campanhas', desc: 'Sua presença frequente nas redes.' },
    { key: 'firstOfferCreated', label: 'Criar primeira oferta', path: '/ofertas', desc: 'O motor de vendas do seu negócio.' },
    { key: 'firstResultRegistered', label: 'Registrar resultado', path: '/resultados/registrar', desc: 'Para o app aprender o que funciona.' }
  ];

  const completedCount = items.filter(item => activationChecklist[item.key]).length;

  if (completedCount === items.length) return null;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 mb-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <button onClick={() => saveActivationChecklist({...activationChecklist, dismissed: true})} className="text-zinc-600 hover:text-white transition">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <div className="flex items-center gap-2">
             <Sparkles className="w-4 h-4 text-amber-500" />
             <h3 className="text-white font-black uppercase tracking-tight text-sm">Checklist de Ativação</h3>
           </div>
           <p className="text-zinc-500 text-xs font-medium">Complete estes passos para dominar o Fotomax IA e vender mais.</p>
           <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
             <div 
               className="bg-amber-500 h-full transition-all duration-1000" 
               style={{ width: `${(completedCount / items.length) * 100}%` }}
             />
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 lg:ml-8">
           {items.map((item) => (
             <div 
               key={item.key}
               onClick={() => !activationChecklist[item.key] && navigate(item.path)}
               className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between h-full ${activationChecklist[item.key] ? 'border-amber-500/20 bg-amber-500/5 opacity-50' : 'border-zinc-800 bg-zinc-950 hover:border-amber-500/50'}`}
             >
                <div className="flex items-center gap-2 mb-2">
                   {activationChecklist[item.key] ? <CheckCircle2 className="w-4 h-4 text-amber-500" /> : <Circle className="w-4 h-4 text-zinc-700" />}
                   <span className={`text-[10px] font-black uppercase tracking-tight ${activationChecklist[item.key] ? 'text-amber-500' : 'text-zinc-400'}`}>
                     {item.label}
                   </span>
                </div>
                {!activationChecklist[item.key] && (
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-[10px] text-zinc-600 font-medium leading-tight">{item.desc}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-700" />
                  </div>
                )}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
