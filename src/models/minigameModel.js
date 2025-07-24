const mongoose = require('mongoose');

const minigameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  highScores: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number },
    }
  ]
});

module.exports = mongoose.model('Minigame', minigameSchema); 