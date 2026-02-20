
import React from 'react';
import { createPortal } from 'react-dom';
import { X, LayoutDashboard, TrendingUp } from 'lucide-react';

interface AiChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AI_MODELS = [
  { id: 'entity', name: 'KRYPTO AI' },
  { id: 'kimi', name: 'Kimi' },
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude', name: 'Claude' },
  { id: 'gemini', name: 'Gemini' },
];

const CATEGORIES = [
  { 
    id: 'agents', 
    title: 'Agents', 
    subsets: [
      { id: 'hle', label: 'HLE-Full', scores: { kimi: 50.2, chatgpt: 45.5, claude: 43.2, gemini: 45.8, entity: 52.3 } },
      { id: 'browse', label: 'BrowseComp', scores: { kimi: 74.9, chatgpt: 65.8, claude: 57.8, gemini: 59.2, entity: 72.7 } },
      { id: 'search', label: 'DeepSearchQA', scores: { kimi: 77.1, chatgpt: 71.3, claude: 76.1, gemini: 63.2, entity: 76.7 } }
    ]
  },
  { 
    id: 'coding', 
    title: 'Coding', 
    subsets: [
      { id: 'verified', label: 'SWE-Bench Verified', scores: { kimi: 76.8, chatgpt: 80.0, claude: 80.9, gemini: 76.2, entity: 76.2 } },
      { id: 'multi', label: 'SWE-Bench Multilingual', scores: { kimi: 73.0, chatgpt: 72.0, claude: 77.5, gemini: 65.0, entity: 71.0 } }
    ]
  },
  { 
    id: 'image', 
    title: 'Image', 
    subsets: [
      { id: 'mmmu', label: 'MMMU Pro', scores: { kimi: 78.5, chatgpt: 79.5, claude: 74.0, gemini: 81.0, entity: 81.4 } },
      { id: 'math', label: 'MathVision', scores: { kimi: 84.2, chatgpt: 83.0, claude: 77.1, gemini: 86.1, entity: 88.2 } },
      { id: 'doc', label: 'OmniDocBench 1.5', scores: { kimi: 88.8, chatgpt: 85.7, claude: 87.7, gemini: 88.5, entity: 85.9 } }
    ]
  },
  { 
    id: 'video', 
    title: 'Video', 
    subsets: [
      { id: 'vmmmu', label: 'VideoMMMU', scores: { kimi: 86.6, chatgpt: 85.9, claude: 84.4, gemini: 87.6, entity: 85.9 } },
      { id: 'lvb', label: 'LongVideoBench', scores: { kimi: 79.8, chatgpt: 76.5, claude: 67.2, gemini: 77.7, entity: 76.8 } }
    ]
  }
];

export const AiChartModal: React.FC<AiChartModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2500] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-[1400px] h-full max-h-[95vh] bg-surface border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-[scaleIn_0.3s]">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">AI Leaderboards</h2>
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.5em] mt-1">Cross-Model Benchmarking // Minimalist Interface</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all text-muted hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Dash Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar grid grid-cols-1 lg:grid-cols-2 gap-6 bg-black/20">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-8 flex flex-col shadow-inner">
               <div className="flex items-center gap-3 mb-8 px-4">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{cat.title}</h3>
               </div>

               <div className="flex-1 flex flex-wrap gap-x-6 gap-y-12 items-end justify-center">
                  {cat.subsets.map((subset) => (
                    <div key={subset.id} className="flex-1 min-w-[200px] flex flex-col items-center px-2">
                       {/* The Bar Group */}
                       <div className="w-full flex items-end justify-center gap-2 h-56 mb-4 border-b border-white/5">
                          {AI_MODELS.map((model) => {
                            const score = (subset.scores as any)[model.id];
                            const isEntity = model.id === 'entity';
                            
                            return (
                              <div key={model.id} className="group relative flex flex-col items-center flex-1 h-full justify-end max-w-[42px]">
                                 {/* Score Label */}
                                 <span className="text-[8px] font-mono font-bold text-muted/80 mb-1 group-hover:text-white transition-colors">{score}</span>
                                 
                                 {/* Bubbly Bar - Fully rounded top, Neutral grey for all AI models (Kimi is NOT blue) */}
                                 <div 
                                    className={`w-full rounded-t-full rounded-b-md relative transition-all duration-1000 ease-out flex flex-col items-center justify-start py-8 overflow-hidden ${
                                      isEntity ? 'bg-zinc-600 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 
                                      'bg-zinc-500/80 group-hover:bg-zinc-400/90'
                                    }`}
                                    style={{ height: `${score}%` }}
                                 >
                                    {/* Vertical AI Name (Logos removed per request) */}
                                    <div className={`text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap pointer-events-none select-none ${isEntity ? 'text-zinc-50' : 'text-zinc-100'}`} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                      {model.name}
                                    </div>
                                    
                                    {/* Shimmer effect for KRYPTO AI */}
                                    {isEntity && (
                                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent animate-[shimmer_5s_infinite]" />
                                    )}
                                 </div>
                              </div>
                            );
                          })}
                       </div>
                       
                       {/* Subset Label */}
                       <div className="text-center h-8 flex items-center">
                          <span className="text-[10px] font-black text-muted/40 uppercase tracking-[0.2em]">{subset.label}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>

        {/* Global Footer */}
        <div className="p-6 border-t border-white/5 bg-black/40 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow animate-pulse" />
                 <span className="text-[8px] font-black text-muted uppercase tracking-[0.3em]">Neural Verification Loop</span>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-primary" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">KRYPTO AI Leaderboards</span>
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>,
    document.body
  );
};
