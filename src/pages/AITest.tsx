import React, { useState } from 'react';
import { aiCore, AIActionType } from '../lib/ai/aiCore';
import { useStorage } from '../hooks/useStorage';

export function AITest() {
  const { user, isAdmin } = useStorage();
  const [actionType, setActionType] = useState<AIActionType>('zap_message');
  const [payload, setPayload] = useState('{\n  "product": "Pizza",\n  "goal": "vender_hoje",\n  "tonality": "urgente"\n}');
  const [dnaMock, setDnaMock] = useState('{\n  "name": "Minha Empresa",\n  "niche": "Roupas"\n}');
  const [offerMock, setOfferMock] = useState('{\n  "offerName": "Oferta Especial"\n}');
  const [campaignMock, setCampaignMock] = useState('{\n  "campaignName": "Campanha Teste"\n}');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  if (!isAdmin()) {
    return <div className="p-6 md:p-12 text-white">Acesso Negado</div>;
  }

  const handleTest = async () => {
    setLoading(true);
    setExecutionTime(null);
    const start = performance.now();
    try {
      const parsedPayload = JSON.parse(payload);
      
      const mockContext = {
        dna: JSON.parse(dnaMock || '{}'),
        activeOffer: JSON.parse(offerMock || '{}'),
        campaign: JSON.parse(campaignMock || '{}'),
      };

      const customUser = { ...user, businessDNA: null, businessProfile: null }; // Avoid overlapping
      
      // Monkey patch aiCore.buildGlobalContext temporarily for the test
      const originalBuilder = aiCore.buildGlobalContext;
      aiCore.buildGlobalContext = () => mockContext as any;

      const res = await aiCore.runAIAction(actionType, parsedPayload, customUser as any);
      setResult(res);
      
      // Restore
      aiCore.buildGlobalContext = originalBuilder;

    } catch (e: any) {
      setResult({ error: e.message || String(e) });
    }
    const end = performance.now();
    setExecutionTime(Math.round(end - start));
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-white pb-20">
      <h1 className="text-3xl font-black mb-6 uppercase tracking-tighter italic text-amber-500">Testador Interno de IA (Fotomax IA)</h1>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 font-bold uppercase text-xs tracking-widest text-zinc-500">Action Type:</label>
          <input 
            type="text" 
            value={actionType} 
            onChange={e => setActionType(e.target.value as AIActionType)}
            className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 font-bold uppercase text-xs tracking-widest text-zinc-500">Info de Execução:</label>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm flex flex-col gap-1">
            <p><span className="text-zinc-500">Modo IA:</span> {result ? (result.module === 'fallback' ? 'Fallback' : 'Real') : '-'}</p>
            <p><span className="text-zinc-500">Tempo:</span> {executionTime ? `${executionTime}ms` : '-'}</p>
            <p><span className="text-zinc-500">Score:</span> {result?.quality?.finalScore ?? '-'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block mb-2 font-bold uppercase text-xs tracking-widest text-zinc-500">Payload (JSON):</label>
          <textarea 
            value={payload}
            onChange={e => setPayload(e.target.value)}
            className="w-full h-32 bg-zinc-900 border border-zinc-800 p-3 rounded-xl font-mono text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 font-bold uppercase text-xs tracking-widest text-zinc-500">DNA Mock (JSON):</label>
          <textarea 
            value={dnaMock}
            onChange={e => setDnaMock(e.target.value)}
            className="w-full h-32 bg-zinc-900 border border-zinc-800 p-3 rounded-xl font-mono text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 font-bold uppercase text-xs tracking-widest text-zinc-500">Oferta Mock (JSON):</label>
          <textarea 
            value={offerMock}
            onChange={e => setOfferMock(e.target.value)}
            className="w-full h-32 bg-zinc-900 border border-zinc-800 p-3 rounded-xl font-mono text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 font-bold uppercase text-xs tracking-widest text-zinc-500">Campanha Mock (JSON):</label>
          <textarea 
            value={campaignMock}
            onChange={e => setCampaignMock(e.target.value)}
            className="w-full h-32 bg-zinc-900 border border-zinc-800 p-3 rounded-xl font-mono text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      <button 
        onClick={handleTest}
        disabled={loading}
        className="mt-8 bg-amber-500 text-black px-8 py-4 font-black uppercase tracking-widest rounded-xl disabled:opacity-50 hover:bg-amber-400 transition"
      >
        {loading ? 'Rodando...' : 'Rodar Teste da AI'}
      </button>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-black mb-4 uppercase tracking-tighter">Resultado (JSON):</h2>
          {result.quality?.warnings?.length > 0 && (
             <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
               <strong className="block mb-1">Avisos (Warnings):</strong>
               <ul className="list-disc pl-5">
                 {result.quality.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
               </ul>
             </div>
          )}
          <pre className="bg-zinc-950 p-6 rounded-xl text-sm overflow-auto max-h-[600px] border border-zinc-800 text-green-400">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
