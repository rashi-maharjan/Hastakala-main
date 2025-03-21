const mongoose = require('mongoose');

// Example for Users model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['normal_user', 'artist', 'admin'], default: 'normal_user' },
  profileImage: { type: String, default: null }, // Added this field
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
