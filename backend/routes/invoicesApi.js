const express = require('express');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const { calculateInvoiceTotals, getFinancialYearRange } = require('../utils/invoice');

const router = express.Router();

const normalizeParty = (party) => ({
  name: party?.name?.trim() || '',
  address: party?.address?.trim() || '',
  phone: party?.phone?.trim() || '',
  gstin: party?.gstin?.trim() || '',
  state: party?.state?.trim() || '',
});

const validateParty = (party, label) => {
  if (!party.name || !party.address || !party.phone || !party.state) {
    return `${label} name, address, phone, and state are required`;
  }

  return null;
};

const buildCustomerDetails = (selectedCustomer, billTo) => ({
  name: billTo.name,
  email: selectedCustomer?.email || '',
  phone: billTo.phone,
  address: billTo.address,
  gstin: billTo.gstin,
  state: billTo.state,
});

const buildInvoiceNumber = async (invoiceDate) => {
  const { start, end, label, monthCode } = getFinancialYearRange(invoiceDate);
  const existingInvoices = await Invoice.find({
    invoiceDate: { $gte: start, $lte: end },
  })
    .sort({ createdAt: 1 })
    .select('invoiceId');

  let sequence = existingInvoices.length + 1;
  let candidate = `${String(sequence).padStart(3, '0')}/${monthCode}/${label}`;

  while (existingInvoices.some((invoice) => invoice.invoiceId === candidate)) {
    sequence += 1;
    candidate = `${String(sequence).padStart(3, '0')}/${monthCode}/${label}`;
  }

  return candidate;
};

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

router.get('/next-number', auth, adminAuth, async (req, res) => {
  try {
    const invoiceDate = req.query.invoiceDate ? new Date(req.query.invoiceDate) : new Date();
    const invoiceId = await buildInvoiceNumber(invoiceDate);
    return res.json({ invoiceId });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Unable to generate the next invoice number' });
  }
});

router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const {
      customerId,
      bookingId,
      type,
      items,
      notes,
      dueDate,
      status,
      invoiceDate,
      dateOfSupply,
      state,
      placeOfSupply,
      reverseCharge,
      transportMode,
      vehicleNumber,
      billTo,
      shipTo,
      bankDetails,
    } = req.body;

    if (!type || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invoice type and at least one product row are required' });
    }

    let selectedCustomer = null;

    if (customerId) {
      selectedCustomer = await User.findById(customerId);
      if (!selectedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
    }

    const normalizedBillTo = normalizeParty(billTo);
    const normalizedShipToInput = normalizeParty(shipTo);
    const shipToSameAsBillTo = shipTo?.sameAsBillTo !== false;
    const normalizedShipTo = shipToSameAsBillTo
      ? { ...normalizedBillTo, sameAsBillTo: true }
      : { ...normalizedShipToInput, sameAsBillTo: false };

    const billToError = validateParty(normalizedBillTo, 'Bill to');
    if (billToError) {
      return res.status(400).json({ message: billToError });
    }

    const shipToError = validateParty(normalizedShipTo, 'Ship to');
    if (shipToError) {
      return res.status(400).json({ message: shipToError });
    }

    if (!invoiceDate || !dateOfSupply || !state?.trim() || !placeOfSupply?.trim()) {
      return res.status(400).json({ message: 'Invoice date, date of supply, state, and place of supply are required' });
    }

    if (!bankDetails?.accountNumber?.trim() || !bankDetails?.ifscCode?.trim()) {
      return res.status(400).json({ message: 'Bank account number and IFSC code are required' });
    }

    const totals = calculateInvoiceTotals(items);
    const invalidItems = totals.items.some(
      (item) =>
        !item.description ||
        Number.isNaN(item.quantity) ||
        Number.isNaN(item.unitPrice) ||
        Number.isNaN(item.cgstRate) ||
        Number.isNaN(item.sgstRate) ||
        item.quantity <= 0 ||
        item.unitPrice <= 0
    );

    if (invalidItems) {
      return res.status(400).json({ message: 'Each product row must include a name, quantity above 0, rate above 0, and numeric GST rates' });
    }

    const parsedInvoiceDate = new Date(invoiceDate);
    const invoiceId = await buildInvoiceNumber(parsedInvoiceDate);

    const invoice = new Invoice({
      invoiceId,
      customer: selectedCustomer?._id || null,
      customerDetails: buildCustomerDetails(selectedCustomer, normalizedBillTo),
      invoiceDate: parsedInvoiceDate,
      dateOfSupply: new Date(dateOfSupply),
      state: state.trim(),
      placeOfSupply: placeOfSupply.trim(),
      reverseCharge: Boolean(reverseCharge),
      transportMode: transportMode?.trim() || 'By hand',
      vehicleNumber: vehicleNumber?.trim() || '',
      billTo: normalizedBillTo,
      shipTo: normalizedShipTo,
      booking: bookingId || null,
      type,
      items: totals.items,
      totalBeforeTax: totals.totalBeforeTax,
      totalCgst: totals.totalCgst,
      totalSgst: totals.totalSgst,
      roundOff: totals.roundOff,
      subtotal: totals.totalBeforeTax,
      tax: totals.totalCgst + totals.totalSgst,
      totalAmount: totals.grandTotal,
      amountInWords: totals.amountInWords,
      bankDetails: {
        accountNumber: bankDetails.accountNumber.trim(),
        ifscCode: bankDetails.ifscCode.trim().toUpperCase(),
      },
      notes: notes?.trim() || '',
      dueDate: dueDate || null,
      date: parsedInvoiceDate,
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

    if (req.user.role !== 'admin' && (!invoice.customer || invoice.customer._id.toString() !== req.user.id)) {
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
