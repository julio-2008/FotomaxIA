import React, { useState } from 'react';
import { MessageSquare, Star, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStorage } from '../hooks/useStorage';

export function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, saveFeedback } = useStorage();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    tryingToDo: '',
    worked: true,
    confusion: '',
    missingFeature: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedback = {
      id: Math.random().toString(36).substring(2, 11),
      userId: user?.id || 'anonymous',
      userEmail: user?.email || 'anonymous',
      createdAt: new Date().toISOString(),
      rating,
      ...formData
    };
    saveFeedback(feedback as any);
    setStep('success');
    setTimeout(() => {
      onClose();
      setStep('form');
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 z-[101] shadow-2xl overflow-hidden"
          >
            {step === 'form' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black uppercase italic tracking-tight">Fala pro <span className="text-amber-500">Fotomax</span></h2>
                    <p className="text-zinc-500 text-sm font-medium">Sua opinião molda o futuro do app.</p>
                  </div>
                  <button type="button" onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">O que você tentou fazer?</label>
                    <input 
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                      placeholder="Ex: Criar um status para minha promoção de terça"
                      value={formData.tryingToDo}
                      onChange={e => setFormData({...formData, tryingToDo: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <button 
                        type="button"
                        onClick={() => setFormData({...formData, worked: true})}
                        className={`p-4 rounded-2xl border font-bold text-sm transition-all ${formData.worked ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                     >
                        Funcionou
                     </button>
                     <button 
                        type="button"
                        onClick={() => setFormData({...formData, worked: false})}
                        className={`p-4 rounded-2xl border font-bold text-sm transition-all ${!formData.worked ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                     >
                        Não funcionou
                     </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">O que ficou confuso?</label>
                    <textarea 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all min-h-[80px]"
                      placeholder="Algum botão ou texto que não entendeu?"
                      value={formData.confusion}
                      onChange={e => setFormData({...formData, confusion: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">O que falta aqui?</label>
                    <input 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                      placeholder="Uma função que você sente falta"
                      value={formData.missingFeature}
                      onChange={e => setFormData({...formData, missingFeature: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 py-4">
                    {[1,2,3,4,5].map((s) => (
                      <button 
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`p-2 transition-all ${rating >= s ? 'text-amber-500' : 'text-zinc-800 hover:text-zinc-700'}`}
                      >
                        <Star className={`w-8 h-8 ${rating >= s ? 'fill-amber-500' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  ENVIAR FEEDBACK
                </button>
              </form>
            ) : (
              <div className="py-20 text-center space-y-6">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase italic tracking-tight">Valeu demais!</h2>
                  <p className="text-zinc-500 font-medium">Seu feedback já está com nossa equipe.</p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
