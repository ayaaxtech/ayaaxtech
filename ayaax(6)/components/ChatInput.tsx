import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  StopCircle, Rocket, ChevronDown, X, Mic, Plus,
  Sparkles, Brain, Flame, Sun, Wand2, Terminal, Lightbulb, 
  Zap, Layers, Hammer, Cpu, Users, Microscope, Video, Palette,
  Ratio, Maximize, Type, Hash, MonitorPlay, Film, Loader2, Settings2, Check,
  AlertTriangle, Eye, Gauge, ShieldCheck, SearchCode, BookCheck, Info, Sparkle,
  Fingerprint, MousePointer2, ChevronRight, AlertCircle, Quote, Target, Library,
  Command
} from 'lucide-react';
import { ChatMode, MessageMetadata, RewriteStyle, Message, ForgeConfig, CorrectnessInsight, LocalMistake } from '../types';
import { Tooltip } from './Tooltip';
import { getTranslation } from '../translations';
import { rewriteInput, auditCorrectness } from '../services/geminiService';

interface ChatInputProps {
  onSend: (message: string, mode: ChatMode, metadata?: MessageMetadata, image?: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  onUpgradeRequest: () => void;
  userTier: string;
  onOpenVision?: () => void;
  language?: string;
  history?: Message[];
  onScoreUpdate?: (score: number) => void;
  initialValue?: string;
}

const DEFAULT_FORGE: ForgeConfig = {
  style: 'Professional',
  tone: 'Confident',
  length: 'Maintain',
  level: 'Standard',
  importance: 'Medium',
  domain: 'General',
  intent: 'Inform'
};

const SUGGESTIONS = [
  "create a website with react",
  "make a landing page",
  "do a summary of this text",
  "give me 10 ideas for a startup",
  "show me how to build a mobile app",
  "type a python script for scraping",
  "create a snake game",
  "do my physics homework",
  "give me a joke about robots",
  "show me latest tech news",
  "type an professional email",
  "make a workout plan",
  "create a 30 day challenge",
  "do a logic analysis of this idea"
];

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, isLoading, onStop, onOpenVision, language = 'English', history = [], onScoreUpdate, initialValue = ''
}) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatMode>('chat');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [forgeConfig, setForgeConfig] = useState<ForgeConfig>(DEFAULT_FORGE);
  const [localMistakes, setLocalMistakes] = useState<LocalMistake[]>([]);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  
  const t = (key: string) => getTranslation(language, key);

  const MODE_OPTIONS: { id: ChatMode, label: string, icon: any, desc: string }[] = [
    { id: 'chat', label: t('modeChat'), icon: Sparkles, desc: t('descChat') },
    { id: 'abc', label: t('modeAbc'), icon: Users, desc: t('descAbc') },
    { id: 'image', label: t('modeImage'), icon: Palette, desc: t('descImage') },
    { id: 'beast', label: t('modeBeast'), icon: Flame, desc: t('descBeast') },
    { id: 'analyst', label: t('modeAnalyst'), icon: Microscope, desc: t('descAnalyst') },
    { id: 'logic', label: t('modeLogic'), icon: Brain, desc: t('descLogic') },
  ];

  const selectedMode = MODE_OPTIONS.find(opt => opt.id === mode) || MODE_OPTIONS[0];

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const forgeRef = useRef<HTMLDivElement>(null);
  const auditTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prefill when action buttons clicked
  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
      textareaRef.current?.focus();
    }
  }, [initialValue]);

  // Suggestions logic
  useEffect(() => {
    if (input.length >= 2) {
      const filtered = SUGGESTIONS.filter(s => s.toLowerCase().includes(input.toLowerCase()) && s.toLowerCase() !== input.toLowerCase());
      setFilteredSuggestions(filtered.slice(0, 5));
    } else {
      setFilteredSuggestions([]);
    }
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (forgeRef.current && !forgeRef.current.contains(event.target as Node)) {
        setIsForgeOpen(false);
        setIsAuditOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && filteredSuggestions.length > 0) {
      e.preventDefault();
      setInput(filteredSuggestions[0]);
      setFilteredSuggestions([]);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim() && !attachedImage) return;
    if (isLoading) return;
    onSend(input.trim(), mode, {}, attachedImage || undefined);
    setInput('');
    setAttachedImage(null);
    setFilteredSuggestions([]);
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 flex flex-col gap-4 animate-[fadeIn_0.5s] relative">
      
      {/* Suggestions List */}
      {filteredSuggestions.length > 0 && (
        <div className="absolute bottom-full left-6 right-6 mb-4 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s] z-[60]">
          {filteredSuggestions.map((s, i) => (
            <button 
              key={i} 
              onClick={() => { setInput(s); setFilteredSuggestions([]); }}
              className="w-full text-left px-6 py-4 hover:bg-white/5 border-b border-white/5 last:border-none flex items-center gap-4 group transition-colors"
            >
              <Command size={14} className="text-muted group-hover:text-primary transition-colors" />
              <span className="text-[11px] font-bold text-white/80 group-hover:text-white uppercase tracking-widest">{s}</span>
            </button>
          ))}
        </div>
      )}

      {(isForgeOpen || isAuditOpen) && (
        <div ref={forgeRef} className="bg-surface/95 backdrop-blur-2xl border border-primary/20 rounded-[3.5rem] p-10 shadow-2xl animate-[scaleIn_0.2s] z-50 overflow-hidden relative min-h-[400px] flex flex-col">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><BookCheck size={180} className="text-primary" /></div>
           <div className="flex flex-col md:flex-row items-center justify-between mb-10 border-b border-white/5 pb-8 gap-8">
              <div className="flex items-center gap-6">
                 <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-glow ring-1 ring-primary/20"><Wand2 size={28} /></div>
                 <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-[0.2em]">Neural Forge</h4>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Direct Control</p>
                 </div>
              </div>
              <div className="flex gap-4">
                  <button onClick={() => { setIsForgeOpen(true); setIsAuditOpen(false); }} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isForgeOpen ? 'bg-primary text-black shadow-glow' : 'text-muted hover:text-text'}`}>Params</button>
                  <button onClick={() => { setIsAuditOpen(true); setIsForgeOpen(false); }} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAuditOpen ? 'bg-primary text-black shadow-glow' : 'text-muted hover:text-text'}`}>Audit</button>
              </div>
           </div>
           <div className="flex-1 overflow-hidden flex flex-col">
              {isForgeOpen && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10 animate-[fadeIn_0.3s]">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2 px-1"><Library size={12} /> Domain</label>
                      <select value={forgeConfig.domain} onChange={(e) => setForgeConfig(p => ({...p, domain: e.target.value as any}))} className="w-full bg-black/60 border border-white/10 rounded-[1.5rem] py-4 px-5 text-[11px] font-bold text-white outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                         {['General', 'Business', 'Academic', 'Technical', 'Creative', 'Casual'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2 px-1"><Target size={12} /> Intent</label>
                      <select value={forgeConfig.intent} onChange={(e) => setForgeConfig(p => ({...p, intent: e.target.value as any}))} className="w-full bg-black/60 border border-white/10 rounded-[1.5rem] py-4 px-5 text-[11px] font-bold text-white outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                         {['Inform', 'Persuade', 'Describe', 'Argue', 'Entertain'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                   </div>
                </div>
              )}
           </div>
           <div className="mt-12 pt-8 border-t border-white/5 flex justify-end relative z-10">
              <button onClick={async () => {
                setIsRewriting(true);
                const result = await rewriteInput(input, history, forgeConfig);
                setInput(result);
                setIsRewriting(false);
                setIsForgeOpen(false);
              }} disabled={!input.trim() || isRewriting} className="w-full md:w-auto flex items-center justify-center gap-6 px-14 py-6 bg-white text-black rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-glow disabled:opacity-30 group">
                 {isRewriting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} Build
              </button>
           </div>
        </div>
      )}

      <div className={`relative flex bg-background border transition-all border-border shadow-lg focus-within:border-primary rounded-[2.5rem] px-6 py-4 items-center gap-4`}>
        <div className="relative shrink-0">
          <button onClick={() => setIsSelectorOpen(!isSelectorOpen)} className="flex items-center gap-3 rounded-2xl border border-border px-4 py-2 bg-surface hover:border-primary transition-all shadow-sm">
            <selectedMode.icon size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text">{selectedMode.label}</span>
            <ChevronDown size={14} className={`text-muted transition-transform duration-300 ${isSelectorOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSelectorOpen && (
            <div className="absolute bottom-full left-0 mb-4 w-72 bg-surface border border-border rounded-[2.5rem] shadow-2xl p-2 animate-[scaleIn_0.2s] z-50">
              {MODE_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => { setMode(opt.id); setIsSelectorOpen(false); }} className={`flex items-center gap-4 w-full p-4 rounded-3xl transition-all ${mode === opt.id ? 'bg-primary/10 text-primary' : 'hover:bg-background text-muted'}`}>
                  <opt.icon size={18} />
                  <div className="text-left"><div className="text-[10px] font-black uppercase tracking-widest">{opt.label}</div></div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Tooltip content={t('contextImage')}><button onClick={() => imageInputRef.current?.click()} className={`p-2 rounded-xl transition-all ${attachedImage ? 'text-primary bg-primary/10' : 'text-muted hover:text-text'}`}><input type="file" ref={imageInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setAttachedImage(reader.result as string); reader.readAsDataURL(file); } }} accept="image/*" className="hidden" /><Plus size={22} /></button></Tooltip>
        </div>

        {attachedImage && (
          <div className="relative shrink-0 animate-[scaleIn_0.2s]">
            <img src={attachedImage} className="w-10 h-10 rounded-xl object-cover border-2 border-primary shadow-glow" alt="Target" />
            <button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-brightRed text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"><X size={10} /></button>
          </div>
        )}

        <div className="relative flex-1 group">
           <textarea
             ref={textareaRef}
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder={attachedImage ? t('describeEdit') : t('synthesizeCommand')}
             className="w-full bg-transparent text-text placeholder:text-muted/50 resize-none focus:outline-none font-sans text-[15px] leading-normal no-scrollbar py-2 h-10 min-h-[40px] overflow-hidden block relative z-10"
             onKeyDown={handleKeyDown}
           />
        </div>
        
        <div className="flex items-center gap-4">
          {input.trim() && !isLoading && (
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 group/forge relative">
              <Tooltip content="Neural Forge">
                <button onClick={() => setIsForgeOpen(!isForgeOpen)} className={`w-10 h-10 flex items-center justify-center rounded-full text-muted hover:text-white transition-all ${isForgeOpen ? 'text-primary bg-primary/10' : ''}`}><Settings2 size={18} /></button>
              </Tooltip>
            </div>
          )}
          {isLoading ? (
            <button onClick={onStop} className="w-12 h-12 flex items-center justify-center bg-primary text-background rounded-full animate-pulse shadow-glow"><StopCircle size={22} /></button>
          ) : (
            <button onClick={handleSend} disabled={!input.trim() && !attachedImage} className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-background hover:scale-105 active:scale-95 disabled:opacity-10 transition-all shadow-glow"><Rocket size={22} /></button>
          )}
        </div>
      </div>
    </div>
  );
};