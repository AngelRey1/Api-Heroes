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

  // Las acciones de mascota ahora se manejan en el componente VirtualPet

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