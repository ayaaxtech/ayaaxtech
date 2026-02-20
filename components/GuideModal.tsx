
import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Info, Layout, MousePointer2, Search, Wand2, Hammer, BarChart3, Sun, 
  Settings, Mic, ImageIcon, Video, Rocket, Plus, PhoneCall, Palette, 
  Power, HelpCircle, Pin, Trash2, Clock, Play, StopCircle, ChevronDown,
  Terminal, Brain, ShieldAlert, Cpu, Hash, Globe, MessageSquare,
  Activity, Flame, FileText
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FULL_DIRECTORY = [
  {
    region: 'TOP HEADER BAR (LEFT TO RIGHT)',
    items: [
      { name: 'Sidebar Toggle', location: 'Top Left Corner', icon: Layout, desc: 'A square button that collapses or expands the left-hand menu. Use this to give yourself more space for deep work.' },
      { name: 'Neural Search Input', location: 'Top Header Center-Left', icon: Search, desc: 'The main command bar. Type here to find tools like the PowerPoint builder or to trigger a global web-grounded intelligence sweep.' },
      { name: 'Session Title Display', location: 'Top Header Middle', icon: MessageSquare, desc: 'Shows the current neural protocol name. It updates automatically based on your first command but acts as a visual anchor for your current thread.' },
      { name: 'Neural Link Indicator', location: 'Below Session Title', icon: Activity, desc: 'A pulsing emerald dot. If it is green, you are synchronized with the Gemini 3 logic core. If red, the handshake is lost.' },
      { name: 'Live Neural Clock', location: 'Top Header Center-Right', icon: Clock, desc: 'Displays your local synchronized time and timezone. Click the numbers to toggle between 12-hour and 24-hour binary formats.' },
      { name: 'Auto App Builder (Hammer)', location: 'Top Header Right #1', icon: Hammer, desc: 'Opens the Forge. This button allows you to build your own custom AI personas with unique logic kernels and personalized icons.' },
      { name: 'Asset Factory (Wand)', location: 'Top Header Right #2', icon: Wand2, desc: 'The conversion gateway. Click this to transform files (like PDF to Word) or synthesize entirely new spreadsheets and presentations from scratch.' },
      { name: 'AI Leaderboards (Charts)', location: 'Top Header Right #3', icon: BarChart3, desc: 'Displays live benchmark data. This allows you to see how Entity stacks up against other models like Kimi or Claude in real-time.' },
      { name: 'Theme Switcher (Sun/Moon)', location: 'Top Header Right #4', icon: Sun, desc: 'Toggles between Obsidian Dark (Deep Black) and High-Contrast Light (Pure White) modes. Essential for varying light environments.' },
      { name: 'Hearth Controls (Settings)', location: 'Top Header Right #5', icon: Settings, desc: 'The master configuration button. Change Entity’s voice, personality, language, and accessibility settings here.' },
      { name: 'System Directory (Help)', location: 'Top Header Right #6', icon: HelpCircle, desc: 'The guide you are viewing now. Explains every single interaction point on the screen.' }
    ]
  },
  {
    region: 'LEFT SIDEBAR (TOP TO BOTTOM)',
    items: [
      { name: 'Entity Core Logo', location: 'Sidebar Top Left', icon: Cpu, desc: 'The pulsing wavy logo. Clicking this resets your view to the main landing protocol while keeping your session memory intact.' },
      { name: 'Call Entity (Mic)', location: 'Sidebar Top Left Block', icon: PhoneCall, desc: 'Initializes a voice-only neural link. This opens a dedicated screen for real-time, zero-latency spoken conversation.' },
      { name: 'Art Lab (Palette)', location: 'Sidebar Top Right Block', icon: Palette, desc: 'Opens the visual synthesis registry. Access pre-made cyberpunk or cinematic templates and view your history of generated images.' },
      { name: 'Quick Tour (Play)', location: 'Sidebar Middle', icon: Play, desc: 'A large pill-shaped button that launches a cinematic video walkthrough. Perfect for new operators to understand the system flow.' },
      { name: 'New Protocol (Plus)', location: 'Sidebar Middle-Bottom', icon: Plus, desc: 'A large black/white button. Click this to clear the current workspace and begin a fresh intelligence thread from scratch.' },
      { name: 'System Memory (List Items)', location: 'Sidebar Scroll Area', icon: Info, desc: 'A vertical list of your past conversations. Click any title to instantly restore that specific logic state.' },
      { name: 'Pin Protocol (Pin)', location: 'Next to Memory Items', icon: Pin, desc: 'Small icon on each saved session. Clicking it sticks that thread to the top of your memory so it never gets lost.' },
      { name: 'Delete Protocol (Trash)', location: 'Next to Memory Items', icon: Trash2, desc: 'Small red-hover icon. Permanently purges a specific session from your local vault. Warning: This cannot be undone.' },
      { name: 'Exit Core (Power)', location: 'Sidebar Bottom', icon: Power, desc: 'The log-out button. Terminates the active handshake and returns you to the login gateway.' }
    ]
  },
  {
    region: 'MAIN COMMAND GRID (CENTER SCREEN)',
    items: [
      { name: 'Deep Search', location: 'Center Grid #1', icon: Search, desc: 'Specifically triggers a web-grounded search protocol to give you real-time data with clickable website links.' },
      { name: 'Logic Chain', location: 'Center Grid #2', icon: Brain, desc: 'Forces Entity to think through a problem step-by-step, showing its internal reasoning process as it works.' },
      { name: 'Entity Analyst', location: 'Center Grid #3', icon: BarChart3, desc: 'Optimized for heavy data. Produces structured reports with tables, bullet points, and analytical research.' },
      { name: 'Art Synth', location: 'Center Grid #4', icon: ImageIcon, desc: 'Shortcut to the image generation engine. Tell Entity what to draw and it will synthesize it instantly.' },
      { name: 'The Beast', location: 'Center Grid #5', icon: Flame, desc: 'The elite coding protocol. Use this for building apps, debugging architecture, or writing complex engineering logic.' },
      { name: 'Security Audit', location: 'Center Grid #6', icon: ShieldAlert, desc: 'Scans text or code for vulnerabilities, logic flaws, or social engineering risks.' },
      { name: 'Polyglot Hub', location: 'Center Grid #7', icon: Globe, desc: 'A dedicated translation trigger. Converts any input into multiple major world languages simultaneously.' },
      { name: 'Data Digest', location: 'Center Grid #8', icon: FileText, desc: 'The summarization engine. Paste massive text and this button will distill it into a short executive summary.' }
    ]
  },
  {
    region: 'COMMAND INPUT LAYER (BOTTOM BAR)',
    items: [
      { name: 'Mode Selector', location: 'Input Left Side', icon: ChevronDown, desc: 'A dropdown that allows you to switch Entity’s core behavior. Switch between "Analyst", "Swarm Agents", "Beast Mode", and "Artist".' },
      { name: 'Neural Voice Input', location: 'Input Middle-Left', icon: Mic, desc: 'The microphone button. Click to speak your commands; Entity will transcribe them into text with high precision.' },
      { name: 'Visual Sync (Image)', location: 'Input Middle', icon: ImageIcon, desc: 'Attach pictures here. Entity will use its neural vision to analyze the image, read text from it, or describe what it sees.' },
      { name: 'Neural Video (Video)', location: 'Input Middle', icon: Video, desc: 'Attach MP4/MOV files. Uses Gemini Pro to analyze video frames for key information and scene-by-scene understanding.' },
      { name: 'Attachment Removal (X)', location: 'Top of Attached File', icon: X, desc: 'Appears only when a file is attached. Clicking this flushes the file from the current buffer before you send.' },
      { name: 'Command Pulse (Rocket)', location: 'Input Right Side', icon: Rocket, desc: 'The main execution button. Sends your text and files into the core logic engine to receive a response.' },
      { name: 'Stop Sync (Stop Circle)', location: 'Input Right Side (While Generating)', icon: StopCircle, desc: 'Appears only when Entity is speaking. Click to immediately halt the output stream and free up neural resources.' }
    ]
  }
];

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[6000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-4xl h-full max-h-[90vh] bg-surface border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-[scaleIn_0.3s]">
        
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow">
              <HelpCircle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">System Interface Mapping</h2>
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.5em] mt-1">Full Command Directory // Unified Interface</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all text-muted hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-16">
          {FULL_DIRECTORY.map((section, sIdx) => (
            <div key={sIdx} className="space-y-10">
              <div className="flex items-center gap-4">
                 <h3 className="text-[12px] font-black text-primary uppercase tracking-[0.6em] whitespace-nowrap">{section.region}</h3>
                 <div className="h-px flex-1 bg-white/5" />
              </div>
              
              <div className="space-y-12">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="group flex flex-col md:flex-row gap-6 items-start border-l-2 border-transparent hover:border-primary/40 pl-6 transition-all">
                    <div className="p-4 bg-white/5 rounded-2xl text-muted group-hover:text-primary transition-colors group-hover:scale-110 shrink-0">
                      <item.icon size={22} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <h4 className="text-[13px] font-black text-white uppercase tracking-widest">{item.name}</h4>
                        <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest border border-primary/20 px-2 py-0.5 rounded-md">
                          {item.location}
                        </span>
                      </div>
                      <p className="text-[14px] text-muted font-medium leading-relaxed max-w-2xl">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-10 pt-10 border-t border-white/5">
             <div className="flex items-center gap-4">
                <h3 className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.6em] whitespace-nowrap">HIDDEN INTERACTION PROTOCOLS</h3>
                <div className="h-px flex-1 bg-white/5" />
             </div>
             <div className="space-y-8">
               <div className="pl-6 space-y-2">
                 <h4 className="text-[13px] font-black text-white uppercase tracking-widest">Code Instance Toggle</h4>
                 <p className="text-[14px] text-muted font-medium leading-relaxed">Inside a Beast Mode response, use the "Source" and "Instance" buttons at the top right of the code block to switch between raw text and a live, running preview of the application.</p>
               </div>
               <div className="pl-6 space-y-2">
                 <h4 className="text-[13px] font-black text-white uppercase tracking-widest">Agent Swarm Tuning</h4>
                 <p className="text-[14px] text-muted font-medium leading-relaxed">In "Entity's Agents" mode, click the Settings icon on any individual agent bubble to change its specific tone, intelligence depth, or processing speed on the fly.</p>
               </div>
               <div className="pl-6 space-y-2">
                 <h4 className="text-[13px] font-black text-white uppercase tracking-widest">Direct File Conversion</h4>
                 <p className="text-[14px] text-muted font-medium leading-relaxed">Inside the Asset Factory, attaching a file automatically switches the system into "Conversion" mode, allowing you to re-architect that specific file into any other supported format.</p>
               </div>
             </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/40 flex justify-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <MousePointer2 size={12} className="text-emerald-500" />
               <span className="text-[9px] font-black text-muted uppercase tracking-widest">Unified Map Verified</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Entity Intelligence Network v4.0.5</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
