const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Enable CORS for frontend access
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Add request logger to help debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json()); // Parse incoming JSON requests

// Middleware for file uploads
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/authRoute');
const eventRoutes = require('./routes/eventRoute');
const communityRoutes = require('./routes/communityRoute');

app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', communityRoutes); // Changed from '/api/community' to '/api'

// Connect to the database
connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});