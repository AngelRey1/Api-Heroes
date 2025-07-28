import React from 'react';

function Hero({ hero }) {
  if (!hero) return null;
  return (
    <div className="hero-container-aaa">
      <div className="hero-avatar-bg">
        {hero.avatar ? (
          <img src={hero.avatar} alt="Heroe" className="hero-avatar-img" />
        ) : (
          <div className="hero-avatar-placeholder">🦸‍♂️</div>
        )}
      </div>
      <h2 className="hero-name">{hero.name}</h2>
      <div className="hero-level">Nivel: <b>{hero.level}</b></div>
      {/* Espacio para accesorios, stats, etc. */}
      <div className="hero-stats">
        <span>⚔️ 10</span>
        <span>🛡️ 8</span>
        <span>💨 7</span>
      </div>
    </div>
  );
}

export default Hero; 