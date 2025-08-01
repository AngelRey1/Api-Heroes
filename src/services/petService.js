import PetRepository from '../repositories/petRepository.js';
import HeroRepository from '../repositories/heroRepository.js';
import { ValidationError, NotFoundError, AuthorizationError } from '../utils/errors.js';
import { validateObjectId, validateRequiredFields, validateStringLength } from '../utils/validations.js';

function toBasicPet(pet) {
    if (!pet) return null;
    return {
        _id: pet._id,
        id_corto: pet._id ? pet._id.toString().substring(0, 8) : undefined,
        name: pet.name,
        type: pet.type,
        petType: pet.petType,
        superPower: pet.superPower,
        status: pet.getLifeStatus(),
        // Stats en tiempo real
        health: pet.health,
        happiness: pet.happiness,
        sleep: pet.sleep,
        hunger: pet.hunger,
        cleanliness: pet.cleanliness,
        energy: pet.energy,
        mood: pet.mood,
        isSleeping: pet.isSleeping,
        isSick: pet.isSick,
        sickness: pet.sickness,
        lastCare: pet.lastCare,
        adoptedBy: pet.adoptedBy && typeof pet.adoptedBy === 'object' ? {
            _id: pet.adoptedBy._id || pet.adoptedBy,
            name: pet.adoptedBy.name,
            alias: pet.adoptedBy.alias
        } : pet.adoptedBy,
        customization: pet.customization || { free: [], paid: [] },
        avatar: pet.avatar,
        glowColor: pet.glowColor,
        color: pet.color,
        personality: pet.personality
    };
}

class PetService {
    constructor() {
        this.petRepository = new PetRepository();
        this.heroRepository = new HeroRepository();
    }

    async createPet(petData, userId) {
        try {
            validateRequiredFields(petData, ['name', 'type']);
            validateStringLength(petData.name, 1, 50, 'Nombre de mascota');

            const pet = await this.petRepository.createPet({
                name: petData.name,
                type: petData.type,
                petType: petData.petType || petData.type,
                superPower: petData.superPower || 'Amor incondicional',
                color: petData.color || '#FFD700',
                personality: petData.personality || 'normal',
                accessories: petData.accessories || [],
                owner: userId,
                // Inicializar stats como en la imagen
                health: 100,
                happiness: 100,
                sleep: 100,
                hunger: 0,
                cleanliness: 100,
                energy: 100,
                mood: 'happy',
                isSleeping: false,
                isSick: false,
                status: 'viva',
                lastCare: new Date(),
                avatar: petData.avatar || '/assets/pet-default.png',
                glowColor: petData.glowColor || '#FF69B4'
            });
            return pet;
        } catch (error) {
            throw new Error(`Error al crear mascota: ${error.message}`);
        }
    }

    async getAllPets(userId) {
        try {
            let pets;
            if (!userId) {
                pets = await this.petRepository.getPets();
            } else {
                validateObjectId(userId, 'ID de usuario');
                pets = await this.petRepository.getPets({ owner: userId });
            }
            
            // Actualizar estadísticas en tiempo real para cada mascota
            const updatedPets = await Promise.all(pets.map(async (pet) => {
                pet.updateStats();
                await pet.save();
                return pet;
            }));
            
            return updatedPets.map(toBasicPet);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new Error(`Error al obtener mascotas: ${error.message}`);
        }
    }

    async getPetById(petId, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para ver esta mascota');
            }

            // Actualizar estadísticas en tiempo real
            pet.updateStats();
            await pet.save();

