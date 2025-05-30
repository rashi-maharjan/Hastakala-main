const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  artwork_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  created_at: { type: Date, default: Date.now },
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

module.exports = Cart;
