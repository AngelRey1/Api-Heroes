import React from 'react';
import { useUser } from '../context/UserContext';
import ActionButtons from '../components/ActionButtons';
import NotificationToast from '../components/NotificationToast';
import './Home.css';

function Toast({ message, color = '#e74c3c', onClose }) {
  if (!message) return null;
  return (
    <div style={{ 
      position: 'fixed', 
      top: 150, 
      right: 24, 
      background: color, 
      color: '#fff', 
      padding: '16px 32px', 
      borderRadius: 12, 
      fontWeight: 'bold', 
      zIndex: 9999, 
      boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
      border: '3px solid #000'
    }} onClick={onClose}>
      {message}
    </div>
  );
}

export default function Home({ mascota, hero, alimentar, limpiar, jugar, dormir, loading: loadingProp, animacionStat, animar }) {
  const { token, fetchUserData, updateCoins } = useUser();

  // Determinar imagen dinámica según estado
  let mascotaImg = '/assets/dog_normal.svg';
  if (mascota) {
    if (mascota.status === 'dead' || mascota.health === 0) {
      mascotaImg = mascota.type === 'Gato' ? '/assets/cat_dead.svg' : '/assets/dog_dead.svg';
    } else if ((mascota.happiness ?? 100) > 80 && (mascota.health ?? 100) > 80) {
      mascotaImg = mascota.type === 'Gato' ? '/assets/cat_happy.svg' : '/assets/dog_happy.svg';
    } else {
      mascotaImg = mascota.type === 'Gato' ? '/assets/cat_normal.svg' : '/assets/dog_normal.svg';
    }
  }

  // Notificaciones visuales
  const [notification, setNotification] = React.useState({ message: '', type: 'info' });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!mascota) return;
    if (mascota.status === 'dead' || mascota.health === 0) {
      setNotification({ message: '¡Tu mascota ha muerto!', type: 'error' });
    } else if ((mascota.health ?? 100) < 30) {
      setNotification({ message: '¡Tu mascota está muy enferma!', type: 'warning' });
    } else if ((mascota.happiness ?? 100) < 30) {
      setNotification({ message: '¡Tu mascota está triste!', type: 'warning' });
    } else if ((mascota.energy ?? 50) < 30) {
      setNotification({ message: '¡Tu mascota está cansada!', type: 'warning' });
    } else if (mascota.diseases && mascota.diseases.length > 0) {
      setNotification({ message: `Enfermedades: ${mascota.diseases.join(', ')}`, type: 'error' });
    } else {
      setNotification({ message: '', type: 'info' });
    }
  }, [mascota]);

  // Imagen y color del héroe
  const heroImg = hero?.avatar || '/assets/hero.svg';
  const heroColor = hero?.color || '#3498db';

  // Determinar clase de animación para la mascota
  let mascotaAnimClass = '';
  if (mascota) {
    if (mascota.status === 'dead' || mascota.health === 0) mascotaAnimClass = 'mascota-muerta';
    else if ((mascota.happiness ?? 100) > 80 && (mascota.health ?? 100) > 80) mascotaAnimClass = 'mascota-feliz';
    else if ((mascota.happiness ?? 100) < 30) mascotaAnimClass = 'mascota-triste';
    else if ((mascota.health ?? 100) < 30 || (mascota.diseases && mascota.diseases.length > 0)) mascotaAnimClass = 'mascota-enferma';
  }

  // Funciones de mascota mejoradas con feedback visual
  const handleAlimentar = async () => {
    if (!mascota) return;
    setLoading(true);
    try {
      await alimentar();
      setNotification({ message: '¡Mascota alimentada! +5 felicidad', type: 'success' });
      // Dar monedas por alimentar
      updateCoins(prev => prev + 2);
    } catch (error) {
      setNotification({ message: 'Error al alimentar mascota', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = async () => {
    if (!mascota) return;
    setLoading(true);
    try {
      await limpiar();
      setNotification({ message: '¡Mascota limpiada! +10 salud', type: 'success' });
      // Dar monedas por limpiar
      updateCoins(prev => prev + 3);
    } catch (error) {
      setNotification({ message: 'Error al limpiar mascota', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleJugar = async () => {
    if (!mascota) return;
    setLoading(true);
    try {
      await jugar();
      setNotification({ message: '¡Jugando con mascota! +15 felicidad', type: 'success' });
      // Dar monedas por jugar
      updateCoins(prev => prev + 5);
    } catch (error) {
      setNotification({ message: 'Error al jugar con mascota', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDormir = async () => {
    if (!mascota) return;
    setLoading(true);
    try {
      await dormir();
      setNotification({ message: '¡Mascota durmiendo! +20 energía', type: 'success' });
      // Dar monedas por dormir
      updateCoins(prev => prev + 1);
    } catch (error) {
      setNotification({ message: 'Error al dormir mascota', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'info' })} 
      />
      
      {/* Personajes principales estilo Pou */}
      <div className="characters-container">
        {/* Mascota */}
        <div className="character-section">
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#000', 
            textShadow: '2px 2px 0px #fff',
            marginBottom: '15px'
          }}>
            Mascota
          </h3>
          <div className="character">
            {mascota ? (
              <>
                <img
                  src={mascotaImg}
                  alt="Mascota"
                  className={`character-img ${mascotaAnimClass}`}
                />
                {/* Accesorio visual: sombrero */}
                {mascota && mascota.accessories && mascota.accessories.includes('sombrero') && (
                  <img 
                    src="/assets/sombrero.svg" 
                    alt="Sombrero" 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 20, 
                      width: 60, 
                      pointerEvents: 'none' 
                    }} 
                  />
                )}
              </>
            ) : (
              <div className="character-placeholder">
                <div className="character-blob">🐾</div>
                <p>¡Crea tu mascota!</p>
              </div>
            )}
          </div>
        </div>

        {/* Héroe */}
        <div className="character-section">
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#000', 
            textShadow: '2px 2px 0px #fff',
            marginBottom: '15px'
          }}>
            Héroe
          </h3>
          <div className="character">
            {hero ? (
              <>
                <img
                  src={hero?.avatar || '/assets/hero.png'}
                  alt="Héroe"
                  className="character-img"
                  style={{ 
                    borderRadius: '50%', 
                    background: hero?.color || '#3498db',
                    border: '3px solid #000'
                  }}
                />
                {/* Accesorio visual: sombrero */}
                {hero && hero.accessories && hero.accessories.includes('sombrero') && (
                  <img 
                    src="/assets/sombrero.svg" 
                    alt="Sombrero" 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 20, 
                      width: 60, 
                      pointerEvents: 'none' 
                    }} 
                  />
                )}
              </>
            ) : (
              <div className="character-placeholder">
                <div className="character-blob">🦸‍♂️</div>
                <p>¡Crea tu héroe!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información del personaje estilo Pou */}
      {mascota && (
        <div className="character-info">
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#000', 
            textShadow: '2px 2px 0px #fff',
            marginBottom: '15px'
          }}>
            {mascota.name || 'Mi Mascota'}
          </h2>
          
          {/* Estadísticas simples */}
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Salud:</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill health" 
                  style={{ width: `${mascota.health || 100}%` }}
                ></div>
              </div>
              <span className="stat-value">{mascota.health || 100}%</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Felicidad:</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill happiness" 
                  style={{ width: `${mascota.happiness || 100}%` }}
                ></div>
              </div>
              <span className="stat-value">{mascota.happiness || 100}%</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Energía:</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill energy" 
                  style={{ width: `${mascota.energy || 50}%` }}
                ></div>
              </div>
              <span className="stat-value">{mascota.energy || 50}%</span>
            </div>
          </div>
          
          {/* Botones de acción */}
          <ActionButtons 
            onFeed={handleAlimentar}
            onClean={handleLimpiar}
            onPlay={handleJugar}
            onSleep={handleDormir}
            loading={loadingProp}
            mascota={mascota}
          />
        </div>
      )}

      {/* Mensaje de bienvenida si no hay mascota */}
      {!mascota && (
        <div className="welcome-message">
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#000', 
            textShadow: '2px 2px 0px #fff',
            marginBottom: '20px'
          }}>
            ¡Bienvenido a Mascota Hero!
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#000', 
            textShadow: '1px 1px 0px #fff',
            textAlign: 'center'
          }}>
            Crea tu mascota y comienza tu aventura
          </p>
        </div>
      )}
    </div>
  );
} 