const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Event = require('../models/Events');
const mongoose = require('mongoose');

// Validation middleware
const validateEventData = (req, res, next) => {
    const { title, start_date, end_date, start_time, end_time, location, user_id } = req.body;
    
    if (!title?.trim() || !start_date || !end_date || !start_time || !end_time || !location?.trim()) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Validate user_id if provided
    if (user_id && !mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Validate dates
    const startDateTime = new Date(`${start_date}T${start_time}`);
    const endDateTime = new Date(`${end_date}T${end_time}`);
    
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        return res.status(400).json({ error: "Invalid date or time format" });
    }
    
    if (endDateTime <= startDateTime) {
        return res.status(400).json({ error: "End date/time must be after start date/time" });
    }

    next();
};

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = 'public/uploads/events';
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        // Generate a unique filename with timestamp and random string
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `event-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1
    }
});

// Error handling middleware
const handleErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: err.message });
    }
    next(err);
};

// Create an event
router.post('/admin/events', 
    upload.single('image'),
    handleErrors,
    validateEventData,
    async (req, res) => {
        try {
            const { title, start_date, end_date, start_time, end_time, location, user_id } = req.body;

            const eventData = {
                title: title.trim(),
                start_date,
                end_date,
                start_time,
                end_time,
                location: location.trim(),
                image: req.file ? `/uploads/events/${req.file.filename}` : ''
            };

            // Only add user_id if it's provided and valid
            if (user_id && mongoose.Types.ObjectId.isValid(user_id)) {
                eventData.user_id = user_id;
            }

            const newEvent = new Event(eventData);
            await newEvent.save();
            
            res.status(201).json({ message: 'Event created successfully', event: newEvent });
        } catch (error) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            res.status(500).json({ error: "Failed to create event", details: error.message });
        }
    }
);

// Get all events
router.get('/admin/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ start_date: 1, start_time: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch events", details: error.message });
    }
});

// Get single event
router.get('/admin/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch event", details: error.message });
    }
});

// Update an event
router.put('/admin/events/:id',
    upload.single('image'),
    handleErrors,
    validateEventData,
    async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                if (req.file) {
                    await fs.unlink(req.file.path).catch(console.error);
                }
                return res.status(404).json({ error: 'Event not found' });
            }

            const { title, start_date, end_date, start_time, end_time, location, user_id } = req.body;

            // Update fields
            event.title = title.trim();
            event.start_date = start_date;
            event.end_date = end_date;
            event.start_time = start_time;
            event.end_time = end_time;
            event.location = location.trim();

            // Update user_id if provided and valid
            if (user_id && mongoose.Types.ObjectId.isValid(user_id)) {
                event.user_id = user_id;
            }

            // Handle image update
            if (req.file) {
                if (event.image) {
                    const oldImagePath = path.join(__dirname, '../public', event.image);
                    await fs.unlink(oldImagePath).catch(console.error);
                }
                event.image = `/uploads/events/${req.file.filename}`;
            }

            await event.save();
            res.json({ message: 'Event updated successfully', event });
        } catch (error) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            res.status(500).json({ error: "Failed to update event", details: error.message });
        }
    }
);

// Delete an event
router.delete('/admin/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Delete associated image
        if (event.image) {
            const imagePath = path.join(__dirname, '../public', event.image);
            await fs.unlink(imagePath).catch(console.error);
        }

        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete event", details: error.message });
    }
});

module.exports = router;