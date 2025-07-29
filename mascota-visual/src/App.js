import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { apiLogin, register, alimentarMascota } from './api';
import { UserProvider, useUser } from './context/UserContext';
import Home from './pages/Home';
import Minigames from './pages/Minigames';
import Achievements from './pages/Achievements';
import Shop from './pages/Shop';
import Statistics from './pages/Statistics';
import Missions from './pages/Missions';
import Events from './pages/Events';
import Friends from './pages/Friends';
import Chat from './pages/Chat';
import Tournaments from './pages/Tournaments';
import Ranking from './pages/Ranking';
import Inventory from './pages/Inventory';
import PetCollection from './pages/PetCollection';
import PetCustomization from './pages/PetCustomization';
import HeroCustomization from './pages/HeroCustomization';
import Customization from './pages/Customization';
import Settings from './pages/Settings';
import SecretAchievements from './pages/SecretAchievements';
import WelcomeGuide from './components/WelcomeGuide';
import ParticleEffect from './components/ParticleEffect';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Tutorial from './components/Tutorial';
import AudioManager from './components/AudioManager';
import './App.css';

function AppContent() {
  const { token, user, coins, login, logout, fetchUserData, loading: userLoading } = useUser();
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    return localStorage.getItem('hasSeenTutorial') === 'true';
  });
  const [loading, setLoading] = useState(false);

  // Verificar si necesita crear héroe o mascota
  React.useEffect(() => {
    if (user && (!user.heroes || user.heroes.length === 0 || 
        !user.pets || user.pets.length === 0)) {
      setShowWelcomeGuide(true);
    }
  }, [user]);

  useEffect(() => {
    // Mostrar tutorial si es la primera vez
    if (user && !hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [user, hasSeenTutorial]);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setHasSeenTutorial(true);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
    setHasSeenTutorial(true);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError('');
      const response = await apiLogin(username, password);
      login(response.token, response.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      setLoading(true);
      setError('');
      const response = await register(username, email, password);
      login(response.token, response.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const alimentar = async () => {
    if (!user?.pets?.length) return;
    try {
      await alimentarMascota(user.pets[0]._id, token);
      fetchUserData();
    } catch (err) {
      console.error('Error alimentando mascota:', err);
    }
  };

  const dormir = async () => {
    if (!user?.pets?.length) return;
    try {
      // Implementar función de dormir
      console.log('Mascota durmiendo...');
    } catch (err) {
      console.error('Error durmiendo mascota:', err);
    }
  };

  const limpiar = async () => {
    if (!user?.pets?.length) return;
    try {
      // Implementar función de limpiar
      console.log('Limpiando mascota...');
    } catch (err) {
      console.error('Error limpiando mascota:', err);
    }
  };

  const jugar = async () => {
    if (!user?.pets?.length) return;
    try {
      // Implementar función de jugar
      console.log('Jugando con mascota...');
    } catch (err) {
      console.error('Error jugando con mascota:', err);
    }
  };

  // Componente de login/registro estilo Pou
  const LoginRegister = () => (
    <div className="login-container">
      <div className="login-card">
        <h1>Mascota Hero</h1>
        <form className="login-form" onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const username = formData.get('username');
          const email = formData.get('email');
          const password = formData.get('password');
          
          if (isLogin) {
            handleLogin(username, password);
          } else {
            handleRegister(username, email, password);
          }
        }}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              required
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="loading"></span> : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>
        
        <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
        
        {error && <div className="message error">{error}</div>}
        {/* {success && <div className="message success">{success}</div>} */}
      </div>
    </div>
  );

  // Componente principal con interfaz estilo Pou
  const MainInterface = () => (
    <div className="App">
      {showTutorial && (
        <Tutorial
          isVisible={showTutorial}
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}
      
      {/* Audio Manager */}
      <AudioManager />

      {/* Barra superior estilo Pou */}
      <div className="top-bar">
        <div className="coins-display">
          <div className="coin-icon">💰</div>
          <span>{coins}</span>
        </div>
        
        <div className="action-icons">
          <div className="action-icon yellow">🍗</div>
          <div className="action-icon green">+</div>
          <div className="action-icon black">👁️</div>
          <div className="action-icon black">⚡</div>
          <div className="action-icon white">2</div>
        </div>
      </div>

      {/* Barra de navegación estilo Pou */}
      <div className="nav-bar">
        <div className="nav-icon">📷</div>
        <div className="nav-icon">◀</div>
        <div className="nav-title">Mascota Hero</div>
        <div className="nav-icon">▶</div>
        <div className="nav-icon">❓</div>
      </div>

      {/* Navegación principal */}
      <Navbar onLogout={handleLogout} />

      {/* Contenido principal */}
      <div className="main-container">
        <Routes>
          <Route path="/" element={
            <Home 
              hero={user?.heroes?.[0] || null} 
              mascota={user?.pets?.[0] || null} 
              estado={user?.pets?.[0]?.status || 'normal'}
              alimentar={alimentar}
              limpiar={limpiar}
              jugar={jugar}
              loading={loading}
              animacionStat={false}
              animar={false}
              dormir={dormir}
            />
          } />
          <Route path="/minigames" element={<Minigames />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/events" element={<Events />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/pet-collection" element={<PetCollection />} />
          <Route path="/pet-customization" element={<PetCustomization />} />
          <Route path="/hero-customization" element={<HeroCustomization />} />
          <Route path="/customization" element={<Customization />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/secret-achievements" element={<SecretAchievements />} />
        </Routes>
      </div>

      {/* Barra inferior estilo Pou */}
      <div className="bottom-bar">
        <div className="bottom-item">
          <div className="bottom-icon">🎮</div>
          <div className="bottom-text">Juegos</div>
        </div>
        <div className="bottom-item">
          <div className="bottom-icon">⚽</div>
          <div className="bottom-text">Pelota</div>
        </div>
        <div className="bottom-item">
          <div className="bottom-icon">🏪</div>
          <div className="bottom-text">Tienda</div>
        </div>
      </div>

      {/* Guía de bienvenida */}
      {showWelcomeGuide && (
        <WelcomeGuide 
          onClose={() => setShowWelcomeGuide(false)}
          onComplete={fetchUserData}
        />
      )}

      {/* Efectos de partículas */}
      <ParticleEffect />
    </div>
  );

  return (
    <Router>
      {!token ? <LoginRegister /> : userLoading ? <div className="loading-container">Cargando...</div> : <MainInterface />}
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
