import User from '../models/userModel.js';
import Item from '../models/itemModel.js';

async function buyItem(itemId, userId) {
  try {
    const item = await Item.findById(itemId);
    if (!item) throw new Error('Item no encontrado');
    
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    
    const totalPrice = item.price;
    if (user.coins < totalPrice) throw new Error('No tienes suficientes monedas');
    
    user.coins -= totalPrice;
    
    const invItem = user.inventory.find(i => i.itemId.toString() === itemId);
    if (invItem) {
      invItem.quantity += 1;
    } else {
      user.inventory.push({ itemId, quantity: 1 });
    }
    
    await user.save();
    
    return { 
      message: 'Item comprado', 
      coins: user.coins, 
      inventory: user.inventory,
      item: item
    };
  } catch (error) {
    throw error;
  }
}

export default {
  buyItem
}; 