import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../api';

const typeIcons = {
  info: 'ℹ️',
  reward: '🎁',
  event: '🎉',
  reminder: '⏰',
};

function NotificationsPanel({ token, open, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getNotifications(token);
        setNotifications(data);
      } catch (err) {
        setError('Error al cargar notificaciones.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [token, open]);

  const handleRead = async (id) => {
    await markNotificationAsRead(token, id);
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const handleDelete = async (id) => {
    await deleteNotification(token, id);
    setNotifications(notifications.filter(n => n._id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const events = notifications.filter(n => n.type === 'event' && (!n.eventEnd || new Date(n.eventEnd) > new Date()));

  return (
    <div className={`notifications-panel${open ? ' open' : ''}`}>
      <div className="notifications-header">
        <span>Notificaciones</span>
        <button onClick={onClose}>✖</button>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {events.length > 0 && (
        <div className="notifications-events">
          <h4>Eventos activos</h4>
          {events.map(ev => (
            <div key={ev._id} className="notification-event">
              <span>{typeIcons[ev.type] || '🎉'}</span> <b>{ev.title}</b>
              <div>{ev.message}</div>
              {ev.eventEnd && <div className="event-date">Hasta: {new Date(ev.eventEnd).toLocaleString()}</div>}
            </div>
          ))}
        </div>
      )}
      <div className="notifications-list">
        {notifications.map(n => (
          <div key={n._id} className={`notification-item${n.read ? ' read' : ''}`}>
            <span className="notification-icon">{typeIcons[n.type] || '🔔'}</span>
            <div className="notification-content">
              <b>{n.title}</b>
              <div>{n.message}</div>
              <div className="notification-date">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            {!n.read && <button className="notification-btn" onClick={() => handleRead(n._id)} title="Marcar como leída">✔️</button>}
            <button className="notification-btn" onClick={() => handleDelete(n._id)} title="Eliminar">🗑️</button>
          </div>
        ))}
        {notifications.length === 0 && !loading && <p>No tienes notificaciones.</p>}
      </div>
      {unreadCount > 0 && <span className="notifications-badge">{unreadCount}</span>}
    </div>
  );
}

export default NotificationsPanel; 