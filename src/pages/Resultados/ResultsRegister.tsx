import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ResultRecord } from '../../types';

export function ResultsRegister() {
  const navigate = useNavigate();
  const { user, saveResultRecord } = useStorage() as any;
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    type: 'sale',
    value: '',
    productOrService: '',
    channel: 'whatsapp',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ResultRecord = {
      id: 'res_' + Date.now(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      type: form.type as any,
      value: form.value ? parseFloat(form.value) : undefined,
      productOrService: form.productOrService,
      channel: form.channel,
      notes: form.notes
    };
    saveResultRecord(newRecord);
    setSuccess(true);
    setTimeout(() => {
      navigate('/resultados');
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Resultado Registrado!</h2>
        <p className="text-zinc-400">Excelente. O Fotomax IA acabou de aprender mais sobre o que funciona no seu negócio.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl mt-12">
      <button onClick={() => navigate('/resultados')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition">
         <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Registrar Resultado</h1>
      <p className="text-zinc-400 mb-8">Não precisa ser só venda. Registre se um cliente respondeu, agendou ou até se recusou a comprar.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
           <label className="block text-zinc-400 font-bold uppercase text-xs mb-2">O que aconteceu?</label>
           <select 
             value={form.type} 
             onChange={e => setForm({...form, type: e.target.value})}
             className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none border border-transparent focus:border-amber-500 transition"
           >
             <option value="sale">Venda realizada</option>
             <option value="reply">Cliente respondeu</option>
             <option value="interest">Cliente pediu preço</option>
             <option value="booking">Cliente agendou data</option>
             <option value="lost">Cliente recusou/sumiu</option>
           </select>
        </div>

        {form.type === 'sale' && (
          <div>
             <label className="block text-zinc-400 font-bold uppercase text-xs mb-2">Valor da Venda (Opcional)</label>
             <input 
               type="number"
               placeholder="Ex: 150.00"
               value={form.value}
               onChange={e => setForm({...form, value: e.target.value})}
               className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none border border-transparent focus:border-amber-500 transition"
             />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
             <label className="block text-zinc-400 font-bold uppercase text-xs mb-2">Produto ou Serviço</label>
             <input 
               type="text"
               placeholder="Ex: Ensaio Gestante"
               value={form.productOrService}
               onChange={e => setForm({...form, productOrService: e.target.value})}
               className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none border border-transparent focus:border-amber-500 transition"
               required
             />
          </div>
          <div>
             <label className="block text-zinc-400 font-bold uppercase text-xs mb-2">De Onde Veio?</label>
             <select 
               value={form.channel} 
               onChange={e => setForm({...form, channel: e.target.value})}
               className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none border border-transparent focus:border-amber-500 transition"
             >
               <option value="whatsapp">WhatsApp</option>
               <option value="instagram_dm">Instagram DM</option>
               <option value="instagram_feed">Instagram Feed</option>
               <option value="boca_a_boca">Boca a Boca</option>
             </select>
          </div>
        </div>

        <div>
           <label className="block text-zinc-400 font-bold uppercase text-xs mb-2">Observações (Opcional)</label>
           <textarea 
             placeholder="Alguma objeção? O cliente mencionou algo específico?"
             value={form.notes}
             onChange={e => setForm({...form, notes: e.target.value})}
             className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none border border-transparent focus:border-amber-500 transition min-h-[100px]"
           />
        </div>

        <button 
          type="submit"
          className="w-full bg-amber-500 text-white rounded-xl p-4 font-black uppercase tracking-widest hover:bg-amber-400 transition"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
