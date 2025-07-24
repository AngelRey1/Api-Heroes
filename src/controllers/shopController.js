import User from '../models/userModel.js';
import Item from '../models/itemModel.js';

export const buyItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId, quantity = 1 } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const totalPrice = item.price * quantity;
    if (user.coins < totalPrice) return res.status(400).json({ error: 'Not enough coins' });
    user.coins -= totalPrice;
    const invItem = user.inventory.find(i => i.itemId.toString() === itemId);
    if (invItem) {
      invItem.quantity += quantity;
    } else {
      user.inventory.push({ itemId, quantity });
    }
    await user.save();
    res.json({ message: 'Item purchased', coins: user.coins, inventory: user.inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 