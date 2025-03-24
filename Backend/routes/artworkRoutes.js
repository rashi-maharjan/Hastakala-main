const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Artwork = require('../models/Artwork');
const { authenticateUser } = require('../middleware/authMiddleware');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/uploads/artwork');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for artwork image storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'artwork-' + uniqueSuffix + ext);
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

// Middleware to check if user is an artist
const isArtist = (req, res, next) => {
  if (req.user && req.user.role === 'artist') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Artists only.' });
  }
};

// Get all artworks
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find()
      .populate('artist', 'name profileImage')
      .sort({ createdAt: -1 });
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new artwork (artist only)
router.post(
  '/', 
  authenticateUser, 
  isArtist, 
  upload.single('image'), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No artwork image uploaded' });
      }

      const { title, price } = req.body;
      if (!title || !price) {
        // Delete uploaded file if request data is incomplete
        fs.unlinkSync(path.join(uploadDir, req.file.filename));
        return res.status(400).json({ error: 'Title and price are required' });
      }

      // Get relative path to save in database
      const imageUrl = `/uploads/artwork/${req.file.filename}`;
      
      const newArtwork = new Artwork({
        title,
        price,
        imageUrl,
        artist: req.user.userId
      });

      await newArtwork.save();
      
      // Populate artist info for response
      const populatedArtwork = await Artwork.findById(newArtwork._id)
        .populate('artist', 'name profileImage');

      res.status(201).json({
        message: 'Artwork added successfully',
        artwork: populatedArtwork
      });
    } catch (error) {
      console.error('Error adding artwork:', error);
      
      // Delete the uploaded file in case of error
      if (req.file) {
        fs.unlinkSync(path.join(uploadDir, req.file.filename));
      }
      
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete artwork (artist can only delete their own artwork)
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    
    // Check if the user is the artist or an admin
    if (
      artwork.artist.toString() !== req.user.userId && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ 
        error: 'Access denied. You can only delete your own artwork.' 
      });
    }
    
    // Get the image path
    const imagePath = path.join(__dirname, '../public', artwork.imageUrl);
    
    // Delete the image file if it exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // Delete the artwork document
    await Artwork.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;