import React from 'react';
import './Home.css';

function Toast({ message, color = '#e74c3c', onClose }) {
  if (!message) return null;
  return (
    <div style={{ position: 'fixed', top: 24, right: 24, background: color, color: '#fff', padding: '16px 32px', borderRadius: 12, fontWeight: 'bold', zIndex: 9999, boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }} onClick={onClose}>
      {message}
    </div>
  );
}

export default function Home({ hero, mascota, estado, alimentar, limpiar, jugar, loading, animacionStat, animar, dormir }) {
  // Determinar imagen dinámica según estado
  let mascotaImg = '/assets/dog_normal.png';
  if (mascota) {
    if (mascota.status === 'dead' || mascota.health === 0) {
      mascotaImg = mascota.type === 'Gato' ? '/assets/cat_dead.png' : '/assets/dog_dead.png';
    } else if ((mascota.happiness ?? 100) > 80 && (mascota.health ?? 100) > 80) {
      mascotaImg = mascota.type === 'Gato' ? '/assets/cat_happy.png' : '/assets/dog_happy.png';
    } else {
      mascotaImg = mascota.type === 'Gato' ? '/assets/cat_normal.png' : '/assets/dog_normal.png';
    }
  }

  // Notificaciones visuales
  const [toast, setToast] = React.useState('');
  React.useEffect(() => {
    if (!mascota) return;
    if (mascota.status === 'dead' || mascota.health === 0) {
      setToast('¡Tu mascota ha muerto!');
    } else if ((mascota.health ?? 100) < 30) {
      setToast('¡Tu mascota está muy enferma!');
    } else if ((mascota.happiness ?? 100) < 30) {
      setToast('¡Tu mascota está triste!');
    } else if ((mascota.energy ?? 50) < 30) {
      setToast('¡Tu mascota está cansada!');
    } else if (mascota.diseases && mascota.diseases.length > 0) {
      setToast(`Enfermedades: ${mascota.diseases.join(', ')}`);
    } else {
      setToast('');
    }
  }, [mascota]);

  // Barras de progreso
  const Barra = ({ label, value, color }) => (
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontWeight: 'bold' }}>{label}: </span>
      <div style={{ background: '#eee', borderRadius: 8, height: 16, width: 120, display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>
        <div style={{ width: `${value}%`, background: color, height: '100%', borderRadius: 8, transition: 'width 0.3s' }} />
      </div>
      <span style={{ marginLeft: 8 }}>{value}</span>
    </div>
  );

  // Imagen y color del héroe
  const heroImg = hero?.avatar || '/assets/hero.png';
  const heroColor = hero?.color || '#3498db';

  // Determinar clase de animación para la mascota
  let mascotaAnimClass = '';
  if (mascota) {
    if (mascota.status === 'dead' || mascota.health === 0) mascotaAnimClass = 'mascota-muerta';
    else if ((mascota.happiness ?? 100) > 80 && (mascota.health ?? 100) > 80) mascotaAnimClass = 'mascota-feliz';
    else if ((mascota.happiness ?? 100) < 30) mascotaAnimClass = 'mascota-triste';
    else if ((mascota.health ?? 100) < 30 || (mascota.diseases && mascota.diseases.length > 0)) mascotaAnimClass = 'mascota-enferma';
  }
  // Determinar clase de animación para el héroe (ejemplo: feliz si mascota está feliz)
  let heroAnimClass = '';
  if (mascota && hero) {
    if (mascota.status === 'dead' || mascota.health === 0) heroAnimClass = 'hero-triste';
    else if ((mascota.happiness ?? 100) > 80 && (mascota.health ?? 100) > 80) heroAnimClass = 'hero-feliz';
    else if ((mascota.happiness ?? 100) < 30) heroAnimClass = 'hero-triste';
    else if ((mascota.health ?? 100) < 30 || (mascota.diseases && mascota.diseases.length > 0)) heroAnimClass = 'hero-enfermo';
  }

  return (
    <div className="home-container">
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="home-header">
        <h1>¡Bienvenido a Mascota Hero!</h1>
        <p>Cuida, juega y personaliza a tu mascota y héroe virtual.</p>
      </div>
      <div className="home-main" style={{ display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'flex-start' }}>
        <div className="home-card mascota-card">
          <h2>Mascota</h2>
          {mascota ? (
            <>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={mascotaImg}
                  alt="Mascota"
                  className={`mascota-img ${animar ? 'mascota-anim' : ''} ${mascotaAnimClass}`}
                />
                {/* Accesorio visual: sombrero */}
                {mascota && mascota.accessories && mascota.accessories.includes('sombrero') && (
                  <img src="/assets/sombrero.png" alt="Sombrero" style={{ position: 'absolute', top: 0, left: 20, width: 60, pointerEvents: 'none' }} />
                )}
              </div>
              {/* Alertas de estado de la mascota */}
              {mascota && mascota.status === 'dead' && (
                <div style={{ color: 'red', fontWeight: 'bold', margin: '8px 0' }}>¡Tu mascota ha muerto!</div>
              )}
              {mascota && mascota.health < 30 && mascota.status !== 'dead' && (
                <div style={{ color: 'orange', fontWeight: 'bold', margin: '8px 0' }}>¡Tu mascota está enferma!</div>
              )}
              {mascota && mascota.happiness < 30 && (
                <div style={{ color: 'blue', fontWeight: 'bold', margin: '8px 0' }}>¡Tu mascota está triste!</div>
              )}
              <div className="mascota-stats">
                <Barra label="Salud" value={mascota.health ?? 100} color="#e74c3c" />
                <Barra label="Felicidad" value={mascota.happiness ?? 100} color="#f1c40f" />
                <Barra label="Energía" value={mascota.energy ?? 50} color="#3498db" />
                <div><span role="img" aria-label="Estado">🦴</span> Estado: {estado}</div>
              </div>
              <div className="mascota-actions">
                <button onClick={alimentar} disabled={loading} className="btn-main">🍖 Alimentar</button>
                <button onClick={limpiar} disabled={loading} className="btn-main">🧼 Limpiar</button>
                <button onClick={jugar} disabled={loading} className="btn-main">🎲 Jugar</button>
                <button onClick={dormir} disabled={loading} className="btn-main">🛌 Dormir</button>
              </div>
            </>
          ) : (
            <div className="mascota-empty">No tienes mascota registrada.</div>
          )}
        </div>
        <div className="home-card hero-card" style={{ background: heroColor, color: '#fff', minWidth: 220, alignSelf: 'center' }}>
          <h2>Héroe</h2>
          {hero ? (
            <>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={heroImg} alt="Héroe" className={`hero-img ${heroAnimClass}`} style={{ borderRadius: '50%', background: '#fff', width: 90, height: 90, objectFit: 'cover', marginBottom: 8 }} />
                {/* Accesorio visual: sombrero */}
                {hero && hero.accessories && hero.accessories.includes('sombrero') && (
                  <img src="/assets/sombrero.png" alt="Sombrero" style={{ position: 'absolute', top: 0, left: 15, width: 50, pointerEvents: 'none' }} />
                )}
              </div>
              <div className="hero-stats">
                <div><span role="img" aria-label="Nombre">🦸‍♂️</span> {hero.name}</div>
                <div><span role="img" aria-label="Nivel">⭐</span> Nivel: {hero.level || 1}</div>
                <div><span role="img" aria-label="Equipo">👥</span> Equipo: {hero.team || 'Independiente'}</div>
              </div>
              <button className="btn-main">Personalizar héroe</button>
            </>
          ) : (
            <div className="hero-empty">No tienes héroe creado.</div>
          )}
        </div>
      </div>
    </div>
  );
} 