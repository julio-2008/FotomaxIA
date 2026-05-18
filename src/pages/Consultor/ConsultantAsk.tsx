import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { consultantEngine } from '../../services/consultantEngine';
import { Loader2, ArrowLeft, Send } from 'lucide-react';

export function ConsultantAsk() {
  const navigate = useNavigate();
  const { user, businessDNA, offers, campaigns, canGenerateCampaign, incrementUsage } = useStorage() as any;
  
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<any>(null);

  const predefinedQuestions = [
    "O que devo vender hoje?",
    "Qual campanha faço para o fim de semana?",
    "Como recupero cliente antigo?",
    "Meu cliente acha caro, o que respondo?",
    "O que posto hoje?"
  ];

  const handleAsk = async (q: string) => {
    if (!canGenerateCampaign()) {
      alert("Limite atingido. Assine para continuar perguntando.");
      return;
    }
    setQuestion(q);
    setLoading(true);
    
    try {
      const summary = consultantEngine.buildSummary(offers, campaigns, [], []);
      const context = { businessDNA, summary };
      const resp = await consultantEngine.askConsultant(q, context, user);
      
      setResponse(resp.result || resp);
      incrementUsage('consultor_question');
    } catch (e) {
      console.error(e);
      alert("Houve um erro ao perguntar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl mt-12">
      <button onClick={() => navigate('/consultor')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition">
         <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <h1 className="text-2xl font-black uppercase text-white mb-2">Perguntar ao Consultor</h1>
      <p className="text-zinc-400 mb-8">Faça uma pergunta sobre o seu negócio e receba uma orientação baseada nos seus dados.</p>

      <div className="flex gap-2 mb-6">
         <input 
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: Qual promoção eu faço amanhã?"
            className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:border-indigo-500 border border-transparent transition"
            onKeyDown={(e) => e.key === 'Enter' && question && handleAsk(question)}
         />
         <button 
           onClick={() => handleAsk(question)}
           disabled={!question || loading}
           className="px-6 bg-indigo-500 text-white rounded-lg flex items-center justify-center font-bold disabled:opacity-50 hover:bg-indigo-400 transition"
         >
           {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
         </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {predefinedQuestions.map((q, i) => (
           <button 
             key={i}
             onClick={() => handleAsk(q)}
             className="bg-zinc-800 text-zinc-300 text-xs px-3 py-2 rounded-full hover:bg-zinc-700 transition"
           >
             {q}
           </button>
        ))}
      </div>

      {response && (
         <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl animate-in fade-in">
            <h3 className="text-white font-bold mb-4">{response.answer}</h3>
            <p className="text-zinc-400 text-sm mb-6">{response.reason}</p>
            {response.module && (
               <button 
                 onClick={() => navigate('/' + response.module)}
                 className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-black uppercase text-sm hover:bg-indigo-400 transition"
               >
                 {response.recommendedAction || 'Ir para Módulo'}
               </button>
            )}
         </div>
      )}
    </div>
  );
}
