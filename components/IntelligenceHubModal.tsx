import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Brain, Zap, Monitor, GraduationCap, Users, 
  Gamepad2, LayoutDashboard, RefreshCcw, ShieldCheck,
  Dna, Cpu, MousePointer2, BookOpen, UserPlus, Layers,
  Activity, Sparkles, Command, Wand2
} from 'lucide-react';

interface IntelligenceHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSafe: () => void;
  onOpenFactory?: () => void;
}

const PROTOCOLS = [
  { id: 'factory', title: 'Asset Factory', desc: 'Synthesize Word, Excel, PPT & PDF assets.', icon: Wand2, color: 'text-blue-400' },
  { id: 'memory', title: 'Neural Memory', desc: 'Syncs long-term user preferences & project context.', icon: Brain, color: 'text-blue-400' },
  { id: 'agent', title: 'Auto-Agent', desc: 'Autonomous planning & tool execution engine.', icon: Zap, color: 'text-yellow-400' },
  { id: 'control', title: 'System Control', desc: 'Interface with local apps & browser automation.', icon: Monitor, color: 'text-emerald-400' },
  { id: 'tutor', title: 'Personal Tutor', desc: 'Adaptive learning, gap detection & custom quizzes.', icon: GraduationCap, color: 'text-orange-400' },
  { id: 'collab', title: 'Multi-AI Collab', desc: 'Orchestrate a team of specialized AI roles.', icon: Users, color: 'text-purple-400' },
  { id: 'sim', title: 'Sim Sandbox', desc: 'History, business & science scenario simulations.', icon: Gamepad2, color: 'text-pink-400' },
  { id: 'dash', title: 'Life Dashboard', desc: 'Integrated goal tracking, habits & neural metrics.', icon: LayoutDashboard, color: 'text-cyan-400' },
  { id: 'self', title: 'Self-Improve', desc: 'ML-based adaptation from user feedback patterns.', icon: RefreshCcw, color: 'text-rose-400' },
  { id: 'context', title: 'Live Context', desc: 'Real-time awareness of time, schedule & news.', icon: Activity, color: 'text-white' },
];

export const IntelligenceHubModal: React.FC<IntelligenceHubModalProps> = ({ isOpen, onClose, onOpenSafe, onOpenFactory }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2600] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-5xl h-full max-h-[85vh] bg-surface border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-[scaleIn_0.3s]">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow">
              <Command size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Neural Hub</h2>
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.5em] mt-1">Intelligence Protocols // Optimized</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { onOpenSafe(); onClose(); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-primary transition-all"
            >
              <ShieldCheck size={14} /> Open Safe
            </button>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all text-muted hover:text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Protocols Grid */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/20">
          {PROTOCOLS.map((p) => (
            <button 
              key={p.id}
              onClick={() => {
                if (p.id === 'factory' && onOpenFactory) {
                  onOpenFactory();
                  onClose();
                }
              }}
              className="group p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-primary/50 hover:bg-primary/5 transition-all text-left flex flex-col items-start shadow-inner relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <p.icon size={120} />
              </div>
              <div className={`p-4 rounded-2xl bg-white/5 mb-6 ${p.color} group-hover:scale-110 group-hover:shadow-glow transition-all`}>
                <p.icon size={28} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{p.title}</h3>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{p.desc}</p>
              
              <div className="mt-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                <span className="text-[8px] font-black text-muted/40 uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
                  {p.id === 'factory' ? 'Protocol Online' : 'Protocol Locked'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow" />
              <span className="text-[9px] font-black text-muted uppercase tracking-[0.4em]">Subsystems Operational</span>
           </div>
           <div className="flex items-center gap-4">
              <span className="text-[9px] font-black text-muted uppercase tracking-widest">v4.0.2</span>
              <div className="w-px h-4 bg-white/10" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">AYAAX Intelligence Layer</span>
           </div>
        </div>
      </div>
    </div>,
    document.body
  );
};