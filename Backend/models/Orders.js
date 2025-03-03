const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artwork_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true
  }],
  total_amount: {
    type: Number,
    required: true
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending'
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
