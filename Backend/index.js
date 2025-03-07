const express = require('express');
const cors = require('cors'); // Import CORS middleware
require('dotenv').config();  // Load environment variables
const connectDB = require('./config/db'); // Import the database connection function

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Allow frontend requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); // Parse JSON request bodies

// Middleware for file uploads
app.use(express.static('public')); // Serve static files from 'public' directory

// Your routes
const authRoutes = require('./routes/authRoute');
const eventRoutes = require('./routes/eventRoute'); // Add this line

app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes); // Add this line

// Connect to the database
connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});