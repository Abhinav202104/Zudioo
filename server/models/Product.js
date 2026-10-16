const mongoose = require('mongoose');

module.exports = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 4.5 },
}, { timestamps: true }));
