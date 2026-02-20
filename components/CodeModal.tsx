import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, ChevronDown, Ratio, Palette, Sparkles, Sun, Image as ImageIcon, Zap } from 'lucide-react';
import { getTranslation } from '../translations';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, options?: { aspectRatio: string }) => void;
  title?: string;
  mode?: 'code' | 'text' | 'image-form';
  language: string;
}

const ASPECT_RATIOS = [
  { label: 'Square', value: '1:1' },
  { label: 'Landscape', value: '16:9' },
  { label: 'Portrait', value: '9:16' },
  { label: 'Wide', value: '4:3' },
  { label: 'Tall', value: '3:4' },
];

export const CodeModal: React.FC<CodeModalProps> = ({ 
  isOpen, onClose, onSubmit, title = "Paste Code", mode = 'code', language 
}) => {
  const [content, setContent] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('None');
  const [mood, setMood] = useState('None');
  const [lighting, setLighting] = useState('None');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    if (isOpen) {
        setContent('');
        setAspectRatio('1:1');
        setStyle('None');
        setMood('None');
        setLighting('None');
        setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isImageForm = mode === 'image-form';

  const handleSubmit = () => {
    if (isImageForm) {
       let promptText = content.trim();
       let effectiveInput = promptText;
       const details = [];
       if (mood !== 'None') details.push(`${mood} mood`);
       if (lighting !== 'None') details.push(`${lighting} lighting`);
       const detailsString = details.length > 0 ? `, ${details.join(', ')}` : '';
       if (style !== 'None') effectiveInput = `${style} style: ${promptText}${detailsString}`;
       else if (details.length > 0) effectiveInput = `${promptText}${detailsString}`;
       onSubmit(effectiveInput, { aspectRatio });
    } else onSubmit(content);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className={`w-full ${isImageForm ? 'max-w-3xl' : 'max-w-2xl'} bg-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[scaleIn_0.2s_ease-out]`}>
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {isImageForm && <ImageIcon size={20} className="text-primary" />}
              {title}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-4 bg-black/20 flex flex-col gap-4">
            {isImageForm && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                 <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted flex items-center gap-1"><Ratio size={12} /> {t('ratio')}</label>
                    <div className="relative group">
                       <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:border-primary/50 py-2 pl-3 pr-8 focus:outline-none transition-colors cursor-pointer">
                          {ASPECT_RATIOS.map(r => <option key={r.value} value={r.value}>{r.label} ({r.value})</option>)}
                       </select>
                       <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={14} />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted flex items-center gap-1"><Palette size={12} /> {t('preset')}</label>
                    <div className="relative group">
                       <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:border-primary/50 py-2 pl-3 pr-8 focus:outline-none transition-colors cursor-pointer">
                          {['None', 'Photorealistic', 'Cinematic', 'Anime', 'Cyberpunk'].map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                       <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={14} />
                    </div>
                 </div>
              </div>
            )}
            <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('describeEdit')}
                className={`w-full ${isImageForm ? 'h-32' : 'h-64'} bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none placeholder:text-gray-600 font-sans`}
            />
        </div>
        <div className="p-4 border-t border-white/5 flex justify-end gap-3 bg-surface">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-colors font-medium text-sm">{t('terminate')}</button>
            <button onClick={handleSubmit} disabled={!content.trim()} className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 transition-colors font-medium text-sm flex items-center gap-2 shadow-glow">
                <Check size={16} /> {t('synthesizeCommand').split(' ')[0]}
            </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
