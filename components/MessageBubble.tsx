import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role, AgentConfig, UserSettings } from '../types';
import { 
  Copy, ExternalLink, Code, Eye, Terminal, Layers, Sliders, Loader2, Zap, Trash2, Plus,
  Volume2, Check, Brain
} from 'lucide-react';
import { AyaaxLogo } from './AyaaxLogo';
import { generateResponse, speak } from '../services/geminiService';
import { getTranslation } from '../translations';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from './Tooltip';

const TONAL_KERNELS = [
  'Serious', 'Funny', 'Goofy', 'Sarcastic', 'Witty', 'Logical', 'Analytical', 'Stoic', 'Hacker', 'Philosophical'
];

interface TuningProps {
  tone: string;
  iq: number;
  speed: number;
  name: string;
  onUpdate: (updates: { tone?: string; iq?: number; speed?: number; name?: string }) => void;
  isOpen: boolean;
  language: string;
}

const TuningPanel: React.FC<TuningProps> = ({ tone, iq, speed, name, onUpdate, isOpen, language }) => {
  if (!isOpen) return null;
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="mt-4 pt-4 border-t border-white/5 animate-[scaleIn_0.2s] space-y-6">
      <div className="space-y-2">
        <label className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">{t('identityMapping')}</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder={t('agentName')}
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-[11px] font-black text-white uppercase focus:border-primary outline-none transition-all"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[8px] font-black text-muted uppercase tracking-[0.4em]">{t('neuralSignature')}</label>
          <span className="text-[9px] font-mono text-primary uppercase font-bold">{tone}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {TONAL_KERNELS.map((k) => (
            <button
              key={k}
              onClick={() => onUpdate({ tone: k })}
              className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase whitespace-nowrap border transition-all ${tone === k ? 'bg-primary text-background border-primary shadow-glow' : 'bg-white/5 text-muted border-white/5 hover:border-muted'}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MessageBubble: React.FC<{ message: Message; language: string; settings?: UserSettings }> = ({ message, language, settings }) => {
  const isUser = message.role === Role.USER;
  const isAbc = message.mode === 'abc';
  const isBeast = message.mode === 'beast' || message.mode === 'builder';
  const isAnalyst = message.mode === 'analyst';
  const t = (key: string) => getTranslation(language, key);
  
  const [nodes, setNodes] = useState<AgentConfig[]>(message.metadata?.nexusNodes || []);
  const [agentInputMap, setAgentInputMap] = useState<Record<string, string>>({});
  const [openTuningNodes, setOpenTuningNodes] = useState<Set<string>>(new Set());

  const [devView, setDevView] = useState<'code' | 'preview'>('code');
  const [editableCode, setEditableCode] = useState(message.content);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cleanForSpeech = (text: string) => {
    return text.replace(/```[\s\S]*?```/g, ' [CODE_BLOCK] ').replace(/`.*?`/g, '').trim();
  };

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const savedAlgorithm = JSON.parse(localStorage.getItem('lo_ai_voice_algorithm') || '{}');
    const voiceName = savedAlgorithm.voice?.id || 'Kore';
    await speak(cleanForSpeech(message.content), voiceName, language);
    setIsSpeaking(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (message.metadata?.nexusNodes) setNodes(message.metadata.nexusNodes);
    else if (isAbc && !isUser && nodes.length === 0) {
      setNodes([
        { id: uuidv4(), name: 'ARCHITECT', tone: 'Analytical', intelligence: 95, speed: 80, avatar: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=100', content: '...', status: 'idle' },
        { id: uuidv4(), name: 'CREATIVE', tone: 'Surreal', intelligence: 85, speed: 90, avatar: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100', content: '...', status: 'idle' }
      ]);
    }
  }, [message.metadata?.nexusNodes, isAbc, isUser]);

  const addAgent = () => {
    if (settings?.tier === 'free' && nodes.length >= 3) {
      alert("Free tier limit: Maximum 3 agents per swarm. Upgrade for unlimited agents.");
      return;
    }
    const newAgent: AgentConfig = {
      id: uuidv4(),
      name: `AGENT_${nodes.length + 1}`,
      tone: 'Logical', intelligence: 90, speed: 85,
      avatar: `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&q=80`,
      content: '...', status: 'idle'
    };
    setNodes(prev => [...prev, newAgent]);
  };

  const updateNode = (id: string, updates: Partial<AgentConfig>) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleAgentPulse = async (node: AgentConfig) => {
    const prompt = agentInputMap[node.id];
    if (!prompt?.trim() || node.status === 'processing') return;
    updateNode(node.id, { status: 'processing', content: '' });
    setAgentInputMap(prev => ({ ...prev, [node.id]: '' }));
    try {
      await generateResponse([], `You are ${node.name}. Respond exclusively in ${language}: ${prompt}`, 'chat', (chunk) => updateNode(node.id, { content: chunk }), () => {}, undefined, { language } as any);
    } catch (err) { updateNode(node.id, { content: 'ERROR' }); } finally { updateNode(node.id, { status: 'done' }); }
  };

  if (isBeast && !isUser) {
    const htmlMatch = editableCode.match(/```html([\s\S]*?)```/i);
    const effectiveCode = htmlMatch ? htmlMatch[1].trim() : editableCode;
    return (
      <div className="flex w-full justify-start animate-[fadeIn_0.5s] mb-12">
        <div className="flex flex-col w-full gap-4 max-w-6xl">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary shadow-glow"><Terminal size={18} /></div>
              <span className="text-[10px] font-black text-text uppercase tracking-[0.4em]">{message.mode === 'builder' ? 'APPLICATION FORGE' : t('beastMode')}</span>
            </div>
            <div className="flex items-center gap-2 bg-surface border border-border p-1 rounded-2xl">
               <button onClick={() => setDevView('code')} className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${devView === 'code' ? 'bg-primary text-background' : 'text-muted'}`}>CODE</button>
               <button onClick={() => setDevView('preview')} className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${devView === 'preview' ? 'bg-primary text-background' : 'text-muted'}`}>PREVIEW</button>
            </div>
          </div>
          <div className="bg-black border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl h-[500px] flex flex-col relative">
            {devView === 'code' ? (
              <textarea value={editableCode} onChange={(e) => setEditableCode(e.target.value)} className="flex-1 bg-black text-[#00ff9d] font-mono text-[13px] p-10 leading-relaxed outline-none resize-none custom-scrollbar" />
            ) : (
              <iframe srcDoc={effectiveCode} className="w-full h-full border-none bg-white" sandbox="allow-scripts" />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isAbc && !isUser) {
    return (
      <div className="flex w-full justify-start animate-[fadeIn_0.5s] mb-12">
        <div className="flex flex-col w-full gap-8">
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-glow"><Layers size={24} /></div>
              <span className="text-[11px] font-black text-text uppercase tracking-[0.4em]">{t('agentSwarmArray')}</span>
            </div>
            <button onClick={addAgent} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-emerald-500 hover:text-black transition-all">
              + {t('addAgent')}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {nodes.map((node) => (
              <div key={node.id} className="bg-surface border border-white/5 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl relative transition-all group/agent">
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={node.avatar} className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-sm" alt="Agent" />
                    <div>
                      <div className="text-[11px] font-black text-white uppercase tracking-widest">{node.name}</div>
                      <div className="text-[8px] font-bold text-muted uppercase">{node.tone} // {node.intelligence}% IQ</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setOpenTuningNodes(prev => { const n = new Set(prev); if(n.has(node.id)) n.delete(node.id); else n.add(node.id); return n; })} className="p-2.5 rounded-xl bg-white/5 text-muted hover:text-white"><Sliders size={16} /></button>
                    <button onClick={() => setNodes(prev => prev.filter(n => n.id !== node.id))} className="p-2.5 text-muted hover:text-brightRed"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${openTuningNodes.has(node.id) ? 'py-6 max-h-[500px]' : 'max-h-0'}`}>
                  <TuningPanel isOpen={true} language={language} name={node.name} tone={node.tone} iq={node.intelligence} speed={node.speed} onUpdate={(u) => updateNode(node.id, u)} />
                </div>
                <div className="flex-1 p-8 prose prose-invert max-w-none text-[13px] leading-relaxed max-h-[200px] overflow-y-auto no-scrollbar">
                  <ReactMarkdown>{node.content}</ReactMarkdown>
                </div>
                <div className="p-4 border-t border-white/5">
                  <div className="relative">
                    <input value={agentInputMap[node.id] || ''} onChange={(e) => setAgentInputMap(prev => ({ ...prev, [node.id]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && handleAgentPulse(node)} placeholder={`${t('agentPulse')} ${node.name}...`} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-[11px] font-bold text-white focus:border-primary outline-none transition-all" />
                    <button onClick={() => handleAgentPulse(node)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-muted hover:text-primary"><Zap size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s] mb-4`}>
      <div className={`flex max-w-[85%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && <div className="flex-shrink-0 pt-3"><AyaaxLogo size="xs" active={message.isStreaming} /></div>}
        <div className="flex flex-col gap-1 min-w-[200px]">
          <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
             <span className="text-[7px] font-black text-muted uppercase tracking-widest">{isUser ? t('subject') : t('entity')}</span>
             {!isUser && message.mode === 'logic' && <div className="flex items-center gap-1.5"><Brain size={10} className="text-primary animate-pulse" /><span className="text-[6px] font-black text-primary uppercase tracking-widest">Logic Chain</span></div>}
          </div>
          <div className={`p-5 rounded-[1.5rem] relative border transition-all ${isUser ? 'bg-text text-background border-text shadow-lg' : 'bg-surface border-border group'}`}>
            <div className={`prose max-w-none text-[14px] leading-relaxed relative z-10 font-medium ${isUser ? 'prose-invert text-background' : 'text-text'}`}><ReactMarkdown>{message.content}</ReactMarkdown></div>
            
            {message.imageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-white/10 shadow-glow">
                <img src={message.imageUrl} alt="Generated Artifact" className="w-full h-auto object-cover" />
              </div>
            )}
            {message.groundingLinks && message.groundingLinks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border space-y-3">
                 <div className="flex items-center gap-2 text-[8px] font-black text-muted uppercase tracking-[0.2em]"><ExternalLink size={10} /> {t('searchResults')}</div>
                 <div className="flex flex-wrap gap-2">{message.groundingLinks.map((link, i) => (<a key={i} href={link.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-background border border-border rounded-lg text-[9px] font-bold text-muted hover:text-primary hover:border-primary transition-all truncate max-w-[200px]">{link.title}</a>))}</div>
              </div>
            )}
            {!isUser && !message.isStreaming && message.content && (
              <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={handleSpeak} className={`p-2 rounded-lg transition-all ${isSpeaking ? 'text-primary' : 'text-muted hover:text-white'}`}>
                  {isSpeaking ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                </button>
                <button onClick={handleCopy} className={`p-2 rounded-lg transition-all ${isCopied ? 'text-emerald-500' : 'text-muted hover:text-white'}`}>
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};