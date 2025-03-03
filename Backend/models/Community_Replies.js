const mongoose = require('mongoose');

const communityReplySchema = new mongoose.Schema({
  community_post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const CommunityReply = mongoose.model('CommunityReply', communityReplySchema);
module.exports = CommunityReply;
