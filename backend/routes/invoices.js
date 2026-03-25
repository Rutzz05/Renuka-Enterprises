const express = require('express');
const Invoice = require('../models/Invoice');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get user's invoices
router.get('/my', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ customer: req.user.user.id }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all invoices (admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('customer', 'name email phone').sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create invoice (admin)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { customer, type, items } = req.body;

    // Generate unique invoice ID
    const invoiceId = `INV-${Date.now()}`;

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const invoice = new Invoice({
      invoiceId,
      customer,
      type,
      items,
      totalAmount,
    });

    await invoice.save();
    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single invoice
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('customer', 'name email phone');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check if user is admin or the customer
    if (req.user.user.role !== 'admin' && invoice.customer._id.toString() !== req.user.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;