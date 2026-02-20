
import React, { useState } from 'react';
import { 
  X, Cpu, CandlestickChart, Volume2, Palette, Zap, 
  ArrowRight, Activity, Sliders, ShieldCheck, 
  Copy, Target, BarChart, Settings, Mic, Code,
  Smartphone, Database, Layout, Eye, GraduationCap,
  Sparkles, Brain, FileText, Search, Terminal
} from 'lucide-react';

export const OnboardingManual: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "1. NEURAL_ACCESS",
      description: "Welcome to AYAAX. Access the terminal via Guest or Member protocols. Guest sessions are temporary, while Member nodes are vault-secured.",
      icon: <Cpu className="text-primary w-12 h-12" />,
      detail: "Unified System Protocol Synchronized.",
      category: "Initialization"
    },
    {
      title: "2. MARKET_INTEL",
      description: "Switch to 'Market Intel' mode to analyze global markets. Upload charts to the 'BIG UPLOAD' box for high-fidelity technical scrutiny.",
      icon: <CandlestickChart className="text-[#00ff9d] w-12 h-12" />,
      detail: "Supported: Crypto, Stocks, Forex, and Futures.",
      category: "Trading Engine"
    },
    {
      title: "3. RISK_ARCHITECTURE",
      description: "Define custom Stop Loss (SL) and Take Profit (TP) parameters. AYAAX suggests optimal risk levels based on your selected strategy.",
      icon: <Target className="text-brightRed w-12 h-12" />,
      detail: "Adaptive Risk Profiling Active.",
      category: "Trading Engine"
    },
    {
      title: "4. ACCURACY_SCORING",
      description: "Every market analysis includes a 'Confidence Score (%)'. Use this to gauge the probability of technical setups.",
      icon: <BarChart className="text-[#00ff9d] w-12 h-12" />,
      detail: "Probabilistic Neural Weights Linked.",
      category: "Trading Engine"
    },
    {
      title: "5. LINGUISTIC_LENGTH",
      description: "Tune response volume in Settings. Choose between Short (direct), Mid (balanced), or Massive (comprehensive) output density.",
      icon: <Sliders className="text-accent w-12 h-12" />,
      detail: "Output Buffer: Configurable.",
      category: "Customization"
    },
    {
      title: "6. TONAL_PROFILES",
      description: "Modify AYAAX's persona. Select from Professional, Creative, Stoic, or Academic tones to suit your current project requirement.",
      icon: <Database className="text-orange-500 w-12 h-12" />,
      detail: "Linguistic Persona Kernels: Swappable.",
      category: "Customization"
    },
    {
      title: "7. AI_BALANCE",
      description: "Adjust the 'AI Balance' slider from Relaxed (chill) to Motivated (aggressive). This changes the logic flow and intensity of suggestions.",
      icon: <Activity className="text-primary w-12 h-12" />,
      detail: "Neural Tension: Tunable.",
      category: "Customization"
    },
    {
      title: "8. READ_ALOUD",
      description: "Click the 'Read Aloud' button on any model turn to hear high-fidelity text-to-speech synthesis.",
      icon: <Volume2 className="text-pink-500 w-12 h-12" />,
      detail: "TTS Engine: Synchronized.",
      category: "Interaction"
    },
    {
      title: "9. NEURAL_MIC",
      description: "Use the 'Neural Mic' for hands-free voice input. The terminal transcribes your speech with zero-latency linguistic mapping.",
      icon: <Mic className="text-accent w-12 h-12" />,
      detail: "Audio Stream: Decrypted.",
      category: "Interaction"
    },
    {
      title: "10. ART_LAB_SYNTHESIS",
      description: "Synthesize visual artifacts. Use presets like Cyberpunk, Photorealistic, or Anime, or describe your vision from scratch.",
      icon: <Palette className="text-orange-500 w-12 h-12" />,
      detail: "Visual Kernel: Optimized.",
      category: "Creativity"
    },
    {
      title: "11. 4K/8K_RESOLUTION",
      description: "Premium users (GG/AYAAX tiers) unlock 4K and 8K High-Fidelity renders for all Art Lab visual outputs.",
      icon: <Sparkles className="text-yellow-400 w-12 h-12" />,
      detail: "Paid Tiers: Mandatory for 4K+.",
      category: "Creativity"
    },
    {
      title: "12. CODE_ORACLE",
      description: "Use 'Code Oracle' to map logic. Paste snippets for architectural analysis, performance refactoring, and logic debugging.",
      icon: <Terminal className="text-primary w-12 h-12" />,
      detail: "Dev Kernel: Fully Integrated.",
      category: "Engineering"
    },
    {
      title: "13. SECURITY_AUDIT",
      description: "Trigger 'Security Scan' to identify vulnerabilities in code or logic. AYAAX performs a deep-dive threat vector analysis.",
      icon: <ShieldCheck className="text-emerald-500 w-12 h-12" />,
      detail: "Vulnerability Database: Updated.",
      category: "Engineering"
    },
    {
      title: "14. IOT_PREVIEW",
      description: "AYAAX can generate IoT code and preview it instantly in the live Web/Mobile simulator (Web Terminal mode).",
      icon: <Smartphone className="text-accent w-12 h-12" />,
      detail: "Live Rendering: Active.",
      category: "Engineering"
    },
    {
      title: "15. QUICK_SUMMARIZE",
      description: "Use the 'Summarize' action under any message to extract key insights and executive bullet points from massive text.",
      icon: <FileText className="text-muted w-12 h-12" />,
      detail: "Abstraction Protocol: High Efficiency.",
      category: "Productivity"
    },
    {
      title: "16. BASIC_TEXT",
      description: "Need something explained simply? Click 'Basic Text' to convert complex AI jargon into kindergarten-level simplicity.",
      icon: <GraduationCap className="text-primary w-12 h-12" />,
      detail: "Simplification Kernel: Active.",
      category: "Productivity"
    },
    {
      title: "17. DEEP_REASONING",
      description: "Trigger 'Reasoning' to view the internal thought process of the AYAAX. See the logic gates used to reach the final answer.",
      icon: <Brain className="text-accent w-12 h-12" />,
      detail: "Transparent Logic: Enabled.",
      category: "Productivity"
    },
    {
      title: "18. ACCESSIBILITY",
      description: "Toggle 'OpenDyslexic' fonts or 'High Contrast' mode in Settings for a tailored visual experience.",
      icon: <Eye className="text-white w-12 h-12" />,
      detail: "Visual Overrides: Available.",
      category: "System"
    },
    {
      title: "19. SESSION_VAULT",
      description: "Members enjoy persistent session storage. Your chats are encrypted and stored in your personal vault.",
      icon: <Layout className="text-muted w-12 h-12" />,
      detail: "Vault Encryption: 8192-bit.",
      category: "System"
    },
    {
      title: "20. PREMIUM_TIERS",
      description: "Unlock the full power of the AYAAX. Pro, GG, and AYAAX tiers provide unlimited logic capacity and exclusive tools.",
      icon: <Zap className="text-yellow-400 w-12 h-12" />,
      detail: "Pinnacle Intelligence: Unlocked.",
      category: "Finalization"
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="max-w-2xl w-full bg-surface border border-white/10 p-12 rounded-[4rem] shadow-prism relative overflow-hidden animate-[scaleIn_0.3s_ease-out]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <button 
          onClick={onComplete} 
          className="absolute top-8 right-8 text-muted hover:text-white transition-all p-3 hover:bg-white/5 rounded-full"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">{currentStep.category}</span>
          </div>

          <div className="mb-10 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner relative group h-32 flex items-center justify-center">
            <div className="relative z-10">{currentStep.icon}</div>
            <div className="absolute -inset-2 bg-white/10 blur-2xl rounded-full opacity-60 animate-pulse" />
          </div>

          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">{currentStep.title}</h2>
          <p className="text-lg text-muted/80 leading-relaxed mb-8 max-w-md font-medium h-24">{currentStep.description}</p>
          
          <div className="bg-black/40 px-8 py-3 rounded-2xl border border-white/5 mb-10 flex items-center gap-3">
             <Activity size={12} className="text-primary animate-pulse" />
             <span className="text-[9px] font-mono text-white uppercase tracking-widest font-bold">NODE_STATUS: {currentStep.detail}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-12 justify-center max-w-md">
            {steps.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setStep(i)}
                className={`h-1.5 transition-all duration-300 rounded-full ${i === step ? 'w-8 bg-primary shadow-neon' : 'w-1.5 bg-white/10 hover:bg-white/20'}`} 
              />
            ))}
          </div>

          <div className="flex gap-4 w-full">
            <button 
              onClick={onComplete} 
              className="flex-1 py-5 bg-white/5 text-muted hover:text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] border border-white/5 transition-all"
            >
              Skip_Manual
            </button>
            <button 
              onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
              className="flex-1 py-5 bg-white text-black border-4 border-primary rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_0_50px_rgba(var(--primary-rgb),0.8)] flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              {step < steps.length - 1 ? 'Next_Phase' : 'Launch_AYAAX'}
              <ArrowRight size={20} className="animate-[bounce-x_1.5s_infinite]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
