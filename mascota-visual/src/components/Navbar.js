import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const links = [
  { to: '/home', label: 'Inicio', icon: '🏠' },
  { to: '/shop', label: 'Tienda', icon: '🛒' },
  { to: '/inventory', label: 'Inventario', icon: '🎒' },
  { to: '/profile', label: 'Perfil', icon: '👤' },
  { to: '/minigames', label: 'Minijuegos', icon: '🎮' },
  { to: '/achievements', label: 'Logros', icon: '🏆' },
  { to: '/pets', label: 'Mascotas', icon: '🐾' },
  { to: '/hero-customization', label: 'Héroe', icon: '🦸‍♂️' },
  { to: '/events', label: 'Eventos', icon: '🎉' },
  { to: '/missions', label: 'Misiones', icon: '📋' },
  { to: '/ranking', label: 'Ranking', icon: '🥇' },
  { to: '/secret-achievements', label: 'Secretos', icon: '🔒' },
];

export default function Navbar({ token }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span role="img" aria-label="logo">🐾</span> Mascota Hero
      </div>
      <div className="navbar-links">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}
          >
            <span>{link.icon}</span> {link.label}
          </NavLink>
        ))}
        <Link to="/tournaments" className="nav-link">
          🏆 Torneos
        </Link>
        <Link to="/customization" className="nav-link">
          🎨 Personalización
        </Link>
        <Link to="/statistics" className="nav-link">
          📊 Estadísticas
        </Link>
      </div>
    </nav>
  );
} 