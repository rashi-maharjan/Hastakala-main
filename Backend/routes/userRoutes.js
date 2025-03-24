const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../models/Users');
const { authenticateUser } = require('../middleware/authMiddleware');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/uploads/profile');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Upload profile image route
router.post('/upload-profile-image', authenticateUser, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get relative path to save in database
    const relativePath = `/uploads/profile/${req.file.filename}`;
    
    // Update user with new profile image path
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { profileImage: relativePath },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      // Delete the uploaded file if user update fails
      fs.unlinkSync(path.join(uploadDir, req.file.filename));
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage
      }
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    
    // Delete the uploaded file in case of error
    if (req.file) {
      fs.unlinkSync(path.join(uploadDir, req.file.filename));
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Delete profile image route
router.delete('/delete-profile-image', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.profileImage) {
      // Get full path to delete file
      const fullPath = path.join(__dirname, '../public', user.profileImage);
      
      // Check if file exists before deleting
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
      
      // Update user to remove profile image reference
      user.profileImage = null;
      await user.save();
    }
    
    res.status(200).json({
      message: 'Profile image deleted successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: null
      }
    });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get profile image
router.get('/profile-image/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('profileImage');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.profileImage) {
      return res.status(404).json({ error: 'No profile image found' });
    }
    
    res.status(200).json({ profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/profiles', authenticateUser, async (req, res) => {
    try {
      const { userIds } = req.body;
      
      console.log('Backend: Received raw user IDs:', userIds);
      
      // Validate input
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: 'Invalid user IDs', receivedIds: userIds });
      }
      
      // Convert all IDs to strings and filter out any invalid ones
      const validUserIds = userIds
        .map(id => typeof id === 'string' ? id : String(id))
        .filter(id => mongoose.Types.ObjectId.isValid(id));
      
      console.log('Backend: Validated user IDs:', validUserIds);
      
      // Find users by their IDs and return relevant profile information
      const userProfiles = await User.find({ 
        _id: { $in: validUserIds }
      }, 'id _id profileImage name email'); // Added more fields for debugging
      
      console.log('Backend: Found user profiles:', userProfiles.map(profile => ({
        id: profile._id,
        name: profile.name,
        profileImage: profile.profileImage
      })));
      
      // If no profiles found, log and return
      if (userProfiles.length === 0) {
        console.log('No user profiles found for given IDs');
        return res.status(404).json({ error: 'No user profiles found', requestedIds: userIds });
      }
      
      res.json(userProfiles);
    } catch (error) {
      console.error('Backend: Error fetching user profiles:', error);
      res.status(500).json({ 
        error: 'Failed to fetch user profiles', 
        details: error.message 
      });
    }
  });
  
module.exports = router;