            return pet;
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al obtener mascota: ${error.message}`);
        }
    }

    async getPetStats(petId, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para ver esta mascota');
            }

            // Actualizar estadísticas en tiempo real
            pet.updateStats();
            await pet.save();

            return pet.getBasicStats();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al obtener estadísticas de mascota: ${error.message}`);
        }
    }

    async feedPet(petId, userId, foodType = 'regular') {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para alimentar esta mascota');
            }

            if (pet.status === 'dead') {
                throw new Error('No puedes alimentar una mascota muerta');
            }

            const success = pet.feed(foodType);
            if (!success) {
                throw new Error('No se pudo alimentar la mascota');
            }

            await pet.save();
            return pet.getBasicStats();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al alimentar mascota: ${error.message}`);
        }
    }

    async waterPet(petId, userId, waterType = 'regular') {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para dar agua a esta mascota');
            }

            if (pet.status === 'dead') {
                throw new Error('No puedes dar agua a una mascota muerta');
            }

            const success = pet.water(waterType);
            if (!success) {
                throw new Error('No se pudo dar agua a la mascota');
            }

            await pet.save();
            return pet.getBasicStats();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al dar agua a la mascota: ${error.message}`);
        }
    }

    async playWithPet(petId, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para jugar con esta mascota');
            }

            if (pet.status === 'dead') {
                throw new Error('No puedes jugar con una mascota muerta');
            }

            if (pet.energy < 15) {
                throw new Error('La mascota está muy cansada para jugar');
            }

            const success = pet.play();
            if (!success) {
                throw new Error('No se pudo jugar con la mascota');
            }

            await pet.save();
            return pet.getBasicStats();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al jugar con la mascota: ${error.message}`);
        }
    }

    async walkPet(petId, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para pasear esta mascota');
            }

            if (pet.status === 'dead') {
                throw new Error('No puedes pasear una mascota muerta');
            }

            if (pet.energy < 20) {
                throw new Error('La mascota está muy cansada para pasear');
            }

            const success = pet.walk();
            if (!success) {
                throw new Error('No se pudo pasear la mascota');
            }

            await pet.save();
            return pet.getBasicStats();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al pasear la mascota: ${error.message}`);
        }
    }

    async bathePet(petId, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para bañar esta mascota');
            }

            if (pet.status === 'dead') {
                throw new Error('No puedes bañar una mascota muerta');
            }

            const success = pet.bathe();
            if (!success) {
                throw new Error('No se pudo bañar la mascota');
            }

            await pet.save();
            return pet.getBasicStats();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al bañar la mascota: ${error.message}`);
        }
    }

    async sleepPet(petId, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para hacer dormir esta mascota');
            }

            if (pet.status === 'dead') {
                throw new Error('No puedes hacer dormir una mascota muerta');
            }

            if (pet.isSleeping) {
                throw new Error('La mascota ya está durmiendo');
            }

            const success = pet.startSleep();
            if (!success) {
                throw new Error('No se pudo hacer dormir la mascota');
            }

            await pet.save();
            return pet.getBasicStats();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al hacer dormir la mascota: ${error.message}`);
        }
    }

    async wakePet(petId, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para despertar esta mascota');
            }

            if (pet.status === 'dead') {
                throw new Error('No puedes despertar una mascota muerta');
            }

            if (!pet.isSleeping) {
                throw new Error('La mascota no está durmiendo');
            }

            const success = pet.wake();
            if (!success) {
                throw new Error('No se pudo despertar la mascota');
            }

            await pet.save();
            return pet.getBasicStats();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al despertar la mascota: ${error.message}`);
        }
    }

    async petPet(petId, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para acariciar esta mascota');
            }

            if (pet.status === 'dead') {
                throw new Error('No puedes acariciar una mascota muerta');
            }

            const success = pet.pet();
            if (!success) {
                throw new Error('No se pudo acariciar la mascota');
            }

            await pet.save();
            return pet.getBasicStats();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al acariciar la mascota: ${error.message}`);
        }
    }

    async healPet(petId, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para curar esta mascota');
            }

            if (pet.status === 'dead') {
                throw new Error('No puedes curar una mascota muerta');
            }

            const success = pet.heal();
            if (!success) {
                throw new Error('No se pudo curar la mascota');
            }

            await pet.save();
            return pet.getBasicStats();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al curar la mascota: ${error.message}`);
        }
    }

    async getPetActivityHistory(petId, userId, limit = 10) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para ver el historial de esta mascota');
            }

            return pet.activityHistory.slice(-limit).reverse();
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al obtener historial de mascota: ${error.message}`);
        }
    }
}

export { toBasicPet };
export default PetService;
