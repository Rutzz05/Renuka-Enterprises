const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/renuka-enterprises');

    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const admin = new User({
        name: 'Administrator',
        email: 'admin@gmail.com',
        password: hashedPassword,
        phone: '9823021804',
        role: 'admin',
      });

      await admin.save();
      console.log('✅ Default admin user created: admin@gmail.com / 123456');
    } else {
      console.log('✅ Admin user already exists');
    }

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
        description: 'Advanced RO+UV+UF purifier for larger homes',
        price: 25000,
        stock: 5,
      },
      {
        name: 'Luminous Inverter 3.5KVA',
        category: 'inverter',
        description: '3.5KVA inverter with dependable battery backup',
        price: 35000,
        stock: 8,
      },
      {
        name: 'Exide Battery 150AH',
        category: 'battery',
        description: '150AH tubular battery for inverter systems',
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
