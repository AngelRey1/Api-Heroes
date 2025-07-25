import Minigame from '../models/minigameModel.js';

export const getAllMinigames = async (req, res) => {
  try {
    const minigames = await Minigame.find();
    res.json(minigames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMinigame = async (req, res) => {
  try {
    const minigame = await Minigame.findById(req.params.id);
    if (!minigame) return res.status(404).json({ error: 'Minigame not found' });
    res.json(minigame);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMinigame = async (req, res) => {
  try {
    const minigame = new Minigame(req.body);
    await minigame.save();
    res.status(201).json(minigame);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateMinigame = async (req, res) => {
  try {
    const minigame = await Minigame.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!minigame) return res.status(404).json({ error: 'Minigame not found' });
    res.json(minigame);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMinigame = async (req, res) => {
  try {
    const minigame = await Minigame.findByIdAndDelete(req.params.id);
    if (!minigame) return res.status(404).json({ error: 'Minigame not found' });
    res.json({ message: 'Minigame deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveScore = async (req, res) => {
  try {
    const minigame = await Minigame.findById(req.params.id);
    if (!minigame) return res.status(404).json({ error: 'Minigame not found' });
    const { score } = req.body;
    const userId = req.user._id;
    // Actualizar o agregar el score del usuario
    const existing = minigame.highScores.find(s => s.userId.toString() === userId.toString());
    if (existing) {
      if (score > existing.score) existing.score = score;
    } else {
      minigame.highScores.push({ userId, score });
    }
    await minigame.save();
    res.json({ message: 'Score saved', highScores: minigame.highScores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMinigameRanking = async (req, res) => {
  try {
    const minigame = await Minigame.findById(req.params.id).populate('highScores.userId', 'username');
    if (!minigame) return res.status(404).json({ error: 'Minigame not found' });
    const ranking = [...minigame.highScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(s => ({ username: s.userId?.username || 'User', score: s.score }));
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 