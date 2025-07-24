const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'reward', 'event', 'reminder'], default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  eventStart: { type: Date },
  eventEnd: { type: Date }
});

module.exports = mongoose.model('Notification', notificationSchema); 