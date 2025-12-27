
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const DEFAULT_SYSTEM_INSTRUCTION = `
Sei "Zap", il consulente di "Fare App", l'agenzia specializzata nella realizzazione di App per iOS ed Android.
Sei bravo a suggerire il tipo di app necessaria al negozio o professionista e quanto è utile per la crescita.
Suggerisci le varie funzioni ecc. 
Rispondi sempre in Italiano.
`;

export class GeminiService {
  private getSystemInstruction(): string {
    return localStorage.getItem('fareapp_chatbot_prompt') || DEFAULT_SYSTEM_INSTRUCTION;
  }

  // Check if API KEY is available via process.env.API_KEY as per guidelines
  getKeyStatus() {
    const key = process.env.API_KEY;
    if (!key || key === "undefined") return { status: 'missing' as const, length: 0, env: 'Non Rilevata' };
    return { status: 'ok' as const, length: key.length, env: 'Attiva' };
  }

  // Fix: Initialize GoogleGenAI with named parameter and use ai.models.generateContent
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!process.env.API_KEY) {
        return { 
          success: false, 
          message: "[v14.0] ERRORE: Chiave API non iniettata. Controlla le Environment Variables su Vercel e riesegui il deploy." 
        };
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

  // Fix: Correctly map history and message to parts, using ai.models.generateContent for multi-turn chat
  async getChatResponse(history: ChatMessage[], message: string): Promise<string> {
    try {
      if (!process.env.API_KEY) return "Servizio AI in manutenzione. Scrivi a info@fareapp.it";

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: { systemInstruction: this.getSystemInstruction() }
      });

      return response.text || "Spiacente, riprova più tardi.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Spiacente, ho un problema di connessione.";
    }
  }
}

export const geminiService = new GeminiService();
