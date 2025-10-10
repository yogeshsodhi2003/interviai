import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import resumeUploadRouter from './routes/resumeUpload.js';
import aiquestionRouter from './routes/aiquestion.js';
import liveAudioRouter from './routes/liveaudio.js';
import  { getGeminiAnswer } from './gemini/gemini.js';
import connectDB from './database/mongodb.js';

// Connect to MongoDB
//connectDB();

// Load environment variables from .env file
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // Adjust for production
});

// Middleware
app.use(bodyParser.json());

// MongoDB connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(resumeUploadRouter);
app.use(aiquestionRouter);
app.use(liveAudioRouter);


// 🔌 WebSocket logic
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('userMessage', async ({ roomId, message }) => {
    console.log(`Message from ${socket.id} in ${roomId}:`, message);

    try {
      const answer = await getGeminiAnswer(message);
      io.to(roomId).emit('aiResponse', answer);
    } catch (err) {
      io.to(roomId).emit('aiResponse', 'Error generating response');
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});
// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
