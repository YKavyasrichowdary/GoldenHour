
import { GoogleGenAI } from "@google/genai";
import { Vitals, Severity } from "../types";

/**
 * Analyzes an emergency medical case to provide clinical summaries and recommendations.
 * Uses gemini-3-pro-preview for advanced reasoning in clinical scenarios.
 */
export const analyzeMedicalCase = async (vitals: Vitals, notes: string, severity: Severity) => {
  // Initializing GoogleGenAI directly with the environment API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this emergency medical case:
    Vitals: Pulse ${vitals.pulse}, BP ${vitals.bp_sys}/${vitals.bp_dia}, SpO2 ${vitals.spo2}%, Temp ${vitals.temp}C.
    Severity: ${severity}
    Notes: ${notes}

    Provide a concise emergency-ready medical summary and specific hospital preparation recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an emergency medicine AI specialist. Convert messy notes into structured summaries and detect critical risks. Be direct, professional, and clinical.",
      },
    });
    
    // Accessing .text property directly as per SDK requirements
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error generating AI summary. Please proceed with manual triage.";
  }
};

/**
 * Generates physical clues to help police match unknown patients with missing persons records.
 */
export const getPoliceIdentityClues = async (description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    A patient of unknown identity was found with the following description:
    "${description}"
    
    List potential demographic indicators or physical clues that could assist police in matching missing persons records.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });
    // Accessing .text property directly as per SDK requirements
    return response.text;
  } catch (error) {
    console.error("Gemini Identity Clues Error:", error);
    return "No AI clues generated.";
  }
};
