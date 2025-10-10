import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getGeminiAnswer = async (question) => {
  try {
    const prompt = `Answer the following: ${question}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are a friendly assistant.",
      },
    });
    return response.text || "No response from AI";
  } catch (error) {
    console.error("Error fetching Gemini answer:", error);
    throw new Error("Failed to get answer from AI");
  }
};
