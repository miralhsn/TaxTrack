const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all reminders
router.get('/', reminderController.getReminders);

// Get upcoming reminders (next 7 days)
router.get('/upcoming', reminderController.getUpcomingReminders);

// Get overdue reminders
router.get('/overdue', reminderController.getOverdueReminders);

// Get reminder statistics
router.get('/stats', reminderController.getReminderStats);

// Get reminders by client
router.get('/client/:clientId', reminderController.getRemindersByClient);

// Create new reminder
router.post('/', reminderController.createReminder);

// Update reminder
router.put('/:id', reminderController.updateReminder);

// Delete reminder
router.delete('/:id', reminderController.deleteReminder);

// Mark reminder as completed
router.patch('/:id/complete', reminderController.markCompleted);

module.exports = router; 