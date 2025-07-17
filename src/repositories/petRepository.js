import Pet from '../models/petModel.js';
import Hero from '../models/heroModel.js';

class PetRepository {
    async getPets(filter = {}) {
        try {
            return await Pet.find(filter).populate('adoptedBy adoptionHistory.hero');
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async savePet(petData) {
        try {
            if (petData._id) {
                return await Pet.findByIdAndUpdate(petData._id, petData, { new: true });
            } else {
                const pet = new Pet(petData);
                return await pet.save();
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getPetById(id) {
        try {
            if (id.length === 8) {
                // Buscar por id_corto
                const all = await Pet.find().populate('adoptedBy adoptionHistory.hero');
                return all.find(p => p._id.toString().substring(0,8) === id);
            } else {
                return await Pet.findById(id).populate('adoptedBy adoptionHistory.hero');
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async adoptPet(petId, heroId, reason, notes) {
        // Adopta la mascota, actualiza campos y guarda historial
        const pet = await this.getPetById(petId);
        if (!pet) throw new Error('Mascota no encontrada');
        if (pet.adoptedBy) throw new Error('La mascota ya fue adoptada');
        pet.adoptedBy = heroId;
        pet.status = 'adopted';
        pet.adoptionHistory = pet.adoptionHistory || [];
        pet.adoptionHistory.push({ hero: heroId, date: new Date(), reason, notes });
        await pet.save();
        // Agregar la mascota al array pets del héroe adoptante
        await Hero.findByIdAndUpdate(heroId, { $addToSet: { pets: pet._id } });
        return await this.getPetById(petId); // Devuelve la mascota con populate actualizado
    }

    async returnPet(petId, notes) {
        // Devuelve la mascota, actualiza campos y guarda historial
        const pet = await this.getPetById(petId);
        if (!pet) throw new Error('Mascota no encontrada');
        if (!pet.adoptedBy) throw new Error('La mascota no está adoptada');
        if (pet.adoptionHistory && pet.adoptionHistory.length > 0) {
            const lastAdoption = pet.adoptionHistory[pet.adoptionHistory.length - 1];
            if (!lastAdoption.returnDate) {
                lastAdoption.status = 'returned';
                lastAdoption.returnDate = new Date();
                lastAdoption.returnNotes = notes;
            }
        }
        // Quitar la mascota del array pets del héroe adoptante
        await Hero.findByIdAndUpdate(pet.adoptedBy, { $pull: { pets: pet._id } });
        pet.adoptedBy = null;
        pet.status = 'returned';
        await pet.save();
        return await this.getPetById(petId); // Devuelve la mascota con populate actualizado
    }

    async deletePet(petId) {
        // Elimina la mascota por ID
        const pet = await this.getPetById(petId);
        if (!pet) throw new Error('Mascota no encontrada');
        await pet.deleteOne();
        return { message: 'Mascota eliminada' };
    }

    async updatePet(petId, updateData) {
        // Actualiza los datos de la mascota por ID
        const pet = await this.getPetById(petId);
        if (!pet) throw new Error('Mascota no encontrada');
        Object.assign(pet, updateData);
        await pet.save();
        return pet;
    }

    async createPet(petData) {
        try {
            const pet = new Pet(petData);
            return await pet.save();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default PetRepository; 