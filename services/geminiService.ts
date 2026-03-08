
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Service to interact with the Gemini AI model for academic tutoring.
 * Strictly follows SDK guidelines for initialization and content generation.
 */
export const getAIResponse = async (userPrompt: string, systemInstruction?: string, isJson: boolean = false) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const config: any = {
      systemInstruction: systemInstruction || "You are an expert academic tutor for EduBoost AI. Your goal is to explain complex concepts simply and help students with their homework and study questions. Always be encouraging, accurate, and provide examples.",
      temperature: 0.7,
      topP: 0.9,
    };

    if (isJson) {
      config.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: config
    });

    return response.text || (isJson ? "[]" : "I'm sorry, I couldn't generate a response at this moment.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return isJson ? "[]" : "Something went wrong. Please check your connection and try again.";
  }
};
