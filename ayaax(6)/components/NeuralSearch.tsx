
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sparkles, Wand2, FileText, FileSpreadsheet, 
  Presentation, Palette, Hammer, BarChart3, 
  Gamepad2, Zap, Terminal, Mic, History, TrendingUp,
  ChevronRight, Command, Globe, Headset
} from 'lucide-react';
import { getTranslation } from '../translations';

interface SearchItem {
  id: string;
  label: string;
  category: string;
  description: string;
  icon: any;
  action: () => void;
  keywords: string[];
}

interface NeuralSearchProps {
  onOpenTool: (toolId: string) => void;
  language?: string;
}

export const NeuralSearch: React.FC<NeuralSearchProps> = ({ onOpenTool, language = 'English' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => getTranslation(language, key);

  // Dynamic Index that re-evaluates when language changes
  const getToolIndex = (): SearchItem[] => [
    { id: 'support', label: 'SUPPORT', category: 'CONTACT', description: 'contact us on support@ayaax.tech', icon: Headset, action: () => { navigator.clipboard.writeText('support@ayaax.tech'); alert('Email copied to clipboard'); }, keywords: ['support', 'help', 'contact', 'email', 'problem'] },
    { id: 'ppt', label: t('pptTool'), category: t('categoryTool'), description: t('pptDesc'), icon: Presentation, action: () => onOpenTool('docFactory'), keywords: ['ppt', 'powerpoint', 'slides', 'deck'] },
    { id: 'excel', label: t('excelTool'), category: t('categoryTool'), description: t('excelDesc'), icon: FileSpreadsheet, action: () => onOpenTool('docFactory'), keywords: ['excel', 'csv', 'data', 'table'] },
    { id: 'word', label: t('wordTool'), category: t('categoryTool'), description: t('wordDesc'), icon: FileText, action: () => onOpenTool('docFactory'), keywords: ['word', 'doc', 'writing'] },
    { id: 'art', label: t('actArt'), category: t('categoryTool'), description: t('emptyGallery'), icon: Palette, action: () => onOpenTool('artLab'), keywords: ['image', 'art', 'draw'] },
    { id: 'builder', label: t('forgeApp'), category: t('categoryTool'), description: t('descAbc'), icon: Hammer, action: () => onOpenTool('builder'), keywords: ['builder', 'app', 'agent'] },
    { id: 'charts', label: t('charts'), category: t('categoryTool'), description: t('pricingData'), icon: BarChart3, action: () => onOpenTool('aiChart'), keywords: ['stats', 'benchmark'] },
    { id: 'call', label: t('callTool'), category: t('categoryProtocol'), description: t('callDesc'), icon: Mic, action: () => onOpenTool('call'), keywords: ['call', 'voice', 'speak'] },
    { id: 'games', label: t('gamesTool'), category: t('categoryTool'), description: t('gamesDesc'), icon: Gamepad2, action: () => onOpenTool('coolHub'), keywords: ['games', 'play'] },
    { id: 'analyst', label: t('actAnalyst'), category: t('categoryProtocol'), description: t('descAnalyst'), icon: Zap, action: () => onOpenTool('analyst'), keywords: ['research', 'data'] },
    { id: 'language', label: t('langSelector'), category: t('categoryProtocol'), description: t('linguisticCore'), icon: Globe, action: () => onOpenTool('langSelector'), keywords: ['language', 'translate'] },
  ];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const index = getToolIndex();
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = index.filter(item => 
      item.label.toLowerCase().includes(q) || 
      item.keywords.some(k => k.includes(q)) ||
      item.description.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query, language]);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl group">
      <div className={`relative flex items-center transition-all duration-300 ${isOpen ? 'scale-[1.02]' : ''}`}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
          <Search size={18} />
        </div>
        <input value={query} onFocus={() => setIsOpen(true)} onChange={e => setQuery(e.target.value)} placeholder={t('searchPlaceholder')} className="w-full bg-surface border border-border rounded-2xl py-2.5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted/40 shadow-sm" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-surface border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-[scaleIn_0.2s] z-[100] backdrop-blur-3xl">
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-6">
            {!query.trim() ? (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 px-2 mb-4">
                    <TrendingUp size={12} className="text-primary" />
                    <span className="text-[9px] font-black text-muted uppercase tracking-[0.4em]">{t('trendingSearches')}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[t('actArt'), t('actSearch'), t('actBeast')].map(cmd => (
                      <button key={cmd} onClick={() => setQuery(cmd)} className="w-full text-left p-4 bg-white/5 border border-transparent hover:border-primary/20 hover:bg-primary/5 rounded-2xl transition-all flex items-center justify-between group/cmd">
                        <span className="text-[10px] font-bold text-white/70 group-hover/cmd:text-white uppercase tracking-widest">{cmd}</span>
                        <ChevronRight size={12} className="text-muted/20 group-hover/cmd:text-primary transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 px-2 mb-4">
                    <Zap size={12} className="text-primary" />
                    <span className="text-[9px] font-black text-muted uppercase tracking-[0.4em]">{t('pinnedCapabilities')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {getToolIndex().slice(0, 4).map(item => (
                      <button key={item.id} onClick={() => { item.action(); setIsOpen(false); }} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all text-left">
                        <div className="p-2.5 bg-black/40 rounded-xl text-primary"><item.icon size={16} /></div>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2 mb-2">
                   <span className="text-[9px] font-black text-muted uppercase tracking-[0.4em]">{t('searchResults')} ({results.length})</span>
                </div>
                {results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map(item => (
                      <button key={item.id} onClick={() => { item.action(); setIsOpen(false); setQuery(''); }} className="w-full flex items-center gap-6 p-5 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all group/item">
                        <div className="p-4 bg-black/40 rounded-2xl text-muted group-hover/item:text-primary transition-all"><item.icon size={22} /></div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[11px] font-black text-white uppercase tracking-widest">{item.label}</span>
                            <span className="text-[7px] font-black px-2 py-0.5 bg-white/5 text-muted rounded uppercase tracking-widest">{item.category}</span>
                          </div>
                          <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-60">{item.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                    <Terminal size={40} className="text-muted opacity-20" />
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">{t('noProtocolFound')} "{query}"</p>
                    <button onClick={() => { onOpenTool('analyst'); setIsOpen(false); }} className="px-6 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all">{t('runGlobalSweep')}</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow animate-pulse" />
                <span className="text-[8px] font-black text-muted uppercase tracking-widest opacity-60">{t('neuralRegistryConnected')}</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};