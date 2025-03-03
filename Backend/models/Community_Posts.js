const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const CommunityPost = mongoose.models.CommunityPost || mongoose.model('CommunityPost', communityPostSchema);

module.exports = CommunityPost;
