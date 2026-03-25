const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/renuka-enterprises');

    // Create admin user
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        email: 'admin@renuka.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        phone: '9876543210',
        role: 'admin',
      });
      await admin.save();
      console.log('Admin user created: admin@renuka.com / password');
    }

    // Create sample products
    const products = [
      {
        name: 'Aquaguard Compact',
        category: 'aquaguard',
        description: 'Compact water purifier for small families',
        price: 15000,
        stock: 10,
      },
      {
        name: 'Aquaguard Grande',
        category: 'aquaguard',
        description: 'Advanced water purifier with RO+UV+UF technology',
        price: 25000,
        stock: 5,
      },
      {
        name: 'Luminous Inverter 3.5KVA',
        category: 'inverter',
        description: '3.5KVA inverter with battery backup',
        price: 35000,
        stock: 8,
      },
      {
        name: 'Exide Battery 150AH',
        category: 'battery',
        description: '150AH tubular battery for inverter',
        price: 18000,
        stock: 15,
      },
    ];

    for (const productData of products) {
      const existing = await Product.findOne({ name: productData.name });
      if (!existing) {
        const product = new Product(productData);
        await product.save();
        console.log(`Product created: ${productData.name}`);
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();