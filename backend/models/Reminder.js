const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'overdue'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
reminderSchema.index({ date: 1, status: 1 });
reminderSchema.index({ clientId: 1 });
reminderSchema.index({ createdBy: 1 });

// Virtual for checking if reminder is overdue
reminderSchema.virtual('isOverdue').get(function() {
  return this.date < new Date() && this.status === 'pending';
});

// Method to mark as completed
reminderSchema.methods.markCompleted = function() {
  this.status = 'completed';
  return this.save();
};

// Method to mark as overdue
reminderSchema.methods.markOverdue = function() {
  if (this.date < new Date() && this.status === 'pending') {
    this.status = 'overdue';
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('Reminder', reminderSchema); 