const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected to:', mongoose.connection.name); // Log database name
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = connectDB;
