const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  criteria: { type: String },
  reward: { type: Object, default: {} },
});

module.exports = mongoose.model('Achievement', achievementSchema); 