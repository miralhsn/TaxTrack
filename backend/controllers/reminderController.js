const Reminder = require('../models/Reminder');
const Client = require('../models/Client');

// Get all reminders for a user
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ createdBy: req.user.id })
      .populate('clientId', 'name company')
      .sort({ date: 1 });
    
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get upcoming reminders (next 7 days)
exports.getUpcomingReminders = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const reminders = await Reminder.find({
      createdBy: req.user.id,
      date: { $gte: today, $lte: nextWeek },
      status: { $in: ['pending', 'overdue'] }
    })
      .populate('clientId', 'name company')
      .sort({ date: 1 });
    
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get overdue reminders
exports.getOverdueReminders = async (req, res) => {
  try {
    const today = new Date();
    
    const reminders = await Reminder.find({
      createdBy: req.user.id,
      date: { $lt: today },
      status: 'pending'
    })
      .populate('clientId', 'name company')
      .sort({ date: 1 });
    
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new reminder
exports.createReminder = async (req, res) => {
  try {
    const { title, message, date, clientId, priority } = req.body;
    
    if (!title || !message || !date || !clientId) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const reminder = new Reminder({
      title,
      message,
      date: new Date(date),
      clientId,
      priority: priority || 'medium',
      createdBy: req.user.id
    });
    
    await reminder.save();
    
    // Populate client info for response
    await reminder.populate('clientId', 'name company');
    
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a reminder
exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, date, priority, status } = req.body;
    
    const reminder = await Reminder.findOne({ _id: id, createdBy: req.user.id });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    if (title) reminder.title = title;
    if (message) reminder.message = message;
    if (date) reminder.date = new Date(date);
    if (priority) reminder.priority = priority;
    if (status) reminder.status = status;
    
    await reminder.save();
    await reminder.populate('clientId', 'name company');
    
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reminder = await Reminder.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    res.json({ message: 'Reminder deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mark reminder as completed
exports.markCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reminder = await Reminder.findOne({ _id: id, createdBy: req.user.id });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    await reminder.markCompleted();
    await reminder.populate('clientId', 'name company');
    
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get reminders by client
exports.getRemindersByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const reminders = await Reminder.find({ 
      clientId, 
      createdBy: req.user.id 
    })
      .populate('clientId', 'name company')
      .sort({ date: 1 });
    
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get reminder statistics
exports.getReminderStats = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const [total, pending, overdue, upcoming] = await Promise.all([
      Reminder.countDocuments({ createdBy: req.user.id }),
      Reminder.countDocuments({ createdBy: req.user.id, status: 'pending' }),
      Reminder.countDocuments({ 
        createdBy: req.user.id, 
        date: { $lt: today }, 
        status: 'pending' 
      }),
      Reminder.countDocuments({ 
        createdBy: req.user.id, 
        date: { $gte: today, $lte: nextWeek }, 
        status: { $in: ['pending', 'overdue'] } 
      })
    ]);
    
    res.json({
      total,
      pending,
      overdue,
      upcoming
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 