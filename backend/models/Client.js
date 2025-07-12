const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  company: { type: String },
  phone: { type: String },
  email: { type: String, required: true },
  documents: [{ type: String }], // file paths or URLs
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema); 