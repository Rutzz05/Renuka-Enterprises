const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['service', 'product'],
    required: true,
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    total: Number,
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['generated', 'paid'],
    default: 'generated',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Invoice', invoiceSchema);