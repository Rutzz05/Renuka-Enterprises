const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// ✅ CREATE booking (NO AUTH for now)
router.post('/', async (req, res) => {
  try {
    const { name, phone, product, serviceType, message } = req.body;

    const booking = new Booking({
      name,
      phone,
      product,
      serviceType,
      message,
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ GET all bookings (for admin later)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;