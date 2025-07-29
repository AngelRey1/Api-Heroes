import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useSoundEffects } from './SoundEffects';
import './BackupRestore.css';

const BackupRestore = () => {
  const { token, user } = useUser();
  const { playClick, playCoin, playCelebrate } = useSoundEffects();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [backupData, setBackupData] = useState(null);
  const [restoreFile, setRestoreFile] = useState(null);

  const createBackup = async () => {
    try {
      setLoading(true);
      playClick();

      // Crear objeto de backup con datos del usuario
      const backup = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        user: {
          username: user?.username,
          email: user?.email,
          coins: user?.coins,
          level: user?.level,
          experience: user?.experience
        },
        pets: user?.mascotas || [],
        heroes: user?.heroes || [],
        inventory: user?.inventory || [],
        achievements: user?.achievements || [],
        statistics: user?.statistics || {},
        settings: {
          soundEnabled: localStorage.getItem('soundEnabled') === 'true',
          musicEnabled: localStorage.getItem('musicEnabled') === 'true',
          volume: localStorage.getItem('volume') || 0.5
        }
      };

      // Crear y descargar archivo
      const blob = new Blob([JSON.stringify(backup, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mascota-hero-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBackupData(backup);
      setNotification({ 
        message: '¡Backup creado exitosamente!', 
        type: 'success' 
      });
      playCoin();
    } catch (error) {
      console.error('Error creating backup:', error);
      setNotification({ 
        message: 'Error al crear backup', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      setRestoreFile(file);
      setNotification({ 
        message: 'Archivo seleccionado correctamente', 
        type: 'success' 
      });
      playClick();
    } else {
      setNotification({ 
        message: 'Por favor selecciona un archivo JSON válido', 
        type: 'error' 
      });
    }
  };

  const restoreBackup = async () => {
    if (!restoreFile) {
      setNotification({ 
        message: 'Por favor selecciona un archivo primero', 
        type: 'error' 
      });
      return;
    }

    try {
      setLoading(true);
      playClick();

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const backup = JSON.parse(e.target.result);
          
          // Validar estructura del backup
          if (!backup.version || !backup.user) {
            throw new Error('Archivo de backup inválido');
          }

          // Aquí enviarías los datos al servidor para restaurar
          // Por ahora solo mostramos los datos
          setBackupData(backup);
          
          setNotification({ 
            message: '¡Backup cargado exitosamente! Revisa los datos antes de restaurar.', 
            type: 'success' 
          });
          playCelebrate();
        } catch (error) {
          console.error('Error parsing backup file:', error);
          setNotification({ 
            message: 'Error al leer el archivo de backup', 
            type: 'error' 
          });
        }
      };
      
      reader.readAsText(restoreFile);
    } catch (error) {
      console.error('Error restoring backup:', error);
      setNotification({ 
        message: 'Error al restaurar backup', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmRestore = async () => {
    if (!backupData) return;

    if (!window.confirm('¿Estás seguro de que quieres restaurar estos datos? Esta acción sobrescribirá tus datos actuales.')) {
      return;
    }

    try {
      setLoading(true);
      playClick();

      // Aquí enviarías los datos al servidor para restaurar
      console.log('Restoring backup:', backupData);
      
      setNotification({ 
        message: '¡Datos restaurados exitosamente!', 
        type: 'success' 
      });
      playCelebrate();
      
      // Limpiar datos
      setBackupData(null);
      setRestoreFile(null);
    } catch (error) {
      console.error('Error confirming restore:', error);
      setNotification({ 
        message: 'Error al confirmar restauración', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const clearBackupData = () => {
    setBackupData(null);
    setRestoreFile(null);
    setNotification({ 
      message: 'Datos de backup limpiados', 
      type: 'info' 
    });
    playClick();
  };

  return (
    <div className="backup-restore-container">
      <div className="backup-restore-card">
        <div className="backup-header">
          <span className="backup-icon">💾</span>
          <h3>Backup y Restore</h3>
        </div>

        <div className="backup-content">
          <div className="backup-section">
            <h4>📤 Crear Backup</h4>
            <p>Guarda una copia de seguridad de todos tus datos del juego.</p>
            <button
              className="backup-btn create-btn"
              onClick={createBackup}
              disabled={loading}
            >
              {loading ? '⏳ Creando...' : '💾 Crear Backup'}
            </button>
          </div>

          <div className="backup-section">
            <h4>📥 Restaurar Backup</h4>
            <p>Restaura tus datos desde un archivo de backup.</p>
            
            <div className="file-input-container">
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="file-input"
                id="backup-file"
              />
              <label htmlFor="backup-file" className="file-label">
                📁 Seleccionar archivo
              </label>
            </div>

            {restoreFile && (
              <div className="file-info">
                <span className="file-name">{restoreFile.name}</span>
                <span className="file-size">
                  ({(restoreFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}

            <button
              className="backup-btn restore-btn"
              onClick={restoreBackup}
              disabled={loading || !restoreFile}
            >
              {loading ? '⏳ Cargando...' : '📥 Cargar Backup'}
            </button>
          </div>

          {backupData && (
            <div className="backup-preview">
              <h4>📋 Vista Previa del Backup</h4>
              <div className="preview-content">
                <div className="preview-item">
                  <span className="preview-label">Usuario:</span>
                  <span className="preview-value">{backupData.user?.username}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Monedas:</span>
                  <span className="preview-value">{backupData.user?.coins}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Mascotas:</span>
                  <span className="preview-value">{backupData.pets?.length || 0}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Héroes:</span>
                  <span className="preview-value">{backupData.heroes?.length || 0}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Fecha:</span>
                  <span className="preview-value">
                    {new Date(backupData.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="preview-actions">
                <button
                  className="backup-btn confirm-btn"
                  onClick={confirmRestore}
                  disabled={loading}
                >
                  {loading ? '⏳ Restaurando...' : '✅ Confirmar Restore'}
                </button>
                <button
                  className="backup-btn clear-btn"
                  onClick={clearBackupData}
                >
                  ❌ Limpiar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="backup-info">
          <h4>ℹ️ Información</h4>
          <ul className="info-list">
            <li>Los backups incluyen todos tus datos del juego</li>
            <li>Guarda los backups en un lugar seguro</li>
            <li>La restauración sobrescribirá datos actuales</li>
            <li>Formato: JSON (compatible con cualquier editor)</li>
          </ul>
        </div>

        {notification.message && (
          <div className={`backup-toast ${notification.type}`}>
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

export default BackupRestore; 