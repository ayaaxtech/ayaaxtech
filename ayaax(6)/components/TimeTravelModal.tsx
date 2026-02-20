
import React from 'react';
import { createPortal } from 'react-dom';
import { X, FastForward, Rocket, Flame, Star, Clock, Zap, ChevronRight, Sparkles, ShieldCheck, Box } from 'lucide-react';
import { getTranslation } from '../translations';

interface TimeTravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

const TIMELINE_DATA = [
  { 
    phase: "Launch Phase", 
    items: [
      { version: "v1.0", date: "March 3, 2026", note: "Official Release", icon: Rocket, features: ["Core Logic Synthesis", "Linguistic Core v1.0", "Basic Agent Swarm"] },
      { version: "v1.1", date: "March 17, 2026", features: ["Deep Search Grounding", "Web Link Verification", "Extended Memory Context"] },
      { version: "v1.2", date: "April 1, 2026", features: ["Art Lab v2.0", "Style Presets Integration", "DALL-E 3 Logic Bridge"] },
      { version: "v1.3", date: "April 22, 2026", features: ["Document OCR Protocol", "PDF Intelligence", "Markdown Export System"] },
      { version: "v1.4", date: "May 12, 2026", features: ["Real-time Voice Latency Drop", "Neural Mic Polishing", "Vocal Polarity Options"] },
      { version: "v1.6", date: "June 2, 2026", features: ["Agent Swarm Multi-tasking", "Distributed Logic Clusters", "Task Delegation UI"] },
      { version: "v1.8", date: "June 25, 2026", features: ["Custom Persona Weights", "Tone Fine-tuning", "Linguistic Emotional Range"] }
    ]
  },
  { 
    phase: "🔥 Major Release", 
    highlight: true, 
    items: [
      { 
        version: "v2.0", 
        date: "July 21, 2026", 
        note: "Flagship Core Evolution", 
        icon: Flame, 
        badge: "🎯", 
        features: [
          "Smarter Reasoning Core v2.0",
          "Complete UI/UX Reconstruction",
          "Neural Memory Vault (Local-First Encryption)",
          "Advanced Mathematical Chain-of-Thought"
        ] 
      }
    ]
  },
  { 
    phase: "🌟 After The Major Drop", 
    items: [
      { version: "v2.1", date: "August 10, 2026", features: ["Video Frame Recognition", "Veo 3.1 Fast Integration", "Action Sequences"] },
      { version: "v2.2", date: "September 5, 2026", features: ["Infinite Reasoning Depth", "Problem Factoring Node", "Code Execution Sandbox"] },
      { version: "v2.5", date: "October 20, 2026", features: ["Linguistic Personality Transfer", "Multi-Language Synthesis Plus", "Adaptive UI Morphing"] },
      { version: "v3.0", date: "January 2027", icon: Star, features: ["Universal Neural Embodiment", "Predictive Intent Mapping", "Full Logic Autonomy"] }
    ]
  }
];

export const TimeTravelModal: React.FC<TimeTravelModalProps> = ({ isOpen, onClose, language }) => {
  const t = (key: string) => getTranslation(language, key);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-5xl h-full max-h-[90vh] bg-surface border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-[scaleIn_0.3s] relative">
        
        {/* Animated Background Decor */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-500/10 to-transparent pointer-events-none" />

        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-yellow-400 text-black rounded-3xl shadow-[0_0_30px_rgba(250,204,21,0.4)] animate-pulse">
              <FastForward size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Timeline Protocol</h2>
              <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-[0.6em] mt-1">Neural Roadmap // Predicted Array</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full text-muted transition-all">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar space-y-24 bg-black/20 relative z-10">
          {TIMELINE_DATA.map((section, sIdx) => (
            <div key={sIdx} className="space-y-16">
              <div className="flex items-center gap-6">
                 <h3 className={`text-[12px] font-black uppercase tracking-[0.8em] px-8 py-3 rounded-2xl border ${section.highlight ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-glow' : 'bg-white/5 border-white/10 text-muted'}`}>
                   {section.phase}
                 </h3>
                 <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
              </div>
              
              <div className="grid grid-cols-1 gap-12 pl-4 border-l-2 border-dashed border-white/5">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="relative group">
                    {/* Connection Node */}
                    <div className={`absolute -left-[1.35rem] top-0 w-4 h-4 rounded-full border-2 bg-surface transition-all duration-500 group-hover:scale-150 ${item.icon ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'border-white/20'}`} />
                    
                    <div className={`p-8 md:p-10 rounded-[3.5rem] border transition-all duration-500 flex flex-col md:flex-row gap-10 ${item.icon ? 'bg-white/[0.05] border-yellow-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.4)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.03]'}`}>
                      
                      <div className="flex flex-col items-center md:items-start shrink-0 text-center md:text-left">
                        <div className={`p-6 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner ${item.icon ? 'bg-yellow-400 text-black' : 'bg-white/5 text-muted group-hover:text-white'}`}>
                          {item.icon ? <item.icon size={32} /> : <Clock size={24} />}
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                           <span className="text-3xl font-black text-white uppercase tracking-tighter">{item.version}</span>
                           {item.badge && <span className="text-2xl animate-bounce">{item.badge}</span>}
                        </div>
                        <div className="text-[11px] font-black text-yellow-400 uppercase tracking-widest bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/20">{item.date}</div>
                        {item.note && (
                          <div className="mt-4 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">{item.note}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3">
                          <Zap size={14} className="text-yellow-400" />
                          <h4 className="text-[12px] font-black text-muted uppercase tracking-[0.4em]">Upcoming Features</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {item.features?.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 group/feat hover:border-white/20 transition-all">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow group-hover/feat:scale-150 transition-transform" />
                              <span className="text-[11px] font-bold text-white/80 group-hover/feat:text-white uppercase tracking-wide">{feat}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <ShieldCheck size={12} className="text-muted/40" />
                              <span className="text-[9px] font-black text-muted/40 uppercase tracking-widest italic">Verification Pending</span>
                           </div>
                           <ChevronRight size={16} className="text-muted/20 group-hover:text-yellow-400 group-hover:translate-x-2 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-8 opacity-40">
             <div className="w-24 h-24 bg-white/5 border border-dashed border-white/20 rounded-full flex items-center justify-center text-muted/20">
                <Box size={40} className="animate-pulse" />
             </div>
             <div className="space-y-2">
                <p className="text-[12px] font-black text-white uppercase tracking-[0.8em]">End of Array</p>
                <p className="text-[9px] font-bold text-muted uppercase tracking-[0.4em]">Future iterations subject to neural expansion</p>
             </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/60 relative z-20 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Temporal Synchronization: OPTIMAL</span>
           </div>
           <div className="flex gap-4">
              <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-muted uppercase tracking-widest">v4.0.5 Core</div>
              <div className="px-6 py-2 bg-yellow-400 text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-glow">Roadmap Verified</div>
           </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(250, 204, 21, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(250, 204, 21, 0.4);
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>,
    document.body
  );
};
