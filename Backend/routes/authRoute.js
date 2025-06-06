const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("Error: JWT_SECRET is not defined in the .env file.");
    process.exit(1); // Stop execution if JWT_SECRET is missing
}

// ✅ REGISTER Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        console.log("Registration attempt for:", email);

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log("Registration failed: User already exists");
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'normal_user',
            profileImage: null // Initialize profile image as null
        });
        await user.save();
        
        console.log("Registration successful for:", email);
        res.status(201).json({ 
            message: 'User registered successfully',
            userId: user._id // Return the user ID for the frontend
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ LOGIN Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log("Login attempt for:", email);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Login failed: User not found");
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Login failed: Password mismatch");
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = { userId: user._id, role: user.role };
        console.log("Creating token with payload:", payload);
        
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        console.log("Login successful for:", email);
        
        res.status(200).json({
            token: `Bearer ${token}`,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                profileImage: user.profileImage
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
        const tokenToVerify = token.startsWith("Bearer ") ? token.slice(7) : token;
        const decoded = jwt.verify(tokenToVerify, JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Test route to verify token
router.get('/verify-token', async (req, res) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ valid: false, message: 'No token provided' });
    }
    
    try {
        const tokenToVerify = token.startsWith("Bearer ") ? token.slice(7) : token;
        const decoded = jwt.verify(tokenToVerify, JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(400).json({ valid: false, message: 'Invalid token' });
    }
});

// Add this endpoint to your authRoutes.js file

// Update user profile
router.put('/update-profile', authenticateUser, async (req, res) => {
    try {
      const { name, email } = req.body;
      const userId = req.user.userId;
  
      // Validate input
      if (!name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }
  
      if (!email.trim()) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      // Check if email is being changed and if it's already in use by another user
      if (email !== req.user.email) {
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
          return res.status(400).json({ error: 'Email is already in use by another account' });
        }
      }
  
      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, select: '-password' }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Return updated user
      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          profileImage: updatedUser.profileImage
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add this endpoint to your authRoutes.js file

// Change password
router.put('/change-password', authenticateUser, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;
  
      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new passwords are required' });
      }
  
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
      }
  
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if current password is correct
      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
  
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;