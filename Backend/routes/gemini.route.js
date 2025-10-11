import express from "express";
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";


const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/gemini", async (req, res) => {
  const { transcript } = req.body;
  console.log("Received transcript:", transcript);

  if (!transcript || typeof transcript !== "string") {
    return res.status(400).json({ error: "Missing or invalid transcript" });
  }

  try {

    const text = "this is a test response of testing purpose only";
    // uncomment below to enable TTS

    // const prompt = `Answer the following: ${transcript}`;
    // const response = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: [{ parts: [{ text: prompt }] }],
    //   config: {
    //     systemInstruction: "You are a friendly assistant.",
    //   },
    // });

    // const text = response.text || "No response from AI";
    // console.log("Gemini response:", text);

    res.json({ text });
  } catch (error) {
    console.error("AI or TTS error:", error);
    res.status(500).json({ error: "Failed to get answer from AI" });
  }
});

export default router;
