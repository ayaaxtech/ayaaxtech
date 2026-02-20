import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Fingerprint, Mail, Smartphone, ArrowRight, 
  ShieldCheck, Globe, KeyRound, Loader2, LogIn, UserPlus 
} from 'lucide-react';
import { getTranslation } from '../translations';
import { signInWithGoogle } from '../services/firebase';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, userData: any) => void;
  language: string;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ 
  isOpen, onClose, onLoginSuccess, language 
}) => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const t = (key: string) => getTranslation(language, key);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsProcessing(true);
    try {
      const result = await signInWithGoogle();
      onLoginSuccess(result.user.email || 'user@ayaax.ai', { provider: 'google', uid: result.user.uid });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualAuth = async (isSignUp: boolean) => {
    setIsProcessing(true);
    // Simulation of verification / handshake
    await new Promise(r => setTimeout(r, 1500));
    onLoginSuccess(method === 'email' ? email : `${countryCode}${phone}`, { uid: 'manual-user-' + Date.now() });
    setIsProcessing(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-[fadeIn_0.3s]">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#FFF 1px, transparent 1px), linear-gradient(90deg, #FFF 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-xl w-full bg-surface border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl relative animate-[scaleIn_0.3s] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <button onClick={onClose} className="absolute top-8 right-8 text-muted hover:text-white transition-all p-2 hover:bg-white/5 rounded-full z-10">
          <X size={24} />
        </button>

        <div className="p-10 md:p-12 space-y-10">
          <div className="text-center space-y-3">
             <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-glow">
                <LogIn size={32} className="text-primary" />
             </div>
             <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Login to Chat</h2>
             <p className="text-[10px] text-muted font-bold uppercase tracking-[0.5em]">Identity Handshake Required</p>
          </div>

          <div className="space-y-6">
            {/* Google Action */}
            <button 
              onClick={handleGoogleAuth}
              disabled={isProcessing}
              className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-primary transition-all group shadow-glow active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><Fingerprint size={18} /> Continue with Google</>}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center px-4"><div className="w-full h-px bg-white/5" /></div>
              <span className="relative z-10 px-4 bg-surface text-[8px] font-black text-muted uppercase tracking-[0.6em]">System Credentials</span>
            </div>

            {/* Auth Method Toggler */}
            <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5">
               <button onClick={() => setMethod('email')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${method === 'email' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}>
                  <Mail size={12} /> Email
               </button>
               <button onClick={() => setMethod('phone')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${method === 'phone' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}>
                  <Smartphone size={12} /> Phone
               </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
               {method === 'email' ? (
                 <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER EMAIL ADDRESS..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white text-[11px] font-bold tracking-widest focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10" 
                    />
                 </div>
               ) : (
                 <div className="flex gap-3">
                    <div className="w-24 relative group">
                       <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={14} />
                       <input 
                        type="text" 
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        placeholder="+1" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-10 pr-2 text-white text-[11px] font-bold focus:border-primary/50 focus:outline-none transition-all" 
                       />
                    </div>
                    <div className="flex-1 relative group">
                       <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={16} />
                       <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="PHONE NUMBER..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white text-[11px] font-bold tracking-widest focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10" 
                       />
                    </div>
                 </div>
               )}

               <div className="relative group">
                  <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={16} />
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="VERIFICATION CODE..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white text-[11px] font-bold tracking-widest focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10" 
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all">Send Code</button>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => handleManualAuth(false)}
                disabled={isProcessing}
                className="flex-1 py-5 bg-white/5 border border-white/10 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-30"
              >
                <LogIn size={16} /> Login
              </button>
              <button 
                onClick={() => handleManualAuth(true)}
                disabled={isProcessing}
                className="flex-1 py-5 bg-primary text-black rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95 shadow-glow disabled:opacity-30"
              >
                <UserPlus size={16} /> Sign Up
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/40 flex flex-col items-center gap-2">
           <div className="flex items-center gap-2">
              <KeyRound size={12} className="text-muted opacity-40" />
              <span className="text-[8px] font-black text-muted uppercase tracking-[0.5em] opacity-40">Obsidian Encryption Handshake Active</span>
           </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
