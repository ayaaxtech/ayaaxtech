import React, { useRef } from 'react';
import { Copy, Printer, CheckCircle2, RotateCcw, Award, ShieldAlert } from 'lucide-react';
import { AyaaxLogo } from './AyaaxLogo';
import { CertificateData } from '../types';

interface CertificateProps {
  data: CertificateData;
  onReset: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ data, onReset }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const themeStyles = {
    hacker: { color: '#39ff14', bg: 'bg-[#39ff14]/5', border: 'border-[#39ff14]/30', shadow: 'shadow-[#39ff14]/20' },
    sky: { color: '#0ea5e9', bg: 'bg-[#0ea5e9]/5', border: 'border-[#0ea5e9]/30', shadow: 'shadow-[#0ea5e9]/20' },
    gold: { color: '#ffd700', bg: 'bg-[#ffd700]/5', border: 'border-[#ffd700]/30', shadow: 'shadow-[#ffd700]/20' },
    beast: { color: '#ff4b4b', bg: 'bg-[#ff4b4b]/5', border: 'border-[#ff4b4b]/30', shadow: 'shadow-[#ff4b4b]/20' },
    pink: { color: '#ff69b4', bg: 'bg-[#ff69b4]/5', border: 'border-[#ff69b4]/30', shadow: 'shadow-[#ff69b4]/20' },
    reaper: { color: '#111111', bg: 'bg-zinc-900/40', border: 'border-white/10', shadow: 'shadow-black/50' },
  };

  const style = themeStyles[data.theme];
  const title = data.customTitle || (data.isSuccess ? "Certificate of Mastery" : "Certificate of Completion");

  const handlePrint = () => window.print();
  const handleCopy = () => {
    navigator.clipboard.writeText(`${title} awarded to ${data.name} on ${data.date} for ${data.reason}. Produced by AYAAX.`);
    alert("Certificate details copied!");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 w-full h-full animate-[scaleIn_0.5s]">
      <div 
        ref={certRef}
        className={`w-full max-w-3xl aspect-[1.4/1] ${style.bg} border-2 ${style.border} rounded-[2rem] p-10 relative flex flex-col items-center justify-center shadow-2xl ${style.shadow} overflow-hidden`}
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 rounded-tl-[2rem]" style={{ borderColor: style.color }}></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 rounded-br-[2rem]" style={{ borderColor: style.color }}></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, ${style.color} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>

        {/* Verified Symbol */}
        <div className="absolute top-10 left-10 flex items-center gap-2">
           <div className="p-2 bg-zinc-400/10 rounded-lg">
             <AyaaxLogo size="sm" className="opacity-40 grayscale" />
           </div>
           <div className="flex flex-col">
             <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Verified_Asset</span>
             <span className="text-[7px] font-bold text-zinc-600 uppercase">Produced by AYAAX Core</span>
           </div>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-6 z-10">
           <div className="mb-2">
             {data.isSuccess ? (
               <Award size={64} style={{ color: style.color }} className="mx-auto" />
             ) : (
               <ShieldAlert size={64} style={{ color: style.color }} className="mx-auto opacity-50" />
             )}
           </div>
           
           <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter" style={{ textShadow: `0 0 20px ${style.color}44` }}>
             {title}
           </h1>
           
           <p className="text-muted uppercase font-bold tracking-[0.3em] text-[10px]">Neural Protocol Synchronization Complete</p>
           
           <div className="py-4">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">Presented to</span>
              <h2 className="text-4xl font-black text-white mt-2 mb-6 underline decoration-zinc-800" style={{ textDecorationColor: style.color }}>{data.name}</h2>
              
              <div className="max-w-md mx-auto h-px bg-white/5 mb-6"></div>
              
              <p className="text-muted text-sm italic font-medium leading-relaxed max-w-sm mx-auto">
                For {data.reason} and engagement within the AYAAX ecosystem.
              </p>
           </div>

           <div className="flex justify-between w-full max-w-md items-end pt-4">
              <div className="flex flex-col items-start border-t border-white/10 pt-4 w-32">
                 <span className="text-[8px] font-bold text-muted uppercase">Authorized_On</span>
                 <span className="text-[10px] font-black text-white font-mono">{data.date}</span>
              </div>
              
              <div className="flex flex-col items-center px-4">
                 <CheckCircle2 size={32} style={{ color: style.color }} />
                 <span className="text-[7px] font-black text-zinc-500 uppercase mt-2">Core_Verified</span>
              </div>

              <div className="flex flex-col items-end border-t border-white/10 pt-4 w-32">
                 <span className="text-[8px] font-bold text-muted uppercase">Neural_Key</span>
                 <span className="text-[10px] font-black text-white font-mono">AX-{data.isSuccess ? 'PASS' : 'PART'}-9921</span>
              </div>
           </div>

           <div className="pt-8 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 leading-relaxed max-w-xs mx-auto">
                "We are hopeful for your continued growth. Thank you for being a part of the AYAAX simulation. May your logic remain sharp."
              </p>
           </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4 w-full max-w-md no-print">
         <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 text-text font-black text-[10px] uppercase tracking-widest transition-all bubbly-button">
            <Copy size={16} /> Copy
         </button>
         <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 text-text font-black text-[10px] uppercase tracking-widest transition-all bubbly-button">
            <Printer size={16} /> Print
         </button>
         <button onClick={onReset} className="p-4 bg-primary text-black rounded-2xl hover:bg-white transition-all shadow-neon bubbly-button">
            <RotateCcw size={20} />
         </button>
      </div>
    </div>
  );
};