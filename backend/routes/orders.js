// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/auth'); 


router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ msg: 'Shipping address is required' });
    }

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
    });

    await order.save();

    await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/all', protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ msg: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;