import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'motion/react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-yellow selection:text-black overflow-x-hidden">
      {/* Background Noise / Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Subtle Gradient Glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-brand-yellow/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-black/80 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-[60]">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-1 text-zinc-400 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
           <div className="w-5 h-5 flex items-center justify-center shrink-0">
             <Logo className="text-brand-yellow w-full h-full" />
           </div>
           <span className="font-display text-base font-black uppercase tracking-tighter italic">FM<span className="text-brand-yellow"> AX</span></span>
        </Link>
        <div className="w-5"></div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[51] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="md:ml-72 p-4 md:p-12 min-h-screen relative">
        <div className="max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
