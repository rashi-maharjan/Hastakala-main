const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Enable CORS for frontend access
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Added PATCH method
  allowedHeaders: ['Content-Type', 'Authorization'], // Added allowed headers
  credentials: true
}));

// Add request logger to help debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Parse incoming JSON requests
app.use(express.json());

// Middleware for file uploads - serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const authRoutes = require('./routes/authRoute');
const eventRoutes = require('./routes/eventRoute');
const communityRoutes = require('./routes/communityRoute');
const userRoutes = require('./routes/userRoutes');
const artworkRoutes = require('./routes/artworkRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', communityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/artwork', artworkRoutes);
app.use('/api/notifications', notificationRoutes);

// Connect to the database
connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});