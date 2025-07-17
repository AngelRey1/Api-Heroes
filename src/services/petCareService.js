// src/services/petCareService.js
import PetRepository from '../repositories/petRepository.js';
import Pet from '../models/petModel.js';

const petRepository = new PetRepository();

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function randomChance(prob) {
    return Math.random() < prob;
}

function countRecentActions(pet, action, minutes = 60) {
    const now = Date.now();
    return (pet.activityHistory || []).filter(a => a.action === action && (now - new Date(a.date).getTime()) < minutes * 60 * 1000).length;
}

async function feedPet(petId, food = 'default', userId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet || pet.owner.toString() !== userId.toString()) throw { status: 403, message: 'No tienes permiso para cuidar esta mascota.' };
    if (pet.health === 0 || pet.status === 'dead') {
        throw new Error('La mascota ha muerto y no puede recibir más cuidados.');
    }
    let healthBoost = 10;
    let happinessBoost = 5;
    if (food === 'premium') { healthBoost = 20; happinessBoost = 15; }
    if ((pet.health ?? 100) >= 100) {
        if (randomChance(0.5)) {
            pet.diseases = pet.diseases || [];
            pet.diseases.push('indigestión');
            pet.activityHistory.push({ action: 'sick', disease: 'indigestión', date: new Date() });
            await pet.save();
            return { message: '¡Sobrealimentación! La mascota se enfermó de indigestión.', health: pet.health, diseases: pet.diseases };
        }
    }
    if (countRecentActions(pet, 'feed', 10) >= 3) {
        pet.diseases = pet.diseases || [];
        pet.diseases.push('empacho');
        pet.activityHistory.push({ action: 'sick', disease: 'empacho', date: new Date() });
        await pet.save();
        return { message: '¡Demasiada comida en poco tiempo! La mascota se enfermó de empacho.', health: pet.health, diseases: pet.diseases };
    }
    const lastFoods = (pet.activityHistory || []).filter(a => a.action === 'feed').slice(-3).map(a => a.food);
    if (lastFoods.length === 3 && lastFoods.every(f => f === food)) {
        pet.happiness = clamp((pet.happiness ?? 100) - 10, 0, 100);
    }
    pet.health = clamp((pet.health ?? 100) + healthBoost, 0, 100);
    pet.happiness = clamp((pet.happiness ?? 100) + happinessBoost, 0, 100);
    if (pet.health === 0) {
        if (pet.status !== 'dead') {
            pet.status = 'dead';
            pet.deathDate = new Date();
        }
    }
    pet.activityHistory = pet.activityHistory || [];
    pet.activityHistory.push({ action: 'feed', food, date: new Date() });
    pet.lastCare = new Date();
    await pet.save();
    return { message: `Mascota alimentada con ${food}`, health: pet.health, happiness: pet.happiness };
}

async function walkPet(petId, userId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet || pet.owner.toString() !== userId.toString()) throw { status: 403, message: 'No tienes permiso para cuidar esta mascota.' };
    if (pet.health === 0 || pet.status === 'dead') {
        throw new Error('La mascota ha muerto y no puede recibir más cuidados.');
    }
    // Personalidad: perezoso pierde felicidad si pasea mucho
    if (pet.personality === 'perezoso' && countRecentActions(pet, 'walk', 60) >= 2) {
        pet.happiness = clamp((pet.happiness ?? 100) - 10, 0, 100);
    } else {
        pet.happiness = clamp((pet.happiness ?? 100) + 10, 0, 100);
    }
    pet.health = clamp((pet.health ?? 100) + 5, 0, 100);
    if (pet.health === 0) {
        if (pet.status !== 'dead') {
            pet.status = 'dead';
            pet.deathDate = new Date();
        }
    }
    pet.activityHistory = pet.activityHistory || [];
    pet.activityHistory.push({ action: 'walk', date: new Date() });
    pet.lastCare = new Date();
    await pet.save();
    return { message: 'Mascota paseada', health: pet.health, happiness: pet.happiness };
}

