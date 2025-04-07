const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticateUser } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// Get notifications for the current user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      recipient: req.user.userId 
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name profileImage')
    .limit(50);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticateUser, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    // Ensure the user can only mark their own notifications as read
    if (notification.recipient.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to modify this notification' });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
router.post('/mark-all-read', authenticateUser, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { 
        recipient: req.user.userId, 
        isRead: false 
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({ 
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error marking notifications as read', error: error.message });
  }
});

// Delete a notification
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    // Ensure the user can only delete their own notifications
    if (notification.recipient.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this notification' });
    }
    
    await Notification.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get unread notification count
router.get('/unread-count', authenticateUser, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.userId,
      isRead: false
    });
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;