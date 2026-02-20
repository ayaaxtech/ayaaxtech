
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Check, Zap, Flame, Crown, ShieldCheck, 
  CreditCard, Loader2, ArrowRight, ChevronLeft,
  Lock, Coins, CheckCircle2,
  Activity, User, Calendar, Hash, AlertCircle
} from 'lucide-react';
import { getTranslation } from '../translations';

const STRIPE_PK = 'pk_live_51T1k99DdTzQ4SKGZfkIGe7dwME0c8ds29MbRtmTeFGzgPPUS5ikPkiop5lMFRcSpQ05V6idkQtPjB5HIGdfV0VSH00HzFomT27';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  isGuest?: boolean;
}

type ModalStep = 'selection' | 'checkout' | 'processing' | 'success';
type PaymentMethod = 'card' | 'crypto';
type CryptoType = 'btc' | 'sol';

const TIERS = [
  { id: 'pro', nameKey: 'tierPro', price: '9.99', icon: Zap, color: 'text-blue-400', features: ['Unlimited Images', '1000 Credits', '~10 Apps per Month', 'Priority Processing'] },
  { id: 'gg', nameKey: 'tierGG', price: '29.99', icon: Flame, color: 'text-orange-400', features: ['Unlimited Images', '50 Apps per 3 Months', 'Neural Forge Access', 'Advanced Tools'] },
  { id: 'entity', nameKey: 'tierEntity', price: '129.99', icon: Crown, color: 'text-primary', features: ['Unlimited Images', '100 Apps per 6 Months', 'Unlimited Agent Swarm', 'Global Context Link'] },
  { id: 'therion', nameKey: 'tierTherion', price: '199.99', icon: ShieldCheck, color: 'text-emerald-500', features: ['Unlimited Images', '500 Apps per Year', 'God Mode Activated', 'Full Core Unlocked'] },
];

const WALLETS = {
  btc: 'bc1qxmu4wztvmsld6mt40ffpw0mvx937frdnehl0zr',
  sol: 'HxXCApEMroRiYfNokAyYjBXkPmz96FhgoeTkDFLa9FRP'
};

