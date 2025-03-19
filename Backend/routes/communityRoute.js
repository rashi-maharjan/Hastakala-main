const express = require("express");
const mongoose = require("mongoose");
const CommunityPost = require("../models/CommunityPost");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all community posts (public route)
router.get("/posts", async (req, res) => {
    try {
        const posts = await CommunityPost.find().sort({ created_at: -1 });
        
        // Get comments for each post
        const postsWithComments = await Promise.all(
            posts.map(async (post) => {
                const postObj = post.toObject();
                const comments = await Comment.find({ post_id: post._id }).sort({ created_at: -1 });
                postObj.comments = comments;
                return postObj;
            })
        );
        
        res.status(200).json(postsWithComments);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: err.message });
    }
});

// Create a community post
router.post("/posts", authenticateUser, async (req, res) => {
    try {
        const { title, content, username } = req.body;
        const user_id = req.user.userId;
        
        console.log("Creating post with:", { user_id, username, title });
        
        // Validate required fields
        if (!title) {
            return res.status(400).json({ error: "title is required" });
        }
        if (!content) {
            return res.status(400).json({ error: "content is required" });
        }
        
        const post = new CommunityPost({ 
            user_id, 
            username: username || "Anonymous", 
            title, 
            content 
        });
        
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get a single community post by ID
router.get("/posts/:id", async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        
        const postObj = post.toObject();
        const comments = await Comment.find({ post_id: req.params.id }).sort({ created_at: -1 });
        postObj.comments = comments;
        
        res.status(200).json(postObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a community post
router.put("/posts/:id", authenticateUser, async (req, res) => {
    try {
        const { title, content } = req.body;
        
        // Find post and check ownership
        const post = await CommunityPost.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        
        // Check if user is the owner of the post
        if (post.user_id.toString() !== req.user.userId) {
            return res.status(403).json({ error: "Not authorized to update this post" });
        }
        
        const updatedPost = await CommunityPost.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a community post
router.delete("/posts/:id", authenticateUser, async (req, res) => {
    try {
        // Find post and check ownership
        const post = await CommunityPost.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        
        // Check if user is the owner of the post
        if (post.user_id.toString() !== req.user.userId) {
            return res.status(403).json({ error: "Not authorized to delete this post" });
        }
        
        await CommunityPost.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ post_id: req.params.id });
        await Like.deleteMany({ post_id: req.params.id });
        
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a comment to a post
router.post("/posts/:id/comments", authenticateUser, async (req, res) => {
    try {
        const { comment_text, username } = req.body;
        const user_id = req.user.userId;
        
        // Validate required fields
        if (!comment_text) {
            return res.status(400).json({ error: "comment_text is required" });
        }
        
        const comment = new Comment({ 
            post_id: req.params.id, 
            user_id,
            username: username || "Anonymous",
            comment_text 
        });
        
        await comment.save();
        await CommunityPost.findByIdAndUpdate(req.params.id, { $inc: { comments_count: 1 } });
        
        res.status(201).json(comment);
    } catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ error: err.message });
    }
});

// Like a post
router.post("/posts/:id/like", authenticateUser, async (req, res) => {
    try {
        const user_id = req.user.userId;
        
        // Check if user already liked this post
        const existingLike = await Like.findOne({ post_id: req.params.id, user_id });
        if (existingLike) {
            return res.status(400).json({ error: "You already liked this post" });
        }
        
        // Create new like
        const like = new Like({ post_id: req.params.id, user_id });
        await like.save();
        
        // Increment likes count
        await CommunityPost.findByIdAndUpdate(req.params.id, { $inc: { likes_count: 1 } });
        
        res.status(201).json(like);
    } catch (err) {
        console.error("Error liking post:", err);
        res.status(500).json({ error: err.message });
    }
});

// Unlike a post
router.delete("/posts/:id/unlike", authenticateUser, async (req, res) => {
    try {
        const user_id = req.user.userId;
        
        // Find and delete like
        const like = await Like.findOneAndDelete({ post_id: req.params.id, user_id });
        if (!like) {
            return res.status(400).json({ error: "You haven't liked this post" });
        }
        
        // Decrement likes count
        await CommunityPost.findByIdAndUpdate(req.params.id, { $inc: { likes_count: -1 } });
        
        res.status(200).json({ message: "Post unliked successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Debug route
router.get("/debug", (req, res) => {
    res.status(200).json({ 
        message: "Community API is working", 
        timestamp: new Date().toISOString() 
    });
});

module.exports = router;