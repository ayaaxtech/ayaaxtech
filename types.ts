
export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export type PlanTier = 'free' | 'pro' | 'gg' | 'ayaax' | 'therion';
export type OutputQuality = 'standard' | 'hd' | '2k' | '4k' | '8k';
export type ChatMode = 'chat' | 'logic' | 'image' | 'search' | 'maps' | 'beast' | 'abc' | 'builder' | 'analyst';
export type RewriteStyle = 'Fix' | 'Clear' | 'Formal' | 'Short' | 'Detailed' | 'Friendly' | 'Smart';

export interface ForgeConfig {
  style: 'Casual' | 'Professional' | 'Academic' | 'Technical' | 'Creative';
  tone: 'Confident' | 'Friendly' | 'Humble' | 'Assertive';
  length: 'Shorten' | 'Maintain' | 'Expand';
  level: 'Beginner' | 'Standard' | 'Expert';
  importance: 'Low' | 'Medium' | 'High';
  domain: 'General' | 'Business' | 'Academic' | 'Technical' | 'Creative' | 'Casual';
  intent: 'Inform' | 'Persuade' | 'Describe' | 'Argue' | 'Entertain';
}

export interface CorrectnessInsight {
  issue: string;
  correction: string;
  advantage: string;
  category: 'Correctness' | 'Clarity' | 'Engagement' | 'Delivery';
  severity: 'Critical' | 'Suggestion';
}

export interface LocalMistake {
  word: string;
  suggestion: string;
  index: number;
}

export interface AgentConfig {
  id: string;
  name: string;
  tone: string;
  avatar: string;
  intelligence: number;
  speed: number;
  content: string;
  status: 'idle' | 'processing' | 'done';
}

export interface CustomAppConfig {
  id: string;
  name: string;
  tagline: string;
  prompt: string;
  color: string;
  iconName: string;
  intelligence: number;
  speed: number;
}

export interface MessageMetadata {
  timeframe?: string;
  language?: string;
  thinkingBudget?: number;
  task?: string;
  indicators?: string[];
  riskProfile?: string;
  tradeType?: string;
  nexusNodes?: AgentConfig[];
  customApp?: CustomAppConfig;
  intentHypothesis?: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
  imageUrl?: string;
  mode?: ChatMode;
  metadata?: MessageMetadata;
  groundingLinks?: { uri: string; title: string }[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  isPinned?: boolean;
}

export interface UserUsage {
  imageGenerationsToday: number;
  lastImageGenTimestamp: number;
  appBuilderCredits: number;
  totalAppsCreated: number;
}

export interface UserSettings {
  tone: string;
  personality: string;
  aiBalance: 'Relaxed' | 'Balanced' | 'Motivated';
  prioritize: 'Speed' | 'Accuracy';
  outputFormat: 'Paragraphs' | 'Bullets' | 'Both';
  language: string;
  dyslexiaFont: boolean;
  highContrast: boolean;
  theme: string;
  primaryColor: string; 
  tier: PlanTier;
  textSize?: 'Small' | 'Medium' | 'Large';
  viewMode?: 'Compact' | 'Spaced';
  isSetupComplete?: boolean;
  explanationStyle?: string;
  homeworkShield?: boolean;
  iotComfortLevel: number; 
  predictiveShield: boolean;
  regretPrevention: boolean;
  socialIntelligence: boolean;
  usage: UserUsage;
}

export interface ImageHistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  aspectRatio: string;
  style?: string;
  mood?: string;
  lighting?: string;
  timestamp: number;
}

export interface Archetype {
  id: string;
  name: string;
  icon: string;
  config: Partial<UserSettings>;
}

export interface CertificateData {
  name: string;
  date: string;
  reason: string;
  theme: 'hacker' | 'sky' | 'gold' | 'beast' | 'pink' | 'reaper';
  isSuccess: boolean;
  customTitle?: string;
}
