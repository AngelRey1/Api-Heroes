import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import CreationModal from './CreationModal';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleCharactersClick = () => {
    navigate('/customization');
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="nav-brand">
          <span className="brand-icon">🐾</span>
          <span className="brand-text">Mascotas Virtuales</span>
        </div>
      </div>

      <div className="nav-items">
        <NavLink to="/" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Inicio</span>
        </NavLink>
        <NavLink to="/minigames" className="nav-item">
          <span className="nav-icon">🎮</span>
          <span className="nav-label">Juegos</span>
        </NavLink>
        <NavLink to="/customization" className="nav-item">
          <span className="nav-icon">🎨</span>
          <span className="nav-label">Personalizar</span>
        </NavLink>
      </div>

      <div className="nav-right">
        <button className="nav-btn characters-btn" onClick={handleCharactersClick}>
          <span className="btn-icon">👥</span>
          <span className="btn-label">Mis Personajes</span>
        </button>
        <button className="nav-btn logout-btn" onClick={handleLogout}>
          <span className="btn-icon">🚪</span>
          <span className="btn-label">Salir</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 