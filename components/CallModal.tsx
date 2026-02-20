import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Mic, MicOff, PhoneOff, Activity, Volume2, ShieldCheck, 
  ChevronRight, Play, Save, CheckCircle2, Cpu, Loader2, 
  Send, Sparkles, Zap, RefreshCw, Settings2, Waves, Terminal, Power,
  User, UserRound
} from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { getTranslation } from '../translations';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: any;
}

type CallStep = 'polarity' | 'active';

export const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose, settings }) => {
  const [step, setStep] = useState<CallStep>('polarity');
  const [gender, setGender] = useState<'boy' | 'girl' | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcription, setTranscription] = useState('');
  const [timer, setTimer] = useState(0);
  const [typedMessage, setTypedMessage] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const t = (key: string) => getTranslation(settings.language, key);

  useEffect(() => {
    const saved = localStorage.getItem('ayaax_ai_voice_algorithm');
    if (saved && isOpen && step === 'polarity') {
      const parsed = JSON.parse(saved);
      setGender(parsed.gender);
      setStep('active');
    }
  }, [isOpen, step]);

  useEffect(() => {
    let interval: any;
    if (isActive) interval = setInterval(() => setTimer(t => t + 1), 1000);
    else setTimer(0);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const resample = (input: Float32Array, fromRate: number, toRate: number): Float32Array => {
    if (fromRate === toRate) return input;
    const ratio = fromRate / toRate;
    const outputLength = Math.round(input.length / ratio);
    const output = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      output[i] = input[Math.min(input.length - 1, Math.round(i * ratio))];
    }
    return output;
  };

  const startCall = async () => {
    if (isInitializing) return;

    try {
      setStatus('Acquiring Mic...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setTranscription('');
      setTimer(0);
      nextStartTimeRef.current = 0;
      sourcesRef.current.clear();
      setIsMuted(false);
      setIsInitializing(true);
      setStatus('Linking AYAAX...');

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      if (audioContext.state === 'suspended') await audioContext.resume();

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const savedAlgorithm = JSON.parse(localStorage.getItem('ayaax_ai_voice_algorithm') || '{}');
      const voiceEngine = savedAlgorithm.gender === 'girl' ? 'Kore' : 'Puck';

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsInitializing(false);
            setStatus('Active Link');
            
            const source = audioContext.createMediaStreamSource(stream);
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;
            
            const hardwareRate = audioContext.sampleRate;
            
            scriptProcessor.onaudioprocess = (e) => {
              if (isMuted || !isActive) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const resampledData = resample(inputData, hardwareRate, 16000);
              const int16 = new Int16Array(resampledData.length);
              for (let i = 0; i < resampledData.length; i++) {
                int16[i] = resampledData[i] * 32768;
              }
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ 
                  media: { 
                    data: encode(new Uint8Array(int16.buffer)), 
                    mimeType: 'audio/pcm;rate=16000' 
                  } 
                });
              }).catch(() => {});
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscription(prev => (prev + ' ' + text).slice(-300));
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              if (ctx.state === 'suspended') await ctx.resume();
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => endCall(),
          onerror: (err) => { 
            console.error("AYAAX Link Error:", err); 
            setStatus('Handshake Failed'); 
            setIsInitializing(false); 
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceEngine } } },
          systemInstruction: `You are AYAAX. You MUST speak and respond 100% EXCLUSIVELY in ${settings.language}. Be concise, professional, and architectural in your tone.`
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error("Startup Failure:", err);
      setIsInitializing(false);
      setStatus('Mic Access Error');
    }
  };

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !isActive || isSynthesizing) return;
    
    const messageToSend = typedMessage.trim();
    setIsSynthesizing(true);
    
    setTranscription(prev => (prev + '\n[You]: ' + messageToSend).slice(-300));
    
    try {
      if (sessionPromiseRef.current) {
        const session = await sessionPromiseRef.current;
        session.sendRealtimeInput([{ text: messageToSend }]);
      }
      setTypedMessage('');
    } catch (err) { 
      console.error("Pulse Error:", err); 
      setTranscription(prev => prev + ' (Send Failed)');
    } 
    finally { setIsSynthesizing(false); }
  };

  const endCall = () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => { try { session.close(); } catch(e) {} });
      sessionPromiseRef.current = null;
    }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    if (processorRef.current) { processorRef.current.onaudioprocess = null; processorRef.current.disconnect(); }
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    audioContextRef.current = null;
    setIsActive(false);
    setIsInitializing(false);
    setStatus('Offline');
    onClose();
  };

  useEffect(() => { return () => { if (isActive) endCall(); }; }, [isActive]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2000] bg-[#09090B] flex items-center justify-center p-6 animate-[fadeIn_0.3s]">
      {step === 'polarity' && (
        <div className="max-w-xl w-full bg-surface border border-white/10 rounded-[4rem] p-12 text-center animate-[scaleIn_0.3s]">
           <h2 className="text-3xl font-bold text-white uppercase tracking-tighter mb-4">Linguistic Polarity</h2>
           <p className="text-muted text-sm mb-12 uppercase tracking-widest font-bold">Select AYAAX frequency profile</p>
           <div className="grid grid-cols-2 gap-6">
              <button onClick={() => { setGender('girl'); localStorage.setItem('ayaax_ai_voice_algorithm', JSON.stringify({ gender: 'girl', voice: { id: 'Kore', engine: 'Kore' } })); setStep('active'); }} className="group p-10 bg-white/5 border border-white/5 rounded-[3rem] hover:border-primary transition-all flex flex-col items-center">
                 <div className="p-6 bg-primary/10 rounded-3xl text-primary mb-6 group-hover:scale-110 transition-transform"><User size={40} /></div>
                 <h3 className="text-xl font-bold text-white uppercase mb-2">{t('feminine')}</h3>
              </button>
              <button onClick={() => { setGender('boy'); localStorage.setItem('ayaax_ai_voice_algorithm', JSON.stringify({ gender: 'boy', voice: { id: 'Puck', engine: 'Puck' } })); setStep('active'); }} className="group p-10 bg-white/5 border border-white/5 rounded-[3rem] hover:border-primary transition-all flex flex-col items-center">
                 <div className="p-6 bg-primary/10 rounded-3xl text-primary mb-6 group-hover:scale-110 transition-transform"><UserRound size={40} /></div>
                 <h3 className="text-xl font-bold text-white uppercase mb-2">{t('masculine')}</h3>
              </button>
           </div>
        </div>
      )}
      {step === 'active' && (
        <div className="max-w-xl w-full h-[90vh] bg-surface border border-white/5 rounded-[4rem] p-10 text-center relative overflow-hidden shadow-2xl animate-[scaleIn_0.3s] flex flex-col items-center">
          
          <div className="mb-8 w-full">
            <div className="w-36 h-36 bg-black/40 rounded-full flex items-center justify-center mx-auto mb-8 relative border-2 border-white/5">
               {(isActive || isInitializing || isSynthesizing) && <div className="absolute inset-0 flex items-center justify-center"><div className="w-36 h-36 rounded-full border-[3px] border-primary shadow-[0_0_15px_rgba(57,255,20,0.5)] animate-pulse" /></div>}
               <div className="relative z-10 w-28 h-28 bg-[#111114] border border-white/10 rounded-full flex items-center justify-center shadow-neon">
                 <Waves size={48} className={isActive ? 'text-primary' : 'text-muted'} />
               </div>
            </div>
            <div className="text-6xl font-mono text-white font-bold tracking-[0.2em] mb-4 drop-shadow-glow">{formatTime(timer)}</div>
            <div className="flex items-center justify-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary animate-pulse shadow-glow' : 'bg-muted'}`} />
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">{status}</span>
            </div>
          </div>

          {!isActive && !isInitializing ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
              <p className="text-[11px] text-muted font-bold uppercase tracking-widest leading-relaxed">Vocal link requires manual handshake</p>
              <button onClick={startCall} className="w-full max-w-sm py-6 bg-white text-black rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[12px] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-glow">Authorize Vocal Link <Power size={18} /></button>
            </div>
          ) : (
            <>
              <div className="flex-1 w-full bg-[#050505] rounded-[3.5rem] border border-white/5 p-10 mb-8 flex items-center justify-center italic text-muted/60 text-[14px] overflow-y-auto custom-scrollbar text-center leading-relaxed whitespace-pre-wrap">
                {transcription || (isInitializing ? "Initializing neural pathways..." : "Listening for direct command...")}
              </div>

              <form onSubmit={handleSendText} className="w-full relative mb-8 group">
                 <input 
                  type="text" 
                  value={typedMessage} 
                  onChange={(e) => setTypedMessage(e.target.value)} 
                  disabled={!isActive || isSynthesizing} 
                  placeholder={isSynthesizing ? "PROCESSING..." : "DIRECT PULSE COMMAND..."} 
                  className="w-full bg-black/40 border-2 border-primary rounded-[3.5rem] py-6 pl-10 pr-20 text-[12px] font-black text-white uppercase tracking-[0.2em] focus:outline-none transition-all placeholder:text-muted/30 disabled:opacity-50 shadow-[0_0_10px_rgba(57,255,20,0.1)]" 
                 />
                 <button type="submit" disabled={!typedMessage.trim() || !isActive || isSynthesizing} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-0 shadow-glow">
                  {isSynthesizing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                 </button>
              </form>

              <div className="flex items-center justify-center gap-10 mb-4">
                <button onClick={() => setIsMuted(!isMuted)} disabled={isInitializing} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 ${isMuted ? 'bg-brightRed/10 text-brightRed border-brightRed/40' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}>
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <button onClick={endCall} className="w-24 h-24 bg-brightRed text-white rounded-full flex items-center justify-center shadow-neon transition-all hover:scale-110 active:scale-90">
                  <PhoneOff size={44} />
                </button>
                <button onClick={() => { endCall(); setStep('polarity'); }} className="w-16 h-16 bg-white/5 border-2 border-white/10 flex items-center justify-center text-muted hover:text-white rounded-full transition-all">
                  <RefreshCw size={24} />
                </button>
              </div>
            </>
          )}
          <div className="mt-6 pt-4 flex items-center justify-center gap-3 border-t border-white/5 w-full">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-[8px] font-black text-muted uppercase tracking-[0.4em]">Handshake Secure // AYAAX Core</span>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};