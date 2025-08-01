import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import VirtualPet from '../components/VirtualPet';
import './Home.css';

const Home = () => {
  const { token, user, activePet, fetchUserData } = useUser();
  const { playClick, playFeed, playClean, playPlay, playSleep } = useSoundEffects();
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    if (activePet) {
      console.log('Home - Pet Stats Debug:');
      console.log('  Health:', activePet.health, typeof activePet.health);
      console.log('  Happiness:', activePet.happiness, typeof activePet.happiness);
      console.log('  Energy:', activePet.energy, typeof activePet.energy);
      console.log('  Raw pet object:', activePet);
    }
  }, [activePet]);

  useEffect(() => {
    if (activePet) {
      checkAbandonment();
      checkPetStatus();
    }
  }, [activePet]);

  const checkAbandonment = () => {
    if (!activePet || !activePet.lastCare) return;
    
    const lastCare = new Date(activePet.lastCare);
    const now = new Date();
    const hoursSinceLastCare = (now - lastCare) / (1000 * 60 * 60);
    
    if (hoursSinceLastCare > 24) {
      setNotification({
        message: '⚠️ Tu mascota necesita atención urgente!',
        type: 'warning'
      });
    }
  };

  const checkPetStatus = () => {
    if (!activePet) return;
    
    const { health, happiness, energy } = activePet;
    
    if (health < 30 || happiness < 30 || energy < 30) {
      setNotification({
        message: '😢 Tu mascota está triste y necesita cuidados',
        type: 'warning'
      });
    }
  };

  const handlePetAction = async (action, actionName) => {
    if (!activePet || !token) return;
    
    try {
      console.log(`${actionName} mascota:`, activePet._id);
      
      const response = await fetch(`https://api-heroes-gh4i.onrender.com/api/pet-care/${activePet._id}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al ${actionName.toLowerCase()}`);
      }
      
      const result = await response.json();
      console.log(`Resultado ${actionName}:`, result);
      
      // Mostrar notificación con consecuencias
      let notificationMessage = result.message;
      let notificationType = 'success';
      
      // Agregar información de consecuencias
      if (result.consequences) {
        const { healthChange, happinessChange, energyChange, diseasesCured } = result.consequences;
        
        let consequencesText = '';
        if (healthChange !== 0) {
          consequencesText += `Salud: ${healthChange > 0 ? '+' : ''}${healthChange} `;
        }
        if (happinessChange !== 0) {
          consequencesText += `Felicidad: ${happinessChange > 0 ? '+' : ''}${happinessChange} `;
        }
        if (energyChange !== 0) {
          consequencesText += `Energía: ${energyChange > 0 ? '+' : ''}${energyChange}`;
        }
        
        if (consequencesText) {
          notificationMessage += ` (${consequencesText})`;
        }
        
        // Si hay enfermedades curadas, mostrar en verde
        if (diseasesCured && diseasesCured.length > 0) {
          notificationMessage += ` 🏥 Enfermedades curadas: ${diseasesCured.join(', ')}`;
        }
        
        // Si hay consecuencias negativas, cambiar tipo de notificación
        if (healthChange < 0 || happinessChange < 0 || energyChange < 0) {
          notificationType = 'warning';
        }
      }
      
      setNotification({
        message: notificationMessage,
        type: notificationType
      });
      
      // Actualizar datos de la mascota
      if (result.pet) {
        await fetchUserData(); // Recargar datos del usuario y mascotas
      }
      
      // Reproducir sonido específico
      switch (action) {
        case 'feed':
          playFeed();
          break;
        case 'bath':
          playClean();
          break;
        case 'play':
          playPlay();
          break;
        case 'sleep':
          playSleep();
          break;
        case 'heal':
          playFeed(); // Usar sonido de feed para curación
          break;
        default:
          playClick();
      }
      
    } catch (error) {
      console.error(`Error ${actionName.toLowerCase()}:`, error);
      setNotification({
        message: `Error ${actionName.toLowerCase()}: ${error.message}`,
        type: 'error'
      });
    }
  };

  const handleAlimentar = () => handlePetAction('feed', 'Alimentar');
  const handleJugar = () => handlePetAction('play', 'Jugar');
  const handleLimpiar = () => handlePetAction('bath', 'Limpiar');
  const handleDormir = () => handlePetAction('sleep', 'Dormir');
  const handleCurar = () => handlePetAction('heal', 'Curar');

  if (!user) {
    return (
      <div className="home-container">
        <div className="welcome-message">
          <h1>¡Bienvenido a tu Aventura Virtual!</h1>
          <p>Inicia sesión para comenzar a cuidar de tus mascotas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Información del usuario */}
        <div className="user-details">
          <div className="user-info">
            <h2>👤 {user.username}</h2>
          </div>
        </div>

        {/* Componente VirtualPet */}
        <VirtualPet 
          pet={activePet} 
          token={token} 
          onUpdate={fetchUserData}
        />
      </div>

      {notification.message && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: 'info' })}
        />
      )}
    </div>
  );
};

export default Home; 