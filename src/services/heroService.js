import heroRepository from '../repositories/heroRepository.js';
import petRepository from '../repositories/petRepository.js';

async function getAllHeroes() {
    return await heroRepository.getHeroes();
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }

    const heroes = await heroRepository.getHeroes();
    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 1;
    const newHero = { ...hero, id: newId, pets: [] };

    heroes.push(newHero);
    await heroRepository.saveHeroes(heroes);

    return newHero;
}

async function updateHero(id, updatedHero) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));

    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }

    delete updatedHero.id;
    heroes[index] = { ...heroes[index], ...updatedHero };

    await heroRepository.saveHeroes(heroes);
    return heroes[index];
}

async function deleteHero(id) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));

    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }

    const filteredHeroes = heroes.filter(hero => hero.id !== parseInt(id));
    await heroRepository.saveHeroes(filteredHeroes);
    return { message: 'Héroe eliminado' };
}

async function findHeroesByCity(city) {
    const heroes = await heroRepository.getHeroes();
    return heroes.filter(hero => hero.city && hero.city.toLowerCase() === city.toLowerCase());
}

async function faceVillain(heroId, villain) {
    const heroes = await heroRepository.getHeroes();
    const hero = heroes.find(hero => hero.id === parseInt(heroId));
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    return `${hero.alias} enfrenta a ${villain}`;
}

// Nueva función: obtener mascotas de un héroe
async function getHeroPets(id) {
    const heroes = await heroRepository.getHeroes();
    const hero = heroes.find(h => h.id === parseInt(id));
    if (!hero) throw new Error('Héroe no encontrado');
    const pets = await petRepository.getPets();
    // Devolver id, name, type y superPower de cada mascota
    return pets
        .filter(pet => hero.pets && hero.pets.includes(pet.id))
        .map(pet => ({
            id: pet.id,
            name: pet.name,
            type: pet.type,
            superPower: pet.superPower
        }));
}

export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain,
    getHeroPets
};
