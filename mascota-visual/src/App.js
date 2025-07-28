import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { login, getMascotas, alimentarMascota, register, getItems, unequipAccessory, sleepPet as sleepPetApi, bathPet as bathPetApi, playWithPet as playWithPetApi, getUserProfile } from './api';
import WelcomeGuide from './components/WelcomeGuide';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import Minigames from './pages/Minigames';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import Hero from './Hero';
import Mascota from './Mascota';
import PetCollection from './pages/PetCollection';
import HeroCustomization from './pages/HeroCustomization';
import Events from './pages/Events';
import Missions from './pages/Missions';
import Ranking from './pages/Ranking';
import SecretAchievements from './pages/SecretAchievements';
import Tournaments from './pages/Tournaments';
import Customization from './pages/Customization';
import Statistics from './pages/Statistics';

const imagenesMascotas = {
  perro: {
    normal: '/assets/dog_normal.png',
    happy: '/assets/dog_happy.png',
    dead: '/assets/dog_dead.png',
  },
  gato: {
    normal: '/assets/cat_normal.png',
    happy: '/assets/cat_happy.png',
    dead: '/assets/cat_dead.png',
  },
};
const imagenesHeroe = {
  default: '/assets/hero.png',
};

function BarraEstado({ mascota }) {
  if (!mascota) return null;
  return (
    <div className="barra-estado">
      <div className="estado-item"><span className="estado-icono">❤️</span> {mascota.health ?? 100}</div>
      <div className="estado-item"><span className="estado-icono">😊</span> {mascota.happiness ?? 100}</div>
      <div className="estado-item"><span className="estado-icono">⚡</span> {mascota.energy ?? 100}</div>
    </div>
  );
}

