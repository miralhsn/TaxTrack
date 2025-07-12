const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  type: { type: String, enum: ['Audit', 'Income Tax', 'Sales Tax', 'Corporate Filing', 'Balance Sheet Generation', 'Miscellaneous'], required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  payments: [{
    date: Date,
    amount: Number,
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    receipt: String, // PDF path or URL
  }],
  dueDate: { type: Date },
  reminderSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema); 