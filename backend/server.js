import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import resumeUploadRouter from './routes/resume.route.js';
import geminiRouter from './routes/gemini.route.js';
import userRouter from './routes/user.route.js';
import connectDB from './database/mongodb.js';
import configureSocket from './config/socket.js';

// Connect to MongoDB
connectDB();

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Configure WebSocket
configureSocket(server);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api', resumeUploadRouter);
app.use('/api', geminiRouter);
app.use('/api/user', userRouter);

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
