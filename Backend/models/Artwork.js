const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String, required: true },
  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  inStock: { type: Boolean, default: true },
  height: { type: String },
  width: { type: String },
  medium: { type: String },
  paper: { type: String },
  orientation: { type: String },
  frame: { type: String, default: 'Not Included' },
  description: { type: String },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Artwork = mongoose.models.Artwork || mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;