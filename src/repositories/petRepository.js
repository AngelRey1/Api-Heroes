import fs from 'fs-extra';
import Pet from '../models/petModel.js';

const filePath = './superpets.json';

async function getPets() {
    try {
        const data = await fs.readJson(filePath);
        return data.map(pet => new Pet(
            pet.id,
            pet.name,
            pet.type,
            pet.superPower,
            pet.adoptedBy ?? null,
            pet.adoptionHistory ?? [],
            pet.status ?? 'available',
            pet.health ?? 100,
            pet.happiness ?? 100,
            pet.personality ?? 'neutral',
            pet.activityHistory ?? [],
            pet.customization ?? { free: [], paid: [] },
            pet.diseases ?? [],
            pet.lastCare ?? null
        ));
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        console.error(error);
        return [];
    }
}

async function savePets(pets) {
    try {
        await fs.writeJson(filePath, pets.map(p => ({
            id: p.id,
            name: p.name,
            type: p.type,
            superPower: p.superPower,
            adoptedBy: p.adoptedBy ?? null,
            adoptionHistory: p.adoptionHistory ?? [],
            status: p.status ?? 'available',
            health: p.health ?? 100,
            happiness: p.happiness ?? 100,
            personality: p.personality ?? 'neutral',
            activityHistory: p.activityHistory ?? [],
            customization: p.customization ?? { free: [], paid: [] },
            diseases: p.diseases ?? [],
            lastCare: p.lastCare ?? null
        })));
    } catch (error) {
        console.error(error);
    }
}

async function getPetById(id) {
    const pets = await getPets();
    return pets.find(pet => pet.id === parseInt(id));
}

export default {
    getPets,
    savePets,
    getPetById
}; 