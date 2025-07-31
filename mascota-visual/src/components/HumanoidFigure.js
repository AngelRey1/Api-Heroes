import React from 'react';
import './HumanoidFigure.css';

const HumanoidFigure = ({ 
  color = '#3498db', 
  accessories = [], 
  size = 200,
  animated = false 
}) => {
  return (
    <div className={`humanoid-container ${animated ? 'animated' : ''}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        className="humanoid-figure"
      >
        {/* Fondo con gradiente */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.05)', stopOpacity: 1}} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Fondo */}
        <circle cx="100" cy="100" r="95" fill="url(#bgGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
        
        {/* Sombra del cuerpo */}
        <ellipse cx="100" cy="170" rx="30" ry="8" fill="rgba(0,0,0,0.2)" className="shadow"/>
        
        {/* Cuerpo principal con gradiente */}
        <ellipse cx="100" cy="120" rx="25" ry="35" fill={color} className="body-part"/>
        <ellipse cx="100" cy="120" rx="20" ry="30" fill={`${color}80`} className="body-highlight"/>
        
        {/* Cabeza con mejor forma */}
        <circle cx="100" cy="60" r="22" fill={color} className="body-part head"/>
        <circle cx="100" cy="58" r="18" fill={`${color}80`} className="head-highlight"/>
        
        {/* Cuello */}
        <rect x="95" y="75" width="10" height="8" fill={color} className="body-part"/>
        
        {/* Brazos con mejor anatomía */}
        <ellipse cx="75" cy="110" rx="10" ry="28" fill={color} className="body-part arm-left"/>
        <ellipse cx="125" cy="110" rx="10" ry="28" fill={color} className="body-part arm-right"/>
        
        {/* Antebrazos */}
        <ellipse cx="75" cy="135" rx="8" ry="20" fill={`${color}80`} className="body-part forearm-left"/>
        <ellipse cx="125" cy="135" rx="8" ry="20" fill={`${color}80`} className="body-part forearm-right"/>
        
        {/* Manos */}
        <circle cx="75" cy="155" r="6" fill={`${color}60`} className="hand-left"/>
        <circle cx="125" cy="155" r="6" fill={`${color}60`} className="hand-right"/>
        
        {/* Piernas con mejor anatomía */}
        <ellipse cx="90" cy="160" rx="10" ry="25" fill={color} className="body-part leg-left"/>
        <ellipse cx="110" cy="160" rx="10" ry="25" fill={color} className="body-part leg-right"/>
        
        {/* Pantorrillas */}
        <ellipse cx="90" cy="180" rx="8" ry="18" fill={`${color}80`} className="body-part calf-left"/>
        <ellipse cx="110" cy="180" rx="8" ry="18" fill={`${color}80`} className="body-part calf-right"/>
        
        {/* Pies */}
        <ellipse cx="90" cy="195" rx="8" ry="4" fill={`${color}60`} className="foot-left"/>
        <ellipse cx="110" cy="195" rx="8" ry="4" fill={`${color}60`} className="foot-right"/>
        
        {/* Ojos más expresivos */}
        <circle cx="92" cy="55" r="3" fill="#2c3e50" className="eye"/>
        <circle cx="108" cy="55" r="3" fill="#2c3e50" className="eye"/>
        <circle cx="92" cy="54" r="1" fill="white" className="eye-highlight"/>
        <circle cx="108" cy="54" r="1" fill="white" className="eye-highlight"/>
        
        {/* Nariz */}
        <ellipse cx="100" cy="62" rx="2" ry="1" fill="#2c3e50" className="nose"/>
        
        {/* Boca más expresiva */}
        <path d="M 95 68 Q 100 72 105 68" fill="none" stroke="#2c3e50" strokeWidth="2" className="mouth"/>
        
        {/* Orejas */}
        <ellipse cx="85" cy="50" rx="4" ry="8" fill={color} className="ear-left"/>
        <ellipse cx="115" cy="50" rx="4" ry="8" fill={color} className="ear-right"/>
        
        {/* Accesorios */}
        {accessories.includes('sombrero') && (
          <g className="accessory hat">
            <ellipse cx="100" cy="35" rx="18" ry="8" fill="#8e44ad"/>
            <rect x="85" y="35" width="30" height="3" fill="#8e44ad"/>
          </g>
        )}
        
        {accessories.includes('gafas') && (
          <g className="accessory glasses">
            <circle cx="92" cy="55" r="6" fill="none" stroke="#2c3e50" strokeWidth="2"/>
            <circle cx="108" cy="55" r="6" fill="none" stroke="#2c3e50" strokeWidth="2"/>
            <line x1="98" y1="55" x2="102" y2="55" stroke="#2c3e50" strokeWidth="2"/>
          </g>
        )}
        
        {accessories.includes('collar') && (
          <ellipse cx="100" cy="85" rx="18" ry="5" fill="#f39c12" className="accessory collar"/>
        )}
        
        {accessories.includes('capa') && (
          <g className="accessory cape">
            <path d="M 70 80 Q 100 60 130 80 L 125 140 Q 100 150 75 140 Z" fill="#9b59b6" opacity="0.8"/>
            <path d="M 75 85 Q 100 70 125 85" fill="none" stroke="#8e44ad" strokeWidth="1"/>
          </g>
        )}
        
        {accessories.includes('espada') && (
          <g className="accessory sword">
            <rect x="130" y="90" width="4" height="45" fill="#95a5a6"/>
            <rect x="125" y="85" width="14" height="4" fill="#95a5a6"/>
            <rect x="125" y="135" width="14" height="4" fill="#95a5a6"/>
            <circle cx="132" cy="88" r="3" fill="#f39c12"/>
          </g>
        )}
        
        {accessories.includes('escudo') && (
          <g className="accessory shield">
            <ellipse cx="135" cy="110" rx="15" ry="25" fill="#e74c3c"/>
            <ellipse cx="135" cy="110" rx="10" ry="18" fill="#c0392b"/>
            <circle cx="135" cy="110" r="8" fill="#f39c12"/>
          </g>
        )}
        
        {/* Efectos de brillo */}
        <circle cx="85" cy="45" r="2" fill="rgba(255,255,255,0.6)" className="shine"/>
        <circle cx="115" cy="45" r="2" fill="rgba(255,255,255,0.6)" className="shine"/>
        
        {/* Efectos de animación */}
        {animated && (
          <g className="animation-effects">
            <circle cx="100" cy="40" r="3" fill="#f1c40f" className="sparkle">
              <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="85" cy="35" r="2" fill="#e74c3c" className="sparkle">
              <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="115" cy="35" r="2" fill="#3498db" className="sparkle">
              <animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
};

export default HumanoidFigure; 