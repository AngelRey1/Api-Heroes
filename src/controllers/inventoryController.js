import User from '../models/userModel.js';
import Item from '../models/itemModel.js';
import Pet from '../models/petModel.js';

export const getInventory = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('inventory.itemId');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const useItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId, petId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const invItem = user.inventory.find(i => i.itemId.toString() === itemId);
    if (!invItem || invItem.quantity < 1) return res.status(400).json({ error: 'No item in inventory' });
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    // Aplicar efecto a la mascota
    let pet = null;
    if (petId) {
      pet = await Pet.findById(petId);
      if (!pet) return res.status(404).json({ error: 'Pet not found' });
      // Aplica efectos (ejemplo: health, happiness, energy)
      if (item.effect) {
        if (item.effect.health) pet.health = Math.min(100, (pet.health || 0) + item.effect.health);
        if (item.effect.happiness) pet.happiness = Math.min(100, (pet.happiness || 0) + item.effect.happiness);
        if (item.effect.energy) pet.energy = Math.min(100, (pet.energy || 0) + item.effect.energy);
      }
      await pet.save();
    }
    // Actualizar inventario
    invItem.quantity -= 1;
    if (invItem.quantity === 0) {
      user.inventory = user.inventory.filter(i => i.itemId.toString() !== itemId);
    }
    await user.save();
    res.json({ message: 'Item used', inventory: user.inventory, pet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 