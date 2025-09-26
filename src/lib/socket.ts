import { Server } from 'socket.io';

interface AttendanceUpdate {
  sessionId: string;
  studentId: string;
  status: string;
  studentName: string;
  timestamp: string;
  method: string;
}

interface SessionUpdate {
  sessionId: string;
  presentCount: number;
  totalCount: number;
  isActive: boolean;
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join class room for real-time updates
    socket.on('join-class', (classId: string) => {
      socket.join(`class-${classId}`);
      console.log(`Client ${socket.id} joined class ${classId}`);
    });

    // Leave class room
    socket.on('leave-class', (classId: string) => {
      socket.leave(`class-${classId}`);
      console.log(`Client ${socket.id} left class ${classId}`);
    });

    // Join session room for live attendance updates
    socket.on('join-session', (sessionId: string) => {
      socket.join(`session-${sessionId}`);
      console.log(`Client ${socket.id} joined session ${sessionId}`);
    });

    // Handle attendance updates
    socket.on('attendance-update', (update: AttendanceUpdate) => {
      // Broadcast to all clients in the session room
      io.to(`session-${update.sessionId}`).emit('attendance-updated', update);
      
      // Also broadcast to class room for general updates
      const sessionId = update.sessionId;
      // Extract classId from sessionId (in a real app, you'd query the database)
      const classId = sessionId.split('-')[0]; // Simple extraction for demo
      io.to(`class-${classId}`).emit('class-attendance-updated', update);
      
      console.log('Attendance update broadcasted:', update);
    });

    // Handle session updates (start/end session, count updates)
    socket.on('session-update', (update: SessionUpdate) => {
      io.to(`session-${update.sessionId}`).emit('session-updated', update);
      
      // Also update class room
      const classId = update.sessionId.split('-')[0]; // Simple extraction for demo
      io.to(`class-${classId}`).emit('class-session-updated', update);
      
      console.log('Session update broadcasted:', update);
    });

    // Handle AI recognition events
    socket.on('ai-recognition-start', (data: { sessionId: string, studentId?: string }) => {
      socket.to(`session-${data.sessionId}`).emit('ai-recognition-started', {
        sessionId: data.sessionId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('ai-recognition-complete', (data: { 
      sessionId: string, 
      studentId: string, 
      success: boolean, 
      confidence?: number 
    }) => {
      const update = {
        sessionId: data.sessionId,
        studentId: data.studentId,
        success: data.success,
        confidence: data.confidence,
        timestamp: new Date().toISOString()
      };
      
      socket.to(`session-${data.sessionId}`).emit('ai-recognition-completed', update);
      console.log('AI recognition completed:', update);
    });

    // Handle real-time analytics updates
    socket.on('analytics-update', (data: { classId: string, stats: any }) => {
      io.to(`class-${data.classId}`).emit('analytics-updated', data.stats);
    });

    // Handle messages (keep existing functionality)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to Attendance System WebSocket!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};