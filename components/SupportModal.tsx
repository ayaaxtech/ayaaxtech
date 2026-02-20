import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Headset, Send, ShieldCheck, Mail, 
  MessageSquare, Loader2, Bot, User, Zap, Terminal, ExternalLink
} from 'lucide-react';
import { generateResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { UserSettings } from '../types';
import { getTranslation } from '../translations';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onNavigate: (target: string) => void;
}

interface SupportMessage {
  role: 'support' | 'user';
  content: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, settings, onNavigate }) => {
  const [step, setStep] = useState<'identity' | 'chat'>('identity');
  const [contact, setContact] = useState('');
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = (key: string, params: any = {}) => getTranslation(settings.language, key, params);

  useEffect(() => {
    if (isOpen) {
      setStep('identity');
      setContact('');
      setMessages([]);
      setInput('');
      setIsGenerating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleIdentitySync = () => {
    if (!contact.trim()) return;
    setStep('chat');
    
    const initialGreeting = t('supportHandshake', { contact: contact, lang: settings.language });
    setMessages([{ role: 'support', content: initialGreeting }]);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('ayaax://')) {
      e.preventDefault();
      const target = href.replace('ayaax://', '');
      onNavigate(target);
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
      e.preventDefault();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsGenerating(true);

    const supportSystemPrompt = `You are the Official AYAAX Support Assistant.
STRICT INSTRUCTIONS:
1. ONLY answer questions about the AYAAX App's features, plans, pricing, and technical setup.
2. If the user asks for a link to plans, upgrades, or payment, use this EXACT markdown link: [Upgrade Plans](ayaax://upgrade).
3. If the user asks about the Asset Factory or file conversion, use: [Asset Factory](ayaax://factory).
4. If the user asks about generating images or the Art Lab, use: [Art Lab](ayaax://artlab).
5. If the user asks about voice calls or vocal links, use: [Neural Call](ayaax://call).
6. IF THE USER SAYS "GIVE ME SOME LINKS FOR THIS:", you must use your GOOGLE SEARCH grounding tool to find highly relevant, verified, and WORKING external URLs for the topic they mentioned. List them clearly as clickable markdown links.
7. FOR ALL OTHER LINKS: If requested for generic info, use regular URLs, but prioritize AYAAX's internal schemes for app-specific features.
8. CONTACT DETAILS: If asked for contact details, say: "Please leave your email address or detailed request in this chat, and our support architects will come back to you shortly."
9. PLANS & PRICING: Pro: $9.99/mo, GG: $29.99/mo, AYAAX: $129.99/mo, Therion: $199.99/mo.
10. LANGUAGE: You MUST respond exclusively in ${settings.language}. All support guidance must be in this language.`;

    try {
      let fullText = "";
      setMessages(prev => [...prev, { role: 'support', content: '' }]);
      
      await generateResponse(
        [], 
        `${supportSystemPrompt}\n\nUser Question: ${userMsg}`,
        'chat',
        (chunk) => {
          fullText = chunk;
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1].content = fullText;
            return next;
          });
        },
        () => {},
        undefined,
        settings,
        { timeframe: 'Support Interface' }
      );
    } catch (err) {
      setMessages(prev => [...prev, { role: 'support', content: "Neural handshake lost. Please retry." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-4xl h-[80vh] bg-surface border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-[scaleIn_0.3s]">
        
        {/* Left: Help Desk Status */}
        <div className="w-full md:w-72 bg-black/40 border-r border-white/5 p-10 flex flex-col">
           <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow">
                <Headset size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{t('helpDesk')}</h2>
                <p className="text-[9px] font-bold text-muted uppercase tracking-[0.4em]">Synced: {settings.language}</p>
              </div>
           </div>

           <div className="flex-1 space-y-8">
              <div className="space-y-4">
                 <span className="text-[9px] font-black text-muted uppercase tracking-[0.4em]">Protocol Status</span>
                 <div className="space-y-2">
                    {[t('pricingData'), t('featureManual'), t('contactSync')].map(node => (
                      <div key={node} className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-glow" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">{node}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {step === 'chat' && (
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-primary" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Linked</span>
                   </div>
                   <p className="text-[9px] text-muted font-bold uppercase tracking-widest leading-relaxed truncate">{contact}</p>
                </div>
              )}
           </div>

           <div className="mt-auto pt-8 border-t border-white/5">
              <button onClick={onClose} className="w-full py-4 bg-white/5 hover:bg-white/10 text-muted hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                {t('terminateLink')}
              </button>
           </div>
        </div>

        {/* Right: Interaction Layer */}
        <div className="flex-1 flex flex-col bg-black/20 overflow-hidden relative">
          <header className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full ${step === 'chat' ? 'bg-emerald-500 animate-pulse' : 'bg-muted'}`} />
               <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">
                 {t('neuralSupport')} Link Active
               </span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-muted"><X size={20} /></button>
          </header>

          {step === 'identity' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10">
               <Mail size={40} className="text-muted" />
               <div className="max-w-xs space-y-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{t('initializeIdentity')}</h3>
                  <p className="text-sm text-muted font-medium leading-relaxed uppercase tracking-widest">{t('provideEmail')}</p>
               </div>
               <div className="w-full max-w-sm space-y-4">
                  <input 
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleIdentitySync()}
                    placeholder={t('emailPlaceholder')}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-white text-[12px] font-black uppercase tracking-widest focus:border-primary focus:outline-none transition-all placeholder:text-muted/30"
                  />
                  <button 
                    onClick={handleIdentitySync}
                    disabled={!contact.trim()}
                    className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20"
                  >
                    {t('unlockSupport')} <Zap size={18} />
                  </button>
               </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'support' ? 'justify-start' : 'justify-end'} animate-[fadeIn_0.3s]`}>
                    <div className={`flex max-w-[85%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'support' ? 'bg-primary/10 border-primary/20 text-primary shadow-glow' : 'bg-white/10 border-white/10 text-white'}`}>
                        {msg.role === 'support' ? <Bot size={16} /> : <User size={16} />}
                      </div>
                      <div className={`p-6 rounded-[2rem] text-[13px] leading-relaxed font-medium ${msg.role === 'support' ? 'bg-white/5 text-text border border-white/5' : 'bg-primary text-black font-bold shadow-glow'}`}>
                        <ReactMarkdown 
                          components={{
                            a: ({node, href, children, ...props}) => (
                              <a 
                                {...props} 
                                href={href}
                                onClick={(e) => handleLinkClick(e, href || '')}
                                className="text-blue-300 underline font-black hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1" 
                              >
                                {children} <ExternalLink size={10} className="inline" />
                              </a>
                            )
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"><Loader2 size={16} className="animate-spin" /></div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-muted uppercase tracking-widest">Synthesizing {settings.language} Output...</div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              <div className="p-10 bg-black/40 border-t border-white/5">
                <div className="relative group">
                  <input 
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={t('howCanIHelp')}
                    className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-6 pl-8 pr-20 text-white text-[13px] font-bold focus:border-primary/50 outline-none transition-all placeholder:text-muted/30"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isGenerating}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-glow disabled:opacity-20"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="absolute top-24 right-10 flex flex-col gap-2 pointer-events-none opacity-20">
             <Terminal size={120} className="text-white" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};