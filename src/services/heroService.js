import HeroRepository from '../repositories/heroRepository.js';
import PetRepository from '../repositories/petRepository.js';
import { toBasicPet } from './petService.js';

class HeroService {
    constructor() {
        this.heroRepository = new HeroRepository();
        this.petRepository = new PetRepository();
    }

    async getAllHeroes(userId) {
        const heroes = await this.heroRepository.getHeroes({ owner: userId });
        // Transformar el array pets de cada héroe para que solo incluya los datos básicos
        return heroes.map(hero => ({
            ...hero.toObject(),
            pets: (hero.pets || []).map(pet => toBasicPet(pet))
        }));
    }

    async addHero(hero) {
        if (!hero.name || !hero.alias) {
            throw new Error("El héroe debe tener un nombre y un alias.");
        }
        hero.pets = [];
        return await this.heroRepository.saveHero(hero);
    }

    async updateHero(id, updatedHero, userId) {
        const hero = await this.heroRepository.getHeroById(id);
        if (!hero || hero.owner.toString() !== userId.toString()) {
            throw { status: 403, message: 'No tienes permiso para modificar este héroe.' };
        }
        return await this.heroRepository.saveHero({ ...updatedHero, _id: id, owner: userId });
    }

    async deleteHero(id, userId) {
        const hero = await this.heroRepository.getHeroById(id);
        if (!hero || hero.owner.toString() !== userId.toString()) {
            throw { status: 403, message: 'No tienes permiso para eliminar este héroe.' };
        }
        await hero.deleteOne();
        return { message: 'Héroe eliminado' };
    }

    async findHeroesByCity(city, userId) {
        const heroes = await this.heroRepository.getHeroes({ owner: userId });
        return heroes.filter(hero => hero.city && hero.city.toLowerCase() === city.toLowerCase());
    }

    async faceVillain(heroId, villain, userId) {
        const hero = await this.heroRepository.getHeroById(heroId);
        if (!hero || hero.owner.toString() !== userId.toString()) {
            throw { status: 403, message: 'No tienes permiso para usar este héroe.' };
        }
        return `${hero.alias} enfrenta a ${villain}`;
    }

    async getHeroPets(id, userId) {
        const hero = await this.heroRepository.getHeroById(id);
        if (!hero || hero.owner.toString() !== userId.toString()) throw { status: 403, message: 'No tienes permiso para ver las mascotas de este héroe.' };
        return (hero.pets || []).map(pet => toBasicPet(pet));
    }
}

export default HeroService;
