import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 Inicio', icon: '🏠' },
    { path: '/minigames', label: '🎮 Juegos', icon: '🎮' },
    { path: '/achievements', label: '🏆 Logros', icon: '🏆' },
    { path: '/shop', label: '🛒 Tienda', icon: '🛒' },
    { path: '/statistics', label: '📊 Estadísticas', icon: '📊' },
    { path: '/missions', label: '📋 Misiones', icon: '📋' },
    { path: '/events', label: '🎉 Eventos', icon: '🎉' },
    { path: '/friends', label: '👥 Amigos', icon: '👥' },
    { path: '/chat', label: '💬 Chat', icon: '💬' },
    { path: '/tournaments', label: '🏆 Torneos', icon: '🏆' },
    { path: '/ranking', label: '🏅 Ranking', icon: '🏅' },
    { path: '/inventory', label: '🎒 Inventario', icon: '🎒' },
    { path: '/pet-collection', label: '🐾 Mascotas', icon: '🐾' },
    { path: '/customization', label: '🎨 Personalizar', icon: '🎨' },
    { path: '/settings', label: '⚙️ Ajustes', icon: '⚙️' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎮 Mascota Hero
        </Link>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label.split(' ')[1]}</span>
            </Link>
          ))}
          
          <button onClick={onLogout} className="nav-link logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 