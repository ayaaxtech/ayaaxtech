
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, CreditCard, Brain, Smile, Calculator, BookOpen, 
  FileText, Target, Users, Image as ImageIcon,
  ChevronRight, ArrowRight, Plus, Trash2, CheckCircle2,
  Trophy, School, Baby
} from 'lucide-react';
import { getTranslation } from '../translations';
import { ChatMode } from '../types';

interface ExtrasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (prompt: string, mode: ChatMode) => void;
  language: string;
}

export const ExtrasModal: React.FC<ExtrasModalProps> = ({ isOpen, onClose, onAction, language }) => {
  const [goals, setGoals] = useState<{id: string, text: string, done: boolean}[]>([]);
  const [newGoal, setNewGoal] = useState('');
  
  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    const savedGoals = localStorage.getItem('krypto_ai_goals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    localStorage.setItem('krypto_ai_goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, { id: Date.now().toString(), text: newGoal.trim(), done: false }]);
    setNewGoal('');
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  if (!isOpen) return null;

  const EXTRAS_TOOLS = [
    { id: 'flashcard', label: t('flashcardMaker'), icon: CreditCard, color: 'text-blue-400', prompt: "Act as a study assistant. Create a set of 5 educational flashcards for the topic of: ", mode: 'chat' },
    { id: 'joke', label: t('jokeDay'), icon: Smile, color: 'text-yellow-400', prompt: "Tell me a highly creative and funny joke of the day.", mode: 'chat' },
    { id: 'math', label: t('mathSolver'), icon: Calculator, color: 'text-purple-400', prompt: "Solve this math problem step-by-step with clear explanations: ", mode: 'logic' },
    { id: 'homework', label: t('homeworkHelper'), icon: BookOpen, color: 'text-emerald-400', prompt: "Help me with my homework. Explain this concept simply: ", mode: 'chat' },
    { id: 'summarize', label: t('summarizor'), icon: FileText, color: 'text-zinc-400', prompt: "Summarize the following text into key insights: ", mode: 'chat' },
    { id: 'vision', label: t('imageRecognition'), icon: ImageIcon, color: 'text-pink-400', prompt: "Analyze this image and describe every detail you see.", mode: 'image' },
  ];

  const ROLES = [
    { id: 'coach', label: t('coachRole'), icon: Trophy, color: 'text-orange-500', prompt: "You are a professional life coach. Motivate me and help me plan my next steps." },
    { id: 'teacher', label: t('teacherRole'), icon: School, color: 'text-blue-500', prompt: "You are a highly experienced teacher. Explain things clearly and test my knowledge." },
    { id: 'kid', label: t('kidRole'), icon: Baby, color: 'text-pink-500', prompt: "You are a friendly companion for kids. Explain everything in a fun, simple way that a child would love." },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-[fadeIn_0.3s]">
      <div className="w-full max-w-5xl h-[85vh] bg-surface border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-[scaleIn_0.3s]">
        
        <div className="w-full md:w-80 bg-black/40 border-r border-white/5 p-8 flex flex-col overflow-y-auto no-scrollbar">
           <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{t('goalTracking')}</h2>
              </div>
           </div>

           <div className="space-y-4 mb-12">
              <div className="flex gap-2">
                 <input 
                    value={newGoal} 
                    onChange={e => setNewGoal(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && addGoal()}
                    placeholder={t('enterGoal')}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white focus:border-primary outline-none"
                 />
                 <button onClick={addGoal} className="p-2 bg-primary text-black rounded-xl hover:bg-white transition-all"><Plus size={16} /></button>
              </div>
              <div className="space-y-2">
                 {goals.map(goal => (
                   <div key={goal.id} className="group flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <button onClick={() => toggleGoal(goal.id)} className="flex items-center gap-3 flex-1 min-w-0">
                         <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${goal.done ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                            {goal.done && <CheckCircle2 size={12} className="text-black" />}
                         </div>
                         <span className={`text-[10px] font-bold uppercase truncate tracking-widest ${goal.done ? 'text-muted line-through' : 'text-text'}`}>{goal.text}</span>
                      </button>
                      <button onClick={() => deleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-brightRed transition-all"><Trash2 size={12} /></button>
                   </div>
                 ))}
                 {goals.length === 0 && <p className="text-[8px] text-muted text-center uppercase tracking-widest py-4">No goals tracked</p>}
              </div>
           </div>

           <div className="mt-auto space-y-6">
              <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.4em] mb-4">{t('roleModels')}</h3>
              <div className="space-y-2">
                 {ROLES.map(role => (
                   <button 
                    key={role.id} 
                    onClick={() => { onAction(role.prompt, 'chat'); onClose(); }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all text-left group"
                   >
                      <div className={`p-2 rounded-xl bg-white/5 ${role.color} group-hover:scale-110 transition-transform`}><role.icon size={18} /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-text">{role.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col bg-black/20 overflow-hidden relative">
          <header className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse` } />
               <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">{t('extras')} Menu</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-muted"><X size={20} /></button>
          </header>

          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXTRAS_TOOLS.map((tool) => (
              <button 
                key={tool.id} 
                onClick={() => { onAction(tool.prompt, tool.mode as ChatMode); onClose(); }}
                className="group p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-primary/50 hover:bg-primary/5 transition-all text-left flex flex-col items-start shadow-inner relative overflow-hidden"
              >
                <div className={`p-4 rounded-2xl bg-white/5 mb-6 ${tool.color} group-hover:scale-110 group-hover:shadow-glow transition-all`}>
                  <tool.icon size={28} />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{tool.label}</h3>
                <div className="mt-auto w-full py-4 border-t border-white/5 flex items-center justify-between group-hover:text-primary transition-colors">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Initialize Protocol</span>
                  <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>

          <div className="p-8 border-t border-white/5 bg-black/40 flex justify-center">
            <span className="text-[8px] font-black text-muted uppercase tracking-[0.6em]">AYAAX Auxiliary Systems</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
