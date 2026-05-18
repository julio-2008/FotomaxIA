import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Zap, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';

export function BillingSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, simulateActiveSubscription, isAdmin } = useStorage();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'processing'>('loading');

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed');
      return;
    }

    const checkSession = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/stripe/checkout-session?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.payment_status === 'paid') {
            setStatus('success');
            // Re-trigger sync in useStorage indirectly by calling a local update if possible, 
            // but useStorage automatically syncs on load. Let's just wait for user to click Dashboard.
          } else {
            setStatus('processing');
          }
        } else {
          setStatus('failed');
        }
      } catch (e) {
        setStatus('failed');
      }
    };
    checkSession();
  }, [sessionId]);

  const handleSync = async () => {
     try {
       const baseUrl = import.meta.env.VITE_API_URL || '';
       await fetch(`${baseUrl}/api/stripe/user-subscription?userId=${user?.id}`);
       window.location.reload();
     } catch(e) {}
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl ${
        status === 'success' ? 'bg-green-500 shadow-green-500/20 rotate-3 animate-bounce' :
        status === 'loading' || status === 'processing' ? 'bg-amber-500 shadow-amber-500/20' :
        'bg-red-500 shadow-red-500/20'
      }`}>
        {status === 'success' ? (
          <CheckCircle2 className="text-black w-12 h-12 stroke-[3]" />
        ) : status === 'loading' || status === 'processing' ? (
          <Loader2 className="text-black w-12 h-12 stroke-[3] animate-spin" />
        ) : (
          <Zap className="text-black w-12 h-12 stroke-[3]" />
        )}
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black title-display mb-4 text-white uppercase italic tracking-tighter">
        {status === 'success' ? 'Pagamento Confirmado!' : 
         status === 'processing' ? 'Processando...' : 
         status === 'loading' ? 'Verificando...' : 'Erro no Pagamento'}
      </h1>
      
      <p className="text-zinc-400 mb-10 max-w-md font-medium leading-relaxed">
        {status === 'success' ? 'Pagamento recebido ou em processamento. Seu plano será atualizado automaticamente assim que o Stripe confirmar.' : 
         status === 'failed' ? 'Não foi possível verificar a sessão. Retorne ao dashboard.' :
         'Estamos aguardando a confirmação do Stripe.'}
        <br/><span className="text-[10px] text-zinc-600 uppercase tracking-widest mt-2 block">Sessão: {sessionId?.substring(0, 16)}...</span>
      </p>

      <div className="space-y-4 w-full max-w-sm">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-amber-500 text-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10"
        >
          Voltar ao Dashboard <ArrowRight className="w-5 h-5" />
        </button>
        
        <button 
          onClick={handleSync}
          className="w-full text-zinc-500 hover:text-amber-500 text-[10px] uppercase font-black tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3 h-3" /> Atualizar status
        </button>
      </div>
      
      <div className="mt-12 flex items-center gap-2 text-zinc-600">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-[9px] font-black uppercase tracking-widest">Ambiente Seguro de Assinatura</span>
      </div>
    </div>
  );
}
