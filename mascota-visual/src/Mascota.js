import React, { useRef, useEffect, useState } from 'react';

function Mascota({ mascota, estado, alimentar, loading, animar, accesorios = [], fondos = [], onUnequip }) {
  const audioRef = useRef(null);
  const mascotaRef = useRef(null);
  const [showBadge, setShowBadge] = useState('');

  useEffect(() => {
    if (animar && mascotaRef.current) {
      mascotaRef.current.classList.add('mascota-animacion-avanzada');
      setTimeout(() => {
        mascotaRef.current && mascotaRef.current.classList.remove('mascota-animacion-avanzada');
      }, 900);
    }
  }, [animar]);

  const handleAlimentar = () => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } catch (e) {
        // Silenciar error de audio no soportado
      }
    }
    alimentar();
  };

  if (!mascota) return (
    <div className="mascota-container">
      <div className="mascota-animada">
        <div className="mascota-placeholder">
          <span role="img" aria-label="Mascota">🐾</span>
        </div>
      </div>
      <p>No se encontró mascota.</p>
    </div>
  );

  // Accesorios y fondo equipados
  const accesoriosEquipados = accesorios.filter(a => (mascota.accessories || []).includes(a._id) && a.type === 'accessory');
  const fondoEquipado = accesorios.find(a => (mascota.accessories || []).includes(a._id) && a.type === 'background');

  // Ajustar la posición de los ojos según el tipo de mascota
  const ojosStyle = mascota.type === 'gato'
    ? { top: 70, left: '50%', width: 70 }
    : { top: 60, left: '50%', width: 80 };

  const handleUnequip = (itemId) => {
    if (onUnequip) onUnequip(itemId);
    setShowBadge(itemId);
    setTimeout(() => setShowBadge(''), 1200);
  };

  return (
    <div className={`mascota-container ${loading ? 'animando' : ''}`} style={fondoEquipado ? { backgroundImage: `url(${fondoEquipado.image})`, backgroundSize: 'cover', transition: 'background-image 0.7s' } : {}}>
      <div className="mascota-animada" style={{ position: 'relative', display: 'inline-block' }} ref={mascotaRef}>
        <img
          src={mascota.imagen}
          alt={estado}
          style={{ width: 200 }}
          className={loading ? 'animar-mascota' : ''}
        />
        {/* Accesorios equipados sobre la mascota */}
        {accesoriosEquipados.map(acc => acc.image && (
          <div key={acc._id} className="mascota-accesorio-wrap">
            <img
              src={acc.image}
              alt={acc.name}
              className="mascota-accesorio accesorio-anim"
              style={{ position: 'absolute', top: 0, left: 0, width: 200, pointerEvents: 'none' }}
              title={acc.name + (acc.description ? ' - ' + acc.description : '')}
            />
            <button className="accesorio-unequip-btn" onClick={() => handleUnequip(acc._id)} title="Quitar accesorio">✖</button>
            {showBadge === acc._id && <span className="accesorio-badge">¡Quitado!</span>}
          </div>
        ))}
        {/* Fondo badge y botón */}
        {fondoEquipado && (
          <div className="mascota-fondo-badge-wrap">
            <button className="accesorio-unequip-btn" onClick={() => handleUnequip(fondoEquipado._id)} title="Quitar fondo">✖</button>
            {showBadge === fondoEquipado._id && <span className="accesorio-badge">¡Quitado!</span>}
          </div>
        )}
        {/* Ojos animados sobre la imagen */}
        <div className="ojos" style={{ ...ojosStyle, position: 'absolute', transform: 'translateX(-50%)' }}>
          <div className="ojo ojo-izq"></div>
          <div className="ojo ojo-der"></div>
        </div>
      </div>
      <audio ref={audioRef} preload="auto">
        <source src="/assets/feed.mp3" type="audio/mpeg" />
        <source src="/assets/feed.ogg" type="audio/ogg" />
        Tu navegador no soporta audio.
      </audio>
      <p>Nombre: <b>{mascota.name}</b></p>
      <p>Tipo: <b>{mascota.type}</b></p>
      <p>Estado actual: <b>{estado}</b></p>
      {mascota.health !== undefined && <p>Salud: <b>{mascota.health}</b></p>}
      {mascota.happiness !== undefined && <p>Felicidad: <b>{mascota.happiness}</b></p>}
      <button onClick={handleAlimentar} disabled={loading}>Alimentar</button>
    </div>
  );
}

export default Mascota; 