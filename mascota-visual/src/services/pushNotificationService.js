class PushNotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.subscription = null;
    this.serviceWorkerRegistration = null;
  }

  // Solicitar permisos de notificación
  async requestPermission() {
    if (!this.isSupported) {
      console.warn('Las notificaciones push no están soportadas en este navegador');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      console.warn('Los permisos de notificación fueron denegados');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
      return false;
    }
  }

  // Registrar service worker
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker no está soportado');
      return false;
    }

    try {
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', this.serviceWorkerRegistration);
      return true;
    } catch (error) {
      console.error('Error al registrar Service Worker:', error);
      return false;
    }
  }

  // Suscribirse a notificaciones push
  async subscribeToPushNotifications() {
    if (!this.isSupported || this.permission !== 'granted') {
      return false;
    }

    if (!this.serviceWorkerRegistration) {
      const registered = await this.registerServiceWorker();
      if (!registered) return false;
    }

    try {
      this.subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
      });

      console.log('Suscrito a notificaciones push:', this.subscription);
      return this.subscription;
    } catch (error) {
      console.error('Error al suscribirse a notificaciones push:', error);
      return false;
    }
  }

  // Cancelar suscripción
  async unsubscribeFromPushNotifications() {
    if (this.subscription) {
      try {
        await this.subscription.unsubscribe();
        this.subscription = null;
        console.log('Suscripción cancelada');
        return true;
      } catch (error) {
        console.error('Error al cancelar suscripción:', error);
        return false;
      }
    }
    return false;
  }

  // Mostrar notificación local
  showNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') {
      return false;
    }

    const defaultOptions = {
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      actions: [
        {
          action: 'open',
          title: 'Abrir',
          icon: '/logo192.png'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: '/logo192.png'
        }
      ],
      data: {
        url: window.location.href
      }
    };

    const notification = new Notification(title, { ...defaultOptions, ...options });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
      
      if (event.action === 'open') {
        // Navegar a la página correspondiente
        if (options.data && options.data.url) {
          window.location.href = options.data.url;
        }
      }
    };

    return notification;
  }

  // Notificaciones específicas del juego
  showPetCareReminder() {
    return this.showNotification('🐾 ¡Tu mascota te necesita!', {
      body: 'Es hora de cuidar a tu mascota. ¡Aliméntala y juega con ella!',
      icon: '/assets/cat_happy.png',
      tag: 'pet-care',
      requireInteraction: true,
      data: { url: '/home' }
    });
  }

  showAchievementUnlocked(achievementName) {
    return this.showNotification('🏆 ¡Logro Desbloqueado!', {
      body: `Has desbloqueado: ${achievementName}`,
      icon: '/logo192.png',
      tag: 'achievement',
      data: { url: '/achievements' }
    });
  }

  showMissionCompleted(missionName) {
    return this.showNotification('🎯 ¡Misión Completada!', {
      body: `Has completado: ${missionName}`,
      icon: '/logo192.png',
      tag: 'mission',
      data: { url: '/missions' }
    });
  }

  showTournamentStarted(tournamentName) {
    return this.showNotification('🏆 ¡Torneo Iniciado!', {
      body: `El torneo "${tournamentName}" ha comenzado. ¡Participa ahora!`,
      icon: '/logo192.png',
      tag: 'tournament',
      requireInteraction: true,
      data: { url: '/tournaments' }
    });
  }

  showNewMessage(senderName) {
    return this.showNotification('💬 Nuevo Mensaje', {
      body: `${senderName} te ha enviado un mensaje`,
      icon: '/logo192.png',
      tag: 'message',
      data: { url: '/chat' }
    });
  }

  showFriendRequest(username) {
    return this.showNotification('👥 Nueva Solicitud de Amistad', {
      body: `${username} quiere ser tu amigo`,
      icon: '/logo192.png',
      tag: 'friend-request',
      requireInteraction: true,
      data: { url: '/friends' }
    });
  }

  showGiftReceived(senderName) {
    return this.showNotification('🎁 ¡Regalo Recibido!', {
      body: `${senderName} te ha enviado un regalo`,
      icon: '/logo192.png',
      tag: 'gift',
      data: { url: '/friends' }
    });
  }

  showEventStarted(eventName) {
    return this.showNotification('🎉 ¡Evento Especial!', {
      body: `El evento "${eventName}" ha comenzado. ¡Participa y gana premios!`,
      icon: '/logo192.png',
      tag: 'event',
      requireInteraction: true,
      data: { url: '/events' }
    });
  }

  // Configurar recordatorios automáticos
  setupPetCareReminders() {
    // Recordatorio cada 4 horas
    setInterval(() => {
      this.showPetCareReminder();
    }, 4 * 60 * 60 * 1000);
  }

  // Configurar recordatorios de torneos
  setupTournamentReminders() {
    // Verificar torneos cada hora
    setInterval(() => {
      // Esta función se llamará desde el componente principal
      // cuando se detecte un torneo próximo
    }, 60 * 60 * 1000);
  }

  // Obtener suscripción actual
  getSubscription() {
    return this.subscription;
  }

  // Verificar si las notificaciones están habilitadas
  isEnabled() {
    return this.isSupported && this.permission === 'granted';
  }

  // Convertir clave VAPID
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Configurar listeners para notificaciones
  setupNotificationListeners() {
    if (!this.isSupported) return;

    // Listener para cuando la aplicación vuelve a estar en foco
    window.addEventListener('focus', () => {
      // Limpiar notificaciones cuando el usuario regresa a la app
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.getNotifications().then(notifications => {
            notifications.forEach(notification => {
              notification.close();
            });
          });
        });
      }
    });

    // Listener para cambios en el estado de la conexión
    window.addEventListener('online', () => {
      console.log('Conexión restaurada');
    });

    window.addEventListener('offline', () => {
      console.log('Conexión perdida');
    });
  }

  // Inicializar el servicio
  async initialize() {
    if (!this.isSupported) {
      console.warn('Notificaciones push no soportadas');
      return false;
    }

    try {
      // Solicitar permisos
      const permissionGranted = await this.requestPermission();
      if (!permissionGranted) {
        return false;
      }

      // Registrar service worker
      await this.registerServiceWorker();

      // Suscribirse a notificaciones push
      await this.subscribeToPushNotifications();

      // Configurar listeners
      this.setupNotificationListeners();

      // Configurar recordatorios
      this.setupPetCareReminders();
      this.setupTournamentReminders();

      console.log('Servicio de notificaciones push inicializado');
      return true;
    } catch (error) {
      console.error('Error al inicializar notificaciones push:', error);
      return false;
    }
  }
}

export default new PushNotificationService(); 