function PanelAcciones({ onAlimentar, onLimpiar, onJugar, onDormir }) {
  return (
    <div className="panel-acciones">
      <div className="icono-accion" title="Alimentar" onClick={onAlimentar}>🍖</div>
      <div className="icono-accion" title="Limpiar" onClick={onLimpiar}>🧼</div>
      <div className="icono-accion" title="Jugar" onClick={onJugar}>🎲</div>
      <div className="icono-accion" title="Dormir" onClick={onDormir}>🛌</div>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [mascota, setMascota] = useState(null);
  const [animacionStat, setAnimacionStat] = useState('');
  const [estado, setEstado] = useState('normal');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [hero, setHero] = useState({ name: 'Héroe', level: 1, avatar: imagenesHeroe.default });
  const [coins, setCoins] = useState(0);
  const [inventoryRefresh, setInventoryRefresh] = useState(0);
  const [animarMascota, setAnimarMascota] = useState(false);
  const [monedasAnim, setMonedasAnim] = useState(false);
  const monedasRef = useRef(coins);
  const audioCompraRef = useRef(null);
  const audioUsarRef = useRef(null);
  const [activePetId, setActivePetId] = useState(null);
  const [items, setItems] = useState([]); // Guardar todos los items para visualización
  const [userBackground, setUserBackground] = useState('');
  const [user, setUser] = useState(null);
  const [achievementNotification, setAchievementNotification] = useState(null);
  const [missionNotification, setMissionNotification] = useState(null);
  const [eventNotification, setEventNotification] = useState(null);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);

  // Cargar items al iniciar
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch {}
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (!token) return;
    getUserProfile(token).then(u => {
      setUserBackground(u.background || '');
      setUser(u);
    });
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(username, password);
      setToken(data.token);
      // Obtener héroe real
      const userProfile = await getUserProfile(data.token);
      setUser(userProfile);
      if (userProfile.heroes && userProfile.heroes.length > 0) {
        setHero(userProfile.heroes[0]);
      } else {
        setSuccess('¡Bienvenido! Ve a "Personalización de Héroe" para crear tu primer héroe.');
        setShowWelcomeGuide(true);
      }
      
      // Obtener mascotas del usuario
      const mascotas = await getMascotas(data.token);
      if (mascotas.length > 0) {
        setMascota(mascotas[0]);
        setEstado(mascotas[0].status || 'normal');
      } else {
        // Si no tiene mascotas, mostrar mensaje informativo
        setSuccess(prev => prev ? prev + ' Luego ve a "Mascotas" para adoptar tu primera mascota.' : '¡Bienvenido! Ve a "Mascotas" para adoptar tu primera mascota.');
        setShowWelcomeGuide(true);
      }
      setCoins(data.user?.coins || 0);
    } catch (err) {
      setError('Login fallido o error al obtener mascota.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await register(username, email, password);
      setSuccess('¡Registro exitoso! Iniciando sesión...');
      // Login automático tras registro
      const loginData = await login(username, password);
      setToken(loginData.token);
      // Obtener héroe real
      const userProfile = await getUserProfile(loginData.token);
      setUser(userProfile);
      if (userProfile.heroes && userProfile.heroes.length > 0) {
        setHero(userProfile.heroes[0]);
      } else {
        setSuccess('¡Bienvenido! Ve a "Personalización de Héroe" para crear tu primer héroe.');
        setShowWelcomeGuide(true);
      }
      
      const mascotas = await getMascotas(loginData.token);
      if (mascotas.length > 0) {
        setMascota(mascotas[0]);
        setEstado(mascotas[0].status || 'normal');
      } else {
        // Si no tiene mascotas, mostrar mensaje informativo
        setSuccess(prev => prev ? prev + ' Luego ve a "Mascotas" para adoptar tu primera mascota.' : '¡Bienvenido! Ve a "Mascotas" para adoptar tu primera mascota.');
        setShowWelcomeGuide(true);
      }
    } catch (err) {
      setError('Error al registrar. ¿Usuario o email ya existen?');
    } finally {
      setLoading(false);
    }
  };

  const alimentar = async () => {
    if (!mascota || !mascota._id) {
      setError('No tienes mascotas. Ve a la sección "Mascotas" para adoptar tu primera mascota.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await alimentarMascota(mascota._id, token);
      setMascota({ ...mascota, ...res });
      setEstado('normal');
      setAnimacionStat('health');
      setTimeout(() => setAnimacionStat(''), 800);
      
      // Mostrar notificación de logros si se desbloquearon
      if (res.achievements && res.achievements.unlocked && res.achievements.unlocked.length > 0) {
        const achievement = res.achievements.unlocked[0];
        setAchievementNotification({
          title: `¡Logro Desbloqueado! ${achievement.icon}`,
          message: `${achievement.name} - +${achievement.coinReward} monedas`,
          type: 'achievement'
        });
        setTimeout(() => setAchievementNotification(null), 5000);
      }
      
      // Mostrar notificación de misiones si se completaron
      if (res.missions && res.missions.completed && res.missions.completed.length > 0) {
        const mission = res.missions.completed[0];
        setMissionNotification({
          title: `¡Misión Completada! ${mission.icon}`,
          message: `${mission.title} - +${mission.coinReward} monedas`,
          type: 'mission'
        });
        setTimeout(() => setMissionNotification(null), 5000);
      }
      
      // Mostrar notificación de eventos si se completaron objetivos
      if (res.events && res.events.completed && res.events.completed.length > 0) {
        const eventObjective = res.events.completed[0];
        setEventNotification({
          title: `¡Objetivo de Evento Completado! 🎉`,
          message: `${eventObjective.description} - +${eventObjective.reward} monedas`,
          type: 'event'
        });
        setTimeout(() => setEventNotification(null), 5000);
      }
    } catch (err) {
      setError('Error al alimentar la mascota.');
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar mascota y detectar cambios de stat
  const handlePetUpdate = (nuevaMascota) => {
    if (!mascota) {
      setMascota(nuevaMascota);
      return;
    }
    let changed = '';
    if (nuevaMascota.health !== mascota.health) changed = 'health';
    else if (nuevaMascota.happiness !== mascota.happiness) changed = 'happiness';
    else if (nuevaMascota.energy !== mascota.energy) changed = 'energy';
    setMascota(nuevaMascota);
    setAnimacionStat(changed);
    setTimeout(() => setAnimacionStat(''), 800);
  };

  // Al comprar objeto, actualizar monedas y animar barra
  const handleCompra = (nuevasMonedas) => {
    setCoins(nuevasMonedas);
    setMonedasAnim(true);
    if (audioCompraRef.current) {
      audioCompraRef.current.currentTime = 0;
      audioCompraRef.current.play();
    }
    setTimeout(() => setMonedasAnim(false), 800);
  };
  // Al usar objeto, animar mascota y reproducir sonido
  const handleUsarObjeto = () => {
    setAnimarMascota(true);
    if (audioUsarRef.current) {
      audioUsarRef.current.currentTime = 0;
      audioUsarRef.current.play();
    }
    setTimeout(() => setAnimarMascota(false), 900);
  };

  const handleUnequip = async (itemId) => {
    if (!mascota || !mascota._id) return;
    await unequipAccessory(token, mascota._id, itemId);
    // Refrescar mascota activa
    // (puedes recargar desde la API o actualizar el estado local)
    // Aquí solo simulo refresco local quitando el accesorio
    setMascota({ ...mascota, accessories: (mascota.accessories || []).filter(id => id !== itemId) });
  };

  const dormir = async () => {
    if (!mascota || !mascota._id) {
      setError('No tienes mascotas. Ve a la sección "Mascotas" para adoptar tu primera mascota.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await sleepPetApi(mascota._id, token);
      setMascota({ ...mascota, ...res });
      setEstado('normal');
      setAnimacionStat('energy');
      setTimeout(() => setAnimacionStat(''), 800);
      
      // Mostrar notificación de logros si se desbloquearon
      if (res.achievements && res.achievements.unlocked && res.achievements.unlocked.length > 0) {
        const achievement = res.achievements.unlocked[0];
        setAchievementNotification({
          title: `¡Logro Desbloqueado! ${achievement.icon}`,
          message: `${achievement.name} - +${achievement.coinReward} monedas`,
          type: 'achievement'
        });
        setTimeout(() => setAchievementNotification(null), 5000);
      }
      
      // Mostrar notificación de misiones si se completaron
      if (res.missions && res.missions.completed && res.missions.completed.length > 0) {
        const mission = res.missions.completed[0];
        setMissionNotification({
          title: `¡Misión Completada! ${mission.icon}`,
          message: `${mission.title} - +${mission.coinReward} monedas`,
          type: 'mission'
        });
        setTimeout(() => setMissionNotification(null), 5000);
      }
      
      // Mostrar notificación de eventos si se completaron objetivos
      if (res.events && res.events.completed && res.events.completed.length > 0) {
        const eventObjective = res.events.completed[0];
        setEventNotification({
          title: `¡Objetivo de Evento Completado! 🎉`,
          message: `${eventObjective.description} - +${eventObjective.reward} monedas`,
          type: 'event'
        });
        setTimeout(() => setEventNotification(null), 5000);
      }
    } catch (err) {
      setError('Error al dormir la mascota.');
    } finally {
      setLoading(false);
    }
  };

  const limpiar = async () => {
    if (!mascota || !mascota._id) {
      setError('No tienes mascotas. Ve a la sección "Mascotas" para adoptar tu primera mascota.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await bathPetApi(mascota._id, token);
      setMascota({ ...mascota, ...res });
      setEstado('normal');
      setAnimacionStat('happiness');
      setTimeout(() => setAnimacionStat(''), 800);
      
      // Mostrar notificación de logros si se desbloquearon
      if (res.achievements && res.achievements.unlocked && res.achievements.unlocked.length > 0) {
        const achievement = res.achievements.unlocked[0];
        setAchievementNotification({
          title: `¡Logro Desbloqueado! ${achievement.icon}`,
          message: `${achievement.name} - +${achievement.coinReward} monedas`,
          type: 'achievement'
        });
        setTimeout(() => setAchievementNotification(null), 5000);
      }
      
      // Mostrar notificación de misiones si se completaron
      if (res.missions && res.missions.completed && res.missions.completed.length > 0) {
        const mission = res.missions.completed[0];
        setMissionNotification({
          title: `¡Misión Completada! ${mission.icon}`,
          message: `${mission.title} - +${mission.coinReward} monedas`,
          type: 'mission'
        });
        setTimeout(() => setMissionNotification(null), 5000);
      }
      
      // Mostrar notificación de eventos si se completaron objetivos
      if (res.events && res.events.completed && res.events.completed.length > 0) {
        const eventObjective = res.events.completed[0];
        setEventNotification({
          title: `¡Objetivo de Evento Completado! 🎉`,
          message: `${eventObjective.description} - +${eventObjective.reward} monedas`,
          type: 'event'
        });
        setTimeout(() => setEventNotification(null), 5000);
      }
    } catch (err) {
      setError('Error al limpiar la mascota.');
    } finally {
      setLoading(false);
    }
  };

  const jugar = async () => {
    if (!mascota || !mascota._id) {
      setError('No tienes mascotas. Ve a la sección "Mascotas" para adoptar tu primera mascota.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await playWithPetApi(mascota._id, token);
      setMascota({ ...mascota, ...res });
      setEstado('normal');
      setAnimacionStat('happiness');
      setTimeout(() => setAnimacionStat(''), 800);
      
      // Mostrar notificación de logros si se desbloquearon
      if (res.achievements && res.achievements.unlocked && res.achievements.unlocked.length > 0) {
        const achievement = res.achievements.unlocked[0];
        setAchievementNotification({
          title: `¡Logro Desbloqueado! ${achievement.icon}`,
          message: `${achievement.name} - +${achievement.coinReward} monedas`,
          type: 'achievement'
        });
        setTimeout(() => setAchievementNotification(null), 5000);
      }
      
      // Mostrar notificación de misiones si se completaron
      if (res.missions && res.missions.completed && res.missions.completed.length > 0) {
        const mission = res.missions.completed[0];
        setMissionNotification({
          title: `¡Misión Completada! ${mission.icon}`,
          message: `${mission.title} - +${mission.coinReward} monedas`,
          type: 'mission'
        });
        setTimeout(() => setMissionNotification(null), 5000);
      }
      
      // Mostrar notificación de eventos si se completaron objetivos
      if (res.events && res.events.completed && res.events.completed.length > 0) {
        const eventObjective = res.events.completed[0];
        setEventNotification({
          title: `¡Objetivo de Evento Completado! 🎉`,
          message: `${eventObjective.description} - +${eventObjective.reward} monedas`,
          type: 'event'
        });
        setTimeout(() => setEventNotification(null), 5000);
      }
    } catch (err) {
      setError('Error al jugar con la mascota.');
    } finally {
      setLoading(false);
    }
  };

  // Cuando se selecciona una mascota activa, actualizar el estado global y refrescar la mascota principal
  const handleActivePetChange = (petId) => {
    setActivePetId(petId);
    // Aquí podrías recargar la mascota activa desde la API si lo deseas
    // O actualizar el estado de la mascota principal
  };

  if (!token) {
    return (
      <div className="App">
        <h1>{showRegister ? 'Registro' : 'Login'}</h1>
        <form onSubmit={showRegister ? handleRegister : handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          {showRegister && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {showRegister ? 'Registrarse' : 'Entrar'}
          </button>
        </form>
        <button onClick={() => { setShowRegister(!showRegister); setError(''); setSuccess(''); }}>
          {showRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    );
  }

  if (mascota) {
    mascota.imagen = imagenesMascotas[mascota.type]?.[estado] || imagenesMascotas['perro'][estado];
  }

  return (
    <Router>
      <div className="App" style={userBackground ? { background: `url(${userBackground}) center/cover no-repeat fixed` } : {}}>
        <div className={`monedas-bar${monedasAnim ? ' monedas-bar-anim' : ''}`}>🪙 {coins}</div>
        <audio ref={audioCompraRef} src="/assets/coin.mp3" preload="auto" />
        <audio ref={audioUsarRef} src="/assets/use.mp3" preload="auto" />
        <Navbar token={token} />
        <Routes>
          <Route path="/home" element={<Home hero={hero} mascota={mascota} estado={estado} alimentar={alimentar} limpiar={limpiar} jugar={jugar} loading={loading} animacionStat={animacionStat} animar={animarMascota} dormir={dormir} />} />
          <Route path="/shop" element={<Shop token={token} onPurchase={handleCompra} />} />
          <Route path="/inventory" element={<Inventory token={token} onUse={handleUsarObjeto} mascotas={mascota ? [mascota] : []} onPetUpdate={handlePetUpdate} key={inventoryRefresh} />} />
          <Route path="/profile" element={<Profile token={token} />} />
          <Route path="/minigames" element={<Minigames token={token} />} />
          <Route path="/achievements" element={<Achievements token={token} onClaim={user => setCoins(user.coins)} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pets" element={<PetCollection token={token} activePetId={activePetId} onActiveChange={handleActivePetChange} />} />
          <Route path="/hero-customization" element={<HeroCustomization token={token} hero={hero} />} />
          <Route path="/events" element={<Events token={token} onReward={coins => setCoins(coins)} />} />
          <Route path="/missions" element={<Missions token={token} onClaim={coins => setCoins(coins)} />} />
          <Route path="/ranking" element={<Ranking token={token} />} />
          <Route path="/secret-achievements" element={<SecretAchievements token={token} />} />
          <Route path="/tournaments" element={<Tournaments token={token} />} />
          <Route path="/customization" element={<Customization token={token} user={user} onUpdate={handleUserUpdate} />} />
          <Route path="/statistics" element={<Statistics token={token} />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
        
        {/* Notificación de logros */}
        {achievementNotification && (
          <div 
            style={{
              position: 'fixed',
              top: 80,
              right: 20,
              background: 'linear-gradient(135deg, #2ecc40, #27ae60)',
              color: 'white',
              padding: '15px 20px',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(46, 204, 64, 0.3)',
              zIndex: 1000,
              maxWidth: '300px',
              animation: 'slideInRight 0.5s ease-out'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{achievementNotification.title}</div>
            <div style={{ fontSize: '0.9em' }}>{achievementNotification.message}</div>
          </div>
        )}
        
        {/* Notificación de misiones */}
        {missionNotification && (
          <div 
            style={{
              position: 'fixed',
              top: missionNotification ? 160 : 80,
              right: 20,
              background: 'linear-gradient(135deg, #3498db, #2980b9)',
              color: 'white',
              padding: '15px 20px',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(52, 152, 219, 0.3)',
              zIndex: 1000,
              maxWidth: '300px',
              animation: 'slideInRight 0.5s ease-out'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{missionNotification.title}</div>
            <div style={{ fontSize: '0.9em' }}>{missionNotification.message}</div>
          </div>
        )}
        
        {/* Notificación de eventos */}
        {eventNotification && (
          <div 
            style={{
              position: 'fixed',
              top: eventNotification ? 240 : 160,
              right: 20,
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
              color: 'white',
              padding: '15px 20px',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
              zIndex: 1000,
              maxWidth: '300px',
              animation: 'slideInRight 0.5s ease-out'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{eventNotification.title}</div>
            <div style={{ fontSize: '0.9em' }}>{eventNotification.message}</div>
          </div>
        )}
        
        {/* Guía de bienvenida */}
        {showWelcomeGuide && (
          <WelcomeGuide 
            onClose={() => setShowWelcomeGuide(false)}
            hasHero={hero && hero._id}
            hasPet={mascota && mascota._id}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
