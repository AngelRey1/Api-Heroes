const Item = require('../models/itemModel');

exports.getAllItems = () => Item.find();
exports.getItem = (id) => Item.findById(id);
exports.createItem = (data) => new Item(data).save();
exports.updateItem = (id, data) => Item.findByIdAndUpdate(id, data, { new: true });
exports.deleteItem = (id) => Item.findByIdAndDelete(id); 