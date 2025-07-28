import React, { useState, useEffect } from 'react';
import pushNotificationService from '../services/pushNotificationService';
import './NotificationSettings.css';

export default function NotificationSettings({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    petCare: true,
    achievements: true,
    missions: true,
    tournaments: true,
    events: true,
    messages: true,
    friendRequests: true,
    gifts: true,
    system: true
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = () => {
    const enabled = pushNotificationService.isEnabled();
    setIsEnabled(enabled);
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const success = await pushNotificationService.initialize();
      if (success) {
        setIsEnabled(true);
        setMessage('✅ Notificaciones habilitadas correctamente');
      } else {
        setMessage('❌ No se pudieron habilitar las notificaciones');
      }
    } catch (error) {
      setMessage('❌ Error al habilitar notificaciones: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      await pushNotificationService.unsubscribeFromPushNotifications();
      setIsEnabled(false);
      setMessage('✅ Notificaciones deshabilitadas');
    } catch (error) {
      setMessage('❌ Error al deshabilitar notificaciones: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleTestNotification = (type) => {
    switch (type) {
      case 'petCare':
        pushNotificationService.showPetCareReminder();
        break;
      case 'achievement':
        pushNotificationService.showAchievementUnlocked('Logro de Prueba');
        break;
      case 'mission':
        pushNotificationService.showMissionCompleted('Misión de Prueba');
        break;
      case 'tournament':
        pushNotificationService.showTournamentStarted('Torneo de Prueba');
        break;
      case 'message':
        pushNotificationService.showNewMessage('Usuario de Prueba');
        break;
      case 'friendRequest':
        pushNotificationService.showFriendRequest('Usuario de Prueba');
        break;
      case 'gift':
        pushNotificationService.showGiftReceived('Usuario de Prueba');
        break;
      case 'event':
        pushNotificationService.showEventStarted('Evento de Prueba');
        break;
      default:
        pushNotificationService.showNotification('Notificación de Prueba', {
          body: 'Esta es una notificación de prueba'
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-settings-overlay">
      <div className="notification-settings-modal">
        <div className="notification-settings-header">
          <h2>🔔 Configuración de Notificaciones</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="notification-settings-content">
          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="notification-status">
            <h3>Estado de Notificaciones</h3>
            <div className="status-indicator">
              <span className={`status-dot ${isEnabled ? 'enabled' : 'disabled'}`}></span>
              <span className="status-text">
                {isEnabled ? 'Habilitadas' : 'Deshabilitadas'}
              </span>
            </div>
            
            {!isEnabled ? (
              <button 
                className="enable-button"
                onClick={handleEnableNotifications}
                disabled={isLoading}
              >
                {isLoading ? 'Habilitando...' : 'Habilitar Notificaciones'}
              </button>
            ) : (
              <button 
                className="disable-button"
                onClick={handleDisableNotifications}
                disabled={isLoading}
              >
                {isLoading ? 'Deshabilitando...' : 'Deshabilitar Notificaciones'}
              </button>
            )}
          </div>

          {isEnabled && (
            <>
              <div className="notification-types">
                <h3>Tipos de Notificaciones</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-icon">🐾</span>
                      <div>
                        <span className="setting-name">Cuidado de Mascotas</span>
                        <span className="setting-desc">Recordatorios para alimentar y cuidar tu mascota</span>
                      </div>
                    </div>
                    <div className="setting-controls">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.petCare}
                          onChange={() => handleSettingChange('petCare')}
                        />
                        <span className="slider"></span>
                      </label>
                      <button 
                        className="test-button"
                        onClick={() => handleTestNotification('petCare')}
                      >
                        Probar
                      </button>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-icon">🏆</span>
                      <div>
                        <span className="setting-name">Logros</span>
                        <span className="setting-desc">Cuando desbloquees nuevos logros</span>
                      </div>
                    </div>
                    <div className="setting-controls">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.achievements}
                          onChange={() => handleSettingChange('achievements')}
                        />
                        <span className="slider"></span>
                      </label>
                      <button 
                        className="test-button"
                        onClick={() => handleTestNotification('achievement')}
                      >
                        Probar
                      </button>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-icon">🎯</span>
                      <div>
                        <span className="setting-name">Misiones</span>
                        <span className="setting-desc">Cuando completes misiones</span>
                      </div>
                    </div>
                    <div className="setting-controls">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.missions}
                          onChange={() => handleSettingChange('missions')}
                        />
                        <span className="slider"></span>
                      </label>
                      <button 
                        className="test-button"
                        onClick={() => handleTestNotification('mission')}
                      >
                        Probar
                      </button>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-icon">🏆</span>
                      <div>
                        <span className="setting-name">Torneos</span>
                        <span className="setting-desc">Inicio de torneos y resultados</span>
                      </div>
                    </div>
                    <div className="setting-controls">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.tournaments}
                          onChange={() => handleSettingChange('tournaments')}
                        />
                        <span className="slider"></span>
                      </label>
                      <button 
                        className="test-button"
                        onClick={() => handleTestNotification('tournament')}
                      >
                        Probar
                      </button>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-icon">🎉</span>
                      <div>
                        <span className="setting-name">Eventos</span>
                        <span className="setting-desc">Eventos especiales y temporales</span>
                      </div>
                    </div>
                    <div className="setting-controls">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.events}
                          onChange={() => handleSettingChange('events')}
                        />
                        <span className="slider"></span>
                      </label>
                      <button 
                        className="test-button"
                        onClick={() => handleTestNotification('event')}
                      >
                        Probar
                      </button>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-icon">💬</span>
                      <div>
                        <span className="setting-name">Mensajes</span>
                        <span className="setting-desc">Nuevos mensajes de amigos</span>
                      </div>
                    </div>
                    <div className="setting-controls">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.messages}
                          onChange={() => handleSettingChange('messages')}
                        />
                        <span className="slider"></span>
                      </label>
                      <button 
                        className="test-button"
                        onClick={() => handleTestNotification('message')}
                      >
                        Probar
                      </button>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-icon">👥</span>
                      <div>
                        <span className="setting-name">Solicitudes de Amistad</span>
                        <span className="setting-desc">Nuevas solicitudes de amistad</span>
                      </div>
                    </div>
                    <div className="setting-controls">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.friendRequests}
                          onChange={() => handleSettingChange('friendRequests')}
                        />
                        <span className="slider"></span>
                      </label>
                      <button 
                        className="test-button"
                        onClick={() => handleTestNotification('friendRequest')}
                      >
                        Probar
                      </button>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-icon">🎁</span>
                      <div>
                        <span className="setting-name">Regalos</span>
                        <span className="setting-desc">Regalos recibidos de amigos</span>
                      </div>
                    </div>
                    <div className="setting-controls">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.gifts}
                          onChange={() => handleSettingChange('gifts')}
                        />
                        <span className="slider"></span>
                      </label>
                      <button 
                        className="test-button"
                        onClick={() => handleTestNotification('gift')}
                      >
                        Probar
                      </button>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-icon">⚙️</span>
                      <div>
                        <span className="setting-name">Sistema</span>
                        <span className="setting-desc">Notificaciones del sistema</span>
                      </div>
                    </div>
                    <div className="setting-controls">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.system}
                          onChange={() => handleSettingChange('system')}
                        />
                        <span className="slider"></span>
                      </label>
                      <button 
                        className="test-button"
                        onClick={() => handleTestNotification('system')}
                      >
                        Probar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="notification-info">
                <h3>ℹ️ Información</h3>
                <ul>
                  <li>Las notificaciones te ayudarán a no perderte eventos importantes</li>
                  <li>Puedes deshabilitar tipos específicos de notificaciones</li>
                  <li>Usa el botón "Probar" para ver cómo se ven las notificaciones</li>
                  <li>Las notificaciones funcionan incluso cuando la app está cerrada</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 