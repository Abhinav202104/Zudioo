const mongoose = require('mongoose');

const STATUSES = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, price: Number, image: String, qty: Number,
  }],
  shipping: { name: String, phone: String, address: String, city: String, pincode: String },
  paymentMethod: { type: String, default: 'COD' },
  total: { type: Number, required: true },
  status: { type: String, enum: STATUSES, default: 'Placed' },
  timeline: [{ status: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
Order.STATUSES = STATUSES;
module.exports = Order;
