import React, { useState } from "react";
import {
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  ShieldCheck,
  X,
  CreditCard,
  RefreshCw,
  Loader2,
  TestTube,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useStorage } from "../hooks/useStorage";
import { PRICING_PLANS } from "../constants";
import { PlanTier } from "../types";

export function Billing() {
  const { user, simulateActiveSubscription, isAdmin } = useStorage();
  const [showModal, setShowModal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (plan: any) => {
    if (plan.id === "trial") return;
    setLoadingPlan(plan.id);
    setErrorMsg("");
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${baseUrl}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: plan.id,
          userId: user?.id,
          userEmail: user?.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "STRIPE_NOT_CONFIGURED") {
          setShowModal(true);
        } else {
          setErrorMsg(data.message || "Erro ao iniciar pagamento.");
        }
      } else {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setErrorMsg("Erro de conexão com o servidor.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user?.stripeCustomerId) return;
    setLoadingPlan("portal");
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(
        `${baseUrl}/api/stripe/create-customer-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stripeCustomerId: user.stripeCustomerId }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.url;
      } else {
        setErrorMsg(data.error || "Erro ao abrir portal.");
      }
    } catch (err) {
      setErrorMsg("Erro de conexão.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold title-display tracking-tight uppercase italic">
              Sua <span className="text-amber-500">Assinatura</span>
            </h1>
            <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/20">
              BETA
            </div>
          </div>
          <p className="text-zinc-500 font-medium">
            Escolha o plano ideal e libere o motor completo de vendas para o seu negócio local.
          </p>
        </div>

        {user?.stripeCustomerId && (
          <button
            onClick={handleManageSubscription}
            disabled={loadingPlan === "portal"}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
          >
            {loadingPlan === "portal" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            Gerenciar Assinatura
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm">{errorMsg}</span>
        </div>
      )}

      {user?.subscriptionStatus === "past_due" && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm">
            Seu pagamento está pendente. Atualize sua assinatura para continuar
            usando nossos recursos premium.
          </span>
        </div>
      )}

      {user?.subscriptionStatus === "cancelled" && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm">
            Sua assinatura foi cancelada. Assine novamente para reativar seu
            acesso.
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_PLANS.map((p, i) => {
          const isCurrentPlan =
            user?.plan === p.id && user?.subscriptionStatus === "active";

          return (
            <div
              key={i}
              className={cn(
                "glass-card p-6 flex flex-col relative transition-all duration-500 bg-zinc-900 border-zinc-800 rounded-[2.5rem]",
                p.highlight
                  ? "ring-2 ring-amber-500 border-amber-500 scale-105 z-10 shadow-2xl shadow-amber-500/5 bg-zinc-950"
                  : "hover:border-zinc-700",
                isCurrentPlan &&
                  "border-amber-500/30 bg-amber-500/5 shadow-inner shadow-amber-500/5",
              )}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Recomendado
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-black mb-1 italic uppercase tracking-tighter">
                  {p.name}
                </h3>
                <p className="subtitle-mono text-[9px] text-zinc-600">
                  {p.desc}
                </p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-3xl font-black">{p.price}</span>
                {p.period && (
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    {p.period}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {p.features.map((f, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 text-xs text-zinc-400 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <button
                  onClick={() => handleSubscribe(p)}
                  disabled={
                    p.id === "trial" || isCurrentPlan || loadingPlan !== null
                  }
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2",
                    isCurrentPlan
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 cursor-default"
                      : p.id === "trial"
                        ? "bg-zinc-800 text-zinc-700 cursor-default"
                        : "bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50",
                  )}
                >
                  {loadingPlan === p.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCurrentPlan ? (
                    "Plano Atual"
                  ) : p.id === "trial" ? (
                    "Já Utilizado"
                  ) : (
                    "Assinar Agora"
                  )}
                </button>

                {/* Dev Only: Simulate Activation */}
                {isAdmin() && p.id !== "trial" && (
                  <button
                    onClick={() => simulateActiveSubscription(p.id as PlanTier)}
                    className="w-full py-2 flex items-center justify-center gap-2 text-[7px] font-black uppercase tracking-widest text-zinc-800 hover:text-amber-500 transition-colors"
                  >
                    <ShieldCheck className="w-3 h-3" /> [ADMIN] Ativar Local
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Seção de Créditos Extras */}
      <div className="mt-16 bg-zinc-900/50 border border-zinc-800 rounded-[3rem] p-8 md:p-6 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
          <Zap className="w-64 h-64 text-amber-500 fill-amber-500" />
        </div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-6 md:p-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              Lançamento em breve
            </div>
            <h2 className="text-4xl font-black title-display uppercase italic tracking-tighter leading-tight text-white">
              Precisa de um boost <br /> <span className="text-amber-500">nos seus resultados?</span>
            </h2>
            <p className="text-zinc-400 font-medium text-lg max-w-md">
              Adquira pacotes de créditos extras que nunca expiram. Perfeito para meses de maior movimento ou campanhas sazonais.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-zinc-950 border border-zinc-800 px-6 py-4 rounded-2xl flex flex-col gap-1 items-center hover:border-amber-500/50 transition-colors">
                <span className="text-2xl font-black text-white">20</span>
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Créditos</span>
                <span className="text-amber-500 font-black mt-1">R$ 19,90</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 px-6 py-4 rounded-2xl flex flex-col gap-1 items-center scale-105 border-amber-500/30 hover:border-amber-500 transition-colors">
                <span className="text-2xl font-black text-white">50</span>
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Créditos</span>
                <span className="text-amber-500 font-black mt-1">R$ 39,90</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 px-6 py-4 rounded-2xl flex flex-col gap-1 items-center hover:border-amber-500/50 transition-colors">
                <span className="text-2xl font-black text-white">100</span>
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Créditos</span>
                <span className="text-amber-500 font-black mt-1">R$ 69,90</span>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[2.5rem] space-y-4">
             <h4 className="font-black uppercase text-amber-500 text-sm tracking-widest mb-4">Vantagens Extras</h4>
             <ul className="space-y-4">
               {[
                 "Acúmulo progressivo (nunca expiram)",
                 "Consumidos apenas após os créditos do mês",
                 "Válidos para qualquer tipo de criação IA",
                 "Upgrade imediato sem mudar assinatura"
               ].map((v, idx) => (
                 <li key={idx} className="flex items-center gap-3 text-sm font-bold text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    {v}
                 </li>
               ))}
             </ul>
             <div className="pt-6">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">
                  * A compra de créditos extras será liberada nos próximos dias junto com o sistema de pagamento automático.
                </p>
             </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-white">
                Pagamento em Configuração
              </h2>
              <p className="text-zinc-400 mb-8 font-medium leading-relaxed">
                As variáveis de integração do Stripe ainda não foram
                configuradas neste ambiente. Insira as chaves STRIPE_SECRET_KEY,
                preços e VITE_API_URL para ativar o pagamento automático.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-zinc-800 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-zinc-700 transition"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
