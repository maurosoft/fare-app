
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const DEFAULT_SYSTEM_INSTRUCTION = `
Sei "Alex", il Senior App Consultant di "Fare App", l'agenzia web d'élite specializzata nello sviluppo di applicazioni mobili Native per iOS e Android.
Rispondi sempre in Italiano.
`;

export class GeminiService {
  private getApiKey(): string | undefined {
    try {
      // @ts-ignore
      const key = process.env.API_KEY || import.meta.env.VITE_API_KEY;
      return key && key !== "undefined" ? key : undefined;
    } catch {
      return undefined;
    }
  }

  private getSystemInstruction(): string {
    return localStorage.getItem('fareapp_chatbot_prompt') || DEFAULT_SYSTEM_INSTRUCTION;
  }

  getKeyStatus() {
    const key = this.getApiKey();
    if (!key) return { status: 'missing' as const, length: 0, env: 'Non Rilevata' };
    return { status: 'ok' as const, length: key.length, env: 'Attiva' };
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const apiKey = this.getApiKey();
      
      if (!apiKey) {
        return { 
          success: false, 
          message: "[v13.0] ERRORE: Chiave API assente. Assicurati che API_KEY sia nelle Environment Variables di Vercel e fai un Redeploy senza cache." 
        };
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Test connessione v13.',
      });
      
      if (response && response.text) {
        return { success: true, message: "[v13.0] ONLINE! L'intelligenza artificiale Alex è connessa correttamente." };
      }
      return { success: false, message: "[v13.0] Errore di comunicazione con Google." };
    } catch (error: any) {
      return { success: false, message: `[v13.0] ERRORE: ${error.message}` };
    }
  }

  async getChatResponse(history: ChatMessage[], message: string): Promise<string> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) return "Servizio AI non configurato. Scrivi a info@fareapp.it";

      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: this.getSystemInstruction() }
      });

      const result = await chat.sendMessage({ message });
      return result.text || "Spiacente, non ho una risposta al momento.";
    } catch (error) {
      return "Spiacente, Alex ha un problema di connessione temporaneo.";
    }
  }
}

export const geminiService = new GeminiService();
