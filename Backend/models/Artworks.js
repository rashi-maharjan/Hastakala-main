const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  artist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Artwork = mongoose.models.Artwork || mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;
