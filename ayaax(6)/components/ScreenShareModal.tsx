import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Monitor, Mic, MicOff, PhoneOff, Activity, ShieldCheck, Waves, Loader2, Sparkles, Power } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface ScreenShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: any;
}

export const ScreenShareModal: React.FC<ScreenShareModalProps> = ({ isOpen, onClose, settings }) => {
  const [isActive, setIsActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcription, setTranscription] = useState('');

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const frameIntervalRef = useRef<any>(null);

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
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

  const startVisionSync = async () => {
    try {
      const screenPromise = navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: "always" } as any, 
        audio: false 
      });
      const micPromise = navigator.mediaDevices.getUserMedia({ audio: true });

      setIsInitializing(true);
      setStatus('Linking Vision...');
      setTranscription('');

      const [screenStream, micStream] = await Promise.all([screenPromise, micPromise]);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      screenRef.current = screenStream;
      streamRef.current = micStream;
      if (videoRef.current) videoRef.current.srcObject = screenStream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsInitializing(false);
            setStatus('Neural Link Synchronized');
            
            const source = audioContext.createMediaStreamSource(micStream);
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;
            const hardwareRate = audioContext.sampleRate;

            scriptProcessor.onaudioprocess = (e) => {
              if (isMuted || !isActive) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const resampledData = resample(inputData, hardwareRate, 16000);
              
              const int16 = new Int16Array(resampledData.length);
              for (let i = 0; i < resampledData.length; i++) {
                int16[i] = Math.max(-1, Math.min(1, resampledData[i])) * 32767;
              }
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } });
              }).catch(() => {});
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            frameIntervalRef.current = setInterval(() => {
              if (!canvasRef.current || !videoRef.current || !isActive) return;
              const ctx = canvasRef.current.getContext('2d');
              if (!ctx) return;
              canvasRef.current.width = 640;
              canvasRef.current.height = 360;
              ctx.drawImage(videoRef.current, 0, 0, 640, 360);
              const base64Data = canvasRef.current.toDataURL('image/jpeg', 0.5).split(',')[1];
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } });
              }).catch(() => {});
            }, 500);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => (prev + ' ' + message.serverContent?.outputTranscription?.text).slice(-150));
            }
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onclose: () => terminate(),
          onerror: (err) => { console.error(err); setStatus('Link Error'); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: "You are AYAAX. You are observing the user's screen in real-time. Be a helpful architectural assistant. If you see code, analyze it. If you see complex tasks, guide them. Talk live and be natural."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsInitializing(false);
      setStatus('Access Refused');
    }
  };

  const terminate = () => {
    if (sessionRef.current) try { sessionRef.current.close(); } catch(e) {}
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (screenRef.current) screenRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    audioContextRef.current = null;
    setIsActive(false);
    setIsInitializing(false);
    onClose();
  };

  useEffect(() => {
    return () => terminate();
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-6xl h-[85vh] bg-surface border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-[scaleIn_0.3s]">
        
        {/* Sync Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-neon">
                <Monitor size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Vision Sync Hub</h2>
                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">{status}</p>
             </div>
          </div>
          <button onClick={terminate} className="p-3 hover:bg-white/10 rounded-full text-muted"><X size={24} /></button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Feed Area */}
          <div className="flex-1 bg-black relative flex items-center justify-center p-8">
             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain rounded-3xl border border-white/10 shadow-2xl" />
             <canvas ref={canvasRef} className="hidden" />
             
             {!isActive && !isInitializing && (
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-black/60 backdrop-blur-md px-12 text-center">
                 <Monitor size={64} className="text-muted opacity-20 mb-4" />
                 <div className="space-y-4 max-w-sm">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Vision Handshake Required</h3>
                    <p className="text-[11px] text-muted font-bold uppercase tracking-widest leading-relaxed">Browser security requires manual authorization to stream display data and mic audio simultaneously.</p>
                 </div>
                 <button 
                  onClick={startVisionSync}
                  className="px-16 py-6 bg-white text-black rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[12px] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-glow"
                 >
                   Authorize Vision Link <Power size={18} />
                 </button>
               </div>
             )}

             {isInitializing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/60 backdrop-blur-md">
                   <Loader2 className="animate-spin text-primary" size={48} />
                   <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Synchronizing Neural Pathways...</p>
                </div>
             )}
          </div>

          {/* Controls & Transcription */}
          <div className="w-full md:w-96 border-l border-white/5 bg-black/20 p-10 flex flex-col justify-between">
             <div className="space-y-10">
                <div className="flex flex-col items-center gap-6">
                   <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center relative">
                      <div className={`absolute inset-0 border-2 border-primary/40 rounded-full animate-ping ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                      <Waves size={40} className={isActive ? 'text-primary' : 'text-muted'} />
                   </div>
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse shadow-glow' : 'bg-muted'}`} />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Handshake Active</span>
                   </div>
                </div>

                <div className="h-48 bg-white/5 rounded-[2.5rem] border border-white/5 p-6 italic text-[13px] text-muted leading-relaxed overflow-y-auto no-scrollbar text-center flex items-center justify-center">
                   {transcription || (isInitializing ? "Initializing neural pathways..." : "Awaiting user authorization...")}
                </div>
             </div>

             <div className="space-y-8">
                <div className="flex items-center justify-center gap-6">
                   <button onClick={() => setIsMuted(!isMuted)} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border ${isMuted ? 'bg-brightRed/20 border-brightRed/40 text-brightRed' : 'bg-white/5 border-white/10 text-white'}`}>
                      {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                   </button>
                   <button onClick={terminate} className="w-20 h-20 bg-brightRed text-white rounded-full flex items-center justify-center shadow-neon hover:scale-105 active:scale-95 transition-all">
                      <PhoneOff size={32} />
                   </button>
                </div>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-3">
                   <ShieldCheck size={14} className="text-primary" />
                   <span className="text-[8px] font-black text-muted uppercase tracking-[0.4em]">AYAAX Core Verified</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};