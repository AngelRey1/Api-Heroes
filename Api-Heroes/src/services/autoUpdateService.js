import Pet from '../models/petModel.js';

class AutoUpdateService {
    constructor() {
        this.updateInterval = null;
        this.isRunning = false;
    }

    /**
     * Inicia el servicio de actualización automática
     */
    start() {
        if (this.isRunning) {
            console.log('AutoUpdateService ya está ejecutándose');
            return;
        }

        console.log('Iniciando AutoUpdateService...');
        this.isRunning = true;

        // Actualizar cada 5 minutos
        this.updateInterval = setInterval(async () => {
            try {
                await this.updateAllPets();
            } catch (error) {
                console.error('Error en actualización automática:', error);
            }
        }, 5 * 60 * 1000); // 5 minutos

        // Ejecutar la primera actualización inmediatamente
        this.updateAllPets();
    }

    /**
     * Detiene el servicio de actualización automática
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.isRunning = false;
        console.log('AutoUpdateService detenido');
    }

    /**
     * Actualiza todas las mascotas
     */
    async updateAllPets() {
        try {
            console.log('Actualizando estadísticas de mascotas...');
            
            // Obtener todas las mascotas
            const pets = await Pet.find({ status: { $ne: 'dead' } });
            
            let updatedCount = 0;
            
            for (const pet of pets) {
                try {
                    // Actualizar estadísticas
                    pet.updateStats();
                    await pet.save();
                    updatedCount++;
                } catch (error) {
                    console.error(`Error actualizando mascota ${pet._id}:`, error);
                }
            }
            
            console.log(`Actualizadas ${updatedCount} mascotas`);
            
            // Verificar mascotas que pueden haber muerto
            await this.checkDeadPets();
            
        } catch (error) {
            console.error('Error en updateAllPets:', error);
        }
    }

    /**
     * Verifica mascotas que pueden haber muerto por negligencia
     */
    async checkDeadPets() {
        try {
            const pets = await Pet.find({ 
                status: { $ne: 'dead' },
                health: { $lte: 0 }
            });
            
            for (const pet of pets) {
                pet.status = 'dead';
                pet.deathDate = new Date();
                await pet.save();
                console.log(`Mascota ${pet.name} ha muerto por negligencia`);
            }
        } catch (error) {
            console.error('Error verificando mascotas muertas:', error);
        }
    }

    /**
     * Actualiza una mascota específica
     */
    async updatePet(petId) {
        try {
            const pet = await Pet.findById(petId);
            if (!pet) {
                throw new Error('Mascota no encontrada');
            }
            
            pet.updateStats();
            await pet.save();
            
            return pet;
        } catch (error) {
            console.error(`Error actualizando mascota ${petId}:`, error);
            throw error;
        }
    }

    /**
     * Obtiene estadísticas del servicio
     */
    getStats() {
        return {
            isRunning: this.isRunning,
            lastUpdate: new Date(),
            updateInterval: this.updateInterval ? '5 minutos' : 'No configurado'
        };
    }
}

export default AutoUpdateService; 