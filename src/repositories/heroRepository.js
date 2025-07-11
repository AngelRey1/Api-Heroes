import fs from 'fs-extra';
import Hero from '../models/heroModel.js';
import petRepository from '../repositories/petRepository.js';

const filePath = './superheroes.json';

async function getHeroes() {
    try {
        const data = await fs.readJson(filePath);
        // Si pets es un array de objetos {id, name}, solo pasar el id al modelo
        return data.map(hero => new Hero(
            hero.id, hero.name, hero.alias, hero.city, hero.team,
            (hero.pets || []).map(p => typeof p === 'object' ? p.id : p)
        ));
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function saveHeroes(heroes) {
    try {
        // Obtener todas las mascotas para mapear id a nombre
        const pets = await petRepository.getPets();
        await fs.writeJson(filePath, heroes.map(h => ({
            id: h.id,
            name: h.name,
            alias: h.alias,
            city: h.city,
            team: h.team,
            pets: (h.pets || []).map(pid => {
                const pet = pets.find(p => p.id === pid);
                return pet ? { id: pet.id, name: pet.name } : { id: pid };
            })
        })));
    } catch (error) {
        console.error(error);
    }
}

export default {
    getHeroes,
    saveHeroes
};
