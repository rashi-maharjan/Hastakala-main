const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityPost", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, default: "Anonymous" }, // Added username field
  comment_text: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);