import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Building, Phone, MapPin, Target, Bell, Instagram, ShoppingBag, TrendingUp, AlertTriangle, Calendar as CalendarIcon, Fingerprint, ChevronRight, LogOut } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { BusinessSettings } from '../types';
import { authService } from '../lib/data/auth';

export function Settings() {
  const navigate = useNavigate();
  const { user, settings, updateSettings, saveUser } = useStorage();
  const [formData, setFormData] = useState<BusinessSettings>({
    name: settings?.name || user?.businessName || '',
    type: settings?.type || 'pizzaria',
    defaultTone: settings?.defaultTone || 'urgente',
    whatsapp: settings?.whatsapp || '',
    city: settings?.city || '',
    targetAudience: settings?.targetAudience || '',
    instagram: settings?.instagram || '',
    mainProduct: settings?.mainProduct || '',
    highProfitProduct: settings?.highProfitProduct || '',
    mainObjection: settings?.mainObjection || '',
    weakDays: settings?.weakDays || ''
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await authService.logout();
    saveUser(null);
    localStorage.removeItem('cp_user');
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold title-display tracking-tight">Configurações</h1>
          <p className="text-zinc-500 font-medium">Personalize os dados padrão para que a IA gere campanhas mais assertivas.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all font-bold text-sm"
        >
          <LogOut className="w-4 h-4" /> Sair da Conta
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border-dashed">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-inner">
            <Fingerprint className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase italic">DNA Comercial Avançado</h3>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Configure o perfil profundo do seu negócio.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/perfil-comercial')}
          className="w-full md:w-auto bg-zinc-800 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-750 transition-all border border-zinc-700 flex items-center justify-center gap-2"
        >
          Editar DNA <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-8 space-y-8 bg-zinc-900 border-zinc-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-500" /> Identidade do Negócio
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Nome Oficial da Empresa</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Instagram (@usuario)</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.instagram}
                  onChange={e => setFormData({...formData, instagram: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all"
                  placeholder="@seu.negocio"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">WhatsApp de Vendas</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.whatsapp}
                  onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Cidade / Bairro Principal</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 space-y-8 bg-zinc-900 border-zinc-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" /> Inteligência Comercial
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Produto Carro-Chefe (Mais Vendido)</label>
              <div className="relative">
                <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.mainProduct}
                  onChange={e => setFormData({...formData, mainProduct: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all"
                  placeholder="Ex: Pizza de Calabresa"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Produto de Maior Lucro (Ouro)</label>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.highProfitProduct}
                  onChange={e => setFormData({...formData, highProfitProduct: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all"
                  placeholder="Ex: Combo Família Premium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Maior Objeção dos Clientes</label>
              <div className="relative">
                <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.mainObjection}
                  onChange={e => setFormData({...formData, mainObjection: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all"
                  placeholder="Ex: Preço do frete / Tempo de entrega"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Dias de Menor Movimento</label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.weakDays}
                  onChange={e => setFormData({...formData, weakDays: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all"
                  placeholder="Ex: Segunda e Terça"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Descrição do Público-Alvo</label>
              <textarea 
                value={formData.targetAudience}
                onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-all min-h-[100px]"
                placeholder="Ex: Famílias de classe média que buscam praticidade e qualidade no jantar..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-2">
          {saved && <span className="text-green-500 text-sm font-bold flex items-center gap-1 animate-pulse"><Save className="w-4 h-4" /> Configurações salvas!</span>}
          <button type="submit" className="brand-button">
            <Save className="w-5 h-5" /> Salvar Tudo
          </button>
        </div>
      </form>

      <AdminTrigger />
    </div>
  );
}

function AdminTrigger() {
  const [clicks, setClicks] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    if (newClicks >= 7) {
      setShowModal(true);
      setClicks(0);
    }
  };

  const handleVerify = () => {
    if (password === 'fotomax-admin') {
      localStorage.setItem('cp_admin_mode', 'true');
      alert('Modo admin ativado neste dispositivo.');
      setShowModal(false);
      window.location.reload();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="pt-12 pb-6 flex flex-col items-center justify-center border-t border-zinc-900/50">
      <button 
        onClick={handleClick}
        className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em] hover:text-zinc-500 transition-colors cursor-default"
      >
        Versão 1.2.0-stable
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-[100] backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">Acesso Administrativo</h3>
            <p className="text-sm text-zinc-500 mb-6 font-medium">Esta área é restrita para desenvolvedores e suporte técnico.</p>
            
            <input 
              type="password"
              placeholder="Sua senha de acesso"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 px-5 mb-4 outline-none focus:border-amber-500 transition-all font-mono"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              autoFocus
            />

            {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-4 text-center">Senha incorreta</p>}

            <div className="flex gap-4">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 bg-zinc-800 text-zinc-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                onClick={handleVerify}
                className="flex-1 bg-amber-500 text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest"
              >
                Acessar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
