const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Ensure correct model path
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
        user = new User({ name, email, password: hashedPassword, role: role || 'user' });
        await user.save();
        
        console.log("Registration successful for:", email);
        res.status(201).json({ message: 'User registered successfully' });
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
                role: user.role 
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
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

module.exports = router;