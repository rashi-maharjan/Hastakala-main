const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityPost", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Like", LikeSchema);
