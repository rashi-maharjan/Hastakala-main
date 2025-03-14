const mongoose = require('mongoose');  // Import mongoose

// Define your community post schema
const communityPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Ensure the user field is required
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            content: {
                type: String,
                required: true,
            },
            likes: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
        },
    ],
}, { timestamps: true });

// Create the model
const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

module.exports = CommunityPost;
