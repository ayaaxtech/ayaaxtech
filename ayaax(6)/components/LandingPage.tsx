import React, { useState, useEffect } from 'react';
import { AyaaxLogo } from './AyaaxLogo';
import { 
  Power, Fingerprint, Loader2, AlertCircle, RefreshCw, 
  Mail, MailCheck, ArrowRight, KeyRound, Globe, List
} from 'lucide-react';
import { getTranslation } from '../translations';
import { auth, signInWithGoogle, isFirebaseReady, initializationError } from '../services/firebase';

interface LandingPageProps {
  onJoin: (email: string, mode: 'signin' | 'signup' | 'test', userData?: any) => void;
  language: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onJoin, language = 'English' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup' | 'test'>('signin');
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProtocolFix, setShowProtocolFix] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [isLocalFile, setIsLocalFile] = useState(false);

  useEffect(() => {
    if (window.location.protocol === 'file:') {
      setIsLocalFile(true);
    }
  }, []);

  const t = (key: string, params?: any) => getTranslation(language, key, params);

  const handleGuest = () => {
    setMode('test');
    setIsInitializing(true);
    setTimeout(() => onJoin('guest@ayaax.ai', 'test'), 1000);
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseReady) {
      setError(`Auth Service Configuration Pending: ${initializationError || 'Retry required'}`);
      return;
    }

    setIsInitializing(true);
    setError(null);
    setShowProtocolFix(false);
    
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      onJoin(user.email || 'google-user@ayaax.ai', 'signin', { 
        provider: 'google', 
        uid: user.uid,
        displayName: user.displayName 
      });
    } catch (err: any) {
      console.error("GOOGLE_AUTH_ERROR:", err);
      let errorMessage = err.message;
      
      if (err.code === 'auth/operation-not-supported-in-this-environment' || window.location.protocol === 'file:') {
        errorMessage = "Protocol Interrupt: Google Auth requires HTTP/HTTPS. file:// protocol is blocked.";
        setShowProtocolFix(true);
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = "Domain not authorized. Please check Firebase Console.";
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = "Auth popup closed.";
      }
      
      setError(errorMessage);
      setIsInitializing(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth || !email || !password) {
      setError("Credentials required to resend verification.");
      return;
    }
    setResending(true);
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      if (userCredential.user) {
        await userCredential.user.sendEmailVerification();
        await auth.signOut();
        alert("Verification signal dispatched. Check your inbox.");
        setError(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (!isFirebaseReady) {
      setError("Authentication service is offline. System sync required.");
      return;
    }

    setIsInitializing(true);
    setError(null);
    setShowProtocolFix(false);

    try {
      if (mode === 'signup') {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        if (userCredential.user) {
          await userCredential.user.sendEmailVerification();
          await auth.signOut();
          setVerificationSent(true);
          setIsInitializing(false);
        }
      } else {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (user && !user.emailVerified) {
          setError("VERIFY_REQUIRED");
          await auth.signOut();
          setIsInitializing(false);
          return;
        }

        if (user) onJoin(user.email!, 'signin', { uid: user.uid });
      }
    } catch (err: any) {
      console.error("AUTH_ERROR:", err);
      let errorMessage = err.message;
      if (err.code === 'auth/operation-not-supported-in-this-environment' || window.location.protocol === 'file:') {
        errorMessage = "Protocol Interrupt: Local storage and auth require a web server (HTTP/HTTPS).";
        setShowProtocolFix(true);
      }
      setError(errorMessage);
      setIsInitializing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-6 z-[9999] overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#FFF 1px, transparent 1px), linear-gradient(90deg, #FFF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.02] blur-[120px] rounded-full animate-pulse" />

      <div className="z-10 w-full max-w-lg flex flex-col items-center animate-[scaleIn_0.4s]">
        <div className="mb-12">
            <AyaaxLogo size="lg" active={true} />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-2">AYAAX</h1>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.7em]">Logic Over Impulse.</p>
        </div>

        {verificationSent ? (
          <div className="w-full bg-white/5 border border-primary/20 rounded-[3rem] p-10 text-center space-y-8 animate-[fadeIn_0.5s]">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-glow">
              <MailCheck size={48} className="text-primary" />
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Check Your Email</h2>
                <p className="text-sm text-muted leading-relaxed font-medium uppercase tracking-widest">
                  A verification link has been sent to: <br/>
                  <span className="text-primary font-bold">{email}</span>
                </p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">You must verify your account before logging in.</p>
            </div>
            <div className="flex flex-col gap-4">
                <button 
                  onClick={() => { setVerificationSent(false); setMode('signin'); setError(null); }}
                  className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-glow hover:scale-[1.02] transition-all"
                >
                  Return to Login
                </button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-8 animate-[fadeIn_0.3s]">
            <div className="w-full space-y-6">
              
              {(isLocalFile || showProtocolFix) && (
                <div className="p-8 bg-brightRed/10 border border-brightRed/30 rounded-[2.5rem] space-y-6 mb-4 animate-[fadeIn_0.5s]">
                  <div className="flex items-center gap-3 text-brightRed">
                    <Globe size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol Interrupt: Fix Required</span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider leading-relaxed">
                      Google Auth requires <b>HTTP/HTTPS</b>. The <b>file://</b> protocol is blocked. To fix this, you MUST run the page on a local web server.
                    </p>
                    <div className="space-y-3 pt-2">
                       <p className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2"><List size={12} className="text-primary" /> Required Steps:</p>
                       <ol className="space-y-2 text-[9px] text-white/70 font-bold uppercase tracking-widest list-decimal pl-4">
                          <li>Close every browser tab of this app.</li>
                          <li>Open your project FOLDER in VS Code (File → Open Folder).</li>
                          <li>Install the "Live Server" extension (by Ritwick Dey).</li>
                          <li>Right-click <b>index.html</b> and select "Open with Live Server".</li>
                          <li>Verify your URL is <b>http://127.0.0.1:5500/</b></li>
                       </ol>
                    </div>
                  </div>
                </div>
              )}

              {initializationError && (
                <div className="p-4 bg-brightRed/10 border border-brightRed/20 rounded-2xl flex items-center gap-3 text-brightRed mb-4 animate-[shake_0.5s]">
                  <AlertCircle size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest truncate">System Protocol Error: {initializationError}</span>
                </div>
              )}

              {/* Google Integration - Top Action */}
              <button 
                onClick={handleGoogleSignIn}
                disabled={isInitializing}
                className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all group shadow-inner"
              >
                {isInitializing && mode === 'test' ? <Loader2 className="animate-spin" size={18} /> : <><Fingerprint size={18} className="group-hover:scale-110 transition-transform text-primary" /> Sync with Google</>}
              </button>

              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center px-4"><div className="w-full h-px bg-white/5" /></div>
                <span className="relative z-10 px-4 bg-black text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">OR SYSTEM ENTRY</span>
              </div>

              {/* Login/Signup Tabs */}
              <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-2 flex gap-1">
                <button onClick={() => {setMode('signin'); setError(null); setShowProtocolFix(false);}} className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'signin' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}>{t('signIn')}</button>
                <button onClick={() => {setMode('signup'); setError(null); setShowProtocolFix(false);}} className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}>{t('signUp')}</button>
              </div>

              {error === "VERIFY_REQUIRED" && (
                <div className="p-8 bg-gold/5 border border-gold/20 rounded-[2.5rem] space-y-4 animate-[fadeIn_0.3s]">
                   <div className="flex items-center gap-4 text-gold">
                    <AlertCircle size={20} />
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Verify Identity</h4>
                   </div>
                   <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Check your email to verify your account.</p>
                   <button onClick={handleResendVerification} disabled={resending} className="text-[9px] font-black text-white uppercase tracking-widest underline flex items-center gap-2">
                        {resending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Resend Signal
                   </button>
                </div>
              )}

              {error && error !== "VERIFY_REQUIRED" && !showProtocolFix && (
                <div className="p-6 bg-brightRed/10 border border-brightRed/20 rounded-[2rem] space-y-3 animate-[shake_0.5s]">
                  <div className="flex items-center gap-3 text-brightRed">
                    <AlertCircle size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Protocol Interrupt</h4>
                  </div>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider leading-relaxed">{error}</p>
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                        <input 
                          type="email" 
                          placeholder={mode === 'signin' ? t('identEmail') : t('createIdentEmail')} 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-white text-[11px] font-bold tracking-widest focus:border-white/40 focus:outline-none transition-all placeholder:text-white/10" 
                        />
                    </div>
                    <div className="relative group">
                        <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                        <input 
                          type="password" 
                          placeholder={t('identPassword')} 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-white text-[11px] font-bold tracking-widest focus:border-white/40 focus:outline-none transition-all placeholder:text-white/10" 
                        />
                    </div>
                </div>
                <button type="submit" disabled={isInitializing || !email || !password} className="w-full py-7 bg-white text-black rounded-3xl font-black uppercase tracking-[0.4em] text-[12px] shadow-glow hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-10 flex items-center justify-center gap-3 group">
                  {isInitializing && (mode === 'signin' || mode === 'signup') ? <><Loader2 className="animate-spin" size={16} /> SYNCING</> : <>{mode === 'signin' ? t('authSync') : t('initProtocol')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
              </form>

              <button 
                onClick={handleGuest}
                disabled={isInitializing}
                className="w-full py-5 bg-white/5 border border-white/10 text-muted rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all"
              >
                {t('guestAccess')} <Power size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-2 opacity-20">
             <Fingerprint size={14} className="text-white" />
             <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">{t('e2eeActive')}</span>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};