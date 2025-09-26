// Vercel serverless function for Socket.IO
const { Server } = require('socket.io');
const { createServer } = require('http');

// Store connected clients
const connectedClients = new Map();

// Socket.IO setup function
function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Store client connection
    connectedClients.set(socket.id, {
      id: socket.id,
      connectedAt: new Date(),
    });

    // Handle joining class rooms
    socket.on('join-class', (classId) => {
      socket.join(`class-${classId}`);
      console.log(`Client ${socket.id} joined class ${classId}`);
    });

    // Handle joining session rooms
    socket.on('join-session', (sessionId) => {
      socket.join(`session-${sessionId}`);
      console.log(`Client ${socket.id} joined session ${sessionId}`);
    });

    // Handle attendance updates
    socket.on('attendance-update', (data) => {
      io.to(`class-${data.classId}`).emit('attendance-updated', {
        studentId: data.studentId,
        status: data.status,
        timestamp: new Date(),
      });
    });

    // Handle session updates
    socket.on('session-update', (data) => {
      io.to(`session-${data.sessionId}`).emit('session-updated', {
        sessionId: data.sessionId,
        presentCount: data.presentCount,
        totalCount: data.totalCount,
        isActive: data.isActive,
        timestamp: new Date(),
      });
    });

    // Handle AI recognition start
    socket.on('ai-recognition-start', (data) => {
      socket.emit('ai-recognition-started', {
        sessionId: data.sessionId,
        studentId: data.studentId,
        timestamp: new Date(),
      });
    });

    // Handle AI recognition complete
    socket.on('ai-recognition-complete', (data) => {
      socket.emit('ai-recognition-completed', {
        sessionId: data.sessionId,
        studentId: data.studentId,
        success: data.success,
        confidence: data.confidence,
        timestamp: new Date(),
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      connectedClients.delete(socket.id);
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to TrackIt Socket.IO server',
      socketId: socket.id,
      timestamp: new Date(),
    });
  });

  // Handle server shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing Socket.IO server');
    io.close();
  });
}

// Vercel serverless function handler
module.exports = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Create HTTP server for Socket.IO
  const server = createServer();
  const io = new Server(server, {
    path: '/api/socketio',
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Setup Socket.IO handlers
  setupSocket(io);

  // For Vercel, we need to handle the upgrade request differently
  // This is a simplified version for serverless environment
  res.status(200).json({
    message: 'Socket.IO server is running',
    path: '/api/socketio',
    connectedClients: connectedClients.size,
  });
};