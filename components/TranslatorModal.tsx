import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Languages, Repeat, Trash2, Copy, Play, Volume2, 
  Sparkles, Check, Loader2, Search, ChevronDown, ArrowRight,
  RefreshCw, Mic
} from 'lucide-react';
import { generateResponse, speak } from '../services/geminiService';
import { getTranslation } from '../translations';
import { GLOBAL_LANGUAGES } from '../App';

interface TranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export const TranslatorModal: React.FC<TranslatorModalProps> = ({ isOpen, onClose, language }) => {
  const [sourceLang, setSourceLang] = useState('Auto');
  const [targetLang, setTargetLang] = useState('English');
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    if (isOpen) {
      setInputText('');
      setResultText('');
      setIsTranslating(false);
    }
  }, [isOpen]);

  const handleTranslate = async () => {
    if (!inputText.trim() || isTranslating) return;
    setIsTranslating(true);
    setResultText('');

    const prompt = `[TRANSLATOR_PROTOCOL]:
SOURCE_LANG: ${sourceLang}
TARGET_LANG: ${targetLang}
INPUT: "${inputText}"
TASK: Translate the input strictly and professionally. Use high-level vocabulary native to ${targetLang}. Output ONLY the translated text.`;

    try {
      await generateResponse(
        [],
        prompt,
        'chat',
        (chunk) => setResultText(chunk),
        () => {},
        undefined,
        { language } as any
      );
    } catch (error) {
      setResultText("NEURAL_LINK_ERROR: Synthesis failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwap = () => {
    if (sourceLang === 'Auto') return;
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    const tempText = inputText;
    setInputText(resultText);
    setResultText(tempText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = async () => {
    if (!resultText || isSpeaking) return;
    setIsSpeaking(true);
    await speak(resultText, 'Puck', targetLang);
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2800] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-6xl h-full max-h-[85vh] bg-surface border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-[scaleIn_0.3s]">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow"><Languages size={24} /></div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t('translatorHeader')}</h2>
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.5em] mt-1">{t('translatorSub')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-muted transition-all"><X size={24} /></button>
        </div>

        {/* Action Bar */}
        <div className="bg-black/30 border-b border-white/5 p-4 flex flex-wrap items-center justify-center gap-4 overflow-hidden">
           <div className="flex items-center gap-2">
              <select 
                value={sourceLang} 
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase text-white focus:outline-none focus:border-primary transition-all cursor-pointer max-w-[150px]"
              >
                <option value="Auto" className="bg-surface">✨ Auto</option>
                {GLOBAL_LANGUAGES.map(l => <option key={l.id} value={l.id} className="bg-surface">{l.flag} {l.id}</option>)}
              </select>
           </div>

           <button 
            onClick={handleSwap}
            disabled={sourceLang === 'Auto'}
            className="p-3 bg-white/5 border border-white/10 rounded-full text-muted hover:text-primary transition-all disabled:opacity-20"
           >
              <Repeat size={18} />
           </button>

           <div className="flex items-center gap-2">
              <select 
                value={targetLang} 
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase text-white focus:outline-none focus:border-primary transition-all cursor-pointer max-w-[150px]"
              >
                {GLOBAL_LANGUAGES.map(l => <option key={l.id} value={l.id} className="bg-surface">{l.flag} {l.id}</option>)}
              </select>
           </div>
        </div>

        {/* Translation Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
           {/* Source Pane */}
           <div className="flex-1 flex flex-col p-8 border-r border-white/5 relative group">
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('enterText')}
                className="flex-1 bg-transparent text-white font-medium text-lg lg:text-xl resize-none focus:outline-none custom-scrollbar placeholder:text-muted/20"
              />
              <div className="mt-4 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <button onClick={() => setInputText('')} className="p-2.5 text-muted hover:text-brightRed transition-all"><Trash2 size={18} /></button>
                    <button className="p-2.5 text-muted hover:text-primary transition-all"><Mic size={18} /></button>
                 </div>
                 <span className="text-[10px] font-mono text-muted/30 uppercase">{inputText.length} / 5000</span>
              </div>
           </div>

           {/* Result Pane */}
           <div className="flex-1 flex flex-col p-8 bg-black/40 relative">
              <textarea 
                readOnly
                value={resultText}
                placeholder={isTranslating ? '...' : t('translationResult')}
                className={`flex-1 bg-transparent text-primary font-bold text-lg lg:text-xl resize-none focus:outline-none custom-scrollbar placeholder:text-muted/10 transition-opacity ${isTranslating ? 'opacity-30' : 'opacity-100'}`}
              />
              {isTranslating && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <Loader2 className="animate-spin text-primary" size={48} />
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <button onClick={handleSpeak} disabled={!resultText} className={`p-2.5 transition-all ${isSpeaking ? 'text-primary' : 'text-muted hover:text-primary'}`}><Volume2 size={18} /></button>
                    <button onClick={handleCopy} disabled={!resultText} className="p-2.5 text-muted hover:text-white transition-all relative">
                      {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Trigger */}
        <div className="p-8 border-t border-white/5 bg-black/40 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow" />
              <span className="text-[9px] font-black text-muted uppercase tracking-[0.4em]">{t('neuralRegistryConnected')}</span>
           </div>
           <button 
            onClick={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            className="px-16 py-6 bg-white text-black rounded-full font-black uppercase text-[12px] shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-4 disabled:opacity-10"
           >
              {isTranslating ? <Loader2 className="animate-spin" size={18} /> : <><Sparkles size={18} /> {t('translateBtn')}</>}
           </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
