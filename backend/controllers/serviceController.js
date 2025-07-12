const Service = require('../models/Service');
const Client = require('../models/Client');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

exports.addService = async (req, res) => {
  try {
    const { clientId } = req.params;
    const service = await Service.create({ ...req.body, client: clientId });
    await Client.findByIdAndUpdate(clientId, { $push: { services: service._id } });
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getServicesForClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const services = await Service.find({ client: clientId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findByIdAndUpdate(serviceId, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    await Client.findByIdAndUpdate(service.client, { $pull: { services: service._id } });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markServiceStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { status } = req.body;
    const service = await Service.findByIdAndUpdate(serviceId, { status }, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.generatePDFReceipt = async (req, res) => {
  // This is a placeholder. In production, use jsPDF or PDFKit to generate a real PDF.
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId).populate('client');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    // Generate a simple text file as a placeholder for PDF
    const receiptText = `Receipt for ${service.type}\nClient: ${service.client}\nAmount: ${service.amount}\nStatus: ${service.status}`;
    const filePath = path.join(__dirname, `../../receipts/receipt-${serviceId}.txt`);
    fs.writeFileSync(filePath, receiptText);
    res.download(filePath, `receipt-${serviceId}.txt`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendReceiptEmail = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId).populate('client');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    // Configure nodemailer with Gmail SMTP (for development)
    // In production, use environment variables for credentials
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    const emailSubject = service.status === 'Paid' 
      ? `Payment Receipt - ${service.type}`
      : `Invoice - ${service.type}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">BillingApp</h1>
          <p style="margin: 5px 0 0 0;">Professional Billing & Tax Management</p>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #333;">${emailSubject}</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Service Details</h3>
            <p><strong>Type:</strong> ${service.type}</p>
            <p><strong>Amount:</strong> $${service.amount}</p>
            <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span style="color: ${service.status === 'Paid' ? '#28a745' : '#ffc107'}; font-weight: bold;">${service.status}</span></p>
            ${service.notes ? `<p><strong>Notes:</strong> ${service.notes}</p>` : ''}
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Client Information</h3>
            <p><strong>Name:</strong> ${service.client.name}</p>
            <p><strong>Company:</strong> ${service.client.company || 'N/A'}</p>
            <p><strong>Email:</strong> ${service.client.email}</p>
            ${service.client.phone ? `<p><strong>Phone:</strong> ${service.client.phone}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">
              Thank you for choosing BillingApp for your professional needs.
            </p>
            <p style="color: #666; font-size: 12px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>© 2024 BillingApp. All rights reserved.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@billingapp.com',
      to: service.client.email,
      subject: emailSubject,
      html: emailHtml,
    });
    
    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send email. Please check your email configuration.' });
  }
};

exports.getAllDueDates = async (req, res) => {
  try {
    const services = await Service.find({ dueDate: { $ne: null } }, 'dueDate type client status');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setDueDate = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { dueDate } = req.body;
    const service = await Service.findByIdAndUpdate(serviceId, { dueDate }, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const now = new Date();
    const reminders = await Service.find({
      dueDate: { $gte: now },
      status: 'Pending',
    }).populate('client');
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get recent services for dashboard
exports.getRecentServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pending services for notifications
exports.getPendingServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'Pending' })
      .populate('client', 'name email')
      .sort({ dueDate: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 