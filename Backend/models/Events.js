const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  location: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = Event;
