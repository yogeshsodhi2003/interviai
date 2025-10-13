import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getGeminiAnswer = async (message, resumeSummary) => {
  try {

    // const response = "this is a test response of testing purpose only";

    const prompt = `here is the ${message} if the message is interview has started then act as an interview expert and ask questions based on the user's resume and the job description provided. If the user asks for advice, provide practical and actionable suggestions. Keep your answers concise and to the point. Use bullet points where appropriate. Avoid unnecessary jargon. Focus on the user's resume and the job description provided. Here is the resume summary: ${resumeSummary}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "you are a interview expert and selecting the best candidate for the job. Be polite and professional in your responses. Keep your answers concise and to the point. Use bullet points where appropriate. Avoid unnecessary jargon. Focus on the user's resume and the job description provided. If the user asks for advice, provide practical and actionable suggestions. ",
      },
    });
    return response.text || "No response from AI";
  } catch (error) {
    console.error("Error fetching Gemini answer:", error);
    throw new Error("Failed to get answer from AI");
  }
};
