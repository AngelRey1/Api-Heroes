import Item from '../models/itemModel.js';
import User from '../models/userModel.js';

class ShopService {
  /**
   * Obtener todos los items disponibles
   */
  async getAvailableItems() {
    return await Item.find({ available: true }).sort({ price: 1 });
  }

  /**
   * Comprar un item
   */
  async buyItem(userId, itemId) {
    const user = await User.findById(userId);
    const item = await Item.findById(itemId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!item) {
      throw new Error('Item no encontrado');
    }

    if (!item.available) {
      throw new Error('Item no disponible');
    }

    if (user.coins < item.price) {
      throw new Error('Monedas insuficientes');
    }

    // Verificar si el usuario ya tiene el item
    if (user.inventory && user.inventory.some(i => i.item.toString() === itemId)) {
      throw new Error('Ya tienes este item');
    }

    // Comprar el item
    user.coins -= item.price;
    user.inventory = user.inventory || [];
    user.inventory.push({
      item: itemId,
      purchasedAt: new Date()
    });

    await user.save();

    return {
      message: `¡${item.name} comprado exitosamente!`,
      remainingCoins: user.coins,
      item: item
    };
  }

  /**
   * Obtener inventario del usuario
   */
  async getUserInventory(userId) {
    const user = await User.findById(userId).populate('inventory.item');
    return user.inventory || [];
  }

  /**
   * Usar un item del inventario
   */
  async useItem(userId, itemId) {
    const user = await User.findById(userId).populate('inventory.item');
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const inventoryItem = user.inventory.find(i => i.item._id.toString() === itemId);
    
    if (!inventoryItem) {
      throw new Error('Item no encontrado en tu inventario');
    }

    // Aplicar efecto del item
    const effect = this.applyItemEffect(inventoryItem.item, user);
    
    // Remover item del inventario si es consumible
    if (inventoryItem.item.type === 'consumable') {
      user.inventory = user.inventory.filter(i => i._id.toString() !== inventoryItem._id.toString());
    }

    await user.save();

    return {
      message: `¡${inventoryItem.item.name} usado!`,
      effect: effect,
      remainingItems: user.inventory.length
    };
  }

  /**
   * Aplicar efecto de item
   */
  applyItemEffect(item, user) {
    switch (item.type) {
      case 'food':
        // Aumentar salud de mascotas
        return { type: 'pet_health_boost', value: item.effect || 20 };
      
      case 'toy':
        // Aumentar felicidad de mascotas
        return { type: 'pet_happiness_boost', value: item.effect || 15 };
      
      case 'medicine':
        // Curar enfermedades
        return { type: 'cure_disease', value: 1 };
      
      case 'accessory':
        // Item cosmético
        return { type: 'cosmetic', value: item.name };
      
      default:
        return { type: 'unknown', value: 0 };
    }
  }

  /**
   * Obtener items por categoría
   */
  async getItemsByCategory(category) {
    return await Item.find({ 
      available: true, 
      category: category 
    }).sort({ price: 1 });
  }

  /**
   * Obtener items en oferta
   */
  async getItemsOnSale() {
    return await Item.find({ 
      available: true, 
      onSale: true 
    }).sort({ price: 1 });
  }
}

export default new ShopService(); 