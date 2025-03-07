const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Making user_id optional
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Add validation to ensure end date is after start date
eventSchema.pre('save', function(next) {
    const startDateTime = new Date(`${this.start_date.toISOString().split('T')[0]}T${this.start_time}`);
    const endDateTime = new Date(`${this.end_date.toISOString().split('T')[0]}T${this.end_time}`);
    
    if (endDateTime <= startDateTime) {
        next(new Error('End date/time must be after start date/time'));
    } else {
        next();
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;