const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { addUser, findUser } = require('./userStore');

const app = express();
app.use(cors());
app.use(express.json());

// Register endpoint
app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const ok = addUser(email, password);
  if (!ok) return res.status(409).json({ error: 'User already exists' });
  res.json({ success: true });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = findUser(email, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true });
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let waitingPlayer = null;

io.on('connection', (socket) => {
  if (waitingPlayer) {
    const room = `room-${waitingPlayer.id}-${socket.id}`;
    socket.join(room);
    waitingPlayer.join(room);
    io.to(room).emit('gameStart', { symbol: 'O', room });
    waitingPlayer.emit('gameStart', { symbol: 'X', room });
    waitingPlayer = null;
  } else {
    waitingPlayer = socket;
  }

  socket.on('move', ({ room, squares, xIsNext }) => {
    socket.to(room).emit('move', { squares, xIsNext });
  });

  socket.on('restart', ({ room }) => {
    io.to(room).emit('restart');
  });

  socket.on('disconnect', () => {
    if (waitingPlayer === socket) {
      waitingPlayer = null;
    } else {
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      rooms.forEach(room => {
        socket.to(room).emit('opponentLeft');
      });
    }
  });
});

httpServer.listen(4000, () => {
  console.log('Tic-Tac-Toe server running on port 4000');
});