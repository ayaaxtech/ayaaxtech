import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, FileText, FileSpreadsheet, Presentation, FileDown, Mail, 
  Download, Wand2, Loader2, CheckCircle2,
  Copy, Check, Repeat
} from 'lucide-react';
import { generateResponse } from '../services/geminiService';
import { getTranslation } from '../translations';

interface DocumentFactoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

type DocType = 'word' | 'excel' | 'ppt' | 'pdf' | 'outlook';

const ASSETS = [
  { id: 'word' as DocType, label: 'Word (DocX)', icon: FileText, color: 'text-[#2B579A]', bg: 'bg-[#2B579A]/10', border: 'border-[#2B579A]/30', desc: 'Neural Document Synthesis' },
  { id: 'excel' as DocType, label: 'Excel (SheetX)', icon: FileSpreadsheet, color: 'text-[#217346]', bg: 'bg-[#217346]/10', border: 'border-[#217346]/30', desc: 'Structured Data Array' },
  { id: 'ppt' as DocType, label: 'PowerPoint (SlideX)', icon: Presentation, color: 'text-[#D24726]', bg: 'bg-[#D24726]/10', border: 'border-[#D24726]/30', desc: 'Visual Deck Architecture' },
  { id: 'pdf' as DocType, label: 'PDF Archive', icon: FileDown, color: 'text-[#F40F02]', bg: 'bg-[#F40F02]/10', border: 'border-[#F40F02]/30', desc: 'Immutable Neural Export' },
  { id: 'outlook' as DocType, label: 'Outlook Protocol', icon: Mail, color: 'text-[#0078D4]', bg: 'bg-[#0078D4]/10', border: 'border-[#0078D4]/30', desc: 'Professional Correspondence' },
];

export const DocumentFactoryModal: React.FC<DocumentFactoryModalProps> = ({ isOpen, onClose, language }) => {
  const t = (key: string, params: any = {}) => getTranslation(language, key, params);
  const [selectedType, setSelectedType] = useState<DocType>('word');
  const [prompt, setPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [attachedFile, setAttachedFile] = useState<{ name: string, content: string } | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setPrompt('');
      setIsSynthesizing(false);
      setResultText(null);
      setAttachedFile(null);
    }
  }, [isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAttachedFile({ name: file.name, content: event.target?.result as string || '' });
      reader.readAsText(file);
    }
  };

  const handleSynthesize = async () => {
    if (!prompt.trim() && !attachedFile) return;
    setIsSynthesizing(true);
    setResultText(null);
    
    let basePrompt = attachedFile ? `[CONVERT]: ${attachedFile.content}\n[INSTRUCT]: ${prompt}` : prompt;
    if (attachedFile) setIsConverting(true);

    try {
      await generateResponse(
        [], 
        `[FACTORY_${selectedType.toUpperCase()}]: ${basePrompt}`, 
        'chat', 
        (chunk) => setResultText(chunk),
        () => {},
        undefined,
        { language } as any
      );
    } catch (error) {
      setResultText("ERROR: Protocol failed.");
    } finally {
      setIsSynthesizing(false);
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!resultText) return;
    const element = document.createElement("a");
    const file = new Blob([resultText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `metro_factory_${selectedType}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2700] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-surface border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-[scaleIn_0.3s]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow"><Wand2 size={24} /></div>
            <div><h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t('assetFactory')}</h2><p className="text-[10px] font-bold text-muted uppercase mt-1">{t('initializingLink')}</p></div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-muted"><X size={24} /></button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="w-full lg:w-80 border-r border-white/5 bg-black/40 p-8 flex flex-col gap-4">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.4em] mb-4">Architecture</h3>
            {ASSETS.map((asset) => (
              <button key={asset.id} onClick={() => setSelectedType(asset.id)} className={`flex items-center gap-4 p-5 rounded-3xl border transition-all text-left ${selectedType === asset.id ? `${asset.bg} ${asset.border} shadow-inner` : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                <div className={`p-3 rounded-2xl bg-black/20 ${asset.color}`}><asset.icon size={20} /></div>
                <div className="text-[11px] font-black text-white uppercase tracking-widest">{asset.label}</div>
              </button>
            ))}
          </div>

          <div className="flex-1 p-8 md:p-12 overflow-y-auto no-scrollbar bg-black/10 flex flex-col">
            <div className="mb-10 flex items-center justify-between">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all text-[10px] font-black uppercase ${attachedFile ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-muted'}`}>
                <Repeat size={14} /> {attachedFile ? attachedFile.name : t('convertMode')}
              </button>
            </div>

            <div className="flex-1 space-y-8">
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t('describeEdit')} className="w-full h-32 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white text-sm focus:outline-none focus:border-primary transition-all resize-none" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                  <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('neuralWorkspace')}</label>
                  {resultText && (
                    <div className="flex gap-4">
                      <button onClick={handleCopy} className="flex items-center gap-2 text-[8px] font-black text-primary uppercase hover:opacity-80 transition-opacity">
                        {copied ? <Check size={10} /> : <Copy size={10} />}
                        {copied ? t('copied') : t('copy')}
                      </button>
                      <button onClick={() => setResultText(null)} className="text-[8px] font-black text-muted uppercase hover:text-white transition-colors">{t('flush')}</button>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <textarea value={resultText || ''} readOnly placeholder={isSynthesizing ? t('processingConversionPath') : '...'} className="w-full h-64 bg-black/60 border border-white/10 rounded-[2.5rem] p-8 text-white font-mono text-[13px] leading-relaxed resize-none" />
                  {isSynthesizing && <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem] backdrop-blur-sm"><Loader2 className="animate-spin text-primary" size={32} /></div>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                {resultText && !isSynthesizing && (
                  <>
                    <button onClick={handleCopy} className="flex-1 max-w-xs flex items-center justify-center gap-4 px-8 py-6 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase text-[12px] hover:bg-white/10 transition-all">
                      {copied ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />} 
                      {copied ? "Logic Copied" : "Copy Content"}
                    </button>
                    <button onClick={handleDownload} className="flex-1 max-w-xs flex items-center justify-center gap-4 px-8 py-6 bg-white text-black rounded-full font-black uppercase text-[12px] shadow-glow hover:scale-105 active:scale-95 transition-all">
                      <Download size={20} /> {t('extractTo')} {selectedType.toUpperCase()}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
              <button onClick={onClose} className="text-[10px] font-black text-muted uppercase">{t('terminate')}</button>
              <button onClick={handleSynthesize} disabled={isSynthesizing} className="px-10 py-4 bg-primary text-background rounded-2xl font-black uppercase text-[10px] shadow-glow">
                {isSynthesizing ? <Loader2 size={16} className="animate-spin" /> : t('synthesizeAsset')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
