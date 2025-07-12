const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for Google users
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  // For password reset
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  // For Google OAuth
  picture: { type: String },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 