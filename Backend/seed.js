const mongoose = require('mongoose');
const User = require('./models/Users'); // Ensure correct path to Users model
require('dotenv').config(); // Load environment variables

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Seed data
const seedUsers = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123', // Note: You should hash passwords in your real app
        role: 'normal_user',
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'artist',
    },
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
    },
];

// Seed function
const seedDB = async () => {
    try {
        // Clear the collection (optional, if you want to reset it)
        await User.deleteMany({});
        
        // Insert seed users
        await User.insertMany(seedUsers);
        
        console.log('Seed data inserted');
    } catch (error) {
        console.error('Seeding error:', error.message);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
};

// Run the seed script
connectDB().then(seedDB);
