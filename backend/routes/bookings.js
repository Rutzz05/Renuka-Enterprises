const express = require('express');
const Booking = require('../models/Booking');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { serviceType, issueType, date, time, notes } = req.body;

    const booking = new Booking({
      customer: req.user.user.id,
      serviceType,
      issueType,
      date,
      time,
      notes,
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all bookings (admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('customer', 'name email phone').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update booking status (admin)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status, technician } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, technician },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;