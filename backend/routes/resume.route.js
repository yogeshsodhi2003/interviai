import express from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import PDFParser from "pdf2json";
import { GoogleGenAI } from "@google/genai";
import { updateResume } from "../controllers/resume.controller.js";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
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

const parsePDF = (filePath) =>
  new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(errData.parserError)
    );

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      // Extract text from all pages
      const text = pdfData.formImage.Pages.map((page) =>
        page.Texts.map((t) => decodeURIComponent(t.R[0].T)).join(" ")
      ).join("\n");

      resolve(text);
    });

    pdfParser.loadPDF(filePath);
  });

router.post("/resumeupload", upload.single("resume"), async (req, res) => {
  console.log("File upload request received", req.body);
  const userId = req.body.userId;
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  if (!userId) {
    return res.status(400).json({ error: "No user id provided" });
  }

  try {
    //extraction text
    const filePath = req.file.path;
    const resumeText = await parsePDF(filePath);

    // uncomment below to enable Gemini API call beacuse of cost issue

    const prompt = `give a short summary of the following resume: ${resumeText.text}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction:
          "your are a resume expert. and extract important key points. ",
      },
    });

    const text = response.text || "No response from AI";
    console.log("AI-generated summary:", text);

    // Update user's resume summary in the database
    // Assuming userId is sent in the request body
    const resume = await updateResume(userId, text);
    if (!resume) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Resume summary updated for user:", userId);

    // Clean up the temporary file
    await fs.promises.unlink(req.file.path);

    res.json({ summary: text, resume });
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
