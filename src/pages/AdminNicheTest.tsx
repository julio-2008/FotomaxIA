import React, { useState } from 'react';
import { 
  Beaker, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Star, 
  MessageSquare, 
  Layout, 
  History,
  TrendingUp,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStorage } from '../hooks/useStorage';
import { aiCore } from '../services/aiCore';
import { NicheScenario, NicheId, ValueProofResult } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SCENARIOS: NicheScenario[] = [
  {
    id: 'pizzaria',
    name: 'Pizzaria Forno da Vila',
    city: 'Juazeiro-BA',
    type: 'Pizzaria com delivery',
    mainProduct: 'Pizza grande calabresa',
    price: 'R$49,90',
    highProfitProduct: 'Combo pizza grande + refrigerante',
    stagnantProduct: 'Pizza frango com catupiry',
    audience: 'Famílias e pessoas que querem resolver a janta sem cozinhar',
    objection: 'Demora na entrega e preço',
    differential: 'Massa fina, entrega no bairro e atendimento rápido pelo WhatsApp',
    mainChannel: 'WhatsApp e Status',
    weakDay: 'Terça-feira',
    goal: 'Vender hoje'
  },
  {
    id: 'barbearia',
    name: 'Barbearia Corte Fino',
    city: 'Petrolina-PE',
    type: 'Barbearia Masculina',
    mainProduct: 'Corte Social',
    price: 'R$35,00',
    highProfitProduct: 'Corte + Barba',
    stagnantProduct: 'Limpeza de Pele',
    audience: 'Homens que querem sair alinhados para o fim de semana',
    objection: 'Preço e falta de tempo',
    differential: 'Agilidade, ambiente retrô e cerveja gelada',
    mainChannel: 'WhatsApp e Story',
    weakDay: 'Quarta-feira',
    goal: 'Preencher horários vazios'
  },
  {
    id: 'salao',
    name: 'Studio Bela Forma',
    city: 'Juazeiro-BA',
    type: 'Salão de Beleza / Estética',
    mainProduct: 'Manicure e Pedicure',
    price: 'R$50,00',
    highProfitProduct: 'Pacote Sobrancelha + Limpeza de Pele',
    stagnantProduct: 'Hidratação Capilar',
    audience: 'Mulheres que querem se cuidar sem deixar para última hora',
    objection: 'Preço e confiança',
    differential: 'Produtos importados e atendimento personalizado',
    mainChannel: 'Story e WhatsApp',
    weakDay: 'Segunda-feira',
    goal: 'Divulgação de agenda'
  },
  {
    id: 'loja',
    name: 'Moda Bella',
    city: 'Juazeiro-BA',
    type: 'Loja de Roupas Femininas',
    mainProduct: 'Blusas Básicas',
    price: 'R$39,90',
    highProfitProduct: 'Look Completo (Vestido + Acessório)',
    stagnantProduct: 'Vestidos Estampados',
    audience: 'Mulheres que buscam estilo e praticidade',
    objection: 'Tamanho e material',
    differential: 'Curadoria de peças exclusivas e entrega em domicílio',
    mainChannel: 'Status e WhatsApp',
    weakDay: 'Segunda-feira',
    goal: 'Movimentar estoque'
  }
];

const TEST_ACTIONS = [
  'dna_summary',
  'offer_generation',
  'campaign_generation',
  'zap_status',
  'zap_message',
  'customer_reactivation_message',
  'calendar_day_idea'
];

