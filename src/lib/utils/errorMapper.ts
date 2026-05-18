
export const mapFirebaseAuthError = (error: any): string => {
  const code = error?.code || error?.message || "";
  
  // Internal logs (could be expanded to a real logging service)
  console.log("[SystemLog] Auth Error:", {
    code,
    technicalMessage: error?.message,
    timestamp: new Date().toISOString()
  });

  if (code.includes("auth/api-key-not-valid") || code.includes("auth/invalid-api-key")) {
    return "O ambiente de cadastro ainda está sendo configurado. Tente novamente em instantes.";
  }

  if (code.includes("auth/operation-not-allowed")) {
    return "O login por e-mail ainda não foi ativado para este projeto.";
  }

  if (code.includes("auth/email-already-in-use")) {
    return "Este e-mail já está cadastrado em nossa base.";
  }

  if (code.includes("auth/invalid-email")) {
    return "Por favor, digite um endereço de e-mail válido.";
  }

  if (code.includes("auth/weak-password")) {
    return "Aumente a segurança: sua senha deve ter pelo menos 6 caracteres.";
  }

  if (code.includes("auth/wrong-password") || code.includes("auth/user-not-found")) {
    return "E-mail ou senha incorretos. Verifique e tente novamente.";
  }

  if (code.includes("auth/network-request-failed")) {
    return "Parece que você está sem internet ou com conexão instável.";
  }

  return "Não conseguimos completar seu acesso agora. Por favor, tente novamente em alguns minutos.";
};
