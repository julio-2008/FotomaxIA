import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import { ShieldCheck, RefreshCw, AlertTriangle, CreditCard } from 'lucide-react';

export function AdminBilling() {
  const { user } = useStorage();
  const [syncStatus, setSyncStatus] = useState<string>('');

  const handleSync = async () => {
    if (!user?.stripeSubscriptionId) {
      setSyncStatus('Usuário atual não possui stripeSubscriptionId');
      return;
    }
    setSyncStatus('Sincronizando...');
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/stripe/sync-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          stripeSubscriptionId: user.stripeSubscriptionId
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSyncStatus(`Sucesso: ${data.subscription.status}`);
      } else {
        setSyncStatus(`Erro: ${data.error}`);
      }
    } catch (e: any) {
      setSyncStatus(`Erro local: ${e.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
          <CreditCard className="text-amber-500 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold title-display tracking-tight">Admin Billing</h1>
          <p className="text-zinc-400 text-sm">Visualização de status de pagamento (Teste Interno)</p>
        </div>
      </div>

      <div className="glass-card p-6 bg-zinc-900 border-zinc-800 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white mb-2 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" /> Somente teste interno
        </h2>
        
        <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-4 rounded-xl">
          <div>
            <span className="text-zinc-500 block mb-1">Usuário Logado</span>
            <span className="text-white font-mono">{user?.id}</span>
          </div>
          <div>
            <span className="text-zinc-500 block mb-1">E-mail</span>
            <span className="text-white font-mono">{user?.email}</span>
          </div>
          <div>
            <span className="text-zinc-500 block mb-1">Plano Atual</span>
            <span className="text-amber-500 font-bold uppercase">{user?.plan}</span>
          </div>
          <div>
            <span className="text-zinc-500 block mb-1">Status da Assinatura</span>
            <span className="text-white font-mono">{user?.subscriptionStatus}</span>
          </div>
          <div>
            <span className="text-zinc-500 block mb-1">Stripe Customer ID</span>
            <span className="text-white font-mono text-xs">{user?.stripeCustomerId || 'N/A'}</span>
          </div>
          <div>
            <span className="text-zinc-500 block mb-1">Stripe Sub ID</span>
            <span className="text-white font-mono text-xs">{user?.stripeSubscriptionId || 'N/A'}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <button 
            onClick={handleSync}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Sincronizar Assinatura com Stripe
          </button>
          {syncStatus && (
            <p className="mt-3 text-xs font-mono text-amber-500">{syncStatus}</p>
          )}
        </div>
      </div>
      
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3 mt-4">
        <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />
        <p className="text-sm text-zinc-300">
          Esta tela não permite liberação manual. A alteração de planos para os usuários só ocorre de forma automatizada pelo Stripe Webhook.
        </p>
      </div>
    </div>
  );
}
