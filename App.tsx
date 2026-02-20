import React, { useState, useEffect, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Role, ChatSession, ChatMode, UserSettings, MessageMetadata, CustomAppConfig, ImageHistoryItem, UserUsage } from './types';
import { generateResponse, speak, ensureAudioContext } from './services/geminiService';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { ActionGrid } from './components/ActionGrid';
import { LandingPage } from './components/LandingPage';
import { AyaaxLogo, AyaaxLogoHandle } from './components/AyaaxLogo';
import { SettingsModal } from './components/SettingsModal';
import { UpgradeModal } from './components/UpgradeModal';
import { DocumentFactoryModal } from './components/DocumentFactoryModal';
import { BuilderModal } from './components/BuilderModal';
import { LiveClock } from './components/LiveClock';
import { AiChartModal } from './components/AiChartModal';
import { ArtLabModal } from './components/ArtLabModal';
import { SetupModal } from './components/SetupModal';
import { NeuralSearch } from './components/NeuralSearch';
import { TranslatorModal } from './components/TranslatorModal';
import { QuickToolbar } from './components/QuickToolbar';
import { LoginPromptModal } from './components/LoginPromptModal';
import { isRTL, useI18n } from './translations';
import { 
  Plus, Settings, PanelLeftClose, PanelLeft, 
  Palette, Power, Trash2, Zap, Pin, PinOff,
  Edit3, Check, X as CloseIcon, Sun, Moon, LogIn,
  ArrowDown
} from 'lucide-react';
import { Tooltip } from './components/Tooltip';
import { TypingIndicator } from './components/TypingIndicator';

export const GLOBAL_LANGUAGES = [
  { id: 'English', label: 'English', flag: '🇺🇸' },
  { id: 'Chinese', label: 'Chinese', flag: '🇨🇳' },
  { id: 'Arabic', label: 'Arabic', flag: '🇸🇦' },
  { id: 'French', label: 'French', flag: '🇫🇷' },
  { id: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'German', label: 'German', flag: '🇩🇪' },
  { id: 'Russian', label: 'Russian', flag: '🇷🇺' },
  { id: 'Japanese', label: 'Japanese', flag: '🇯🇵' },
  { id: 'Korean', label: 'Korean', flag: '🇰🇷' },
  { id: 'Italian', label: 'Italian', flag: '🇮🇹' },
  { id: 'Portuguese', label: 'Portuguese', flag: '🇵🇹' },
  { id: 'Czech', label: 'Czech', flag: '🇨🇿' },
];

const DEFAULT_USAGE: UserUsage = {
  imageGenerationsToday: 0,
  lastImageGenTimestamp: 0,
  appBuilderCredits: 100,
  totalAppsCreated: 0
};

