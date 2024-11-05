import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory storage (replace with a database in production)
let schedules = {
  'Dani': [],
  'Tere': []
};

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('get_schedules', () => {
    socket.emit('schedules_updated', schedules);
  });

  socket.on('update_schedules', (newSchedules) => {
    schedules = newSchedules;
    // Broadcast to all connected clients except sender
    socket.broadcast.emit('schedules_updated', schedules);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});