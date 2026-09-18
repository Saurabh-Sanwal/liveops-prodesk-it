require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err.message));

const lockedTickets = new Map();

app.get('/api/tickets', async (req, res) => {
  const tickets = await Ticket.find().sort({ createdAt: -1 });
  res.json(tickets);
});

app.post('/api/tickets', async (req, res) => {
  const { title, customer, description } = req.body;
  const ticket = await Ticket.create({ title, customer, description });
  io.emit('new_ticket', ticket);
  res.json(ticket);
});

async function seedTickets() {
  const count = await Ticket.countDocuments();
  if (count === 0) {
    await Ticket.insertMany([
      {
        title: 'Truck #22 broke down - Dallas Route',
        customer: 'ABC Freight Co.',
        description: 'Delivery delayed 3 hours, truck needs towing.'
      },
      {
        title: 'Duplicate billing on Order #4521',
        customer: 'Speedy Logistics',
        description: 'Customer charged twice for same delivery.'
      },
      {
        title: 'Package not delivered - Order #7789',
        customer: 'Green Valley Traders',
        description: 'Tracking shows delivered but customer says not received.'
      }
    ]);
    console.log('Sample tickets added');
  }
}
mongoose.connection.once('open', seedTickets);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_dashboard', () => {
    const locks = Array.from(lockedTickets.entries()).map(([ticketId, data]) => ({
      ticketId,
      agentName: data.agentName
    }));
    socket.emit('current_locks', locks);
  });

  socket.on('lock_ticket', ({ ticketId, agentName }) => {
    if (lockedTickets.has(ticketId)) {
      socket.emit('lock_failed', { ticketId });
      return;
    }
    lockedTickets.set(ticketId, { agentName, socketId: socket.id });
    io.emit('ticket_locked', { ticketId, agentName });
  });

  socket.on('unlock_ticket', ({ ticketId }) => {
    lockedTickets.delete(ticketId);
    io.emit('ticket_unlocked', { ticketId });
  });

  socket.on('disconnect', () => {
    for (const [ticketId, data] of lockedTickets.entries()) {
      if (data.socketId === socket.id) {
        lockedTickets.delete(ticketId);
        io.emit('ticket_unlocked', { ticketId });
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