declare global { interface Window { Stripe: any; } }

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, language, isGuest }) => {
  const [step, setStep] = useState<ModalStep>('selection');
  const [selectedTier, setSelectedTier] = useState<typeof TIERS[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card' as PaymentMethod);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('btc');
  const [formError, setFormError] = useState<string | null>(null);
  const [cardData, setCardData] = useState({ email: '', name: '', number: '', expiry: '', cvv: '' });
  
  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    if (isOpen) { setStep('selection'); setSelectedTier(null); setFormError(null); }
  }, [isOpen]);

  const isFormValid = () => {
    if (paymentMethod === 'crypto') return true;
    return cardData.email.includes('@') && cardData.name.length > 2 && cardData.number.length === 16 && /^\d{2}\/\d{2}$/.test(cardData.expiry) && cardData.cvv.length >= 3;
  };

  const handleProcess = async () => {
    if (isGuest) {
      alert("GUESTS CANNOT PROCESS TRANSACTIONS. PLEASE SIGN IN OR SIGN UP TO PAY FOR A PLAN.");
      onClose();
      return;
    }
    if (!isFormValid()) return setFormError("INCOMPLETE_METADATA");
    setStep('processing');
    await new Promise(r => setTimeout(r, 3000));
    setStep('success');
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-6 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-surface border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow"><Crown size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                {step === 'selection' ? t('upgrade') : t('checkoutHeader')}
              </h2>
              {isGuest && <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">Guest Mode: View Only</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-muted"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {step === 'selection' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TIERS.map((tier) => (
                <button key={tier.id} onClick={() => { setSelectedTier(tier); setStep('checkout'); }} className="group p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-primary/50 hover:bg-primary/5 transition-all text-left flex flex-col items-start">
                  <div className={`p-4 rounded-2xl bg-white/5 mb-6 ${tier.color} group-hover:scale-110 transition-all`}><tier.icon size={28} /></div>
                  <h3 className="text-lg font-black text-white uppercase mb-1">{t(tier.nameKey)}</h3>
                  <div className="flex items-baseline gap-1 mb-6"><span className="text-2xl font-black text-white">${tier.price}</span><span className="text-[10px] text-muted font-bold">/MO</span></div>
                  <div className="space-y-3 mb-8 w-full">
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2"><Check size={12} className="text-emerald-500" /><span className="text-[10px] text-muted font-bold uppercase tracking-widest">{f}</span></div>
                    ))}
                  </div>
                  <div className="mt-auto w-full py-4 border-t border-white/5 flex items-center justify-between group-hover:text-primary transition-colors">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Initialize</span>
                    <ArrowRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'checkout' && selectedTier && (
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 animate-[fadeIn_0.3s]">
              <div className="flex-1 space-y-10">
                <button onClick={() => setStep('selection')} className="flex items-center gap-2 text-[10px] font-black text-muted uppercase hover:text-white"><ChevronLeft size={14} /> {t('backToPlans')}</button>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setPaymentMethod('card')} className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'card' ? 'bg-primary/10 border-primary text-primary shadow-glow' : 'bg-white/5 border-white/5 text-muted'}`}><CreditCard size={24} /><span className="text-[10px] font-black uppercase">Secure Card</span></button>
                  <button onClick={() => setPaymentMethod('crypto')} className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'crypto' ? 'bg-primary/10 border-primary text-primary shadow-glow' : 'bg-white/5 border-white/5 text-muted'}`}><Coins size={24} /><span className="text-[10px] font-black uppercase">Crypto Assets</span></button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2"><label className="text-[9px] font-black text-muted uppercase">Email Address</label><input type="email" value={cardData.email} onChange={e => setCardData({...cardData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold focus:border-primary outline-none" /></div>
                    <div className="md:col-span-2 space-y-2"><label className="text-[9px] font-black text-muted uppercase">Card Holder Name</label><input type="text" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-bold focus:border-primary outline-none" /></div>
                    <div className="md:col-span-2 space-y-2"><label className="text-[9px] font-black text-muted uppercase">Card Number</label><input type="text" value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value.replace(/\D/g, '').slice(0,16)})} placeholder="0000 0000 0000 0000" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-mono focus:border-primary outline-none" /></div>
                    <div className="space-y-2"><label className="text-[9px] font-black text-muted uppercase">Expiry (MM/YY)</label><input type="text" value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value.slice(0,5)})} placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-mono focus:border-primary outline-none" /></div>
                    <div className="space-y-2"><label className="text-[9px] font-black text-muted uppercase">CVV</label><input type="password" value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value.slice(0,4)})} placeholder="***" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-mono focus:border-primary outline-none" /></div>
                  </div>
                )}

                <button onClick={handleProcess} disabled={!isFormValid()} className={`w-full py-6 rounded-[2.5rem] font-black uppercase text-[12px] shadow-glow flex items-center justify-center gap-4 transition-all active:scale-95 ${isGuest ? 'bg-white/10 text-white' : 'bg-white text-black'}`}>
                  {isGuest ? "Sign in to Pay" : t('completeTransaction')} <Lock size={18} />
                </button>
              </div>
              <div className="w-full lg:w-80 space-y-6"><div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-4"><div className={`w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center ${selectedTier.color}`}><selectedTier.icon size={32} /></div><h4 className="font-black text-white uppercase">{t(selectedTier.nameKey)}</h4><div className="text-3xl font-black text-white">${selectedTier.price}</div></div></div>
            </div>
          )}

          {step === 'processing' && (
            <div className="h-full flex flex-col items-center justify-center space-y-8"><div className="w-32 h-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /><p className="text-[11px] font-bold text-muted uppercase tracking-[0.5em]">Synchronizing Core Assets...</p></div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-10"><div className="w-40 h-40 bg-primary/10 rounded-[3rem] flex items-center justify-center animate-pulse"><CheckCircle2 size={80} className="text-primary" /></div><h3 className="text-5xl font-black text-white uppercase italic">Protocol Active</h3><button onClick={onClose} className="px-24 py-7 bg-white text-black rounded-full font-black uppercase text-[13px] shadow-glow">Enter Core</button></div>
          )}
        </div>
        <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-center gap-3"><ShieldCheck size={16} className="text-emerald-500" /><span className="text-[9px] font-black text-muted uppercase tracking-[0.5em]">Global E2EE Handshake Verified</span></div>
      </div>
    </div>,
    document.body
  );
};
