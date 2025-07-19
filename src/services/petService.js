import PetRepository from '../repositories/petRepository.js';
import HeroRepository from '../repositories/heroRepository.js';
import { ValidationError, NotFoundError, AuthorizationError } from '../utils/errors.js';
import { validateObjectId, validateRequiredFields, validateStringLength } from '../utils/validations.js';

// Función auxiliar para simplificar la mascota (solo datos básicos y customización)
function toBasicPet(pet) {
    if (!pet) return null;
    return {
        _id: pet._id,
        id_corto: pet._id ? pet._id.toString().substring(0, 8) : undefined,
        name: pet.name,
        type: pet.type,
        superPower: pet.superPower,
        status: pet.status,
        adoptedBy: pet.adoptedBy && typeof pet.adoptedBy === 'object' ? {
            _id: pet.adoptedBy._id || pet.adoptedBy,
            name: pet.adoptedBy.name,
            alias: pet.adoptedBy.alias
        } : pet.adoptedBy,
        customization: pet.customization || { free: [], paid: [] }
    };
}

class PetService {
    constructor() {
        this.petRepository = new PetRepository();
        this.heroRepository = new HeroRepository();
    }

    async createPet(petData, userId) {
        try {
            // Validar campos requeridos
            validateRequiredFields(petData, ['name', 'type', 'superPower']);
            // Validar longitudes de strings
            validateStringLength(petData.name, 1, 50, 'Nombre');
            validateStringLength(petData.type, 1, 30, 'Tipo');
            validateStringLength(petData.superPower, 1, 100, 'Superpoder');

            // Validar que el usuario existe
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.createPet({
                ...petData,
                owner: userId
            });

            return pet;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new Error(`Error al crear mascota: ${error.message}`);
        }
    }

    async getAllPets(userId) {
        try {
            // Si no se pasa userId, devuelve todas las mascotas
            let pets;
            if (!userId) {
                pets = await this.petRepository.getPets();
            } else {
                validateObjectId(userId, 'ID de usuario');
                pets = await this.petRepository.getPets({ owner: userId });
            }
            // Solo datos básicos y customización
            return pets.map(toBasicPet);
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

            return pet;
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al obtener mascota: ${error.message}`);
        }
    }

    async updatePet(petId, updateData, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            // Validar campos si se proporcionan
            if (updateData.name) {
                validateStringLength(updateData.name, 1, 50, 'Nombre');
            }
            if (updateData.type) {
                validateStringLength(updateData.type, 1, 30, 'Tipo');
            }
            if (updateData.superPower) {
                validateStringLength(updateData.superPower, 1, 100, 'Superpoder');
            }

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para modificar esta mascota');
            }

            return await this.petRepository.updatePet(petId, updateData);
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al actualizar mascota: ${error.message}`);
        }
    }

    async deletePet(petId, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            const pet = await this.petRepository.getPetById(petId);

            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para eliminar esta mascota');
            }

            return await this.petRepository.deletePet(petId);
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al eliminar mascota: ${error.message}`);
        }
    }

    async adoptPet(petId, heroId, reason, notes, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(heroId, 'ID de héroe');
            validateObjectId(userId, 'ID de usuario');

            if (reason) {
                validateStringLength(reason, 10, 'Motivo de adopción');
            }
            if (notes) {
                validateStringLength(notes, 1, 'Notas');
            }

            const pet = await this.petRepository.getPetById(petId);
            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para adoptar esta mascota');
            }

            const hero = await this.heroRepository.getHeroById(heroId);
            if (!hero) {
                throw new NotFoundError('Héroe no encontrado');
            }

            if (hero.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para usar este héroe');
            }

            return await this.petRepository.adoptPet(petId, heroId, reason, notes);
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al adoptar mascota: ${error.message}`);
        }
    }

    async returnPet(petId, notes, userId) {
        try {
            validateObjectId(petId, 'ID de mascota');
            validateObjectId(userId, 'ID de usuario');

            if (notes) {
                validateStringLength(notes, 1, 'Notas');
            }

            const pet = await this.petRepository.getPetById(petId);
            if (!pet) {
                throw new NotFoundError('Mascota no encontrada');
            }

            if (pet.owner.toString() !== userId.toString()) {
                throw new AuthorizationError('No tienes permiso para devolver esta mascota');
            }

            return await this.petRepository.returnPet(petId, notes);
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new Error(`Error al devolver mascota: ${error.message}`);
        }
    }

    // Mascotas adoptadas por héroes del usuario autenticado
    async getAdoptedPetsByUser(userId) {
        try {
            validateObjectId(userId, 'ID de usuario');
            // Buscar héroes del usuario
            const heroes = await this.heroRepository.getHeroes({ owner: userId });
            const heroIds = heroes.map(h => h._id.toString());
            if (heroIds.length === 0) return [];
            // Buscar mascotas adoptadas por esos héroes
            const pets = await this.petRepository.getPets({ adoptedBy: { $in: heroIds } });
            return pets.map(toBasicPet);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new Error(`Error al obtener mascotas adoptadas: ${error.message}`);
        }
    }
}

export { toBasicPet };
export default PetService;