export function AdminNicheTest() {
  const { user } = useStorage();
  const [testing, setTesting] = useState<NicheId | null>(null);
  const [results, setResults] = useState<Record<NicheId, ValueProofResult | null>>({
    pizzaria: null,
    barbearia: null,
    salao: null,
    loja: null,
    acaiteria: null,
    hamburgueria: null,
    estetica: null,
    servico: null
  } as any);

  const runTest = async (nicheId: NicheId) => {
    setTesting(nicheId);
    const scenario = SCENARIOS.find(s => s.id === nicheId);
    if (!scenario) return;

    const testResults: any[] = [];
    let totalScore = 0;

    for (const action of TEST_ACTIONS) {
      const payload = {
        input: {
          productOrService: scenario.mainProduct,
          productTitle: scenario.mainProduct,
          price: scenario.price,
          targetAudience: scenario.audience,
          mainBenefit: scenario.differential,
          objection: scenario.objection,
          goal: scenario.goal
        },
        businessProfile: {
          businessName: scenario.name,
          city: scenario.city,
          businessType: scenario.type,
          niche: nicheId
        }
      };

      const aiRes = await aiCore.run(action as any, payload);
      if (aiRes.success) {
        const content = aiRes.data.result?.whatsappMessage || aiRes.data.result?.statusText || aiRes.data.result?.description || aiRes.data.result?.headline || '';
        const evaluation = await aiCore.evaluateResult(content, scenario.name);
        
        testResults.push({
          actionType: action,
          content,
          score: evaluation.score,
          feedback: evaluation.feedback
        });
        totalScore += evaluation.score;
      }
    }

    const avgScore = Math.round(totalScore / testResults.length);
    const result: ValueProofResult = {
      niche: nicheId,
      score: avgScore,
      results: testResults,
      summary: {
        strengths: testResults.filter(r => r.score >= 80).map(r => r.actionType),
        weaknesses: testResults.filter(r => r.score < 60).map(r => r.actionType),
        recommendation: avgScore >= 80 ? 'Pronto para Produção' : 'Necessita ajustes no Prompt'
      },
      status: avgScore >= 80 ? 'approved' : avgScore >= 60 ? 'partial' : 'rejected',
      testedAt: new Date().toISOString()
    };

    setResults(prev => ({ ...prev, [nicheId]: result }));
    setTesting(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'partial': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-zinc-900 text-zinc-500 border-zinc-800';
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl font-black title-display italic uppercase tracking-tighter">
              Calibração por <span className="text-amber-500">Nicho</span>
            </h1>
            <p className="text-zinc-500 font-medium">Validação de prova de valor para negócios locais reais.</p>
          </div>
          <div className="bg-zinc-950 px-6 py-3 rounded-2xl border border-zinc-800 flex items-center gap-4">
             <div className="text-center">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">NICHOS OK</p>
                <p className="text-xl font-black text-white">{(Object.values(results) as (ValueProofResult | null)[]).filter(r => r?.status === 'approved').length} / 3</p>
             </div>
             <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                (Object.values(results) as (ValueProofResult | null)[]).filter(r => r?.status === 'approved').length >= 3 ? "bg-green-500 text-black" : "bg-red-500 text-white"
             )}>
                {(Object.values(results) as (ValueProofResult | null)[]).filter(r => r?.status === 'approved').length >= 3 ? "BETA READY" : "BLOCKED"}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SCENARIOS.map((scenario) => (
          <div key={scenario.id} className="bg-zinc-950 border border-zinc-800 rounded-[3rem] p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase italic tracking-tight">{scenario.name}</h2>
                <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{scenario.city} • {scenario.type}</p>
              </div>
              {results[scenario.id] ? (
                <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", getStatusColor(results[scenario.id]!.status))}>
                   Score: {results[scenario.id]!.score}
                </div>
              ) : (
                <button 
                  onClick={() => runTest(scenario.id)}
                  disabled={!!testing}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                  {testing === scenario.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  Rodar Teste
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Produto Principal</p>
                  <p className="text-xs font-bold text-zinc-300">{scenario.mainProduct}</p>
               </div>
               <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Público</p>
                  <p className="text-xs font-bold text-zinc-300">{scenario.audience}</p>
               </div>
            </div>

            {results[scenario.id] && (
              <div className="space-y-4 animate-in slide-in-from-top duration-500">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500">
                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                   Resultados Analisados ({results[scenario.id]!.results.length})
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {results[scenario.id]!.results.map((res, j) => (
                      <div key={j} className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5 space-y-3">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{res.actionType}</span>
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded", res.score >= 80 ? "text-green-500 bg-green-500/10" : res.score >= 60 ? "text-amber-500 bg-amber-500/10" : "text-red-500 bg-red-500/10")}>
                               {res.score} pts
                            </span>
                         </div>
                         <p className="text-sm text-zinc-300 font-medium italic">"{res.content.substring(0, 150)}..."</p>
                         <p className="text-[10px] text-zinc-600 italic">{res.feedback}</p>
                      </div>
                   ))}
                </div>

                <div className="pt-4 border-t border-zinc-800">
                   <button 
                     onClick={() => runTest(scenario.id)}
                     className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-amber-500 flex items-center gap-2 transition-all"
                   >
                     <RefreshCw className="w-3 h-3" />
                     Regerar Teste e Calibrar
                   </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
