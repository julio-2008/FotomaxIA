
export interface EnvStatus {
  ready: boolean;
  missing: string[];
  invalid: string[];
  message: string;
}

export const validateFirebaseConfig = (): EnvStatus => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;

  const missing: string[] = [];
  const invalid: string[] = [];

  if (!apiKey || apiKey === "not_configured") missing.push("VITE_FIREBASE_API_KEY");
  else if (!apiKey.startsWith("AIza")) invalid.push("VITE_FIREBASE_API_KEY");

  if (!authDomain || authDomain === "not_configured") missing.push("VITE_FIREBASE_AUTH_DOMAIN");
  else if (!authDomain.includes(".firebaseapp.com") && !authDomain.includes(".web.app")) invalid.push("VITE_FIREBASE_AUTH_DOMAIN");

  if (!projectId || projectId === "not_configured") missing.push("VITE_FIREBASE_PROJECT_ID");
  if (!appId || appId === "not_configured") missing.push("VITE_FIREBASE_APP_ID");

  const ready = missing.length === 0 && invalid.length === 0;

  return {
    ready,
    missing,
    invalid,
    message: ready ? "Firebase Pronto" : "Firebase não configurado ou inválido"
  };
};

export const validateAIConfig = (): EnvStatus => {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
  
  if (!geminiKey || geminiKey === "not_configured") {
    return { ready: false, missing: ["GEMINI_API_KEY"], invalid: [], message: "IA Indisponível" };
  }
  return { ready: true, missing: [], invalid: [], message: "IA Pronta" };
};

export const validateStripeConfig = (): EnvStatus => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!key || key === "not_configured") {
    return { ready: false, missing: ["VITE_STRIPE_PUBLISHABLE_KEY"], invalid: [], message: "Pagamentos Desativados" };
  }
  return { ready: true, missing: [], invalid: [], message: "Stripe Pronto" };
};

export const getEnvironmentStatus = () => {
  return {
    firebase: validateFirebaseConfig(),
    ai: validateAIConfig(),
    stripe: validateStripeConfig(),
    databaseProvider: import.meta.env.VITE_DATABASE_PROVIDER || 'localStorage',
    fallbackLocal: import.meta.env.VITE_DATABASE_FALLBACK_LOCAL === 'true'
  };
};

export const isFirebaseReady = () => validateFirebaseConfig().ready;
export const isAIReady = () => validateAIConfig().ready;
