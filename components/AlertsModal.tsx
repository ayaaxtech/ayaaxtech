
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, Info, ShieldCheck, Zap, AlertCircle, RefreshCw, Trash2, Check, Radio, Newspaper, Megaphone, ArrowRight, Calendar } from 'lucide-react';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LIVE_NEWS = [
  { id: 'n1', title: 'Neural Hearth v2.1 Activated', desc: 'Enhanced semantic logic for creative writing and coding tasks. New "Step-by-Step" mode improved.', date: 'Today' },
  { id: 'n2', title: 'Warm Aesthetics Deployment', desc: 'The "Espresso Dark Mode" and "Cream Light Mode" are now fully synchronized across all regions.', date: 'Today' },
  { id: 'n3', title: 'Knowledge Base Expansion', desc: 'Google Search grounding logic now pulls from deeper academic and technical repositories.', date: 'Yesterday' },
  { id: 'n4', title: 'Security Protocol Upgrade', desc: 'Local vault encryption strengthened for all Member-tier archives.', date: '2d ago' },
  { id: 'n5', title: 'New Tutorial Series', desc: 'Check the User Manual for new advanced prompts and hidden shortcuts.', date: '3d ago' },
];

export const AlertsModal: React.FC<AlertsModalProps> = ({ isOpen, onClose }) => {
  const [hasPermission, setHasPermission] = useState(false);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-[fadeIn_0.3s]">
      <div className="max-w-xl w-full bg-surface border border-border rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-[scaleIn_0.2s]">
        
        {!hasPermission ? (
          <div className="p-12 text-center space-y-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-glow">
              <Megaphone size={32} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text uppercase tracking-tight">Sync Intel Stream?</h2>
              <p className="text-muted text-sm leading-relaxed uppercase tracking-widest font-bold">Stay informed on system patches, news, and new capabilities.</p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <button 
                onClick={() => setHasPermission(true)}
                className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-glow flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                Connect Stream
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-background text-muted hover:text-text rounded-2xl font-black uppercase tracking-widest text-[11px] border border-border transition-all"
              >
                Decline
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-8 border-b border-border flex items-center justify-between bg-surface/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow">
                  <Newspaper size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-text uppercase tracking-tight">System Feed</h2>
                  <p className="text-[9px] font-bold text-muted uppercase tracking-[0.3em]">Updates & News</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-muted hover:text-text transition-all"><X size={24} /></button>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar max-h-[60vh]">
              {LIVE_NEWS.map(news => (
                <div key={news.id} className="p-6 bg-background border border-border rounded-[2.5rem] space-y-3 hover:border-primary transition-all group shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                      <Calendar size={10} /> {news.date}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-glow" />
                  </div>
                  <h4 className="text-[14px] font-black text-text uppercase tracking-wide leading-tight group-hover:text-primary transition-colors">{news.title}</h4>
                  <p className="text-[11px] text-muted leading-relaxed font-medium">{news.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border bg-surface/50 text-center">
              <span className="text-[9px] font-black text-muted uppercase tracking-[0.4em]">Real-time link established</span>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
