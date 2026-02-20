
import React from 'react';
import { Smartphone, Monitor, Code, ExternalLink, RefreshCw, X, Zap, Activity, ShieldAlert, Eye } from 'lucide-react';

interface IoTPreviewProps {
  code: string | null;
  type: 'web' | 'mobile';
  isLoading: boolean;
  onClose: () => void;
  comfortLevel?: number;
}

export const IoTPreview: React.FC<IoTPreviewProps> = ({ code, type, isLoading, onClose, comfortLevel = 50 }) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (code && iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }, [code, isLoading]);

  return (
    <div className="w-full h-full bg-surface border-l border-white/5 flex flex-col animate-[fadeIn_0.5s]">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-neon">
            {type === 'mobile' ? <Smartphone size={20} /> : <Monitor size={20} />}
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">IoT Live Preview</h3>
            <p className="text-[9px] font-bold text-muted uppercase">Rendering: {type === 'mobile' ? 'iOS/Android Simulator' : 'Web Terminal'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {isLoading && <RefreshCw size={16} className="text-primary animate-spin mr-2" />}
           <div className="hidden md:flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
              <Zap size={10} className="text-primary" />
              <span className="text-[7px] font-black text-muted uppercase tracking-[0.2em]">Intent Score: {comfortLevel}</span>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-muted transition-all">
             <X size={20} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col p-8 bg-[#050505] pattern-dots">
        
        {/* Hypothesis Engine Readout */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-[fadeIn_0.5s]">
           <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4 shadow-inner">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Eye size={16} /></div>
              <div>
                 <p className="text-[8px] font-black text-muted uppercase tracking-widest">Predicted Intent</p>
                 <p className="text-[11px] font-bold text-white uppercase">User looking for snack</p>
              </div>
           </div>
           <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4 shadow-inner">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Activity size={16} /></div>
              <div>
                 <p className="text-[8px] font-black text-muted uppercase tracking-widest">Proactive State</p>
                 <p className="text-[11px] font-bold text-white uppercase">Pre-lighting pantry shelf</p>
              </div>
           </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {type === 'mobile' ? (
            <div className="relative w-[300px] h-[600px] bg-[#1a1a1a] rounded-[3rem] border-[8px] border-[#333] shadow-2xl overflow-hidden animate-[scaleIn_0.3s]">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#333] rounded-b-2xl z-20"></div>
              
              {code ? (
                <iframe 
                  ref={iframeRef}
                  title="IoT Mobile Preview"
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 gap-4">
                   <Smartphone size={48} className="text-muted opacity-20" />
                   <p className="text-[10px] font-black text-muted uppercase tracking-widest">Awaiting Neural Code Payload...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-[#111] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-[scaleIn_0.3s]">
              <div className="h-8 bg-[#222] border-b border-white/5 flex items-center px-4 gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-brightRed/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-primary/50"></div>
              </div>
              {code ? (
                <iframe 
                  ref={iframeRef}
                  title="IoT Web Preview"
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 gap-4">
                   <Monitor size={48} className="text-muted opacity-20" />
                   <p className="text-[10px] font-black text-muted uppercase tracking-widest">Awaiting Neural Code Payload...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Behavioral Anomaly Readout */}
        <div className="mt-6 p-6 bg-black/40 border border-white/10 rounded-[2.5rem] flex items-center justify-between">
           <div className="flex items-center gap-4">
              <ShieldAlert size={18} className="text-yellow-400" />
              <div>
                 <p className="text-[9px] font-black text-white uppercase tracking-widest">Risk Anticipation Active</p>
                 <p className="text-[8px] text-muted font-bold uppercase mt-0.5">Confident: 98.4% // No movement with stove ON</p>
              </div>
           </div>
           <button className="px-5 py-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all">
              Initialize Killswitch
           </button>
        </div>
      </div>
      
      <div className="p-6 border-t border-white/5 bg-black/20 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${code ? 'bg-primary shadow-neon animate-pulse' : 'bg-muted'}`}></div>
            <span className="text-[10px] font-black text-muted uppercase tracking-widest">{code ? 'Logic Counterfactuals Enabled' : 'Offline'}</span>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Eye size={12} className="text-muted" />
               <span className="text-[8px] font-bold text-muted uppercase tracking-[0.3em]">Temporal Context: Deadline Week</span>
            </div>
            <button 
              disabled={!code}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black text-text uppercase tracking-widest transition-all disabled:opacity-20 border border-white/5 flex items-center gap-2"
            >
              <Code size={14} /> View State Tree
            </button>
         </div>
      </div>
    </div>
  );
};
