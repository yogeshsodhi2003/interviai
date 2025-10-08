// server/upload.ts
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import {pdf} from 'pdf-parse';

dotenv.config();

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

cloudinary.config({
  cloud_name: process.env.CLD_CLOUD_NAME,
  api_key: process.env.CLD_API_KEY,
  api_secret: process.env.CLD_API_SECRET,
});

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/api/resumeupload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    //extraction text
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const resumeText = await pdf(dataBuffer);
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'resumes',
      use_filename: true,
      unique_filename: true
    });

    // Clean up the temporary file
    await fs.promises.unlink(req.file.path);

    res.json({
      text: resumeText.text,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes
    });

  } catch (err) {
    console.error('Upload error:', err);
    
    // Clean up the temporary file if it exists
    if (req.file?.path) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error('Error deleting temporary file:', unlinkErr);
      }
    }

    res.status(500).json({ 
      error: 'Upload failed',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default router;