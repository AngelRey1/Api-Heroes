import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { 
  getFriendsList, 
  getFriendRequests, 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest,
  removeFriend,
  visitFriend
} from '../api';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import './Friends.css';

const Friends = () => {
  const { token } = useUser();
  const { playClick, playCoin, playCelebrate } = useSoundEffects();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [activeTab, setActiveTab] = useState('friends');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFriendsData();
  }, [token]);

  const fetchFriendsData = async () => {
    try {
      setLoading(true);
      
      // Obtener lista de amigos
      const friendsData = await getFriendsList(token);
      setFriends(friendsData);
      
      // Obtener solicitudes de amistad
      const requestsData = await getFriendRequests(token);
      setRequests(requestsData);
      
    } catch (err) {
      console.error('Error fetching friends data:', err);
      setNotification({ message: 'Error al cargar amigos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      setActionLoading(true);
      playClick();
      
      await sendFriendRequest(userId, token);
      
      setNotification({ 
        message: 'Solicitud de amistad enviada', 
        type: 'success' 
      });
      
      playCoin();
    } catch (err) {
      console.error('Error sending friend request:', err);
      setNotification({ message: 'Error al enviar solicitud', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setActionLoading(true);
      playClick();
      
      await acceptFriendRequest(requestId, token);
      
      setNotification({ 
        message: '¡Solicitud aceptada!', 
        type: 'success' 
      });
      
      playCelebrate();
      
      // Recargar datos
      await fetchFriendsData();
    } catch (err) {
      console.error('Error accepting request:', err);
      setNotification({ message: 'Error al aceptar solicitud', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setActionLoading(true);
      playClick();
      
      await rejectFriendRequest(requestId, token);
      
      setNotification({ 
        message: 'Solicitud rechazada', 
        type: 'info' 
      });
      
      // Recargar datos
      await fetchFriendsData();
    } catch (err) {
      console.error('Error rejecting request:', err);
      setNotification({ message: 'Error al rechazar solicitud', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar a este amigo?')) {
      return;
    }

    try {
      setActionLoading(true);
      playClick();
      
      await removeFriend(friendId, token);
      
      setNotification({ 
        message: 'Amigo eliminado', 
        type: 'info' 
      });
      
      // Recargar datos
      await fetchFriendsData();
    } catch (err) {
      console.error('Error removing friend:', err);
      setNotification({ message: 'Error al eliminar amigo', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleVisitFriend = async (friendId) => {
    try {
      setActionLoading(true);
      playClick();
      
      const result = await visitFriend(friendId, token);
      
      setNotification({ 
        message: `¡Visitaste a ${result.friendName}! +${result.coinsEarned} monedas`, 
        type: 'success' 
      });
      
      playCoin();
    } catch (err) {
      console.error('Error visiting friend:', err);
      setNotification({ message: 'Error al visitar amigo', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter(request => 
    request.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="friends-container">
        <div className="loading-message">
          <div className="loading-spinner">👥</div>
          <p>Cargando amigos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-container">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'info' })} 
      />

      {/* Header */}
      <div className="friends-header">
        <h1>👥 Amigos</h1>
        <div className="friends-stats">
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-label">Amigos:</span>
            <span className="stat-value">{friends.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📨</span>
            <span className="stat-label">Solicitudes:</span>
            <span className="stat-value">{requests.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('friends');
            playClick();
          }}
        >
          👥 Mis Amigos ({friends.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('requests');
            playClick();
          }}
        >
          📨 Solicitudes ({requests.length})
        </button>
      </div>

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar amigos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Contenido de amigos */}
      {activeTab === 'friends' && (
        <div className="friends-content">
          {filteredFriends.length === 0 ? (
            <div className="no-friends">
              <div className="no-friends-icon">👥</div>
              <h3>No tienes amigos aún</h3>
              <p>¡Agrega amigos para visitarlos y compartir experiencias!</p>
            </div>
          ) : (
            <div className="friends-grid">
              {filteredFriends.map(friend => (
                <div key={friend._id} className="friend-card">
                  <div className="friend-avatar">
                    <img 
                      src={friend.avatar || '/assets/hero.svg'} 
                      alt={friend.username}
                      className="avatar-img"
                    />
                  </div>
                  
                  <div className="friend-info">
                    <h3 className="friend-name">{friend.username}</h3>
                    <p className="friend-level">Nivel {friend.level || 1}</p>
                    <div className="friend-stats">
                      <span className="stat">🐾 {friend.petsCount || 0} mascotas</span>
                      <span className="stat">🏆 {friend.achievementsCount || 0} logros</span>
                    </div>
                  </div>
                  
                  <div className="friend-actions">
                    <button
                      className="visit-btn"
                      onClick={() => handleVisitFriend(friend._id)}
                      disabled={actionLoading}
                    >
                      🏠 Visitar
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFriend(friend._id)}
                      disabled={actionLoading}
                    >
                      ❌ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contenido de solicitudes */}
      {activeTab === 'requests' && (
        <div className="requests-content">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">
              <div className="no-requests-icon">📨</div>
              <h3>No hay solicitudes pendientes</h3>
              <p>¡Las solicitudes de amistad aparecerán aquí!</p>
            </div>
          ) : (
            <div className="requests-grid">
              {filteredRequests.map(request => (
                <div key={request._id} className="request-card">
                  <div className="request-avatar">
                    <img 
                      src={request.avatar || '/assets/hero.svg'} 
                      alt={request.username}
                      className="avatar-img"
                    />
                  </div>
                  
                  <div className="request-info">
                    <h3 className="request-name">{request.username}</h3>
                    <p className="request-level">Nivel {request.level || 1}</p>
                    <p className="request-message">{request.message || 'Quiere ser tu amigo'}</p>
                  </div>
                  
                  <div className="request-actions">
                    <button
                      className="accept-btn"
                      onClick={() => handleAcceptRequest(request._id)}
                      disabled={actionLoading}
                    >
                      ✅ Aceptar
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRejectRequest(request._id)}
                      disabled={actionLoading}
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Información adicional */}
      <div className="friends-info">
        <div className="info-card">
          <h3>💡 Funciones de Amigos</h3>
          <div className="friends-features">
            <div className="feature-item">
              <span className="feature-icon">🏠</span>
              <span className="feature-name">Visitar</span>
              <span className="feature-desc">Visita a tus amigos y gana monedas</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎁</span>
              <span className="feature-name">Regalar</span>
              <span className="feature-desc">Envía regalos a tus amigos</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <span className="feature-name">Competir</span>
              <span className="feature-desc">Compite en torneos</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span className="feature-name">Chat</span>
              <span className="feature-desc">Chatea con tus amigos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends; 