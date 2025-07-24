const Minigame = require('../models/minigameModel');

exports.getAllMinigames = () => Minigame.find();
exports.getMinigame = (id) => Minigame.findById(id);
exports.createMinigame = (data) => new Minigame(data).save();
exports.updateMinigame = (id, data) => Minigame.findByIdAndUpdate(id, data, { new: true });
exports.deleteMinigame = (id) => Minigame.findByIdAndDelete(id); 