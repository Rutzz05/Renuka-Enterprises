const express = require('express');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/my', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ customer: req.user.id })
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });
    return res.json(invoices);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to fetch invoices' });
  }
});

router.get('/', auth, adminAuth, async (_req, res) => {
  try {
    const invoices = await Invoice.find().populate('customer', 'name email phone').sort({ createdAt: -1 });
    return res.json(invoices);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to fetch invoices' });
  }
});

router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { customerId, bookingId, type, items, tax, notes, dueDate, status } = req.body;

    if (!customerId || !type || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Customer, type, and at least one invoice item are required' });
    }

    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const normalizedItems = items.map((item) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

      return {
        description: item.description?.trim(),
        quantity,
        unitPrice,
        total: Number((quantity * unitPrice).toFixed(2)),
      };
    });

    const subtotal = Number(normalizedItems.reduce((sum, item) => sum + item.total, 0).toFixed(2));
    const taxAmount = Number(tax || 0);
    const totalAmount = Number((subtotal + taxAmount).toFixed(2));

    const invoice = new Invoice({
      invoiceId: `INV-${Date.now()}`,
      customer: customerId,
      booking: bookingId || null,
      type,
      items: normalizedItems,
      subtotal,
      tax: taxAmount,
      totalAmount,
      notes: notes?.trim() || '',
      dueDate: dueDate || null,
      status: status === 'paid' ? 'paid' : 'generated',
    });

    await invoice.save();

    const populatedInvoice = await invoice.populate('customer', 'name email phone');
    return res.status(201).json(populatedInvoice);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to create invoice' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('booking');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (req.user.role !== 'admin' && invoice.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(invoice);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to fetch invoice' });
  }
});

router.patch('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status === 'paid' ? 'paid' : 'generated' },
      { new: true, runValidators: true }
    ).populate('customer', 'name email phone');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    return res.json(invoice);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to update invoice status' });
  }
});

module.exports = router;
