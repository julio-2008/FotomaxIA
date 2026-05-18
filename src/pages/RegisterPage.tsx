import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, Building, Chrome } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { authService } from '../lib/data/auth';
import { mapFirebaseAuthError } from '../lib/utils/errorMapper';
import { AppAlert } from '../components/ui/AppAlert';
import { isFirebaseReady } from '../lib/config/envValidator';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { saveUser } = useStorage();
  const navigate = useNavigate();

  const firebaseReady = useMemo(() => isFirebaseReady(), []);

  const validateForm = () => {
    if (!email.includes('@')) return "Por favor, digite um e-mail válido.";
    if (email.endsWith('.cor')) return "Você quis dizer .com?";
    if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (!businessName.trim()) return "Informe o nome do seu negócio.";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userProfile = await authService.register(email, password);
      userProfile.businessName = businessName;
      userProfile.businessProfile = { businessName } as any; 
      saveUser(userProfile);
      navigate('/dashboard');
    } catch (err: any) {
      setError(mapFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!firebaseReady) {
      setError("O cadastro com Google está temporariamente indisponível. Estamos ajustando o ambiente.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userProfile = await authService.loginWithGoogle();
      saveUser(userProfile);
      navigate('/dashboard');
    } catch (err: any) {
      setError(mapFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 animate-fade-in">
      <Link to="/" className="flex items-center gap-4 mb-16 group">
        <div className="w-10 h-10 bg-brand-yellow flex items-center justify-center group-hover:bg-white transition-colors">
          <Sparkles className="text-black w-6 h-6 fill-current" />
        </div>
        <span className="text-editorial-h3 text-white italic">FOTOMAX<span className="text-brand-yellow">_IA</span></span>
      </Link>

      <div className="w-full max-w-md bg-black border-2 border-zinc-900 p-6 md:p-12 space-y-12">
        <div className="space-y-3">
          <span className="text-editorial-label text-brand-yellow">Onboarding Portal</span>
          <h1 className="text-3xl md:text-editorial-h3 text-white italic uppercase tracking-tighter leading-none">CRIAR MINHA CONTA</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Junte-se à nova era da comunicação estratégica.</p>
        </div>

        {error && (
          <div className="p-5 border-l-4 border-red-700 bg-zinc-950 text-red-700 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] block">SEU EMAIL</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="USER@DOMAIN.COM"
                className="w-full bg-black border-2 border-zinc-900 px-6 py-4 text-white font-bold uppercase text-xs placeholder:text-zinc-800 focus:border-brand-yellow outline-none transition-all"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] block">NOME DO NEGÓCIO</label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="NOME DO NEGÓCIO"
                className="w-full bg-black border-2 border-zinc-900 px-6 py-4 text-white font-bold uppercase text-xs placeholder:text-zinc-800 focus:border-brand-yellow outline-none transition-all"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] block">SUA SENHA</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border-2 border-zinc-900 px-6 py-4 text-white font-bold uppercase text-xs placeholder:text-zinc-800 focus:border-brand-yellow outline-none transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="brand-button w-full bg-brand-yellow text-black py-5 text-sm group"
          >
            <span>{loading ? 'PROCESSANDO...' : 'CRIAR CONTA GRÁTIS'}</span>
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="flex items-center gap-6 opacity-30">
          <div className="flex-1 h-px bg-zinc-900" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">OU USE O SISTEMA</span>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>

        <button 
          onClick={handleGoogleRegister}
          type="button"
          disabled={loading || !firebaseReady}
          className="w-full bg-black border-2 border-zinc-900 text-white py-5 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 hover:border-brand-yellow transition-all disabled:opacity-50"
        >
          <Chrome className="w-5 h-5 text-brand-yellow" /> 
          {firebaseReady ? 'CADASTRAR COM GOOGLE' : 'GOOGLE OFFLINE'}
        </button>

        <p className="text-center pt-8 border-t border-zinc-950 text-[10px] font-black uppercase tracking-widest text-zinc-700">
          JÁ POSSUI CONTA? <Link to="/login" className="text-brand-yellow hover:text-white transition-colors">ACESSAR LOGIN</Link>
        </p>
      </div>
    </div>
  );
}
