const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  artist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artwork_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  sale_date: {
    type: Date,
    default: Date.now
  }
});

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;
