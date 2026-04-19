const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  updatePreference: {
    type: String,
    enum: ['whatsapp', 'email', 'both'],
    required: true
  },
  whatsapp: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  registeredDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registration', registrationSchema);