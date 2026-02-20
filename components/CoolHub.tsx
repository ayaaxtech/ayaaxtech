
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Gamepad2, Gift, ChevronRight, BrainCircuit, Flame, Trophy } from 'lucide-react';
import { GameHub } from './GameHub';

interface CoolHubProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const CoolHub: React.FC<CoolHubProps> = ({ isOpen, onClose, userName }) => {
  const [activeFeature, setActiveFeature] = useState<'menu' | 'games'>('menu');

  if (!isOpen) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[350] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 transition-all duration-300`}>
      <button onClick={onClose} className="absolute top-10 right-10 text-muted hover:text-white transition-all p-4 hover:bg-white/5 rounded-full z-[100]">
        <X size={32} />
      </button>

      <div className={`w-full max-w-5xl h-[80vh] bg-surface/50 border border-white/10 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300`}>
        {activeFeature === 'menu' && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-[scaleIn_0.3s]">
            <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">Gaming Library</h2>
            <p className="text-muted mb-16 max-w-md mx-auto">Access the core entertainment hub for mini-games and simulations.</p>
            <div className="grid grid-cols-1 gap-8 w-full max-w-sm">
              <button onClick={() => setActiveFeature('games')} className="group p-10 bg-white/5 border border-white/5 rounded-[3rem] hover:border-primary hover:bg-primary/5 transition-all text-center flex flex-col items-center shadow-bubbly">
                <div className="p-6 bg-primary/10 rounded-3xl text-primary mb-6 group-hover:scale-110 transition-transform"><Gamepad2 size={40} /></div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Play Games</h3>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">Choose from our classic board games and arena shooters.</p>
              </button>
            </div>
          </div>
        )}

        {activeFeature === 'games' && <GameHub onBack={() => setActiveFeature('menu')} />}
      </div>
    </div>,
    document.body
  );
};
