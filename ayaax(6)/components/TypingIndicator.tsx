import React from 'react';
import { Brain } from 'lucide-react';

interface TypingIndicatorProps {
  mode?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ mode }) => {
  const isLogic = mode === 'logic';

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-3xl w-fit border border-white/10 shadow-prism animate-[fadeIn_0.3s] relative overflow-hidden">
      {isLogic && (
        <div className="lightning-overlay absolute inset-0 opacity-20 pointer-events-none" />
      )}
      <div className="flex items-center space-x-3 relative z-10">
        <div className="flex items-center space-x-1.5">
          <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-[10px] font-black text-muted uppercase tracking-widest">
          {isLogic ? 'AYAAX is thinking...' : 'Synthesizing...'}
        </span>
        {isLogic && (
          <div className="p-1 bg-primary/10 rounded-lg text-primary animate-pulse">
            <Brain size={12} />
          </div>
        )}
      </div>
    </div>
  );
};