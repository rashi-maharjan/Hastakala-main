const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');
const CommunityPost = require('../models/CommunityPost');
const Event = require('../models/Events');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        const { query } = req.query;

        // Validate query
        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Create a case-insensitive regex search
        const searchRegex = new RegExp(query.trim(), 'i');

        // Perform parallel searches across different collections
        const [artworks, communityPosts, events] = await Promise.all([
            Artwork.find({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { medium: searchRegex },
                    { paper: searchRegex }
                ]
            }).populate('artist', 'name profileImage').limit(10),

            CommunityPost.find({
                $or: [
                    { title: searchRegex },
                    { content: searchRegex },
                    { username: searchRegex }
                ]
            }).limit(10),

            Event.find({
                $or: [
                    { title: searchRegex },
                    { location: searchRegex }
                ]
            }).limit(10)
        ]);

        res.json({
            artworks,
            communityPosts,
            events
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'An error occurred during search', details: error.message });
    }
});

module.exports = router;