const DEFAULT_SETTINGS: UserSettings = {
  tone: 'Professional', personality: 'Helpful', aiBalance: 'Balanced', prioritize: 'Accuracy', outputFormat: 'Both',
  language: 'English', dyslexiaFont: false, highContrast: false, theme: 'dark', primaryColor: '#FFFFFF', tier: 'free',
  textSize: 'Small', viewMode: 'Spaced', isSetupComplete: false, explanationStyle: 'Conceptual', homeworkShield: false,
  iotComfortLevel: 50, predictiveShield: true, regretPrevention: true, socialIntelligence: true,
  usage: DEFAULT_USAGE
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [showSetup, setShowSetup] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentMode, setCurrentMode] = useState<ChatMode>('chat');
  const { t, isLoaded } = useI18n(settings.language);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [inputPrefill, setInputPrefill] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [modals, setModals] = useState({
    settings: false, upgrade: false, factory: false, builder: false,
    chart: false, artLab: false, vision: false, translator: false
  });
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sidebarLogoRef = useRef<AyaaxLogoHandle>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ayaax_ai_user');
      const savedSettings = localStorage.getItem('ayaax_ai_settings');
      const savedSessions = localStorage.getItem('ayaax_ai_sessions');
      const savedHistory = localStorage.getItem('ayaax_ai_image_history');
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) setActiveSessionId(parsed[0].id);
      }
      if (savedHistory) setImageHistory(JSON.parse(savedHistory));
    } catch(e) { console.error("Storage load failure", e); }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('ayaax_ai_user', JSON.stringify(user));
      else localStorage.removeItem('ayaax_ai_user');

      localStorage.setItem('ayaax_ai_settings', JSON.stringify(settings));
      
      const prunedSessions = sessions.slice(0, 15).map(session => ({
        ...session,
        messages: session.messages.slice(-25).map(m => ({
          ...m,
          imageUrl: (session.id === activeSessionId) ? m.imageUrl : undefined
        }))
      }));
      localStorage.setItem('ayaax_ai_sessions', JSON.stringify(prunedSessions));
      localStorage.setItem('ayaax_ai_image_history', JSON.stringify(imageHistory.slice(0, 10)));
      document.body.className = settings.theme;
    } catch(e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        localStorage.removeItem('ayaax_ai_image_history');
      }
    }
  }, [user, settings, sessions, imageHistory, activeSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [activeSessionId, isLoading]);

  const activeSession = useMemo(() => sessions.find(s => s.id === activeSessionId) || null, [sessions, activeSessionId]);

  const handleLogout = () => { setUser(null); setActiveSessionId(null); localStorage.clear(); };

  const toggleTheme = () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    setShowScrollButton(!isAtBottom);
  };

  const checkUsageLimit = (type: 'image' | 'builder'): boolean => {
    const isFree = settings.tier === 'free';
    const usage = settings.usage || DEFAULT_USAGE;

    if (type === 'image' && isFree) {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      let count = usage.imageGenerationsToday || 0;
      if (now - (usage.lastImageGenTimestamp || 0) > oneDay) count = 0;
      
      if (count >= 3) {
        alert("Image limit reached. Please login.");
        if (!user) setShowLoginPrompt(true);
        else toggleModal('upgrade', true);
        return false;
      }
    }
    return true;
  };

  const toggleModal = (key: keyof typeof modals, state?: boolean) => {
    const nextState = state !== undefined ? state : !modals[key];
    setModals(prev => ({ ...prev, [key]: nextState }));
  };

  const createNewSession = (title: string = t('newProtocol')) => {
    const newId = uuidv4();
    const newSession: ChatSession = { id: newId, title, messages: [], createdAt: Date.now(), isPinned: false };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    return newId;
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) setActiveSessionId(null);
  };

  const togglePin = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
  };

  const renameSession = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
    setEditingSessionId(null);
  };

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });
  }, [sessions]);

  const handleSend = async (content: string, mode: ChatMode, metadata: MessageMetadata = {}, image?: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (mode === 'image' && !checkUsageLimit('image')) return;

    let currentId = activeSessionId;
    if (!currentId) currentId = createNewSession(content.slice(0, 30) || t('newProtocol'));
    
    await ensureAudioContext();
    const userMessage: Message = { id: uuidv4(), role: Role.USER, content, mode, imageUrl: image, timestamp: Date.now(), metadata };
    const aiMessageId = uuidv4();
    const aiMessage: Message = { id: aiMessageId, role: Role.MODEL, content: '', mode, timestamp: Date.now(), isStreaming: true };
    setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, userMessage, aiMessage] } : s));
    setIsLoading(true);
    
    try {
      await generateResponse(sessions.find(s => s.id === currentId)?.messages || [], content, mode, (text) => {
        setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: s.messages.map(m => m.id === aiMessageId ? { ...m, content: text } : m) } : s));
      }, (links) => {
        setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: s.messages.map(m => m.id === aiMessageId ? { ...m, groundingLinks: links } : m) } : s));
      }, (imageUrl) => {
        setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: s.messages.map(m => m.id === aiMessageId ? { ...m, imageUrl: imageUrl } : m) } : s));
        setImageHistory(prev => [{ id: uuidv4(), imageUrl, prompt: content, aspectRatio: '1:1', timestamp: Date.now() }, ...prev].slice(0, 10));
        setSettings(prev => {
          const usage = prev.usage || DEFAULT_USAGE;
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000;
          let count = usage.imageGenerationsToday || 0;
          if (now - (usage.lastImageGenTimestamp || 0) > oneDay) count = 0;
          return { ...prev, usage: { ...usage, imageGenerationsToday: count + 1, lastImageGenTimestamp: now } };
        });
      }, settings, metadata, image);
    } catch (error: any) {
      setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: s.messages.map(m => m.id === aiMessageId ? { ...m, content: "Failure", isError: true } : m) } : s));
    } finally {
      setIsLoading(false);
      setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: s.messages.map(m => m.id === aiMessageId ? { ...m, isStreaming: false } : m) } : s));
    }
  };

  const handlePrefill = (prompt: string, mode: ChatMode) => {
    setCurrentMode(mode);
    setInputPrefill(prompt + " ");
    // Clear prefill after it's passed to input
    setTimeout(() => setInputPrefill(''), 100);
  };

  const handleOpenTool = (id: string) => {
    if (id === 'langSelector' || id === 'language') toggleModal('settings', true);
    else if (id === 'docFactory') toggleModal('factory', true);
    else toggleModal(id as any, true);
  };

  if (!isLoaded) return <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-6 z-[9999]"><AyaaxLogo size="lg" active={true} /></div>;

  return (
    <div className={`flex h-screen w-full bg-background overflow-hidden relative font-sans ${settings.theme === 'light' ? 'light-theme' : ''}`} dir={isRTL(settings.language) ? 'rtl' : 'ltr'}>
      <aside className={`sidebar-cool h-full bg-surface border-r border-border flex flex-col z-30 transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0 opacity-0'}`}>
        <div className="p-8 flex items-center justify-between">
          <AyaaxLogo ref={sidebarLogoRef} size="sm" active={isLoading} onClick={() => setActiveSessionId(null)} />
          <div className="flex gap-2">
            <Tooltip content={t('actArt')}>
              <button onClick={() => toggleModal('artLab')} className="p-2.5 bg-background border border-border rounded-xl hover:text-accent transition-all">
                <Palette size={18} />
              </button>
            </Tooltip>
            <Tooltip content={settings.theme === 'dark' ? "Light Mode" : "Dark Mode"}>
              <button onClick={toggleTheme} className="p-2.5 bg-background border border-border rounded-xl hover:text-accent transition-all">
                {settings.theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-400" />}
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="px-6 mb-6">
          <Tooltip content={t('newProtocol')}>
            <button 
              onClick={() => createNewSession()} 
              className="w-full py-6 bg-primary/10 border-2 border-primary text-primary rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(57,255,20,0.4)] hover:shadow-[0_0_40px_rgba(57,255,20,0.6)] hover:bg-primary hover:text-black"
            >
              <Plus size={20} strokeWidth={3} /> {t('newProtocol')}
            </button>
          </Tooltip>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-2 pb-10">
          {sortedSessions.map(s => (
            <div key={s.id} className="group relative">
               <button onClick={() => setActiveSessionId(s.id)} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left truncate border ${activeSessionId === s.id ? 'bg-primary/10 border-primary text-text' : 'bg-transparent border-transparent text-muted hover:bg-background/50 hover:text-text'}`}>
                 {s.isPinned && <Pin size={10} className="text-primary shrink-0" />}
                 {editingSessionId === s.id ? (
                   <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                     <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="bg-black/40 border-none outline-none text-[11px] w-full p-1 text-white" autoFocus onKeyDown={e => e.key === 'Enter' && renameSession(s.id, editTitle)} onBlur={() => setEditingSessionId(null)} />
                     <button onClick={() => renameSession(s.id, editTitle)} className="text-primary"><Check size={12} /></button>
                   </div>
                 ) : (
                   <span className="text-[11px] font-bold uppercase truncate flex-1">{s.title}</span>
                 )}
               </button>
               <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-surface/95 backdrop-blur shadow-xl p-1 rounded-lg border border-white/5">
                  <Tooltip content={s.isPinned ? "Unpin" : "Pin"}>
                    <button onClick={(e) => { e.stopPropagation(); togglePin(s.id); }} className={`p-1.5 rounded-md hover:bg-white/5 transition-all ${s.isPinned ? 'text-primary' : 'text-muted hover:text-white'}`}>
                      {s.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                    </button>
                  </Tooltip>
                  <Tooltip content="Rename">
                    <button onClick={(e) => { e.stopPropagation(); setEditingSessionId(s.id); setEditTitle(s.title); }} className="p-1.5 rounded-md text-muted hover:text-blue-400 hover:bg-white/5 transition-all">
                      <Edit3 size={14} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete">
                    <button onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }} className="p-1.5 rounded-md text-muted hover:text-brightRed hover:bg-white/5 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </Tooltip>
               </div>
            </div>
          ))}
        </div>
        <div className="p-8 border-t border-border bg-background/30 flex items-center justify-between">
           {user ? (
             <Tooltip content="Logout">
               <button onClick={handleLogout} className="p-2.5 bg-background border border-border rounded-xl text-muted hover:text-brightRed transition-all">
                 <Power size={18} />
               </button>
             </Tooltip>
           ) : (
             <Tooltip content="Login">
               <button onClick={() => setShowLoginPrompt(true)} className="p-2.5 bg-background border border-border rounded-xl text-primary hover:bg-primary/10 transition-all">
                 <LogIn size={18} />
               </button>
             </Tooltip>
           )}
           <div className="text-[9px] font-black text-primary/60 uppercase tracking-widest">{user ? settings.tier.toUpperCase() : 'FREE'}</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative min-w-0 h-full">
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-6 flex-1">
            <Tooltip content={isSidebarOpen ? "Collapse" : "Expand"}>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-text hover:bg-surface rounded-xl transition-all">
                {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
              </button>
            </Tooltip>
            <NeuralSearch language={settings.language} onOpenTool={handleOpenTool} />
          </div>
          <div className="flex items-center gap-4">
            <LiveClock />
            <div className="flex items-center gap-3 border-l border-white/5 pl-4">
              <Tooltip content={t('upgrade')}>
                <button onClick={() => toggleModal('upgrade')} className="px-5 py-2.5 rounded-xl bg-primary/10 border-2 border-primary transition-all hover:scale-105 active:scale-95">
                  <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">{t('upgrade')}</span>
                </button>
              </Tooltip>
              <Tooltip content={t('settings')}>
                <button onClick={() => toggleModal('settings')} className="p-2.5 text-muted hover:text-primary transition-all">
                  <Settings size={20} />
                </button>
              </Tooltip>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative" onScroll={handleScroll} ref={chatContainerRef}>
          <div className="max-w-5xl mx-auto w-full pt-10 pb-40 px-6">
            {!activeSession || activeSession.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[60vh] space-y-16">
                <AyaaxLogo size="xl" active={isLoading} onClick={() => sidebarLogoRef.current?.triggerExplosion()} />
                <ActionGrid onActionSelect={handlePrefill} language={settings.language} />
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {activeSession.messages.map((msg) => <MessageBubble key={msg.id} message={msg} language={settings.language} settings={settings} />)}
                {isLoading && <TypingIndicator mode={activeSession.messages[activeSession.messages.length-2]?.mode} />}
                <div ref={scrollRef} />
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/95 to-transparent z-20">
          <div className="max-w-5xl mx-auto w-full flex flex-col gap-4 relative">
             {/* Jump to bottom button */}
             {showScrollButton && (
               <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-[bounce_2s_infinite]">
                 <Tooltip content="Jump to latest">
                   <button 
                    onClick={scrollToBottom}
                    className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.6)] hover:scale-110 active:scale-95 transition-all"
                   >
                     <ArrowDown size={24} strokeWidth={3} />
                   </button>
                 </Tooltip>
               </div>
             )}

             <ChatInput initialValue={inputPrefill} onSend={(msg, mode, meta, img) => handleSend(msg, mode || currentMode, meta, img)} isLoading={isLoading} onUpgradeRequest={() => toggleModal('upgrade')} userTier={settings.tier} language={settings.language} history={activeSession?.messages || []} />
             {activeSession && activeSession.messages.length > 0 && <QuickToolbar currentMode={currentMode} onModeChange={setCurrentMode} onAction={(a) => a === 'clear' ? setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [] } : s)) : handleSend(t('promptSummarize'), 'chat')} language={settings.language} />}
          </div>
        </div>
      </main>

      <SettingsModal isOpen={modals.settings} onClose={() => toggleModal('settings', false)} settings={settings} onSettingsChange={setSettings} />
      <UpgradeModal isOpen={modals.upgrade} onClose={() => toggleModal('upgrade', false)} language={settings.language} isGuest={!user} />
      <BuilderModal isOpen={modals.builder} onClose={() => toggleModal('builder', false)} language={settings.language} onForge={(conf) => { handleSend(t('forgeInit', { name: conf.name }), 'builder', { customApp: conf }); toggleModal('builder', false); }} />
      <ArtLabModal isOpen={modals.artLab} onClose={() => toggleModal('artLab', false)} imageHistory={imageHistory} onGenerate={handleSend} language={settings.language} />
      <SetupModal isOpen={showSetup} onComplete={(s) => { setSettings(s); setShowSetup(false); }} onSkip={() => setShowSetup(false)} initialSettings={settings} />
      
      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        onLoginSuccess={(email, userData) => {
          setUser({ email, id: userData.uid, ...userData });
          setShowLoginPrompt(false);
          setShowSetup(true);
        }}
        language={settings.language}
      />
    </div>
  );
};

export default App;