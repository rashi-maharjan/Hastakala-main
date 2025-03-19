const mongoose = require("mongoose");

const CommunityPostSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, default: "Anonymous" }, // Added username field
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes_count: { type: Number, default: 0 },
  comments_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);