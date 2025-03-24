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
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Artwork = mongoose.models.Artwork || mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;