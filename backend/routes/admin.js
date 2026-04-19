const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const jwt = require('jsonwebtoken');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === 'anandasha' && password === 'anandasha@') {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all registrations
router.get('/registrations', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET);
    const data = await Registration.find().sort({ registeredDate: -1 });
    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;