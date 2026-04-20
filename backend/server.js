const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ✅ CORS FIX (ONLY THIS VERSION — no duplicates)
app.use(cors({
  origin: "https://renukaenterprises.co.in",
  credentials: true
}));

// ✅ Handle preflight requests
app.options("*", cors());

// ✅ Middleware
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 5000;

// ✅ Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookingsApi'));
app.use('/api/products', require('./routes/productsApi'));
app.use('/api/invoices', require('./routes/invoicesApi'));

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ❌ Error handler
app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Internal server error' });
});

// ✅ Start server
const startServer = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});