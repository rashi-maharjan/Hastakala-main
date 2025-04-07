const Notification = require('../models/Notification');
const User = require('../models/Users');

// Create a notification
exports.createNotification = async (options) => {
  try {
    const { recipient, sender, type, message, linkTo, relatedItem, relatedItemModel } = options;
    
    // Don't send notification if sender is the same as recipient
    if (sender && sender.toString() === recipient.toString()) {
      return null;
    }
    
    const notification = new Notification({
      recipient,
      sender,
      type,
      message,
      linkTo,
      relatedItem,
      relatedItemModel,
      isRead: false
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Create notification for a new comment
exports.createCommentNotification = async (postId, postTitle, commentId, postOwnerId, commenterId, commenterName) => {
  try {
    // If commenterName is not provided or is "Anonymous", try to get the actual name from the database
    if (!commenterName || commenterName === "Anonymous") {
      // Fetch the user information from the database
      const user = await User.findById(commenterId);
      if (user && user.name) {
        commenterName = user.name;
      }
    }
    
    await this.createNotification({
      recipient: postOwnerId,
      sender: commenterId,
      type: 'comment',
      message: `${commenterName} commented on your post "${postTitle}"`,
      linkTo: `/community/post/${postId}`,
      relatedItem: commentId,
      relatedItemModel: 'Comment'
    });
  } catch (error) {
    console.error('Error creating comment notification:', error);
  }
};

// Create notification for a reply to a comment
exports.createReplyNotification = async (postId, postTitle, commentId, originalCommenterId, replyAuthorId, replyAuthorName) => {
  try {
    // If replyAuthorName is not provided or is "Anonymous", try to get the actual name from the database
    if (!replyAuthorName || replyAuthorName === "Anonymous") {
      // Fetch the user information from the database
      const user = await User.findById(replyAuthorId);
      if (user && user.name) {
        replyAuthorName = user.name;
      }
    }
    
    await this.createNotification({
      recipient: originalCommenterId,
      sender: replyAuthorId,
      type: 'reply',
      message: `${replyAuthorName} replied to your comment on "${postTitle}"`,
      linkTo: `/community/post/${postId}`,
      relatedItem: commentId,
      relatedItemModel: 'Comment'
    });
  } catch (error) {
    console.error('Error creating reply notification:', error);
  }
};

// Create notification for a like
exports.createLikeNotification = async (postId, postTitle, postOwnerId, likerId, likerName) => {
  try {
    // If likerName is not provided or is "Anonymous", try to get the actual name from the database
    if (!likerName || likerName === "Anonymous") {
      // Fetch the user information from the database
      const user = await User.findById(likerId);
      if (user && user.name) {
        likerName = user.name;
      }
    }
    
    await this.createNotification({
      recipient: postOwnerId,
      sender: likerId,
      type: 'like',
      message: `${likerName} liked your post "${postTitle}"`,
      linkTo: `/community/post/${postId}`,
      relatedItem: postId,
      relatedItemModel: 'CommunityPost'
    });
  } catch (error) {
    console.error('Error creating like notification:', error);
  }
};

// Create notification for a new event (to all users)
exports.createEventNotification = async (eventId, eventTitle, creatorId) => {
  try {
    // Get the creator's name
    let creatorName = "Admin";
    const creator = await User.findById(creatorId);
    if (creator && creator.name) {
      creatorName = creator.name;
    }
    
    // Find all users except the creator
    const users = await User.find({ _id: { $ne: creatorId } }, '_id');
    
    // Create a notification for each user
    const notifications = users.map(user => ({
      recipient: user._id,
      sender: creatorId,
      type: 'event',
      message: `${creatorName} added a new event: "${eventTitle}"`,
      linkTo: `/events/${eventId}`,
      relatedItem: eventId,
      relatedItemModel: 'Event'
    }));
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('Error creating event notifications:', error);
  }
};

// Create a system notification for a specific user
exports.createSystemNotification = async (userId, message, linkTo) => {
  try {
    await this.createNotification({
      recipient: userId,
      type: 'system',
      message,
      linkTo
    });
  } catch (error) {
    console.error('Error creating system notification:', error);
  }
};

module.exports = exports;