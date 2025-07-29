import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword,
  deleteAccount,
  exportUserData,
  getProfileStatistics
} from '../api';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import './Profile.css';

const Profile = () => {
  const { token, user, logout } = useUser();
  const { playClick, playCoin, playCelebrate } = useSoundEffects();
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [activeTab, setActiveTab] = useState('info');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, [token]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        getUserProfile(token),
        getProfileStatistics(token)
      ]);
      setProfile(profileData);
      setStatistics(statsData);
      setFormData({
        username: profileData.username || '',
        email: profileData.email || '',
        bio: profileData.bio || '',
        avatar: profileData.avatar || ''
      });
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setNotification({ message: 'Error al cargar perfil', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      playClick();
      await updateUserProfile(formData, token);
      setNotification({ 
        message: 'Perfil actualizado correctamente', 
        type: 'success' 
      });
      playCoin();
      setEditMode(false);
      await fetchProfileData();
    } catch (err) {
      console.error('Error updating profile:', err);
      setNotification({ message: 'Error al actualizar perfil', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    try {
      setSaving(true);
      playClick();
      await changePassword(passwordData, token);
      setNotification({ 
        message: 'Contraseña cambiada correctamente', 
        type: 'success' 
      });
      playCelebrate();
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error changing password:', err);
      setNotification({ message: 'Error al cambiar contraseña', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setSaving(true);
      playClick();
      await deleteAccount(token);
      setNotification({ 
        message: 'Cuenta eliminada correctamente', 
        type: 'info' 
      });
      logout();
    } catch (err) {
      console.error('Error deleting account:', err);
      setNotification({ message: 'Error al eliminar cuenta', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      setSaving(true);
      playClick();
      const data = await exportUserData(token);
      
      // Crear y descargar archivo
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mascota-hero-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setNotification({ 
        message: 'Datos exportados correctamente', 
        type: 'success' 
      });
      playCoin();
    } catch (err) {
      console.error('Error exporting data:', err);
      setNotification({ message: 'Error al exportar datos', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getLevelProgress = () => {
    if (!statistics) return 0;
    const currentExp = statistics.totalExperience || 0;
    const level = Math.floor(currentExp / 1000) + 1;
    const expForNextLevel = level * 1000;
    const expInCurrentLevel = currentExp - ((level - 1) * 1000);
    return (expInCurrentLevel / 1000) * 100;
  };

  const getLevel = () => {
    if (!statistics) return 1;
    return Math.floor((statistics.totalExperience || 0) / 1000) + 1;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-message">
          <div className="loading-spinner">👤</div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'info' })} 
      />

      {/* Header del perfil */}
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <img 
              src={profile?.avatar || '/assets/hero.svg'} 
              alt={profile?.username}
              className="avatar-img"
            />
            {editMode && (
              <div className="avatar-edit">
                <input
                  type="text"
                  placeholder="URL del avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                  className="avatar-input"
                />
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{profile?.username}</h1>
            <div className="profile-level">
              <span className="level-badge">Nivel {getLevel()}</span>
              <div className="level-progress">
                <div 
                  className="level-fill"
                  style={{ width: `${getLevelProgress()}%` }}
                ></div>
              </div>
            </div>
            <p className="profile-bio">{profile?.bio || 'Sin descripción'}</p>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-icon">💰</span>
            <span className="stat-label">Monedas:</span>
            <span className="stat-value">{user?.coins || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🐾</span>
            <span className="stat-label">Mascotas:</span>
            <span className="stat-value">{user?.mascotas?.length || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <span className="stat-label">Logros:</span>
            <span className="stat-value">{statistics?.achievementsCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('info');
            playClick();
          }}
        >
          👤 Información
        </button>
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('stats');
            playClick();
          }}
        >
          📊 Estadísticas
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('security');
            playClick();
          }}
        >
          🔒 Seguridad
        </button>
        <button
          className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('data');
            playClick();
          }}
        >
          📁 Datos
        </button>
      </div>

      {/* Contenido de las tabs */}
      <div className="profile-content">
        {activeTab === 'info' && (
          <div className="info-section">
            <div className="section-header">
              <h2>👤 Información Personal</h2>
              <button
                className={`edit-btn ${editMode ? 'save' : ''}`}
                onClick={() => {
                  if (editMode) {
                    handleSaveProfile();
                  } else {
                    setEditMode(true);
                    playClick();
                  }
                }}
                disabled={saving}
              >
                {saving ? '⏳' : editMode ? '💾 Guardar' : '✏️ Editar'}
              </button>
            </div>

            <div className="form-group">
              <label>Nombre de usuario:</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                disabled={!editMode}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!editMode}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Biografía:</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                disabled={!editMode}
                className="form-textarea"
                rows="3"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            {editMode && (
              <div className="edit-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      username: profile?.username || '',
                      email: profile?.email || '',
                      bio: profile?.bio || '',
                      avatar: profile?.avatar || ''
                    });
                    playClick();
                  }}
                >
                  ❌ Cancelar
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <h2>📊 Estadísticas Detalladas</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-info">
                  <h3>Juegos Jugados</h3>
                  <p className="stat-value">{statistics?.gamesPlayed || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <h3>Puntuación Máxima</h3>
                  <p className="stat-value">{statistics?.highestScore || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-info">
                  <h3>Tiempo Jugado</h3>
                  <p className="stat-value">{Math.floor((statistics?.totalPlayTime || 0) / 60)} min</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>Amigos</h3>
                  <p className="stat-value">{statistics?.friendsCount || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>Días Activo</h3>
                  <p className="stat-value">{statistics?.daysActive || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>Misiones Completadas</h3>
                  <p className="stat-value">{statistics?.missionsCompleted || 0}</p>
                </div>
              </div>
            </div>

            <div className="achievement-section">
              <h3>🏆 Logros Recientes</h3>
              <div className="achievements-list">
                {statistics?.recentAchievements?.length > 0 ? (
                  statistics.recentAchievements.map(achievement => (
                    <div key={achievement._id} className="achievement-item">
                      <span className="achievement-icon">{achievement.icon || '🏆'}</span>
                      <div className="achievement-info">
                        <h4>{achievement.title}</h4>
                        <p>{achievement.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-achievements">No hay logros recientes</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-section">
            <h2>🔒 Configuración de Seguridad</h2>
            
            <div className="password-section">
              <h3>🔑 Cambiar Contraseña</h3>
              <div className="form-group">
                <label>Contraseña actual:</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="form-input"
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>

              <div className="form-group">
                <label>Nueva contraseña:</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="form-input"
                  placeholder="Ingresa tu nueva contraseña"
                />
              </div>

              <div className="form-group">
                <label>Confirmar nueva contraseña:</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="form-input"
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>

              <button
                className="change-password-btn"
                onClick={handleChangePassword}
                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                {saving ? '⏳ Cambiando...' : '🔑 Cambiar Contraseña'}
              </button>
            </div>

            <div className="danger-section">
              <h3>⚠️ Zona de Peligro</h3>
              <div className="danger-actions">
                <button
                  className="delete-account-btn"
                  onClick={handleDeleteAccount}
                  disabled={saving}
                >
                  {saving ? '⏳' : '🗑️ Eliminar Cuenta'}
                </button>
                <p className="danger-warning">
                  ⚠️ Esta acción no se puede deshacer
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="data-section">
            <h2>📁 Gestión de Datos</h2>
            
            <div className="data-actions">
              <div className="data-action">
                <h3>📤 Exportar Datos</h3>
                <p>Descarga todos tus datos en formato JSON</p>
                <button
                  className="export-btn"
                  onClick={handleExportData}
                  disabled={saving}
                >
                  {saving ? '⏳ Exportando...' : '📤 Exportar Datos'}
                </button>
              </div>

              <div className="data-info">
                <h3>📊 Información de la Cuenta</h3>
                <div className="data-grid">
                  <div className="data-item">
                    <span className="data-label">Fecha de registro:</span>
                    <span className="data-value">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Última actividad:</span>
                    <span className="data-value">
                      {profile?.lastActivity ? new Date(profile.lastActivity).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">ID de usuario:</span>
                    <span className="data-value">{profile?._id || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 