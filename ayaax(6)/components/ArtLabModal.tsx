import React from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Image as ImageIcon, Copy, Play, History, Palette, Info } from 'lucide-react';
import { ImageHistoryItem, ChatMode } from '../types';
import { getTranslation } from '../translations';

interface ArtLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageHistory: ImageHistoryItem[];
  onGenerate: (content: string, mode: ChatMode) => void;
  language: string;
}

export const ArtLabModal: React.FC<ArtLabModalProps> = ({ isOpen, onClose, imageHistory, onGenerate, language }) => {
  const t = (key: string) => getTranslation(language, key);

  if (!isOpen) return null;

  const INSPIRATION_TEMPLATES = [
    { title: "Cyberpunk City", prompt: "A hyper-realistic cyberpunk city at night with neon lights reflecting on wet streets, 8k, cinematic lighting", bgImage: "https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&q=80&w=600" },
    { title: "Ethereal Forest", prompt: "An enchanted forest with glowing flora and floating bioluminescent spores, ethereal atmosphere, digital art", bgImage: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=600" }
  ];

  return (
    createPortal(
      <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.3s]">
        <div className="w-full max-w-7xl h-full max-h-[90vh] bg-surface border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-[scaleIn_0.3s]">
          
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-neon"><Palette size={24} /></div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{t('actArt')}</h2>
                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Neural Imagery Engine v2.5</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full text-muted transition-all"><X size={28} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar space-y-16">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-primary" size={20} />
                <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">{t('templates')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {INSPIRATION_TEMPLATES.map((item, idx) => (
                  <div key={idx} className="group relative h-80 bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all shadow-2xl">
                    <img src={item.bgImage} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-8 flex flex-col justify-between">
                      <h4 className="text-xl font-black text-white mb-3 tracking-tight">{item.title}</h4>
                      <button onClick={() => { onGenerate(item.prompt, 'image'); onClose(); }} className="w-full py-4 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-neon">
                        <Play size={12} fill="currentColor" /> {t('actArt')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <History className="text-primary" size={20} />
                <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">{t('registry')}</h3>
              </div>
              {imageHistory.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                  <ImageIcon size={48} className="text-muted opacity-20" />
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">{t('emptyGallery')}</h4>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>,
      document.body
    )
  );
};