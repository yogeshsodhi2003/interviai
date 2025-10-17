import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import path from 'node:path';
import resumeUploadRouter from './routes/resume.route.js';
import userRouter from './routes/user.route.js';
import connectDB from './database/mongodb.js';
import configureSocket from './config/socket.js';

// Connect to MongoDB
connectDB();

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve(); 

// Create HTTP server
const server = http.createServer(app);

// Configure WebSocket
configureSocket(server);

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/api', resumeUploadRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => { 
    res.send('API is running...');
});

// Start server
server.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
