const express = require('express');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to fetch products' });
  }
});

router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, category, description, price, stock, image } = req.body;

    if (!name || !category || !description || price === undefined) {
      return res.status(400).json({ message: 'Name, category, description, and price are required' });
    }

    const product = new Product({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock || 0),
      image: image?.trim() || '',
    });

    await product.save();
    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to create product' });
  }
});

router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, category, description, price, stock, image } = req.body;
    const updates = {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(category !== undefined ? { category: category.trim() } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(stock !== undefined ? { stock: Number(stock) } : {}),
      ...(image !== undefined ? { image: image.trim() } : {}),
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to update product' });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to delete product' });
  }
});

module.exports = router;
