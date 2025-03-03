const express = require('express');
const cors = require('cors'); // Import CORS middleware
require('dotenv').config();  // Load environment variables


const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Allow frontend requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); // Parse JSON request bodies



// Your routes
const authRoutes = require('./routes/authRoute');
const connectDB = require('./config/db');
app.use('/api/auth', authRoutes);


connectDB()
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
