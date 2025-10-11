import { Server } from 'socket.io';
import { getGeminiAnswer } from '../gemini/gemini.js';

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Handle room joining
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle user messages
    socket.on('userMessage', async ({ roomId, message, resumeSummary }) => {
      console.log(`Message received - Room: ${roomId}, Message: ${message}`);
      
      try {
        const answer = await getGeminiAnswer(message, resumeSummary);
        console.log('AI Response generated:', answer);
        
        // Emit to specific room
        io.to(roomId).emit('aiResponse', answer);
        
        // Log emission
        console.log(`Response emitted to room ${roomId}`);
      } catch (err) {
        console.error('Error generating response:', err);
        
        // Emit error to specific room
        socket.to(roomId).emit('aiResponse', 'Error generating response');
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};

export default configureSocket;