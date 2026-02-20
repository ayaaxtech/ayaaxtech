
import React from 'react';
import { 
  Search, Brain, Image as ImageIcon, 
  Flame, Sparkles, ShieldAlert, Code, Languages,
  Zap, FileText, Fingerprint, Cpu, Microscope,
  Calculator, PenTool, Lightbulb, Map, TrendingUp,
  Gavel, HeartPulse, Users, Binary, BookOpen, 
  Target, Rocket, ShieldCheck, Globe
} from 'lucide-react';
import { ChatMode } from '../types';
import { getTranslation } from '../translations';

interface ActionGridProps {
  onActionSelect: (prompt: string, mode: ChatMode) => void;
  language?: string;
}

export const ActionGrid: React.FC<ActionGridProps> = ({ onActionSelect, language = 'English' }) => {
  const t = (key: string) => getTranslation(language, key);

  const ACTIONS = [
    { id: 'search', label: t('actSearch'), prompt: t('promptSearch'), icon: Search, mode: 'chat' as ChatMode, color: 'text-blue-400' },
    { id: 'reason', label: t('actLogic'), prompt: t('promptLogic'), icon: Brain, mode: 'logic' as ChatMode, color: 'text-purple-400' },
    { id: 'agents', label: t('actAgents'), prompt: t('promptAgents'), icon: Users, mode: 'abc' as ChatMode, color: 'text-emerald-500' },
    { id: 'analyst', label: t('actAnalyst'), prompt: t('promptAnalyst'), icon: Microscope, mode: 'analyst' as ChatMode, color: 'text-emerald-400' },
    { id: 'image', label: t('actArt'), prompt: t('promptArt'), icon: ImageIcon, mode: 'image' as ChatMode, color: 'text-pink-400' },
    { id: 'beast', label: t('actBeast'), prompt: t('promptBeast'), icon: Flame, mode: 'beast' as ChatMode, color: 'text-orange-400' },
    { id: 'math', label: t('actMath'), prompt: t('promptMath'), icon: Calculator, mode: 'logic' as ChatMode, color: 'text-cyan-400' },
    { id: 'audit', label: t('actAudit'), prompt: t('promptAudit'), icon: ShieldAlert, mode: 'logic' as ChatMode, color: 'text-emerald-400' },
    { id: 'legal', label: 'Legal Audit', prompt: 'Perform a legal and regulatory review of the following context...', icon: Gavel, mode: 'logic' as ChatMode, color: 'text-zinc-300' },
    { id: 'health', label: 'Health Logic', prompt: 'Synthesize health and wellness advice based on...', icon: HeartPulse, mode: 'chat' as ChatMode, color: 'text-rose-400' },
    { id: 'code_review', label: 'Architect Review', prompt: 'Perform an architectural review of this system design...', icon: Binary, mode: 'beast' as ChatMode, color: 'text-blue-500' },
    { id: 'study', label: 'Study Guide', prompt: 'Create a comprehensive study guide for...', icon: BookOpen, mode: 'chat' as ChatMode, color: 'text-indigo-400' },
    { id: 'strategy', label: t('actStrategy'), prompt: t('promptStrategy'), icon: TrendingUp, mode: 'logic' as ChatMode, color: 'text-rose-400' },
    { id: 'brainstorm', label: t('actCreative'), prompt: t('promptCreative'), icon: Lightbulb, mode: 'chat' as ChatMode, color: 'text-amber-500' },
    { id: 'mission', label: 'Mission Prep', prompt: 'Execute strategic mission planning for...', icon: Target, mode: 'logic' as ChatMode, color: 'text-red-500' },
    { id: 'seo', label: 'SEO Forge', prompt: 'Optimize the following content for maximum SEO performance...', icon: Rocket, mode: 'chat' as ChatMode, color: 'text-primary' },
    { id: 'security', label: 'Deep Shield', prompt: 'Run a deep-trace security scan on...', icon: ShieldCheck, mode: 'logic' as ChatMode, color: 'text-emerald-500' },
    { id: 'news', label: 'Intel Sweep', prompt: 'Perform a global intel sweep on the following topic...', icon: Globe, mode: 'search' as ChatMode, color: 'text-blue-300' },
    { id: 'translate', label: t('actTranslate'), prompt: t('promptTranslate'), icon: Languages, mode: 'chat' as ChatMode, color: 'text-zinc-200' },
    { id: 'summarize', label: t('actSummarize'), prompt: t('promptSummarize'), icon: FileText, mode: 'chat' as ChatMode, color: 'text-zinc-400' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-[fadeIn_0.5s]">
      {ACTIONS.map((item) => (
        <button
          key={item.id}
          onClick={() => onActionSelect(item.prompt, item.mode)}
          className="group flex flex-col items-center justify-center p-6 rounded-[2rem] border bg-white/[0.03] border-white/10 hover:border-primary hover:bg-primary/10 hover:shadow-glow transition-all active:scale-95 text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-primary to-transparent pointer-events-none" />
          <div className={`p-4 rounded-2xl transition-all border shadow-inner relative z-10 bg-white/5 ${item.color} border-white/5 group-hover:border-primary/20 group-hover:scale-110`}>
            <item.icon size={22} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-4 transition-colors relative z-10 text-muted group-hover:text-text">
            {item.label}
          </span>
          <div className="mt-2 h-1 transition-all duration-300 rounded-full w-0 group-hover:w-8 bg-primary" />
        </button>
      ))}
    </div>
  );
};
