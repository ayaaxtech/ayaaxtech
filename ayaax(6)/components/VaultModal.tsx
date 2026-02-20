import React from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, Lock, Pin, ImageIcon, ChevronRight, Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { ChatSession, ImageHistoryItem } from '../types';
import { Tooltip } from './Tooltip';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedSessions: ChatSession[];
  imageHistory: ImageHistoryItem[];
  onSessionSelect: (id: string) => void;
  onDeleteSession?: (id: string, e?: React.MouseEvent) => void;
  onDeleteImage?: (id: string) => void;
  onPurgeAllImages?: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({ 
  isOpen, onClose, pinnedSessions, imageHistory, onSessionSelect, onDeleteSession, onDeleteImage, onPurgeAllImages
}) => {
  if (!isOpen) return null;

  const handleDownload = (item: ImageHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = item.imageUrl;
    a.download = `ayaax_artifact_${item.id.slice(0, 8)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return createPortal(
    <div className="fixed inset-0 z-[2100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6 animate-[fadeIn_0.3s]">
      <div className="max-w-6xl w-full h-[85vh] bg-surface border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-[scaleIn_0.2s]">
        
        {/* Vault Sidebar */}
        <div className="w-80 border-r border-white/5 bg-black/40 p-10 flex flex-col space-y-12 shrink-0">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-[2rem] text-primary shadow-neon">
                <Shield size={32} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Secure Vault</h2>
                <p className="text-[9px] font-bold text-muted uppercase tracking-[0.3em]">Obsidian Encryption Active</p>
              </div>
           </div>

           <div className="space-y-2">
              <button className="w-full flex items-center gap-4 p-4 bg-white/10 border border-white/10 rounded-2xl text-white">
                <Bookmark size={18} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-left">Saved Insights</span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl text-muted hover:text-white transition-all">
                <ImageIcon size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-left">Neural Artifacts</span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl text-muted hover:text-white transition-all">
                <Pin size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-left">Pinned Threads</span>
              </button>
           </div>

           <div className="mt-auto p-6 bg-white/5 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                 <Lock size={12} className="text-emerald-500" />
                 <span className="text-[8px] font-black text-white uppercase tracking-widest">E2EE Storage</span>
              </div>
              <p className="text-[8px] text-muted uppercase tracking-widest leading-relaxed">Your neural vault is decentralized and encrypted on the local edge.</p>
           </div>
        </div>

        {/* Vault Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
          <div className="p-10 border-b border-white/5 flex items-center justify-between">
             <h3 className="text-2xl font-black text-white uppercase tracking-tight">Neural Inventory</h3>
             <div className="flex items-center gap-4">
                {imageHistory.length > 0 && (
                   <button 
                    onClick={onPurgeAllImages}
                    className="px-4 py-2 bg-brightRed/10 border border-brightRed/20 text-brightRed rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-brightRed hover:text-white transition-all"
                   >
                     Flush Cache
                   </button>
                )}
                <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all text-muted">
                  <X size={24} />
                </button>
             </div>
          </div>

          <div className="flex-1 p-10 overflow-y-auto no-scrollbar space-y-16">
            
            {/* Pinned Sessions */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <Pin size={16} className="text-primary" />
                 <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">Pinned Protocols</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinnedSessions.length > 0 ? pinnedSessions.map(session => (
                  <div 
                    key={session.id}
                    className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-primary/50 transition-all flex items-center justify-between group cursor-pointer"
                    onClick={() => onSessionSelect(session.id)}
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="text-[12px] font-black text-white uppercase tracking-wide truncate mb-1">{session.title}</div>
                      <div className="text-[9px] text-muted uppercase font-bold tracking-widest">{session.messages.length} neural turns</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip content="Purge From Vault">
                        <button 
                          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDeleteSession?.(session.id, e); }}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 text-muted hover:text-brightRed hover:bg-brightRed/10 transition-all font-black text-sm"
                        >
                          !
                        </button>
                      </Tooltip>
                      <ChevronRight size={18} className="text-muted/30 group-hover:text-white transition-all" />
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 py-10 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] text-muted text-[10px] font-bold uppercase tracking-widest">No pinned sessions found in vault</div>
                )}
              </div>
            </section>

            {/* Visual Artifacts */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <ImageIcon size={16} className="text-accent" />
                    <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">Neural Artifact Registry</h4>
                 </div>
                 <span className="text-[8px] font-black text-muted/40 uppercase tracking-widest">Cap: 10 Items</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageHistory.length > 0 ? imageHistory.map(item => (
                  <div key={item.id} className="aspect-square bg-black rounded-2xl overflow-hidden border border-white/5 group relative">
                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Artifact" />
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3 p-4">
                       <p className="text-[8px] text-white/60 font-medium line-clamp-2 text-center mb-2 italic px-2">"{item.prompt}"</p>
                       <div className="flex gap-2">
                          <button 
                            onClick={(e) => handleDownload(item, e)}
                            className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-primary hover:text-black transition-all"
                          >
                            <ExternalLink size={14} />
                          </button>
                          <button 
                            onClick={() => onDeleteImage?.(item.id)}
                            className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-brightRed hover:text-white transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-10 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] text-muted text-[10px] font-bold uppercase tracking-widest">No visual artifacts synthesized yet</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};