import Hero from '../models/heroModel.js';

class HeroRepository {
    async getHeroes(filter = {}) {
        try {
            // Trae héroes filtrados y sus mascotas (populate pets)
            return await Hero.find(filter).populate('pets');
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getHeroById(id) {
        try {
            if (id.length === 8) {
                // Buscar por id_corto
                const all = await Hero.find().populate('pets');
                return all.find(h => h._id.toString().substring(0,8) === id);
            } else {
                return await Hero.findById(id).populate('pets');
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async saveHero(heroData) {
        try {
            // Si heroData tiene _id, actualiza; si no, crea nuevo
            if (heroData._id) {
                return await Hero.findByIdAndUpdate(heroData._id, heroData, { new: true });
            } else {
                const hero = new Hero(heroData);
                return await hero.save();
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default HeroRepository;
