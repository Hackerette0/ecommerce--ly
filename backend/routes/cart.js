const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');


const router = express.Router();

// Add to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body; // default quantity to 1 if missing

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if item already in cart
    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Item exists → increment quantity
      user.cart[itemIndex].quantity += Number(quantity);
    } else {
      // New item
      user.cart.push({ product: productId, quantity: Number(quantity) });
    }

    // Save the updated cart
    await user.save();

    // Fetch user again with populated product details
    const populatedUser = await User.findById(req.user.id).populate('cart.product');

    // Send back the full populated cart
    res.json({
      success: true,
      cart: populatedUser.cart   // ← this is what you want
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// Get cart
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Checkout
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/pay', async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // Amount in paise
    currency: "INR",
    receipt: "receipt_" + Math.random(),
  };
  const order = await razorpay.orders.create(options);
  res.json(order);
});
module.exports = router;