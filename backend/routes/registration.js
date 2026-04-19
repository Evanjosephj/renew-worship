const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// Submit registration
router.post('/submit', async (req, res) => {
  try {
    const { name, gender, phone, updatePreference, whatsapp, email, message } = req.body;

    const newEntry = new Registration({
      name,
      gender,
      phone,
      updatePreference,
      whatsapp,
      email,
      message
    });

    await newEntry.save();
    res.status(201).json({ success: true, message: 'Registered successfully' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;