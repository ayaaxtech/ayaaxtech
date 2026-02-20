import React, { useState } from 'react';
import { 
  Play, X, Info, ShieldCheck, Zap, 
  Wand2, Palette, Microscope, ChevronRight, 
  Terminal, Globe
} from 'lucide-react';

interface SystemBriefingProps {
  onDismiss: () => void;
}

export const SystemBriefing: React.FC<SystemBriefingProps> = ({ onDismiss }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto mb-10 animate-[fadeIn_0.5s]">
      <div className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <button 
          onClick={onDismiss}
          className="absolute top-6 right-6 z-20 p-2 bg-black/40 hover:bg-brightRed/20 text-muted hover:text-white rounded-full transition-all"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Video Section */}
          <div className="lg:w-3/5 relative aspect-video bg-black group overflow-hidden">
            {!isPlaying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-8 bg-gradient-to-t from-black via-black/40 to-transparent">
                <div className="p-6 bg-primary/20 border border-primary/40 rounded-full text-white shadow-glow group-hover:scale-110 transition-transform mb-4">
                  <Play size={32} fill="currentColor" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Initialize System Briefing</h3>
                <p className="text-[9px] font-bold text-muted uppercase tracking-[0.4em]">Duration: 01:45 // 4K Neural Capture</p>
              </div>
            ) : (
              <video 
                src="https://cdn.pixabay.com/video/2021/04/12/70860-536968037_large.mp4" 
                className="w-full h-full object-cover" 
                controls 
                autoPlay
              />
            )}
            
            {/* Visual Overlays */}
            <div className="absolute top-6 left-6 pointer-events-none flex flex-col gap-2 z-20">
               <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Protocol: Manual_v4</span>
               </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:w-2/5 p-10 flex flex-col justify-between bg-black/20">
            <div>
               <div className="flex items-center gap-3 mb-6">
                  <Info size={14} className="text-primary" />
                  <span className="text-[9px] font-black text-muted uppercase tracking-[0.4em]">Operational Guide</span>
               </div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">Mastering the Entity Interface</h2>
               
               <div className="space-y-5">
                  <div className="flex items-start gap-4 group/item">
                    <div className="p-2 bg-white/5 rounded-lg group-hover/item:text-primary transition-colors"><Wand2 size={16} /></div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Asset Factory</p>
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Transform PDF to Outlook, Word to PPT instantly.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group/item">
                    <div className="p-2 bg-white/5 rounded-lg group-hover/item:text-primary transition-colors"><Microscope size={16} /></div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Entity Analyst</p>
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Deep intelligence sweeps with real-time citations.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group/item">
                    <div className="p-2 bg-white/5 rounded-lg group-hover/item:text-primary transition-colors"><Globe size={16} /></div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Global Registry</p>
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Use search to find and trigger local protocols.</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-muted uppercase tracking-widest">Logic Status</span>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Verified Online</span>
              </div>
              <button 
                onClick={() => setIsPlaying(true)}
                className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors"
              >
                Watch Guide <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};