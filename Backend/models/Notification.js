const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['comment', 'like', 'event', 'reply', 'system'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  linkTo: {
    type: String, // URL to direct user when clicking on notification
    required: true
  },
  relatedItem: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedItemModel'
  },
  relatedItemModel: {
    type: String,
    enum: ['CommunityPost', 'Comment', 'Event', 'Artwork']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;