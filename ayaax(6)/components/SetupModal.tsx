import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Cpu, ArrowRight, CheckCircle2, 
  AlertTriangle, ShieldAlert
} from 'lucide-react';
import { UserSettings } from '../types';
import { getTranslation } from '../translations';

interface SetupModalProps {
  isOpen: boolean;
  onComplete: (settings: UserSettings, showManual: boolean) => void;
  onSkip: () => void;
  initialSettings: UserSettings;
}

type SetupStep = 'notice' | 'finish';

const STEPS: SetupStep[] = ['notice', 'finish'];

export const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onComplete, onSkip, initialSettings }) => {
  const [step, setStep] = useState<SetupStep>('notice');
  const [settings, setSettings] = useState<UserSettings>(initialSettings);

  const t = (key: string, params: any = {}) => getTranslation(settings.language, key, params);

  if (!isOpen) return null;
  const isRTL = settings.language === 'Arabic' || settings.language === 'Hebrew';

  return createPortal(
    <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-[fadeIn_0.5s]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl w-full bg-surface border border-white/10 rounded-[4rem] flex flex-col overflow-hidden shadow-2xl relative animate-[scaleIn_0.3s]">
        <div className="flex h-1.5 w-full bg-white/5">
          {STEPS.map((s, idx) => (
            <div key={s} className={`flex-1 transition-all duration-500 ${idx <= STEPS.indexOf(step) ? 'bg-primary shadow-neon' : ''}`} />
          ))}
        </div>
        <div className="p-10 md:p-14 flex flex-col flex-1 h-[70vh]">
          
          {step === 'notice' && (
            <div className="space-y-8 animate-[fadeIn_0.3s] h-full flex flex-col justify-center">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-yellow-400/10 rounded-2xl text-yellow-400">
                    <AlertTriangle size={32} />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-white uppercase tracking-tighter mb-2">Usage Policy</h2>
                <p className="text-muted text-[10px] uppercase tracking-[0.5em] font-black">Account Terms</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400/40" />
                <div className="absolute -right-20 -bottom-20 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <ShieldAlert size={300} />
                </div>
                
                <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium text-center italic relative z-10">
                  "Our free plan includes limited usage. On the free plan, you can generate up to 3 images and run up to 3 agents. If you need more, please create an account and upgrade to a paid plan. Payments can be made via card or cryptocurrency. We keep the service stable and fair for everyone."
                </p>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-black text-muted uppercase tracking-[0.3em]">Status: Active</span>
                 </div>
                 <div className="w-px h-3 bg-white/10" />
                 <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-muted uppercase tracking-[0.3em]">Ready</span>
                 </div>
              </div>
            </div>
          )}

          {step === 'finish' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 animate-[fadeIn_0.3s]">
              <div className="relative">
                <div className="w-40 h-40 bg-primary/20 rounded-full flex items-center justify-center animate-pulse shadow-glow">
                  <CheckCircle2 size={80} className="text-primary" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic">Ready to start</h2>
                <p className="text-xl font-bold text-white/90 uppercase tracking-[0.3em]">Everything is set up.</p>
              </div>
            </div>
          )}

          <div className={`mt-auto pt-10 flex gap-4 shrink-0 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {step !== 'finish' && (
              <button onClick={onSkip} className="px-10 py-5 bg-white/5 text-muted hover:text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] border border-white/5 transition-all">
                {t('skipSetup')}
              </button>
            )}
            
            {step === 'finish' ? (
              <button 
                onClick={() => onComplete({ ...settings, isSetupComplete: true }, false)} 
                className="flex-1 py-6 bg-white text-black border-4 border-primary rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] shadow-glow"
              >
                Go to Chat
              </button>
            ) : (
              <button 
                onClick={() => setStep('finish')} 
                className="flex-1 py-6 bg-white text-black border-4 border-primary rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] shadow-glow flex items-center justify-center gap-3 transition-all"
              >
                Accept <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};