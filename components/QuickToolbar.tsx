import React from 'react';
import { 
  Zap, Brain, Microscope, Flame, 
  FileText, Code2, Calculator
} from 'lucide-react';
import { ChatMode } from '../types';
import { Tooltip } from './Tooltip';
import { getTranslation } from '../translations';

interface QuickToolbarProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onAction: (action: string) => void;
  language: string;
}

export const QuickToolbar: React.FC<QuickToolbarProps> = ({ currentMode, onModeChange, onAction, language }) => {
  const t = (key: string) => getTranslation(language, key);

  const TOOLS = [
    { id: 'logic', icon: Brain, label: 'LOGIC' },
    { id: 'beast', icon: Flame, label: 'BEAST' },
    { id: 'analyst', icon: Microscope, label: 'ANALYST' },
    { id: 'abc', icon: Zap, label: 'SWARM' },
  ];

  return (
    <div className="flex items-center justify-between w-full mt-2 animate-[fadeIn_0.5s]">
      {/* Mode Selector Pill */}
      <div className="flex items-center bg-black/40 border border-white/5 p-1 rounded-2xl">
        {TOOLS.map((tool) => {
          const isActive = currentMode === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onModeChange(tool.id as ChatMode)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary text-black shadow-glow font-black' 
                  : 'text-muted/60 hover:text-white'
              }`}
            >
              <tool.icon size={16} />
              {isActive && (
                <span className="text-[10px] font-black tracking-[0.2em]">{tool.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Center Utility Icons */}
      <div className="flex items-center gap-2">
        <div className="w-px h-4 bg-white/10 mx-2" />
        <Tooltip content="Summarize Context">
          <button 
            onClick={() => onAction('summarize')}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-primary transition-all hover:border-primary/30"
          >
            <FileText size={18} />
          </button>
        </Tooltip>
        <Tooltip content="Refactor Code">
          <button 
            onClick={() => onAction('codeFix')}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-blue-400 transition-all hover:border-blue-400/30"
          >
            <Code2 size={18} />
          </button>
        </Tooltip>
        <Tooltip content="Neural Calculation">
          <button 
            onClick={() => onAction('calculate')}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-cyan-400 transition-all hover:border-cyan-400/30"
          >
            <Calculator size={18} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};