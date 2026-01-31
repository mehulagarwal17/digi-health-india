
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { Patient } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeSymptom(symptoms: string[], age: string): Promise<{ diagnosis: string; risk: string }> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these symptoms for a patient aged ${age}: ${symptoms.join(', ')}. 
        Provide a disease name and risk level (LOW, MEDIUM, HIGH).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnosis: { type: Type.STRING },
              risk: { type: Type.STRING }
            },
            required: ["diagnosis", "risk"]
          }
        }
      });
      return JSON.parse(response.text || '{"diagnosis": "Inconclusive", "risk": "LOW"}');
    } catch (error) {
      return { diagnosis: "Analysis Unavailable", risk: "MEDIUM" };
    }
  }

  async analyzeVision(base64Image: string, symptoms: string[]): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: `Analyze this clinical image alongside symptoms: ${symptoms.join(', ')}. Provide a 2-sentence visual assessment for a medical officer.` }
          ]
        }
      });
      return response.text || "Vision analysis failed to process.";
    } catch (error) {
      return "Unable to perform vision analysis.";
    }
  }

  async searchMedicalKnowledge(query: string): Promise<{ text: string; sources: any[] }> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide the latest clinical guidelines or news for: ${query}. Focus on 2024-2025 protocols.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return {
        text: response.text || "No information found.",
        sources: sources
      };
    } catch (error) {
      return { text: "Search service unavailable.", sources: [] };
    }
  }

  createClinicalChat(patient: Patient): Chat {
    const context = `
      PATIENT CONTEXT:
      ID: ${patient.id}, Symptoms: ${patient.symptoms.join(', ')}
      Vitals: ${patient.vitals.temp}°F, ${patient.vitals.pulse} bpm
      AI Preliminary Diagnosis: ${patient.aiDiagnosis}
    `;

    return this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are a professional CDSS AI for Digi-Health India. Provide medical guidance based on context: ${context}.`,
        temperature: 0.3,
      },
    });
  }
}

export const gemini = new GeminiService();
