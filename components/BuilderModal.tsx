import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Hammer, Send, CheckCircle2, 
  Loader2
} from 'lucide-react';
import { CustomAppConfig } from '../types';
import { getTranslation } from '../translations';

interface BuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForge: (config: CustomAppConfig) => void;
  language: string;
}

type Step = 'name' | 'details' | 'purpose' | 'logo' | 'review';

export const BuilderModal: React.FC<BuilderModalProps> = ({ isOpen, onClose, onForge, language }) => {
  const t = (key: string, params: any = {}) => getTranslation(language, key, params);
  const [step, setStep] = useState<Step>('name');
  const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [config, setConfig] = useState<Partial<CustomAppConfig>>({ intelligence: 95, speed: 85 });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('name');
      setMessages([{ role: 'system', text: "Welcome to the App Architect. To begin building your custom intelligence node, please provide a unique NAME for your application." }]);
      setInputValue('');
    }
  }, [isOpen, language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleNext = () => {
    if (!inputValue.trim()) return;
    const currentInput = inputValue.trim();
    let nextStep: Step = step;
    let response = "...";

    if (step === 'name') { 
      setConfig(p => ({ ...p, name: currentInput.toUpperCase() })); 
      nextStep = 'details'; 
      response = `Name '${currentInput.toUpperCase()}' acknowledged. Now, describe the core logic or FEATURES this app should have. (Example: 'Expert in Python coding and React architecture')`; 
    }
    else if (step === 'details') { 
      setConfig(p => ({ ...p, prompt: currentInput })); 
      nextStep = 'purpose'; 
      response = "Logic parameters set. What is the MISSION or main tagline for this application? (Example: 'Empowering deep technical research')"; 
    }
    else if (step === 'purpose') { 
      setConfig(p => ({ ...p, tagline: currentInput })); 
      nextStep = 'logo'; 
      response = "Mission captured. Finally, describe the VISUAL STYLE or desired icon for this app. (Example: 'A glowing circuit board' or 'Minimalist blue flame')"; 
    }
    else if (step === 'logo') { 
      setConfig(p => ({ ...p, iconName: currentInput })); 
      nextStep = 'review'; 
      response = "Neural Blueprint complete. Review the specifications on the right and trigger the forge when ready."; 
    }

    setMessages(prev => [...prev, { role: 'user', text: currentInput }, { role: 'system', text: response }]);
    setStep(nextStep);
    setInputValue('');
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-7xl h-full max-h-[85vh] bg-surface border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-[scaleIn_0.3s]">
        <div className="flex-1 flex flex-col bg-black/20 border-r border-white/5">
          <header className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Hammer size={24} /></div>
              <div>
                <h2 className="text-xl font-black text-white uppercase">{t('appArchitectChat')}</h2>
                <p className="text-[10px] font-bold text-muted uppercase">{t('interactiveProtocol')}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors"><X size={24} /></button>
          </header>
          <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'system' ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-6 rounded-[2rem] text-[14px] leading-relaxed max-w-[80%] ${msg.role === 'system' ? 'bg-white/5 text-text border border-white/5' : 'bg-primary text-black font-bold shadow-glow'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
          {step !== 'review' && (
            <div className="p-10 bg-black/40 border-t border-white/5">
              <div className="relative">
                <input 
                  value={inputValue} 
                  onChange={e => setInputValue(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleNext()} 
                  placeholder="Type your response here..."
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-6 px-8 text-white focus:border-primary focus:outline-none transition-all" 
                />
                <button 
                  onClick={handleNext} 
                  disabled={!inputValue.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-[400px] bg-surface p-10 space-y-10">
          <div className="p-8 bg-black/40 border border-white/5 rounded-[3rem] space-y-6">
            <h3 className="text-[11px] font-black text-primary uppercase text-center">{t('blueprintStatus')}</h3>
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center"><span className="text-[9px] font-black text-muted uppercase">{t('logicDepth')}</span><span className="text-[9px] font-black text-emerald-500 uppercase">95%</span></div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[95%]" /></div>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { l: t('identityMapping'), c: !!config.name }, 
              { l: "Expertise Logic", c: !!config.prompt }, 
              { l: "Strategic Mission", c: !!config.tagline }, 
              { l: "Aesthetic Identity", c: !!config.iconName }
            ].map((f, i) => (
              <div key={i} className={`flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl border transition-all ${f.c ? 'border-primary/40' : 'border-white/5'}`}>
                <span className={`text-[10px] font-black uppercase flex-1 ${f.c ? 'text-white' : 'text-muted/30'}`}>{f.l}</span>
                {f.c && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>
            ))}
          </div>
          {step === 'review' && (
            <div className="space-y-6 animate-[fadeIn_0.5s]">
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                <h4 className="text-sm font-black text-white uppercase mb-2">{config.name}</h4>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest italic">"{config.tagline}"</p>
              </div>
              <button onClick={() => onForge(config as CustomAppConfig)} className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black uppercase text-[13px] shadow-glow hover:scale-105 active:scale-95 transition-all">
                {t('triggerForge')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
