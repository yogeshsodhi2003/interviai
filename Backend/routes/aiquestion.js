import express from 'express';
import { getGeminiAnswer } from '../gemini/gemini.js';
const router = express.Router();

router.post('/api/aiquestion', async(req, res) => {
  const { question } = req.body;
  
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid question' });
  } 
  const roomId = `${jobTitle}-${Date.now()}`;

  const answer = await getGeminiAnswer(question); // Call Gemini API here
  res.json({ answer, roomId });
});

export default router;