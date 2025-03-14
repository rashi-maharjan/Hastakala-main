const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const { authenticateUser } = require('../middleware/authMiddleware'); // Import the middleware

// Create a new post
// Create a new post
// Create a new post
router.post('/posts', authenticateUser, async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.userId;  // Make sure you're using the correct field (userId or _id)

    console.log("User ID when creating post:", userId); // Log userId to verify it's correct

    try {
        const newPost = new CommunityPost({
            user: userId, // Save the userId correctly here
            title,
            content,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
});

// Get all posts
// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await CommunityPost.find()
            .populate('user', 'name') // Populate user field
            .populate('comments.user', 'name') // Populate user in comments as well
            .sort({ createdAt: -1 }); // Sort posts by most recent

        console.log('Fetched posts:', posts); // Log the posts to check if `user` is populated correctly
        res.json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});


// Add a comment to a post
router.post('/posts/:postId/comments', authenticateUser, async (req, res) => { // Apply authenticateUser middleware
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user._id; // Access the authenticated user

    try {
        const post = await CommunityPost.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({ user: userId, content });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// Like a comment
router.put('/posts/:postId/comments/:commentId/like', authenticateUser, async (req, res) => { // Apply authenticateUser middleware
    const { postId, commentId } = req.params;
    const userId = req.user._id; // Access the authenticated user

    try {
        const post = await CommunityPost.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Toggle like
        const likeIndex = comment.likes.indexOf(userId);
        if (likeIndex === -1) {
            // User hasn't liked the comment yet, add like
            comment.likes.push(userId);
        } else {
            // User has already liked the comment, remove like
            comment.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ message: 'Error liking comment' });
    }
});
// Delete a comment
// Delete a comment
// Delete a comment
router.delete('/posts/:postId/comments/:commentId', authenticateUser, async (req, res) => {
    const { postId, commentId } = req.params;
    const userId = req.user._id; // Get the userId from the authenticated user

    try {
        const post = await CommunityPost.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the comment by its ID
        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the authenticated user is the one who posted the comment
        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        }

        // Remove the comment
        post.comments.pull(commentId); // This is an alternative to comment.remove()
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment' });
    }
});


module.exports = router;
