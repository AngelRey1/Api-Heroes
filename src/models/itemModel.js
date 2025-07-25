import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['food', 'toy', 'medicine', 'accessory', 'background', 'skin'], required: true },
  effect: { type: Object, default: {} },
  price: { type: Number, required: true },
  image: { type: String },
  target: { type: String, enum: ['pet', 'hero', 'both'], default: 'pet' },
});

export default mongoose.model('Item', itemSchema); 