const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');

// Add service to client, list services for client
router.post('/client/:clientId', auth, serviceController.addService);
router.get('/client/:clientId', auth, serviceController.getServicesForClient);
// Update, delete service
router.put('/:serviceId', auth, serviceController.updateService);
router.delete('/:serviceId', auth, serviceController.deleteService);
// Mark as paid/pending
router.patch('/:serviceId/status', auth, serviceController.markServiceStatus);
// Generate PDF receipt
router.get('/:serviceId/receipt', auth, serviceController.generatePDFReceipt);
// Send receipt email
router.post('/:serviceId/email', auth, serviceController.sendReceiptEmail);
router.get('/due-dates/all', auth, serviceController.getAllDueDates);
router.patch('/:serviceId/due-date', auth, serviceController.setDueDate);
router.get('/reminders/all', auth, serviceController.getReminders);
router.get('/recent', auth, serviceController.getRecentServices);
router.get('/pending', auth, serviceController.getPendingServices);

module.exports = router; 