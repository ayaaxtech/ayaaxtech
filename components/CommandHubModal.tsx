import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Activity, ImageIcon, Globe, Zap, 
  Cpu, Terminal, ShieldCheck, Gauge, 
  Info, Download, RefreshCw, Calendar, Ratio, Palette,
  Trash2, Share, Database, LayoutPanelLeft, Clock,
  ChevronRight, Sparkle, Sun, ExternalLink, ArrowRight
} from 'lucide-react';
import { ImageHistoryItem, Archetype } from '../types';
import { AyaaxLogo } from './AyaaxLogo';

interface CommandHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageHistory?: ImageHistoryItem[];
  onRegenerate?: (item: ImageHistoryItem) => void;
  archetypes?: Archetype[];
  onPurgeAll?: () => void;
}

type ModalView = 'overview' | 'images' | 'commands' | 'diagnostics' | 'security';

export const CommandHubModal: React.FC<CommandHubModalProps> = ({ 
  isOpen, onClose, imageHistory = [], onRegenerate, archetypes = [], onPurgeAll
}) => {
  const [step, setStep] = useState<'inquiry' | 'hub'>('inquiry');
  const [view, setView] = useState<ModalView>('overview');
  const [logs, setLogs] = useState<string[]>([]);
  const [cpuLoad, setCpuLoad] = useState(12);

  useEffect(() => {
    if (isOpen) {
      setStep('inquiry');
      setView('overview');
      setLogs([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && step === 'hub') {
        const interval = setInterval(() => {
            setCpuLoad(prev => Math.min(99, Math.max(5, prev + (Math.random() - 0.5) * 20)));
        }, 2000);
        const logInterval = setInterval(() => {
            const newLogs = [
                `System status: Optimal`, `Connection: Encrypted`, `Neural latency: ${(Math.random()*8).toFixed(1)}ms`, `Diagnostics sweep complete`, `Interface synchronized`, `Artifact Registry updated: ${imageHistory.length} items`
            ];
            const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)];
            setLogs(prev => [randomLog, ...prev].slice(0, 12));
        }, 1500);
        return () => { clearInterval(interval); clearInterval(logInterval); };
    }
  }, [isOpen, step, imageHistory.length]);

  if (!isOpen) return null;

  const TEST_COMMANDS = [
    { cmd: '/sync', desc: 'Refresh neural connection', icon: RefreshCw },
    { cmd: '/beast-mode', desc: 'Toggle high-performance reasoning', icon: Zap },
    { cmd: '/generate-sample', desc: 'Create a test visual artifact', icon: ImageIcon },
    { cmd: '/network-check', desc: 'Verify secure tunnel status', icon: Globe },
    { cmd: '/system-info', desc: 'View detailed environment specs', icon: Database },
    { cmd: '/clear-cache', desc: 'Flush local temporary data', icon: Trash2 },
  ];

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'text-primary' },
    { id: 'images', label: 'Artifacts', icon: ImageIcon, color: 'text-accent' },
    { id: 'commands', label: 'Terminal', icon: Terminal, color: 'text-orange-500' },
    { id: 'diagnostics', label: 'Status', icon: Gauge, color: 'text-yellow-400' },
    { id: 'security', label: 'Shield', icon: ShieldCheck, color: 'text-emerald-500' },
  ];

  const handleDownload = (item: ImageHistoryItem) => {
    const a = document.createElement('a'); a.href = item.imageUrl; a.download = `ayaax_artifact_${item.id.slice(0, 8)}.png`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-[fadeIn_0.3s]">
      {step === 'inquiry' ? (
        <div className="relative z-10 max-w-lg w-full bg-surface border border-white/10 p-12 shadow-2xl rounded-[3rem] animate-[scaleIn_0.2s] text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"><Info size={40} className="text-primary" /></div>
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Access Command Center?</h2>
          <p className="text-sm text-muted mb-10 leading-relaxed uppercase tracking-widest font-bold">Authorized personnel only. Entering the Command Hub provides direct access to system logs and diagnostic controls.</p>
          <div className="flex flex-col gap-4 w-full">
             <button onClick={() => setStep('hub')} className="w-full py-6 bg-white text-black border-4 border-primary rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_0_50px_rgba(var(--primary-rgb),0.8)] flex items-center justify-center gap-3 transition-all active:scale-95">Initialize Hub <ArrowRight size={18} className="animate-[bounce-x_1.5s_infinite]" /></button>
             <button onClick={onClose} className="w-full py-4 bg-white/5 text-muted hover:text-white rounded-2xl uppercase tracking-widest text-[11px] transition-all border border-white/5">Abort Protocol</button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-[1200px] h-[85vh] bg-surface border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-[scaleIn_0.2s]">
          <div className="w-72 border-r border-white/5 bg-black/20 p-8 flex flex-col">
             <div className="mb-10 flex items-center gap-3 px-2"><AyaaxLogo size="xs" active={true} /><h3 className="text-sm font-black text-white uppercase tracking-widest">AYAAX_Hub</h3></div>
             <div className="flex-1 space-y-1">
                {NAV_ITEMS.map(item => (
                  <button key={item.id} onClick={() => setView(item.id as ModalView)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${view === item.id ? 'bg-white/10 text-white shadow-inner-glass border-white/5 border' : 'text-muted hover:text-white hover:bg-white/5'}`}><item.icon size={18} className={view === item.id ? item.color : ''} /><span className="text-xs font-bold uppercase tracking-wide">{item.label}</span></button>
                ))}
             </div>
             <div className="mt-8 p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3"><div className="flex justify-between text-[10px] font-bold text-muted uppercase"><span>Resource Load</span><span className="text-primary">{cpuLoad.toFixed(0)}%</span></div><div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-1000" style={{ width: `${cpuLoad}%` }}></div></div></div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
             <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <div><h1 className="text-2xl font-black text-white uppercase tracking-tight">{view === 'images' ? 'Neural Artifact Registry' : view === 'overview' ? 'System Overview' : view === 'commands' ? 'Terminal Console' : view}</h1><p className="text-[9px] font-bold text-muted uppercase tracking-widest mt-1">Status: All subsystems nominal</p></div>
                <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all text-muted"><X size={24} /></button>
             </div>
             <div className="flex-1 p-10 overflow-y-auto custom-scrollbar no-scrollbar">
                {view === 'overview' && (
                  <div className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] flex flex-col justify-between h-44 shadow-prism"><h3 className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><Activity size={12} /> Neural Status</h3><div className="text-4xl font-black text-primary">ACTIVE</div><p className="text-[9px] text-muted uppercase">Latency: 4.2ms avg</p></div>
                        <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] flex flex-col justify-between h-44 shadow-prism"><h3 className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> Uptime</h3><div className="text-4xl font-black text-white">99.8%</div><p className="text-[9px] text-muted uppercase">Global Registry Connected</p></div>
                        <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] flex flex-col justify-between h-44 shadow-prism"><h3 className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><ImageIcon size={12} /> Registry</h3><div className="text-4xl font-black text-accent">{imageHistory.length}</div><p className="text-[9px] text-muted uppercase">Stored Artifacts</p></div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-black/40 border border-white/5 p-8 rounded-[3rem] space-y-6 shadow-prism"><div className="flex items-center justify-between"><h3 className="text-[10px] font-black text-muted uppercase tracking-widest">Real-Time Console</h3><div className="w-2 h-2 rounded-full bg-primary animate-pulse" /></div><div className="space-y-3 font-mono text-[11px] text-primary/70 h-48 overflow-y-auto no-scrollbar">{logs.map((log, i) => <div key={i} className="flex gap-4 opacity-80"><span className="opacity-30">❯</span> {log}</div>)}</div></div>
                        <div className="space-y-6"><h3 className="text-[10px] font-black text-muted uppercase tracking-widest">Quick Actions Dashboard</h3><div className="grid grid-cols-2 gap-4">{[{ label: 'Purge Threads', icon: Trash2, color: 'hover:text-brightRed', action: onPurgeAll }, { label: 'Export Logs', icon: Share, color: 'hover:text-primary' }, { label: 'Neural Sync', icon: RefreshCw, color: 'hover:text-accent' }, { label: 'Beast Toggle', icon: Zap, color: 'hover:text-yellow-400' }, { label: 'Manage Profile', icon: Terminal, color: 'hover:text-white' }, { label: 'Hub Layout', icon: LayoutPanelLeft, color: 'hover:text-white' }].map((btn, i) => (<button key={i} onClick={btn.action} className={`flex items-center gap-3 p-5 bg-white/5 border border-white/5 rounded-2xl transition-all ${btn.color} hover:bg-white/10 text-left shadow-sm`}><btn.icon size={16} /><span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span></button>))}</div></div>
                     </div>
                  </div>
                )}
                {view === 'images' && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/5"><div><p className="text-[11px] text-muted font-black uppercase tracking-[0.3em]">Artifact Registry Status</p><p className="text-[9px] text-muted/50 font-bold uppercase tracking-widest mt-1">{imageHistory.length} Persistent Neural Visualizations Indexed</p></div><button onClick={onPurgeAll} className="flex items-center gap-2 px-6 py-2 bg-brightRed/10 border border-brightRed/20 text-brightRed rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brightRed hover:text-white transition-all shadow-neon"><Trash2 size={12} /> Flush Artifact Cache</button></div>
                    {imageHistory.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {imageHistory.map((item) => (
                          <div key={item.id} className="group relative bg-black/40 border border-white/10 rounded-[3rem] overflow-hidden hover:border-primary/50 transition-all shadow-prism flex flex-col">
                            <div className="aspect-square bg-black overflow-hidden relative"><img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms] ease-out" /><div className="absolute inset-0 bg-black/90 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col p-10 justify-between"><div className="space-y-8"><div className="flex justify-between items-center border-b border-white/10 pb-4"><span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Registry_Meta</span><span className="text-[9px] font-mono text-muted/50 uppercase">ID:{item.id.slice(0, 8)}</span></div><div className="space-y-6"><div className="space-y-2"><div className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><Terminal size={10} /> Neural Prompt</div><p className="text-[13px] text-white/90 italic leading-relaxed font-medium line-clamp-4">"{item.prompt}"</p></div><div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5"><div className="space-y-2"><div className="text-[8px] font-bold text-muted uppercase tracking-widest">Synthesis Params</div><div className="flex flex-col gap-2"><div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest"><Ratio size={10} /> {item.aspectRatio}</div><div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest"><Palette size={10} /> {item.style || 'Standard'}</div></div></div><div className="space-y-2"><div className="text-[8px] font-bold text-muted uppercase tracking-widest">Aesthetic Links</div><div className="flex flex-col gap-2"><div className="flex items-center gap-2 text-[10px] font-black text-yellow-400 uppercase tracking-widest"><Sparkle size={10} /> {item.mood || 'None'}</div><div className="flex items-center gap-2 text-[10px] font-black text-orange-400 uppercase tracking-widest"><Sun size={10} /> {item.lighting || 'None'}</div></div></div></div></div></div><div className="flex flex-col gap-3"><button onClick={() => onRegenerate?.(item)} className="w-full py-4 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-neon hover:bg-white transition-all flex items-center justify-center gap-2"><RefreshCw size={14} /> Trigger Iteration</button><button onClick={() => handleDownload(item)} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white transition-all flex items-center justify-center gap-2"><Download size={14} /> Extract Artifact</button></div></div></div>
                            <div className="p-6 bg-white/[0.02] flex items-center justify-between border-t border-white/5"><div className="flex gap-2"><div className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[8px] font-black text-accent uppercase tracking-widest">{item.aspectRatio}</div><div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[8px] font-black text-primary uppercase tracking-widest">{item.style || 'STD'}</div></div><div className="flex items-center gap-2 text-muted/30 group-hover:text-white transition-all"><span className="text-[8px] font-black uppercase tracking-widest">Analyze</span><ChevronRight size={10} /></div></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-white/5 border border-dashed border-white/10 rounded-[4rem] animate-[fadeIn_0.5s]"><div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-muted/20 border border-white/10 shadow-inner"><ImageIcon size={48} strokeWidth={1} /></div><div className="space-y-3"><h3 className="text-xl font-black text-white uppercase tracking-tight">Registry Offline</h3><p className="text-xs text-muted max-w-xs mx-auto uppercase tracking-widest leading-relaxed">Synthesize images via the neural gateway to populate your local visual archive.</p></div><button onClick={() => setView('overview')} className="text-primary font-black uppercase text-[10px] tracking-[0.3em] hover:underline underline-offset-8">Return to Base</button></div>
                    )}
                  </div>
                )}
                {view === 'commands' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{TEST_COMMANDS.map(item => (<button key={item.cmd} className="group p-10 bg-white/5 border border-white/5 rounded-[2.5rem] hover:border-primary/50 transition-all flex items-center justify-between text-left shadow-prism"><div className="flex items-center gap-8"><div className="p-5 bg-white/5 rounded-3xl group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner"><item.icon size={28} /></div><div><div className="text-lg font-mono text-primary font-black mb-1">{item.cmd}</div><div className="text-[10px] text-muted uppercase tracking-widest font-black opacity-60">{item.desc}</div></div></div><ChevronRight className="text-muted/30 group-hover:text-white transition-all" size={24} /></button>))}</div>
                )}
                {view === 'diagnostics' && (<div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-pulse"><Gauge size={80} className="text-primary opacity-40" /><div className="space-y-3"><p className="text-xl font-black text-white uppercase tracking-[0.3em]">Neural Sweep in Progress</p><p className="text-[10px] text-muted uppercase tracking-[0.5em] opacity-40">Polling system kernels | Memory parity active | Logic gates nominal</p></div></div>)}
                {view === 'security' && (<div className="space-y-10 animate-[fadeIn_0.5s]"><div className="p-12 bg-emerald-500/5 border border-emerald-500/20 rounded-[4rem] flex flex-col items-center text-center shadow-prism"><div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20"><ShieldCheck size={40} className="text-emerald-500" /></div><h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Neural Interface Encrypted</h3><p className="text-sm text-muted max-w-md mb-10 leading-relaxed uppercase tracking-widest opacity-60">All telemetric data between this terminal and the Gemini 3 logic core is secured via 8192-bit rotating end-to-end synchronization protocols.</p><div className="flex gap-4"><div className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />Key Verified</div><div className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest">TLS 1.3 // OBSIDIAN</div></div></div></div>)}
             </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes bounce-x { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
      `}</style>
    </div>,
    document.body
  );
};