async function playWithPet(petId, userId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet || pet.owner.toString() !== userId.toString()) throw { status: 403, message: 'No tienes permiso para cuidar esta mascota.' };
    if (pet.health === 0 || pet.status === 'dead') {
        throw new Error('La mascota ha muerto y no puede recibir más cuidados.');
    }
    // Penalización por jugar demasiado
    if (countRecentActions(pet, 'play', 10) >= 3) {
        pet.diseases = pet.diseases || [];
        pet.diseases.push('agotamiento');
        pet.activityHistory.push({ action: 'sick', disease: 'agotamiento', date: new Date() });
        await pet.save();
        return { message: '¡Demasiado juego! La mascota se enfermó de agotamiento.', health: pet.health, diseases: pet.diseases };
    }
    // Personalidad: juguetón pierde felicidad si no juega seguido
    if (pet.personality === 'juguetón') {
        const lastPlay = (pet.activityHistory || []).reverse().find(a => a.action === 'play');
        if (!lastPlay || (Date.now() - new Date(lastPlay.date).getTime()) > 6 * 60 * 60 * 1000) {
            pet.happiness = clamp((pet.happiness ?? 100) - 10, 0, 100);
        }
    }
    pet.happiness = clamp((pet.happiness ?? 100) + 15, 0, 100);
    pet.health = clamp((pet.health ?? 100) - 2, 0, 100); // jugar cansa
    if (pet.health === 0) {
        if (pet.status !== 'dead') {
            pet.status = 'dead';
            pet.deathDate = new Date();
        }
    }
    pet.activityHistory = pet.activityHistory || [];
    pet.activityHistory.push({ action: 'play', date: new Date() });
    pet.lastCare = new Date();
    await pet.save();
    return { message: 'Mascota jugó', health: pet.health, happiness: pet.happiness };
}

async function bathPet(petId, userId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet || pet.owner.toString() !== userId.toString()) throw { status: 403, message: 'No tienes permiso para cuidar esta mascota.' };
    if (pet.health === 0 || pet.status === 'dead') {
        throw new Error('La mascota ha muerto y no puede recibir más cuidados.');
    }
    // Penalización por bañar muchas veces seguidas
    if (countRecentActions(pet, 'bath', 30) >= 2) {
        pet.diseases = pet.diseases || [];
        pet.diseases.push('resfriado');
        pet.activityHistory.push({ action: 'sick', disease: 'resfriado', date: new Date() });
        await pet.save();
        return { message: '¡Demasiados baños! La mascota se resfrió.', happiness: pet.happiness, diseases: pet.diseases };
    }
    pet.happiness = clamp((pet.happiness ?? 100) + 5, 0, 100);
    pet.activityHistory = pet.activityHistory || [];
    pet.activityHistory.push({ action: 'bath', date: new Date() });
    pet.lastCare = new Date();
    
    // Verificar muerte ANTES de guardar
    if (pet.health === 0) {
        if (pet.status !== 'dead') {
            pet.status = 'dead';
            pet.deathDate = new Date();
        }
    }
    
    await pet.save();
    return { message: 'Mascota bañada', happiness: pet.happiness };
}

async function customizePet(petId, item, type = 'free', userId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet || pet.owner.toString() !== userId.toString()) throw { status: 403, message: 'No tienes permiso para cuidar esta mascota.' };
    if (pet.health === 0 || pet.status === 'dead') {
        throw new Error('La mascota ha muerto y no puede recibir más cuidados.');
    }
    
    // TODO: Implementar sistema de balance del usuario
    // Por ahora, permitir customización gratuita
    if (type === 'paid') {
        // Simular verificación de balance (implementar cuando se agregue sistema de monedas)
        const userBalance = 0; // Temporal: obtener balance real del usuario
        if (userBalance < 1) {
            throw new Error('No tienes saldo suficiente para customización paga.');
        }
    }
    
    pet.customization = pet.customization || { free: [], paid: [] };
    pet.customization[type] = pet.customization[type] || [];
    pet.customization[type].push(item);
    pet.activityHistory = pet.activityHistory || [];
    pet.activityHistory.push({ action: 'customize', item, type, date: new Date() });
    await pet.save();
    return { message: `Mascota customizada con ${item} (${type})`, customization: pet.customization };
}

