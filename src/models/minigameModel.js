import mongoose from 'mongoose';

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

export default mongoose.model('Minigame', minigameSchema); 