
import React from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Info, Wand2, Palette, Microscope, Globe, Cpu, Zap, ShieldCheck } from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[5000] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-6xl h-full max-h-[85vh] bg-surface border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-[scaleIn_0.3s]">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow">
              <Cpu size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">System Manual</h2>
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.5em] mt-1">Direct Neural Briefing // Entity V4.0</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all text-muted hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Video Section */}
          <div className="lg:w-3/5 relative bg-black flex items-center justify-center overflow-hidden border-r border-white/5">
            <video 
              src="https://cdn.pixabay.com/video/2021/04/12/70860-536968037_large.mp4" 
              className="w-full h-full object-cover opacity-60" 
              controls 
              autoPlay
              loop
            />
            <div className="absolute top-8 left-8 pointer-events-none flex flex-col gap-2">
               <div className="px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/40 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Live System Walkthrough</span>
               </div>
            </div>
          </div>

          {/* Guide Section */}
          <div className="lg:w-2/5 p-12 overflow-y-auto no-scrollbar bg-black/40 flex flex-col justify-between">
            <div className="space-y-10">
               <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Zap size={14} className="text-primary" />
                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Core Protocols</span>
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">Master the Entity Interface</h3>
               </div>

               <div className="space-y-8">
                  <div className="flex items-start gap-5 group">
                    <div className="p-3 bg-white/5 rounded-2xl text-primary group-hover:scale-110 transition-transform shadow-inner"><Wand2 size={20} /></div>
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Asset Factory</h4>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider leading-relaxed">The ultimate conversion tool. Select a target format (Excel, Word, Outlook) and drop any file to transform it instantly.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="p-3 bg-white/5 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform shadow-inner"><Microscope size={20} /></div>
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Entity Analyst</h4>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider leading-relaxed">High-fidelity research. Entity sweeps the global web, verifies citations, and produces structured intelligence reports.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="p-3 bg-white/5 rounded-2xl text-orange-400 group-hover:scale-110 transition-transform shadow-inner"><Palette size={20} /></div>
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Art Lab Synth</h4>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider leading-relaxed">A cinematic visual engine. Use presets like "Cyberpunk" or describe your own vision to synthesize high-resolution artifacts.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="p-3 bg-white/5 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform shadow-inner"><Globe size={20} /></div>
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Global Registry</h4>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider leading-relaxed">Search to find any local capability. If you can't find a tool, just type it into Neural Search to activate the protocol.</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-muted uppercase tracking-widest">Encryption Level</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">8192-BIT // SECURE</span>
              </div>
              <div className="flex items-center gap-3">
                 <ShieldCheck size={20} className="text-primary" />
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">Logic Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
