
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Globe, Monitor, Accessibility, Layout, Cpu, Zap
} from 'lucide-react';
import { getTranslation } from '../translations';
import { GLOBAL_LANGUAGES } from '../App';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: any;
  onSettingsChange: (newSettings: any) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState<'engine' | 'iot' | 'regional' | 'accessibility' | 'ui'>('engine');

  const update = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const t = (key: string) => getTranslation(settings.language, key);

  if (!isOpen) return null;

  const tabs = [
    { id: 'engine', label: t('tabEngine'), icon: Cpu },
    { id: 'iot', label: "Neural IoT", icon: Zap },
    { id: 'regional', label: t('tabRegional'), icon: Globe },
    { id: 'accessibility', label: t('tabAccessibility'), icon: Accessibility },
    { id: 'ui', label: t('tabInterface'), icon: Layout }
  ];

  return createPortal(
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-[fadeIn_0.2s]">
      <div className="w-full max-w-4xl h-[80vh] bg-surface border border-border rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-[scaleIn_0.2s]">
        
        <div className="flex items-center justify-between p-8 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-xl text-primary"><Monitor size={20} /></div>
             <h2 className="text-xl font-black uppercase tracking-widest text-text">{t('settings')}</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-background rounded-full transition-all text-muted">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r border-border p-4 space-y-1 bg-background/30 overflow-y-auto no-scrollbar">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-background shadow-glow' : 'text-muted hover:bg-background/20 hover:text-text'}`}
              >
                <tab.icon size={14} strokeWidth={3} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar no-scrollbar">
            {activeTab === 'engine' && (
              <div className="space-y-8 animate-[fadeIn_0.2s]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('tabEngine')}</h3>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-muted uppercase tracking-widest">{t('aiBalance')}</label>
                  <div className="flex bg-background rounded-xl p-1 gap-1 border border-border">
                    {['Relaxed', 'Balanced', 'Motivated'].map(b => (
                      <button key={b} onClick={() => update('aiBalance', b)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${settings.aiBalance === b ? 'bg-primary text-background shadow-glow' : 'text-muted hover:bg-surface'}`}>{b}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'iot' && (
              <div className="space-y-8 animate-[fadeIn_0.2s]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Neural IoT</h3>
                <div className="p-6 bg-background border border-border rounded-[2rem] space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] font-black uppercase text-text">Predictive Shield</p>
                    <button onClick={() => update('predictiveShield', !settings.predictiveShield)} className={`w-12 h-6 rounded-full relative transition-all ${settings.predictiveShield ? 'bg-primary' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.predictiveShield ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'regional' && (
              <div className="space-y-8 animate-[fadeIn_0.2s]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('tabRegional')}</h3>
                <div className="space-y-2">
                   <label className="text-[9px] font-bold text-muted uppercase tracking-widest">Interface Language</label>
                   <select value={settings.language} onChange={e => update('language', e.target.value)} className="w-full bg-background border border-border rounded-xl p-4 text-xs text-text focus:border-primary outline-none">
                      {GLOBAL_LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.flag} {l.label}</option>)}
                   </select>
                </div>
              </div>
            )}
            
            {activeTab === 'accessibility' && (
              <div className="space-y-8 animate-[fadeIn_0.2s]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('tabAccessibility')}</h3>
                <div className="p-6 bg-background border border-border rounded-[2rem] space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-black uppercase text-text">High Contrast</p>
                      <p className="text-[8px] text-muted font-bold uppercase tracking-widest mt-1">Enhance visual boundaries</p>
                    </div>
                    <button onClick={() => update('highContrast', !settings.highContrast)} className={`w-12 h-6 rounded-full relative transition-all ${settings.highContrast ? 'bg-primary' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.highContrast ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-black uppercase text-text">Dyslexia Font</p>
                      <p className="text-[8px] text-muted font-bold uppercase tracking-widest mt-1">OpenDyslexic Typeface</p>
                    </div>
                    <button onClick={() => update('dyslexiaFont', !settings.dyslexiaFont)} className={`w-12 h-6 rounded-full relative transition-all ${settings.dyslexiaFont ? 'bg-primary' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.dyslexiaFont ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'ui' && (
              <div className="space-y-8 animate-[fadeIn_0.2s]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('tabInterface')}</h3>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-muted uppercase tracking-widest">Text Density</label>
                  <div className="flex bg-background rounded-xl p-1 gap-1 border border-border">
                    {['Small', 'Medium', 'Large'].map(s => (
                      <button key={s} onClick={() => update('textSize', s)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${settings.textSize === s ? 'bg-primary text-background shadow-glow' : 'text-muted hover:bg-surface'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-8 border-t border-border bg-background/50 flex justify-end">
           <button onClick={onClose} className="px-10 py-4 bg-primary text-background rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-glow">{t('applySync')}</button>
        </div>
      </div>
    </div>,
    document.body
  );
};
