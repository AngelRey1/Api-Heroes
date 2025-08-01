import React, { useState, useEffect } from 'react';
import { 
    feedPet, 
    waterPet, 
    playWithPet, 
    walkPet, 
    bathePet, 
    sleepPet, 
    wakePet, 
    petPet, 
    healPet, 
    getPetStatus 
} from '../api';
import './VirtualPet.css';

const VirtualPet = ({ pet, token, onUpdate }) => {
    const [petStats, setPetStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        if (pet && token) {
            loadPetStats();
            // Actualizar stats cada 30 segundos
            const interval = setInterval(loadPetStats, 30000);
            return () => clearInterval(interval);
        }
    }, [pet, token]);

    const loadPetStats = async () => {
        try {
            const stats = await getPetStatus(token, pet._id);
            setPetStats(stats);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error cargando stats de mascota:', error);
        }
    };

    const handleAction = async (action, params = {}) => {
        if (loading) return;
        
        setLoading(true);
        setMessage('');
        
        try {
            let result;
            switch (action) {
                case 'feed':
                    result = await feedPet(token, pet._id, params.foodType || 'regular');
                    break;
                case 'water':
                    result = await waterPet(token, pet._id, params.waterType || 'regular');
                    break;
                case 'play':
                    result = await playWithPet(token, pet._id);
                    break;
                case 'walk':
                    result = await walkPet(token, pet._id);
                    break;
                case 'bathe':
                    result = await bathePet(token, pet._id);
                    break;
                case 'sleep':
                    result = await sleepPet(token, pet._id);
                    break;
                case 'wake':
                    result = await wakePet(token, pet._id);
                    break;
                case 'pet':
                    result = await petPet(token, pet._id);
                    break;
                case 'heal':
                    result = await healPet(token, pet._id);
                    break;
                default:
                    throw new Error('Acción no válida');
            }
            
            setPetStats(result);
            setMessage(getActionMessage(action));
            if (onUpdate) onUpdate();
            
            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setMessage(''), 3000);
            
        } catch (error) {
            console.error(`Error en acción ${action}:`, error);
            setMessage(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const getActionMessage = (action) => {
        const messages = {
            feed: '¡Mascota alimentada! 🍽️',
            water: '¡Mascota hidratada! 💧',
            play: '¡Mascota jugó! 🎾',
            walk: '¡Mascota paseó! 🦮',
            bathe: '¡Mascota bañada! 🛁',
            sleep: '¡Mascota durmiendo! 😴',
            wake: '¡Mascota despierta! ⏰',
            pet: '¡Mascota acariciada! ❤️',
            heal: '¡Mascota curada! 🩹'
        };
        return messages[action] || 'Acción completada';
    };

    const getMoodIcon = (mood) => {
        const icons = {
            happy: '😊',
            sad: '😢',
            angry: '😠',
            excited: '🤩',
            tired: '😴',
            hungry: '🍽️',
            thirsty: '💧',
            dirty: '🤢',
            sick: '🤒',
            sleepy: '😴'
        };
        return icons[mood] || '😊';
    };

    const getStatusColor = (value) => {
        if (value >= 80) return '#4CAF50'; // Verde
        if (value >= 60) return '#FF9800'; // Naranja
        if (value >= 40) return '#FFC107'; // Amarillo
        return '#F44336'; // Rojo
    };

    const getStatusText = (value) => {
        if (value >= 80) return 'Excelente';
        if (value >= 60) return 'Bueno';
        if (value >= 40) return 'Regular';
        if (value >= 20) return 'Bajo';
        return 'Crítico';
    };

    if (!pet) {
        return <div className="virtual-pet">Selecciona una mascota para cuidarla</div>;
    }

    if (loading && !petStats) {
        return <div className="virtual-pet">Cargando estado de la mascota...</div>;
    }

    return (
        <div className="virtual-pet">
            <div className="pet-header">
                <div className="pet-avatar-container">
                    <div 
                        className="pet-avatar" 
                        style={{ 
                            backgroundImage: `url(${pet.avatar || '/assets/pet-default.png'})`,
                            boxShadow: `0 0 20px ${pet.glowColor || '#FF69B4'}`
                        }}
                    />
                </div>
                <div className="pet-info">
                    <h3 className="pet-name">{pet.name}</h3>
                    <div className="pet-details">
                        <span><strong>Tipo:</strong> {pet.type}</span>
                        <span><strong>Poder:</strong> {pet.superPower}</span>
                        <span><strong>Personalidad:</strong> {pet.personality}</span>
                        <span className="life-status">
                            <span className="status-indicator" style={{ backgroundColor: pet.status === 'Viva' ? '#4CAF50' : '#F44336' }}></span>
                            {pet.status}
                        </span>
                    </div>
                </div>
            </div>

            {message && (
                <div className="message-toast">
                    {message}
                </div>
            )}

            {petStats && (
                <div className="pet-stats">
                    <div className="stats-header">
                        <span className="mood-display">
                            {getMoodIcon(petStats.mood)} {petStats.mood}
                        </span>
                        {petStats.isSleeping && <span className="sleeping-indicator">💤 Durmiendo</span>}
                    </div>
                    
                    <div className="stats-bars">
                        <div className="stat-bar">
                            <label>Salud: {petStats.health}%</label>
                            <div className="bar-container">
                                <div 
                                    className="bar-fill" 
                                    style={{ 
                                        width: `${petStats.health}%`,
                                        backgroundColor: getStatusColor(petStats.health)
                                    }}
                                />
                            </div>
                            <span className="stat-text">{getStatusText(petStats.health)}</span>
                        </div>

                        <div className="stat-bar">
                            <label>Felicidad: {petStats.happiness}%</label>
                            <div className="bar-container">
                                <div 
                                    className="bar-fill" 
                                    style={{ 
                                        width: `${petStats.happiness}%`,
                                        backgroundColor: getStatusColor(petStats.happiness)
                                    }}
                                />
                            </div>
                            <span className="stat-text">{getStatusText(petStats.happiness)}</span>
                        </div>

                        <div className="stat-bar">
                            <label>Sueño: {petStats.sleep}%</label>
                            <div className="bar-container">
                                <div 
                                    className="bar-fill" 
                                    style={{ 
                                        width: `${petStats.sleep}%`,
                                        backgroundColor: getStatusColor(petStats.sleep)
                                    }}
                                />
                            </div>
                            <span className="stat-text">{getStatusText(petStats.sleep)}</span>
                        </div>

                        <div className="stat-bar">
                            <label>Hambre: {petStats.hunger}%</label>
                            <div className="bar-container">
                                <div 
                                    className="bar-fill" 
                                    style={{ 
                                        width: `${petStats.hunger}%`,
                                        backgroundColor: getStatusColor(100 - petStats.hunger)
                                    }}
                                />
                            </div>
                            <span className="stat-text">{getStatusText(100 - petStats.hunger)}</span>
                        </div>

                        <div className="stat-bar">
                            <label>Limpieza: {petStats.cleanliness}%</label>
                            <div className="bar-container">
                                <div 
                                    className="bar-fill" 
                                    style={{ 
                                        width: `${petStats.cleanliness}%`,
                                        backgroundColor: getStatusColor(petStats.cleanliness)
                                    }}
                                />
                            </div>
                            <span className="stat-text">{getStatusText(petStats.cleanliness)}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="pet-actions">
                <h4>Acciones de Cuidado</h4>
                <div className="action-buttons">
                    <button 
                        onClick={() => handleAction('sleep')} 
                        disabled={loading || petStats?.isSleeping || petStats?.status === 'Muerta'} 
                        className="action-btn sleep"
                    >
                        😴 Dormir
                    </button>
                    <button 
                        onClick={() => handleAction('play')} 
                        disabled={loading || petStats?.energy < 15 || petStats?.status === 'Muerta'} 
                        className="action-btn play"
                    >
                        🎾 Jugar
                    </button>
                    <button 
                        onClick={() => handleAction('feed')} 
                        disabled={loading || petStats?.status === 'Muerta'} 
                        className="action-btn feed"
                    >
                        🍽️ Alimentar
                    </button>
                    <button 
                        onClick={() => handleAction('bathe')} 
                        disabled={loading || petStats?.status === 'Muerta'} 
                        className="action-btn bathe"
                    >
                        🛁 Bañar
                    </button>
                    <button 
                        onClick={() => handleAction('pet')} 
                        disabled={loading || petStats?.status === 'Muerta'} 
                        className="action-btn pet"
                    >
                        ❤️ Acariciar
                    </button>
                    <button 
                        onClick={() => handleAction('heal')} 
                        disabled={loading || petStats?.status === 'Muerta'} 
                        className="action-btn heal"
                    >
                        🩹 Curar
                    </button>
                </div>
                
                {petStats?.isSleeping && (
                    <button 
                        onClick={() => handleAction('wake')} 
                        disabled={loading || petStats?.status === 'Muerta'} 
                        className="action-btn wake"
                    >
                        ⏰ Despertar
                    </button>
                )}

                <div className="action-info">
                    <p>💡 Consejos:</p>
                    <ul>
                        <li>Alimenta regularmente para mantener la salud</li>
                        <li>Juega para aumentar la felicidad</li>
                        <li>Baña para mantener la limpieza</li>
                        <li>Deja dormir para recuperar energía</li>
                        <li>Acaricia para mejorar el ánimo</li>
                    </ul>
                </div>
            </div>

            <div className="last-update">
                Última actualización: {lastUpdate.toLocaleTimeString()}
            </div>
        </div>
    );
};

export default VirtualPet; 