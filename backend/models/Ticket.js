const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: String,
    customer: String,
    description: String,
    status: { type: String, default: 'open' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
