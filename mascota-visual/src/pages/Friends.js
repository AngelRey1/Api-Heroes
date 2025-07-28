import React, { useEffect, useState } from 'react';
import { 
  searchUsers, 
  sendFriendRequest, 
  respondToFriendRequest, 
  getFriendsList, 
  getFriendRequests,
  getFriendProfile,
  removeFriend,
  getReceivedGifts,
  claimGift
} from '../api';
import './Friends.css';

export default function Friends({ token }) {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendProfile, setFriendProfile] = useState(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [friendsData, requestsData, giftsData] = await Promise.all([
        getFriendsList(token),
        getFriendRequests(token),
        getReceivedGifts(token)
      ]);
      setFriends(friendsData);
      setRequests(requestsData);
      setGifts(giftsData);
    } catch (err) {
      setError('Error al cargar datos de amigos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length < 2) return;
    try {
      const results = await searchUsers(searchQuery, token);
      setSearchResults(results);
    } catch (err) {
      setError('Error al buscar usuarios.');
    }
  };

  const handleSendRequest = async (userId, message = '') => {
    try {
      await sendFriendRequest(userId, message, token);
      setSuccess('Solicitud enviada correctamente');
      setSearchResults([]);
      setSearchQuery('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar solicitud');
    }
  };

  const handleRespondRequest = async (requestId, response) => {
    try {
      await respondToFriendRequest(requestId, response, token);
      setSuccess(`Solicitud ${response === 'accepted' ? 'aceptada' : 'rechazada'}`);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al responder solicitud');
    }
  };

  const handleViewProfile = async (friendId) => {
    try {
      const profile = await getFriendProfile(friendId, token);
      setFriendProfile(profile);
      setSelectedFriend(friendId);
    } catch (err) {
      setError('Error al cargar perfil del amigo');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este amigo?')) return;
    try {
      await removeFriend(friendId, token);
      setSuccess('Amigo eliminado correctamente');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar amigo');
    }
  };

  const handleClaimGift = async (giftId) => {
    try {
      await claimGift(giftId, token);
      setSuccess('¡Regalo reclamado!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al reclamar regalo');
    }
  };

  const closeProfile = () => {
    setSelectedFriend(null);
    setFriendProfile(null);
  };

  if (loading) return <div className="friends-container"><p>Cargando...</p></div>;

  return (
    <div className="friends-container">
      <div className="friends-header">
        <h2>👥 Amigos</h2>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="friends-tabs">
        <button 
          className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Amigos ({friends.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Solicitudes ({requests.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'gifts' ? 'active' : ''}`}
          onClick={() => setActiveTab('gifts')}
        >
          Regalos ({gifts.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Buscar
        </button>
      </div>

      <div className="friends-content">
        {activeTab === 'friends' && (
          <div className="friends-list">
            {friends.length === 0 ? (
              <p className="no-data">No tienes amigos aún. ¡Busca usuarios para agregar!</p>
            ) : (
              friends.map(friend => (
                <div key={friend._id} className="friend-card">
                  <div className="friend-avatar">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt={friend.heroName} />
                    ) : (
                      <div className="default-avatar">👤</div>
                    )}
                  </div>
                  <div className="friend-info">
                    <h3>{friend.heroName}</h3>
                    <p>@{friend.username}</p>
                  </div>
                  <div className="friend-actions">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewProfile(friend._id)}
                    >
                      Ver Perfil
                    </button>
                    <button 
                      className="btn-remove"
                      onClick={() => handleRemoveFriend(friend._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-list">
            {requests.length === 0 ? (
              <p className="no-data">No tienes solicitudes pendientes</p>
            ) : (
              requests.map(request => (
                <div key={request._id} className="request-card">
                  <div className="request-avatar">
                    {request.from.avatar ? (
                      <img src={request.from.avatar} alt={request.from.heroName} />
                    ) : (
                      <div className="default-avatar">👤</div>
                    )}
                  </div>
                  <div className="request-info">
                    <h3>{request.from.heroName}</h3>
                    <p>@{request.from.username}</p>
                    {request.message && <p className="request-message">"{request.message}"</p>}
                  </div>
                  <div className="request-actions">
                    <button 
                      className="btn-accept"
                      onClick={() => handleRespondRequest(request._id, 'accepted')}
                    >
                      Aceptar
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleRespondRequest(request._id, 'rejected')}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'gifts' && (
          <div className="gifts-list">
            {gifts.length === 0 ? (
              <p className="no-data">No tienes regalos pendientes</p>
            ) : (
              gifts.map(gift => (
                <div key={gift._id} className="gift-card">
                  <div className="gift-avatar">
                    {gift.from.avatar ? (
                      <img src={gift.from.avatar} alt={gift.from.heroName} />
                    ) : (
                      <div className="default-avatar">👤</div>
                    )}
                  </div>
                  <div className="gift-info">
                    <h3>De: {gift.from.heroName}</h3>
                    <div className="gift-item">
                      <span>🎁 {gift.item.name}</span>
                    </div>
                    {gift.message && <p className="gift-message">"{gift.message}"</p>}
                    <p className="gift-date">
                      Recibido: {new Date(gift.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="gift-actions">
                    <button 
                      className="btn-claim"
                      onClick={() => handleClaimGift(gift._id)}
                    >
                      Reclamar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>Buscar</button>
            </div>
            
            <div className="search-results">
              {searchResults.map(user => (
                <div key={user._id} className="search-result-card">
                  <div className="result-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.heroName} />
                    ) : (
                      <div className="default-avatar">👤</div>
                    )}
                  </div>
                  <div className="result-info">
                    <h3>{user.heroName}</h3>
                    <p>@{user.username}</p>
                  </div>
                  <div className="result-actions">
                    <button 
                      className="btn-add"
                      onClick={() => handleSendRequest(user._id)}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de perfil de amigo */}
      {selectedFriend && friendProfile && (
        <div className="profile-modal-overlay" onClick={closeProfile}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Perfil de {friendProfile.hero?.name || friendProfile.username}</h3>
              <button className="close-button" onClick={closeProfile}>✕</button>
            </div>
            
            <div className="profile-modal-content">
              <div className="profile-hero">
                <div className="hero-avatar">
                  {friendProfile.hero?.avatar ? (
                    <img src={friendProfile.hero.avatar} alt={friendProfile.hero.name} />
                  ) : (
                    <div className="default-avatar">👤</div>
                  )}
                </div>
                <div className="hero-info">
                  <h4>{friendProfile.hero?.name || friendProfile.username}</h4>
                  <p>@{friendProfile.username}</p>
                  <p>🪙 {friendProfile.coins} monedas</p>
                </div>
              </div>

              <div className="profile-pets">
                <h4>Mascotas ({friendProfile.pets?.length || 0})</h4>
                <div className="pets-grid">
                  {friendProfile.pets?.map(pet => (
                    <div key={pet._id} className="pet-item">
                      <span>{pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🐾'}</span>
                      <p>{pet.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-achievements">
                <h4>Logros ({friendProfile.achievements?.length || 0})</h4>
                <div className="achievements-grid">
                  {friendProfile.achievements?.slice(0, 6).map(achievement => (
                    <div key={achievement.achievement._id} className="achievement-item">
                      <span>{achievement.achievement.icon}</span>
                      <p>{achievement.achievement.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-stats">
                <h4>Estadísticas Sociales</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span>👥 Amigos</span>
                    <span>{friendProfile.socialStats?.friendsCount || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span>🎁 Regalos Enviados</span>
                    <span>{friendProfile.socialStats?.giftsSent || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span>🎁 Regalos Recibidos</span>
                    <span>{friendProfile.socialStats?.giftsReceived || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 