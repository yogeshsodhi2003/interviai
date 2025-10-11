import express from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { pdf } from "pdf-parse";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Create uploads directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PDF and Word documents are allowed."),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.post("/resumeupload", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    //extraction text
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const resumeText = await pdf(dataBuffer);

    const text = "Jake Ryan is a recent Computer Science graduate with a minor in Business, specializing in full-stack web development and software engineering. He has significant hands-on experience developing REST APIs (FastAPI), full-stack web applications (Flask, React, PostgreSQL, Docker) for data analysis and visualization, and contributing to large codebases. His background includes impactful research in AI for game generation, which he presented at a world conference, and computational social science. Additionally, he has practical experience in IT support, troubleshooting, and system maintenance, alongside successfully developing and publishing a popular Minecraft plugin with over 2,000 downloads. Jake is proficient in Python, Java, SQL, JavaScript, and key developer tools including Git, Docker, and CI/CD methodologies like TravisCI."

    // uncomment below to enable Gemini API call beacuse of cost issue


    
    // const prompt = `give a short summary of the following resume: ${resumeText.text}`;
    // const response = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: [{ parts: [{ text: prompt }] }],
    //   config: {
    //     systemInstruction:
    //       "your are a resume expert. and extract important key points. ",
    //   },
    // });

    // const text = response.text || "No response from AI";

    // Clean up the temporary file
    await fs.promises.unlink(req.file.path);

    res.json({ summary: text });
  } catch (err) {
    console.error("Upload error:", err);

    // Clean up the temporary file if it exists
    if (req.file?.path) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error("Error deleting temporary file:", unlinkErr);
      }
    }

    res.status(500).json({
      error: "Upload failed",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size too large. Maximum size is 10MB." });
    }
    return res.status(400).json({ error: err.message });
  }

  console.error("Unexpected error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default router;
