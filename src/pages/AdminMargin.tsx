import React, { useState, useEffect } from 'react';
import { useStorage } from '../hooks/useStorage';
import { 
  Calculator, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  ChevronRight, 
  Target,
  ArrowDown
} from 'lucide-react';
import { motion } from 'motion/react';

export function AdminMargin() {
  const { isAdmin } = useStorage();
  
  const [params, setParams] = useState({
    planPrice: 147,
    creditsIncluded: 80,
    costPerCredit: 0.25,
    costPerImage: 1.50,
    imagesIncluded: 5,
    paymentFee: 0.05,
    desiredMargin: 0.40
  });

  const [results, setResults] = useState({
    grossRevenue: 0,
    feeCost: 0,
    maxIACost: 0,
    estimatedIACost: 0,
    estimatedMargin: 0,
    riskLevel: 'low'
  });

  useEffect(() => {
    const grossRevenue = params.planPrice;
    const feeCost = grossRevenue * params.paymentFee;
    const estimatedIACost = (params.creditsIncluded * params.costPerCredit) + (params.imagesIncluded * params.costPerImage);
    const netRevenue = grossRevenue - feeCost - estimatedIACost;
    const estimatedMargin = netRevenue / grossRevenue;
    
    let riskLevel = 'low';
    if (estimatedMargin < 0.20) riskLevel = 'high';
    else if (estimatedMargin < 0.40) riskLevel = 'medium';

    setResults({
      grossRevenue,
      feeCost,
      maxIACost: grossRevenue * (1 - params.paymentFee - params.desiredMargin),
      estimatedIACost,
      estimatedMargin,
      riskLevel
    });
  }, [params]);

  if (!isAdmin()) {
    return <div className="p-6 md:p-12 text-center text-zinc-500 font-bold uppercase">Acesso Restrito ao Admin</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-black title-display uppercase italic tracking-tighter text-white">
          Simulador de <span className="text-amber-500">Margem e Risco</span>
        </h1>
        <p className="text-zinc-500 font-medium max-w-2xl">
          Ajuste os parâmetros para garantir que os planos do Fotomax IA sejam lucrativos e seguros.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Parâmetros */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="font-black uppercase text-zinc-400 flex items-center gap-2">
              <Calculator className="w-5 h-5" /> Parâmetros
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Preço do Plano (R$)</label>
                <input 
                  type="number" 
                  value={params.planPrice}
                  onChange={(e) => setParams({...params, planPrice: Number(e.target.value)})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Créditos Inclusos</label>
                <input 
                  type="number" 
                  value={params.creditsIncluded}
                  onChange={(e) => setParams({...params, creditsIncluded: Number(e.target.value)})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Imagens Inclusas</label>
                <input 
                  type="number" 
                  value={params.imagesIncluded}
                  onChange={(e) => setParams({...params, imagesIncluded: Number(e.target.value)})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Custo Médio p/ Crédito (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={params.costPerCredit}
                  onChange={(e) => setParams({...params, costPerCredit: Number(e.target.value)})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Margem Desejada (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={params.desiredMargin * 100}
                  onChange={(e) => setParams({...params, desiredMargin: Number(e.target.value) / 100})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col justify-center gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase">Margem Estimada</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl md:text-5xl font-black ${(results.estimatedMargin * 100) < 20 ? 'text-red-500' : 'text-green-500'}`}>
                  {(results.estimatedMargin * 100).toFixed(1)}%
                </span>
                <span className="text-zinc-500 font-bold uppercase text-[10px]">Líquida</span>
              </div>
            </div>

            <div className={`rounded-[2.5rem] p-8 border ${results.riskLevel === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-500' : results.riskLevel === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-green-500/10 border-green-500/20 text-green-500'} flex flex-col justify-center gap-2`}>
              <span className="text-xs font-bold uppercase">Nível de Risco</span>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8" />
                <span className="text-4xl font-black uppercase italic tracking-tighter">
                  {results.riskLevel === 'high' ? 'CRÍTICO' : results.riskLevel === 'medium' ? 'ALERTA' : 'SEGURO'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 rotate-12">
              <TrendingUp className="w-64 h-64" />
            </div>
            
            <h3 className="font-black uppercase text-zinc-400 mb-8 flex items-center gap-2 relative z-10">
              <DollarSign className="w-5 h-5" /> Decomposição de Custos
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase text-zinc-500 px-1">
                  <span>Receita Bruta</span>
                  <span>R$ {results.grossRevenue.toFixed(2)}</span>
                </div>
                <div className="h-6 bg-green-500 rounded-xl" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase text-zinc-500 px-1">
                  <span>Impostos e Taxas ({(params.paymentFee * 100).toFixed(0)}%)</span>
                  <span>R$ {results.feeCost.toFixed(2)}</span>
                </div>
                <div className="h-6 bg-amber-500 rounded-xl" style={{ width: `${(params.paymentFee) * 100}%` }} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase text-zinc-500 px-1">
                  <span>Custo IA p/ Uso Total (100%)</span>
                  <span>R$ {results.estimatedIACost.toFixed(2)}</span>
                </div>
                <div className="h-6 bg-red-500 rounded-xl" style={{ width: `${(results.estimatedIACost / results.grossRevenue) * 100}%` }} />
              </div>

              <div className="mt-12 pt-12 border-t border-zinc-800">
                <div className={`p-6 rounded-3xl ${results.riskLevel === 'high' ? 'bg-red-500/20' : 'bg-zinc-950'} border border-zinc-800`}>
                  <p className="text-sm font-medium text-zinc-400 leading-relaxed italic">
                    {results.riskLevel === 'high' 
                      ? "ALERTA: Se o usuário consumir todo o limite, você terá prejuízo ou margem irrelevante. Reduza os créditos ou aumente o preço." 
                      : results.riskLevel === 'medium'
                      ? "CUIDADO: A margem está apertada. Verifique se o custo médio por crédito real é menor que sua estimativa."
                      : "SEGURO: O plano tem uma margem saudável mesmo com 100% de uso pelo cliente."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
