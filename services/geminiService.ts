import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini AI client
// NOTE: In a real production app, you might want to proxy this through a backend 
// to avoid exposing keys, but for this client-side demo, we use env vars directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-2.5-flash';

export const generateRandomQuestion = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: "Generate a single, short, fun, spicy, or deep anonymous question to ask a friend on social media. Keep it under 15 words. Just the question, no quotes.",
      config: {
        temperature: 1.2, // High creativity
        maxOutputTokens: 50,
      }
    });
    return response.text?.trim() || "What's your biggest secret?";
  } catch (error) {
    console.error("Gemini Dice Error:", error);
    return "What is your favorite memory of us?"; // Fallback
  }
};

export const generateWittyReply = async (messageText: string, tone: 'funny' | 'roast' | 'wholesome'): Promise<string> => {
  try {
    let systemInstruction = "You are a cool, Gen Z social media user replying to anonymous messages.";
    if (tone === 'funny') systemInstruction += " Be witty and hilarious.";
    if (tone === 'roast') systemInstruction += " Roast them gently but savagely.";
    if (tone === 'wholesome') systemInstruction += " Be sweet, supportive, and kind.";

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Reply to this anonymous message: "${messageText}". Keep it short (under 20 words) and suitable for an Instagram Story sticker.`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 1,
      }
    });
    return response.text?.trim() || "Haha, good one!";
  } catch (error) {
    console.error("Gemini Reply Error:", error);
    return "That's interesting! tell me more.";
  }
};