const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    serialNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerDetails: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        default: '',
      },
      phone: {
        type: String,
        trim: true,
        default: '',
      },
      address: {
        type: String,
        trim: true,
        default: '',
      },
      gstin: {
        type: String,
        trim: true,
        default: '',
      },
      state: {
        type: String,
        trim: true,
        default: '',
      },
    },
    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateOfSupply: {
      type: Date,
      required: true,
      default: Date.now,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    placeOfSupply: {
      type: String,
      required: true,
      trim: true,
    },
    reverseCharge: {
      type: Boolean,
      default: false,
    },
    transportMode: {
      type: String,
      trim: true,
      default: 'By hand',
    },
    vehicleNumber: {
      type: String,
      trim: true,
      default: '',
    },
    billTo: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      gstin: {
        type: String,
        trim: true,
        default: '',
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
    },
    shipTo: {
      sameAsBillTo: {
        type: Boolean,
        default: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      gstin: {
        type: String,
        trim: true,
        default: '',
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    type: {
      type: String,
      enum: ['service', 'product'],
      required: true,
    },
    items: [
      {
        description: {
          type: String,
          required: true,
          trim: true,
        },
        hsnCode: {
          type: String,
          trim: true,
          default: '',
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        cgstRate: {
          type: Number,
          required: true,
          min: 0,
        },
        sgstRate: {
          type: Number,
          required: true,
          min: 0,
        },
        cgstAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        sgstAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        total: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalBeforeTax: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCgst: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSgst: {
      type: Number,
      required: true,
      min: 0,
    },
    roundOff: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountInWords: {
      type: String,
      required: true,
      trim: true,
    },
    bankDetails: {
      accountNumber: {
        type: String,
        required: true,
        trim: true,
      },
      ifscCode: {
        type: String,
        required: true,
        trim: true,
      },
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    date: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['generated', 'paid'],
      default: 'generated',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
