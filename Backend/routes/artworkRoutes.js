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

// Initialize multer with increased file size limit
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Increased to 10MB max file size
  }
});

// Custom error handler for multer
const uploadMiddleware = (req, res, next) => {
  const uploadHandler = upload.single('image');
  
  uploadHandler(req, res, function(err) {
    if (err) {
      console.error('Multer error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            error: 'File too large. Maximum file size is 10MB.' 
          });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

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

// Get artwork by ID
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('artist', 'name profileImage');
    
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    
    res.status(200).json(artwork);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new artwork (artist only)
router.post(
  '/', 
  authenticateUser, 
  isArtist, 
  uploadMiddleware, // Use custom middleware to handle multer errors
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No artwork image uploaded' });
      }

      const { 
        title, 
        price, 
        inStock, 
        height, 
        width, 
        medium, 
        paper, 
        orientation, 
        frame, 
        description 
      } = req.body;
      
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
        artist: req.user.userId,
        inStock: inStock === 'true' || inStock === true,
        height,
        width,
        medium,
        paper,
        orientation,
        frame,
        description
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

// Update artwork (artist only can update their own artworks)
router.put(
  '/:id',
  authenticateUser,
  async (req, res) => {
    try {
      const artwork = await Artwork.findById(req.params.id);
      
      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
      }
      
      // Check if user is the artist or an admin
      if (
        artwork.artist.toString() !== req.user.userId && 
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ 
          error: 'Access denied. You can only update your own artwork.' 
        });
      }
      
      // Fields that can be updated
      const { 
        title, 
        price, 
        inStock, 
        height, 
        width, 
        medium, 
        paper, 
        orientation, 
        frame, 
        description 
      } = req.body;
      
      // Update allowed fields
      if (title) artwork.title = title;
      if (price) artwork.price = price;
      if (inStock !== undefined) artwork.inStock = inStock === 'true' || inStock === true;
      if (height) artwork.height = height;
      if (width) artwork.width = width;
      if (medium) artwork.medium = medium;
      if (paper) artwork.paper = paper;
      if (orientation) artwork.orientation = orientation;
      if (frame) artwork.frame = frame;
      if (description) artwork.description = description;
      
      await artwork.save();
      
      // Populate artist info for response
      const updatedArtwork = await Artwork.findById(artwork._id)
        .populate('artist', 'name profileImage');
      
      res.status(200).json({
        message: 'Artwork updated successfully',
        artwork: updatedArtwork
      });
    } catch (error) {
      console.error('Error updating artwork:', error);
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

// Add this method to your artworkRoutes.js
router.patch('/update-stock/:id', async (req, res) => {
  try {
    // Validate the ID format
    const id = req.params.id.trim();

    // Find the artwork
    const artwork = await Artwork.findById(id);
    
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Update the artwork's inStock status to false
    artwork.inStock = false;
    
    // Save the updated artwork
    await artwork.save();

    // Populate artist info for response
    const updatedArtwork = await Artwork.findById(id)
      .populate('artist', 'name profileImage');

    res.status(200).json({
      message: 'Artwork stock status updated successfully',
      artwork: updatedArtwork
    });
  } catch (error) {
    console.error('Error updating artwork stock:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: 'Failed to update artwork stock status'
    });
  }
});

module.exports = router;