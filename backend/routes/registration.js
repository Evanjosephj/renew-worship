const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// Submit registration
router.post('/submit', async (req, res) => {
  try {
    const { name, gender, phone, updatePreference, whatsapp, email, message } = req.body;

    // Check duplicate phone number
    const existingPhone = await Registration.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'This phone number is already registered!' });
    }

    // Check duplicate whatsapp
    if (whatsapp) {
      const existingWhatsapp = await Registration.findOne({ whatsapp });
      if (existingWhatsapp) {
        return res.status(400).json({ success: false, message: 'This WhatsApp number is already registered!' });
      }
    }

    // Check duplicate email
    if (email) {
      const existingEmail = await Registration.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'This email is already registered!' });
      }
    }

    const newEntry = new Registration({
      name, gender, phone, updatePreference, whatsapp, email, message
    });

    await newEntry.save();
    res.status(201).json({ success: true, message: 'Registered successfully' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;