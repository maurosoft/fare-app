
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const DEFAULT_SYSTEM_INSTRUCTION = `
Sei "Alex", il Senior App Consultant di "Fare App", l'agenzia web d'élite specializzata nello sviluppo di applicazioni mobili Native per iOS e Android.
Rispondi sempre in Italiano.
`;

export class GeminiService {
  private getApiKey(): string | undefined {
    // Vite inietta la variabile definita nel config
    const key = process.env.API_KEY;
    return (key && key !== "undefined" && key !== "") ? key : undefined;
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
          message: "[v14.0] ERRORE: Chiave API non iniettata. Controlla le Environment Variables su Vercel e riesegui il deploy." 
        };
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Test build v14.',
      });
      
      if (response && response.text) {
        return { success: true, message: "[v14.0] Alex AI è ONLINE!" };
      }
      return { success: false, message: "[v14.0] Errore risposta." };
    } catch (error: any) {
      return { success: false, message: `[v14.0] ERRORE GOOGLE: ${error.message}` };
    }
  }

  async getChatResponse(history: ChatMessage[], message: string): Promise<string> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) return "Servizio AI in manutenzione. Scrivi a info@fareapp.it";

      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: this.getSystemInstruction() }
      });

      const result = await chat.sendMessage({ message });
      return result.text || "Spiacente, riprova più tardi.";
    } catch (error) {
      return "Spiacente, ho un problema di connessione.";
    }
  }
}

export const geminiService = new GeminiService();