async function healPet(petId, disease, userId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet || pet.owner.toString() !== userId.toString()) throw { status: 403, message: 'No tienes permiso para cuidar esta mascota.' };
    if (pet.health === 0 || pet.status === 'dead') {
        throw new Error('La mascota ha muerto y no puede recibir más cuidados.');
    }
    pet.diseases = (pet.diseases || []).filter(d => d !== disease);
    pet.health = clamp((pet.health ?? 100) + 15, 0, 100);
    pet.activityHistory = pet.activityHistory || [];
    pet.activityHistory.push({ action: 'heal', disease, date: new Date() });
    await pet.save();
    return { message: `Mascota curada de ${disease}`, health: pet.health, diseases: pet.diseases };
}

async function getPetStatus(petId, userId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet || pet.owner.toString() !== userId.toString()) throw { status: 403, message: 'No tienes permiso para ver esta mascota.' };
    // Retornar toda la información relevante de la mascota
    return {
        id: pet._id, // Corregido: usar _id en lugar de id
        name: pet.name,
        type: pet.type,
        superPower: pet.superPower,
        adoptedBy: pet.adoptedBy,
        adoptionHistory: pet.adoptionHistory,
        status: pet.status,
        health: pet.health,
        happiness: pet.happiness,
        personality: pet.personality,
        activityHistory: pet.activityHistory,
        customization: pet.customization,
        diseases: pet.diseases,
        lastCare: pet.lastCare
    };
}

async function makePetSick(petId, disease, userId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet || pet.owner.toString() !== userId.toString()) throw { status: 403, message: 'No tienes permiso para cuidar esta mascota.' };
    if (pet.health === 0 || pet.status === 'dead') {
        throw new Error('La mascota ha muerto y no puede recibir más cuidados.');
    }
    pet.diseases = pet.diseases || [];
    if (!pet.diseases.includes(disease)) pet.diseases.push(disease);
    pet.health = clamp((pet.health ?? 100) - 20, 0, 100);
    if (pet.health === 0) {
        if (pet.status !== 'dead') {
            pet.status = 'dead';
            pet.deathDate = new Date();
        }
    }
    pet.activityHistory = pet.activityHistory || [];
    pet.activityHistory.push({ action: 'sick', disease, date: new Date() });
    await pet.save();
    return { message: `Mascota enfermó de ${disease}`, health: pet.health, happiness: pet.happiness, diseases: pet.diseases };
}

async function decayPetStats(petId, hours = 1, userId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet || pet.owner.toString() !== userId.toString()) throw { status: 403, message: 'No tienes permiso para cuidar esta mascota.' };
    if (pet.health === 0 || pet.status === 'dead') {
        throw new Error('La mascota ha muerto y no puede recibir más cuidados.');
    }
    // Si está enferma y no se cura, decae más rápido
    let healthDecay = 2 * hours;
    let happinessDecay = 3 * hours;
    if (pet.diseases && pet.diseases.length > 0) {
        healthDecay *= 2;
        happinessDecay *= 2;
    }
    pet.health = clamp((pet.health ?? 100) - healthDecay, 0, 100);
    if (pet.health === 0) {
        if (pet.status !== 'dead') {
            pet.status = 'dead';
            pet.deathDate = new Date();
        }
    }
    // Si abandono es muy largo, probabilidad de enfermedad
    if (hours >= 24 && randomChance(0.3)) {
        pet.diseases = pet.diseases || [];
        pet.diseases.push('tristeza');
        pet.activityHistory.push({ action: 'sick', disease: 'tristeza', date: new Date() });
    }
    await pet.save();
    return { message: `Stats decay for ${hours}h`, health: pet.health, happiness: pet.happiness, diseases: pet.diseases };
}

export default {
    feedPet,
    walkPet,
    playWithPet,
    bathPet,
    customizePet,
    healPet,
    getPetStatus,
    makePetSick,
    decayPetStats
}; 