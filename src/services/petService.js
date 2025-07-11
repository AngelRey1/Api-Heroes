import petRepository from '../repositories/petRepository.js';
import heroRepository from '../repositories/heroRepository.js';
import Pet from '../models/petModel.js';

async function getAllPets() {
    return await petRepository.getPets();
}

async function addPet(pet) {
    if (!pet.name || !pet.type) {
        throw new Error('La mascota debe tener nombre y tipo.');
    }
    const pets = await petRepository.getPets();
    let newId;
    if (pet.id !== undefined && pet.id !== null) {
        if (pets.some(p => p.id === parseInt(pet.id))) {
            throw new Error('El id de la mascota ya existe.');
        }
        newId = parseInt(pet.id);
    } else {
        newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
    }
    const newPet = new Pet(newId, pet.name, pet.type, pet.superPower, null, [], 'available');
    pets.push(newPet);
    await petRepository.savePets(pets);
    return newPet;
}

async function adoptPet(petId, heroId, reason = '', notes = '') {
    const pets = await petRepository.getPets();
    const pet = pets.find(p => p.id === parseInt(petId));
    if (!pet) throw new Error('Mascota no encontrada');
    if (pet.adoptedBy) throw new Error('La mascota ya fue adoptada');
    const heroes = await heroRepository.getHeroes();
    const hero = heroes.find(h => h.id === parseInt(heroId));
    if (!hero) throw new Error('Héroe no encontrado');
    // Registrar adopción
    const adoptionDate = new Date().toISOString();
    const adoptionRecord = {
        heroId: hero.id,
        heroName: hero.name,
        adoptionDate,
        reason,
        notes,
        status: 'adopted'
    };
    pet.adoptedBy = hero.id;
    pet.status = 'adopted';
    pet.adoptionHistory = pet.adoptionHistory || [];
    pet.adoptionHistory.push(adoptionRecord);
    hero.pets = hero.pets || [];
    hero.pets.push(pet.id);
    await petRepository.savePets(pets);
    await heroRepository.saveHeroes(heroes);
    return { message: `La mascota ${pet.name} fue adoptada por ${hero.name}`, adoption: adoptionRecord };
}

async function returnPet(petId, notes = '') {
    const pets = await petRepository.getPets();
    const pet = pets.find(p => p.id === parseInt(petId));
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('La mascota no está adoptada');
    const heroes = await heroRepository.getHeroes();
    const hero = heroes.find(h => h.id === parseInt(pet.adoptedBy));
    // Actualizar historial
    if (pet.adoptionHistory && pet.adoptionHistory.length > 0) {
        const lastAdoption = pet.adoptionHistory[pet.adoptionHistory.length - 1];
        if (lastAdoption.status === 'adopted') {
            lastAdoption.status = 'returned';
            lastAdoption.returnDate = new Date().toISOString();
            lastAdoption.returnNotes = notes;
        }
    }
    // Quitar la mascota del héroe
    if (hero && hero.pets) {
        hero.pets = hero.pets.filter(pid => pid !== pet.id);
        await heroRepository.saveHeroes(heroes);
    }
    pet.adoptedBy = null;
    pet.status = 'returned';
    await petRepository.savePets(pets);
    return { message: `La mascota ${pet.name} fue devuelta`, pet };
}

async function deletePet(id) {
    const pets = await petRepository.getPets();
    const pet = pets.find(p => p.id === parseInt(id));
    if (!pet) {
        throw new Error('Mascota no encontrada');
    }
    if (pet.adoptedBy) {
        const heroes = await heroRepository.getHeroes();
        const hero = heroes.find(h => h.id === parseInt(pet.adoptedBy));
        if (hero && hero.pets) {
            hero.pets = hero.pets.filter(pid => pid !== pet.id);
            await heroRepository.saveHeroes(heroes);
        }
    }
    const filteredPets = pets.filter(pet => pet.id !== parseInt(id));
    await petRepository.savePets(filteredPets);
    return { message: 'Mascota eliminada' };
}

async function getPetById(id) {
    return await petRepository.getPetById(id);
}

async function updatePet(id, data) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    if (data.id !== undefined && data.id !== null && data.id !== pets[index].id) {
        if (pets.some(p => p.id === parseInt(data.id))) {
            throw new Error('El nuevo id de la mascota ya existe.');
        }
        pets[index].id = parseInt(data.id);
    }
    if (data.name !== undefined) pets[index].name = data.name;
    if (data.type !== undefined) pets[index].type = data.type;
    if (data.superPower !== undefined) pets[index].superPower = data.superPower;
    await petRepository.savePets(pets);
    return pets[index];
}

export default {
    getAllPets,
    addPet,
    adoptPet,
    returnPet,
    deletePet,
    getPetById,
    updatePet
};
