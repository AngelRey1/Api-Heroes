import React, { useState, useEffect } from 'react';
import { useSoundEffects } from './SoundEffects';
import './PushNotifications.css';

const PushNotifications = () => {
  const { playClick, playCoin } = useSoundEffects();
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  const checkNotificationSupport = () => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  };

  const requestPermission = async () => {
    try {
      setLoading(true);
      playClick();
      
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setNotification({ 
          message: '¡Notificaciones activadas! Recibirás alertas importantes.', 
          type: 'success' 
        });
        playCoin();
        await subscribeToNotifications();
      } else {
        setNotification({ 
          message: 'Permisos de notificación denegados', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setNotification({ 
        message: 'Error al solicitar permisos de notificación', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNotifications = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
        });
        
        setSubscription(subscription);
        
        // Enviar suscripción al servidor
        await sendSubscriptionToServer(subscription);
        
      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
      }
    }
  };

  const sendSubscriptionToServer = async (subscription) => {
    try {
      // Aquí enviarías la suscripción al servidor
      console.log('Subscription sent to server:', subscription);
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      setLoading(true);
      playClick();
      
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        
        setNotification({ 
          message: 'Notificaciones desactivadas', 
          type: 'info' 
        });
      }
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      setNotification({ 
        message: 'Error al desactivar notificaciones', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testNotification = () => {
    if (permission === 'granted') {
      playClick();
      
      const notification = new Notification('Mascota Hero 🎮', {
        body: '¡Tu mascota te extraña! Ven a cuidarla.',
        icon: '/assets/hero.svg',
        badge: '/assets/hero.svg',
        tag: 'mascota-reminder',
        requireInteraction: false,
        silent: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setNotification({ 
        message: 'Notificación de prueba enviada', 
        type: 'success' 
      });
      playCoin();
    }
  };

  if (!isSupported) {
    return (
      <div className="push-notifications-container">
        <div className="notification-card">
          <div className="notification-header">
            <span className="notification-icon">🔔</span>
            <h3>Notificaciones Push</h3>
          </div>
          <div className="notification-content">
            <p>Tu navegador no soporta notificaciones push.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="push-notifications-container">
      <div className="notification-card">
        <div className="notification-header">
          <span className="notification-icon">🔔</span>
          <h3>Notificaciones Push</h3>
        </div>
        
        <div className="notification-content">
          <div className="permission-status">
            <span className="status-label">Estado:</span>
            <span className={`status-badge ${permission}`}>
              {permission === 'granted' && '✅ Activadas'}
              {permission === 'denied' && '❌ Denegadas'}
              {permission === 'default' && '⏳ Pendientes'}
            </span>
          </div>

          <div className="notification-features">
            <h4>Funciones disponibles:</h4>
            <ul className="features-list">
              <li>🎮 Recordatorios de minijuegos</li>
              <li>🐾 Alertas de cuidado de mascota</li>
              <li>🎯 Notificaciones de misiones</li>
              <li>🏆 Logros desbloqueados</li>
              <li>👥 Mensajes de amigos</li>
              <li>🎪 Eventos especiales</li>
            </ul>
          </div>

          <div className="notification-actions">
            {permission === 'default' && (
              <button
                className="notification-btn primary-btn"
                onClick={requestPermission}
                disabled={loading}
              >
                {loading ? '⏳' : '🔔 Activar Notificaciones'}
              </button>
            )}

            {permission === 'granted' && (
              <>
                <button
                  className="notification-btn test-btn"
                  onClick={testNotification}
                >
                  🧪 Probar Notificación
                </button>
                
                <button
                  className="notification-btn secondary-btn"
                  onClick={unsubscribeFromNotifications}
                  disabled={loading}
                >
                  {loading ? '⏳' : '🔕 Desactivar'}
                </button>
              </>
            )}

            {permission === 'denied' && (
              <div className="permission-help">
                <p>Para activar notificaciones:</p>
                <ol>
                  <li>Abre la configuración de tu navegador</li>
                  <li>Busca "Notificaciones" o "Sitios"</li>
                  <li>Permite notificaciones para este sitio</li>
                  <li>Recarga la página</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {notification.message && (
          <div className={`notification-toast ${notification.type}`}>
            <span className="toast-icon">
              {notification.type === 'success' && '✅'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'info' && 'ℹ️'}
            </span>
            <span className="toast-message">{notification.message}</span>
            <button
              className="toast-close"
              onClick={() => setNotification({ message: '', type: 'info' })}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PushNotifications; 