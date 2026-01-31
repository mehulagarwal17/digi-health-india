
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Patient } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeSymptom(symptoms: string[], age: string): Promise<{ diagnosis: string; risk: string }> {
    try {
      const response = await this.ai.models.generateContent({
        // Using Flash for quick initial screening
        model: 'gemini-3-flash-preview',
        contents: `Analyze these symptoms for a patient aged ${age}: ${symptoms.join(', ')}. 
        Provide a very brief probable disease name and a risk level (LOW, MEDIUM, HIGH).`,
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
      console.error("Gemini Error:", error);
      return { diagnosis: "Analysis Unavailable", risk: "MEDIUM" };
    }
  }

  async predictOutbreak(districtData: any): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given this healthcare trend data: ${JSON.stringify(districtData)}, 
        predict if there is a potential disease outbreak. Provide a one-sentence warning if needed.`,
      });
      return response.text || "No immediate outbreak threats detected.";
    } catch (error) {
      return "Outbreak monitoring system currently processing.";
    }
  }

  createClinicalChat(patient: Patient): Chat {
    const context = `
      PATIENT CONTEXT:
      ID: ${patient.id}
      Profile: ${patient.age}y ${patient.gender}, Village: ${patient.village}
      Symptoms: ${patient.symptoms.join(', ')}
      Vitals: Temp ${patient.vitals.temp}°F, Pulse ${patient.vitals.pulse} bpm, BP ${patient.vitals.bp || 'N/A'}
      Risk Score: ${patient.riskLevel}
      Severity: ${patient.severity}
      AI Preliminary Diagnosis: ${patient.aiDiagnosis}
      
      CLINICAL HISTORY:
      ${patient.previousCare ? `
      Last Facility: ${patient.previousCare.lastFacility} (${patient.previousCare.facilityType})
      Prior Diagnosis: ${patient.previousCare.priorDiagnosis}
      Investigations: ${patient.previousCare.investigations.map(i => `${i.test}: ${i.findings}`).join('; ')}
      ` : 'No prior records available.'}
      
      TIMELINE:
      ${patient.clinicalTimeline.map(e => `${e.date}: ${e.note} (${e.recordedBy})`).join('\n')}
    `;

    return this.ai.chats.create({
      // Using Pro for high-stakes clinical reasoning
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `
          You are a professional Clinical Decision Support AI for DIGI-HEALTH INDIA.
          Your role is to assist Government doctors and Medical Officers by analyzing patient context and providing evidence-based suggestions.
          
          STRICT CLINICAL PROTOCOL:
          1. You are NOT a diagnostic AI. Defer all final decisions to the human doctor.
          2. Maintain a professional, calm, medically literate, and supportive tone.
          3. Structure responses with bullet points and short reasoning.
          4. SAFETY: Never prescribe medications, dosages, or give definitive diagnoses.
          5. Use phrases like "May consider", "Could indicate", "Clinical correlation required".
          6. Highlight red flags and mention guideline-based criteria.
          7. Be concise. Do not use excessive medical jargon.
          
          CURRENT PATIENT CONTEXT:
          ${context}
        `,
        temperature: 0.3, // Lower temperature for more consistent medical reasoning
      },
    });
  }
}

export const gemini = new GeminiService();
