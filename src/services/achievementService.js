const Achievement = require('../models/achievementModel');

exports.getAllAchievements = () => Achievement.find();
exports.getAchievement = (id) => Achievement.findById(id);
exports.createAchievement = (data) => new Achievement(data).save();
exports.updateAchievement = (id, data) => Achievement.findByIdAndUpdate(id, data, { new: true });
exports.deleteAchievement = (id) => Achievement.findByIdAndDelete(id); 