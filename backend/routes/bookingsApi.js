const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth, optionalAuth, adminAuth } = require('../middleware/auth');

const router = express.Router();
const customerEditableStatuses = ['pending', 'in-progress'];

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name, email, phone, serviceType, issueType, preferredDate, preferredTime, notes, source } = req.body;

    if (!serviceType || !issueType || !preferredDate || !preferredTime) {
      return res.status(400).json({
        message: 'Service type, issue type, preferred date, and preferred time are required',
      });
    }

    let bookingName = name?.trim();
    let bookingEmail = email?.trim().toLowerCase() || '';
    let bookingPhone = phone?.trim();
    let customerId = null;

    if (req.user?.id) {
      const currentUser = await User.findById(req.user.id);
      if (currentUser) {
        bookingName = bookingName || currentUser.name;
        bookingEmail = bookingEmail || currentUser.email;
        bookingPhone = bookingPhone || currentUser.phone;
        customerId = currentUser._id;
      }
    }

    if (!bookingName || !bookingPhone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    const booking = new Booking({
      customer: customerId,
      name: bookingName,
      email: bookingEmail,
      phone: bookingPhone,
      serviceType,
      issueType: issueType.trim(),
      preferredDate,
      preferredTime: preferredTime.trim(),
      notes: notes?.trim() || '',
      source: source === 'contact' ? 'contact' : 'dashboard',
    });

    await booking.save();
    return res.status(201).json(booking);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to create booking' });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id }).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to fetch your bookings' });
  }
});

router.patch('/:id/customer', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!booking.customer || booking.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have access to this booking' });
    }

    if (!customerEditableStatuses.includes(booking.status)) {
      return res.status(400).json({ message: 'This booking can no longer be changed by the customer' });
    }

    const updates = {};

    if (req.body.action === 'cancel') {
      updates.status = 'cancelled';
    }

    if (req.body.action === 'reschedule') {
      const { preferredDate, preferredTime, notes } = req.body;

      if (!preferredDate || !preferredTime) {
        return res.status(400).json({ message: 'Preferred date and time are required to reschedule' });
      }

      updates.preferredDate = preferredDate;
      updates.preferredTime = preferredTime.trim();
      if (typeof notes === 'string') {
        updates.notes = notes.trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid customer update was provided' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json(updatedBooking);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to update booking' });
  }
});

router.get('/', auth, adminAuth, async (_req, res) => {
  try {
    const bookings = await Booking.find().populate('customer', 'name email phone').sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to fetch bookings' });
  }
});

router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const updates = {};

    if (req.body.status) {
      updates.status = req.body.status;
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('customer', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.json(booking);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to update booking' });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to delete booking' });
  }
});

module.exports = router;
