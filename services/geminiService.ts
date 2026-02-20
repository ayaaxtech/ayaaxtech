
import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";
import { Message, Role, ChatMode, UserSettings, MessageMetadata, RewriteStyle, ForgeConfig, CorrectnessInsight } from "../types";

// Safe API Key access for Vite/Netlify
const getAi = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    console.error("AYAAX CORE: API_KEY is missing. Set it in Netlify Environment Variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

const MODELS = {
  BASIC: 'gemini-flash-latest',
  COMPLEX: 'gemini-3-pro-preview',
  IMAGE: 'gemini-2.5-flash-image',
  TTS: 'gemini-2.5-flash-preview-tts',
  MAPS: 'gemini-2.5-flash'
};

let audioContext: AudioContext | null = null;

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
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
}

export const ensureAudioContext = async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  return audioContext;
};

export const speak = async (text: string, voiceName: string = 'Kore', language: string = 'English') => {
  try {
    const ai = getAi();
    const ctx = await ensureAudioContext();
    const response = await ai.models.generateContent({
      model: MODELS.TTS,
      contents: [{ parts: [{ text: `Language: ${language}. Output text: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts[0]?.inlineData?.data;
    if (base64Audio) {
      const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    }
  } catch (err) {
    console.error("Speech Synthesis Failed", err);
  }
};

async function withRetry<T>(fn: () => Promise<T>, retries = 1, delay = 500): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const generateResponse = async (
  history: Message[],
  userMessage: string,
  mode: ChatMode,
  onChunk: (text: string) => void,
  onGrounding: (links: { uri: string; title: string }[]) => void,
  onImage?: (url: string) => void,
  settings?: UserSettings,
  metadata?: MessageMetadata,
  imageInput?: string
): Promise<string> => {
  return withRetry(async () => {
    const ai = getAi();
    const lang = settings?.language || 'English';
    const systemInstruction = `You are AYAAX, a top-tier neural core. Tone: Cool, intelligent, markdown-only. Language: Strictly ${lang}.`;

    const model = (mode === 'image') ? MODELS.IMAGE : 
                  (mode === 'maps') ? MODELS.MAPS :
                  (mode === 'logic' || mode === 'beast' || mode === 'analyst' || mode === 'builder' || !!imageInput) ? MODELS.COMPLEX : 
                  MODELS.BASIC;

    // 1. Build a sanitized, strictly alternating contents array
    const contents: any[] = [];
    let lastRole: string | null = null;

    // Filter out messages that are empty, errors, or currently streaming
    const validHistory = history.filter(m => m.content && m.content.trim() !== "" && !m.isStreaming && !m.isError);

    for (const m of validHistory) {
      const role = m.role === Role.USER ? 'user' : 'model';
      
      // The history MUST start with 'user'
      if (contents.length === 0 && role !== 'user') continue;

      // Roles MUST alternate user -> model -> user
      if (role !== lastRole) {
        contents.push({
          role,
          parts: [{ text: m.content }]
        });
        lastRole = role;
      }
    }

    // Prepare current prompt parts
    const currentParts: any[] = [{ text: userMessage.trim() || "Analyze" }];
    if (imageInput) {
      const [mimeInfo, base64Data] = imageInput.split(',');
      const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || 'image/png';
      currentParts.push({ inlineData: { data: base64Data, mimeType } });
    }

    // Final check: if history ends with 'user', we remove it because our NEW message is also 'user'
    if (lastRole === 'user') {
      contents.pop();
    }

    contents.push({
      role: 'user',
      parts: currentParts
    });

    const config: any = { systemInstruction };
    if (mode === 'search' || mode === 'analyst') config.tools = [{ googleSearch: {} }];
    else if (mode === 'maps') config.tools = [{ googleMaps: {} }];

    let fullText = "";
    const responseStream = await ai.models.generateContentStream({ model, contents, config });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
      
      const grounding = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (grounding) {
        const links = grounding.map((c: any) => {
          if (c.web) return { uri: c.web.uri, title: c.web.title };
          if (c.maps) return { uri: c.maps.uri, title: c.maps.title };
          return null;
        }).filter(Boolean);
        if (links.length > 0) onGrounding(links);
      }

      if (mode === 'image' && onImage) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const p of parts) {
            if (p.inlineData) onImage(`data:${p.inlineData.mimeType};base64,${p.inlineData.data}`);
          }
        }
      }
    }

    return fullText;
  });
};

export const auditCorrectness = async (text: string): Promise<CorrectnessInsight[]> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: MODELS.BASIC,
      contents: [{ role: 'user', parts: [{ text: `Audit for correctness: "${text}"` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              issue: { type: Type.STRING },
              correction: { type: Type.STRING },
              advantage: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['Correctness', 'Clarity', 'Engagement', 'Delivery'] },
              severity: { type: Type.STRING, enum: ['Critical', 'Suggestion'] }
            },
            required: ["issue", "correction", "advantage", "category", "severity"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch { return []; }
};

export const rewriteInput = async (text: string, history: Message[], config?: ForgeConfig): Promise<string> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: MODELS.BASIC,
      contents: [{ role: 'user', parts: [{ text: `Rewrite professionally: "${text}"` }] }],
      config: { systemInstruction: "You are the AYAAX Forge. Output ONLY the polished result." }
    });
    return response.text || text;
  } catch { return text; }
};
