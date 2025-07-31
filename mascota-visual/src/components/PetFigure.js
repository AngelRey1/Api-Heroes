import React from 'react';
import './PetFigure.css';

const PetFigure = ({ 
  color = '#3498db', 
  type = 'dog', 
  accessories = [], 
  size = 200,
  animated = false,
  mood = 'happy'
}) => {
  const getPetDetails = (type) => {
    const pets = {
      // Perros
      dog: { 
        body: 'canine', 
        ears: 'pointed', 
        tail: 'curved',
        features: { nose: 'round', eyes: 'friendly', snout: 'medium' }
      },
      golden_retriever: { 
        body: 'canine', 
        ears: 'floppy', 
        tail: 'feathered',
        features: { nose: 'round', eyes: 'friendly', snout: 'medium' }
      },
      husky: { 
        body: 'canine', 
        ears: 'pointed', 
        tail: 'bushy',
        features: { nose: 'pointed', eyes: 'blue', snout: 'long' }
      },
      bulldog: { 
        body: 'stout', 
        ears: 'small', 
        tail: 'short',
        features: { nose: 'flat', eyes: 'sad', snout: 'short' }
      },
      poodle: { 
        body: 'elegant', 
        ears: 'floppy', 
        tail: 'curly',
        features: { nose: 'round', eyes: 'bright', snout: 'medium' }
      },
      
      // Gatos
      cat: { 
        body: 'feline', 
        ears: 'triangular', 
        tail: 'straight',
        features: { nose: 'small', eyes: 'slanted', snout: 'small' }
      },
      persian: { 
        body: 'feline', 
        ears: 'small', 
        tail: 'fluffy',
        features: { nose: 'flat', eyes: 'round', snout: 'short' }
      },
      siamese: { 
        body: 'feline', 
        ears: 'large', 
        tail: 'thin',
        features: { nose: 'pointed', eyes: 'blue', snout: 'long' }
      },
      maine_coon: { 
        body: 'large_feline', 
        ears: 'tufted', 
        tail: 'bushy',
        features: { nose: 'medium', eyes: 'golden', snout: 'medium' }
      },
      
      // Roedores
      rabbit: { 
        body: 'rodent', 
        ears: 'long', 
        tail: 'pom',
        features: { nose: 'tiny', eyes: 'round', snout: 'small' }
      },
      hamster: { 
        body: 'chubby', 
        ears: 'small', 
        tail: 'short',
        features: { nose: 'button', eyes: 'beady', snout: 'tiny' }
      },
      guinea_pig: { 
        body: 'chubby', 
        ears: 'round', 
        tail: 'none',
        features: { nose: 'button', eyes: 'round', snout: 'small' }
      },
      
      // Aves
      bird: { 
        body: 'avian', 
        ears: 'none', 
        tail: 'feathers',
        features: { nose: 'beak', eyes: 'bright', snout: 'beak' }
      },
      parrot: { 
        body: 'avian', 
        ears: 'none', 
        tail: 'long_feathers',
        features: { nose: 'beak', eyes: 'bright', snout: 'beak' }
      },
      owl: { 
        body: 'avian', 
        ears: 'tufts', 
        tail: 'short_feathers',
        features: { nose: 'beak', eyes: 'large', snout: 'beak' }
      },
      
      // Exóticos
      ferret: { 
        body: 'slim', 
        ears: 'small', 
        tail: 'long',
        features: { nose: 'pointed', eyes: 'bright', snout: 'long' }
      },
      hedgehog: { 
        body: 'spiky', 
        ears: 'small', 
        tail: 'short',
        features: { nose: 'pointed', eyes: 'small', snout: 'pointed' }
      },
      chinchilla: { 
        body: 'fluffy', 
        ears: 'large', 
        tail: 'bushy',
        features: { nose: 'small', eyes: 'round', snout: 'small' }
      },
      
      // Reptiles
      turtle: { 
        body: 'shell', 
        ears: 'none', 
        tail: 'short',
        features: { nose: 'small', eyes: 'round', snout: 'small' }
      },
      lizard: { 
        body: 'scaly', 
        ears: 'none', 
        tail: 'long',
        features: { nose: 'small', eyes: 'slit', snout: 'pointed' }
      }
    };
    return pets[type] || pets.dog;
  };

  const details = getPetDetails(type);
  const moodColors = {
    happy: '#f1c40f',
    sad: '#3498db',
    angry: '#e74c3c',
    excited: '#e67e22',
    sleepy: '#9b59b6'
  };

  return (
    <div className={`pet-container ${animated ? 'animated' : ''}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        className="pet-figure"
      >
        {/* Fondo con gradiente */}
        <defs>
          <linearGradient id="petBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.05)', stopOpacity: 1}} />
          </linearGradient>
          <filter id="petGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Fondo */}
        <circle cx="100" cy="100" r="95" fill="url(#petBgGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
        
        {/* Sombra */}
        <ellipse cx="100" cy="170" rx="25" ry="6" fill="rgba(0,0,0,0.2)" className="shadow"/>
        
        {/* Cuerpo principal con gradiente */}
        <ellipse cx="100" cy="120" rx="30" ry="25" fill={color} className="body-part"/>
        <ellipse cx="100" cy="120" rx="25" ry="20" fill={`${color}80`} className="body-highlight"/>
        
        {/* Cabeza con mejor forma */}
        <circle cx="100" cy="80" r="25" fill={color} className="body-part head"/>
        <circle cx="100" cy="78" r="20" fill={`${color}80`} className="head-highlight"/>
        
        {/* Orejas según tipo */}
        {details.ears === 'pointed' && (
          <>
            <path d="M 85 60 L 80 40 L 90 55 Z" fill={color} className="ear"/>
            <path d="M 115 60 L 120 40 L 110 55 Z" fill={color} className="ear"/>
          </>
        )}
        {details.ears === 'floppy' && (
          <>
            <ellipse cx="85" cy="55" rx="6" ry="12" fill={color} className="ear"/>
            <ellipse cx="115" cy="55" rx="6" ry="12" fill={color} className="ear"/>
          </>
        )}
        {details.ears === 'triangular' && (
          <>
            <path d="M 85 60 L 82 45 L 88 55 Z" fill={color} className="ear"/>
            <path d="M 115 60 L 118 45 L 112 55 Z" fill={color} className="ear"/>
          </>
        )}
        {details.ears === 'large' && (
          <>
            <ellipse cx="85" cy="50" rx="8" ry="15" fill={color} className="ear"/>
            <ellipse cx="115" cy="50" rx="8" ry="15" fill={color} className="ear"/>
          </>
        )}
        {details.ears === 'small' && (
          <>
            <circle cx="85" cy="55" r="4" fill={color} className="ear"/>
            <circle cx="115" cy="55" r="4" fill={color} className="ear"/>
          </>
        )}
        {details.ears === 'tufted' && (
          <>
            <ellipse cx="85" cy="50" rx="6" ry="12" fill={color} className="ear"/>
            <ellipse cx="115" cy="50" rx="6" ry="12" fill={color} className="ear"/>
            <circle cx="85" cy="45" r="2" fill="#f39c12" className="ear-tuft"/>
            <circle cx="115" cy="45" r="2" fill="#f39c12" className="ear-tuft"/>
          </>
        )}
        {details.ears === 'tufts' && (
          <>
            <ellipse cx="85" cy="45" rx="3" ry="8" fill="#f39c12" className="ear-tuft"/>
            <ellipse cx="115" cy="45" rx="3" ry="8" fill="#f39c12" className="ear-tuft"/>
          </>
        )}
        {details.ears === 'round' && (
          <>
            <circle cx="85" cy="55" r="5" fill={color} className="ear"/>
            <circle cx="115" cy="55" r="5" fill={color} className="ear"/>
          </>
        )}
        
        {/* Patas con mejor anatomía */}
        <ellipse cx="85" cy="150" rx="6" ry="15" fill={color} className="leg"/>
        <ellipse cx="115" cy="150" rx="6" ry="15" fill={color} className="leg"/>
        
        {/* Patas traseras */}
        <ellipse cx="90" cy="155" rx="5" ry="12" fill={`${color}80`} className="leg-back"/>
        <ellipse cx="110" cy="155" rx="5" ry="12" fill={`${color}80`} className="leg-back"/>
        
        {/* Cola según tipo */}
        {details.tail === 'curved' && (
          <path d="M 130 110 Q 150 100 145 120 Q 140 130 130 125" fill={color} className="tail"/>
        )}
        {details.tail === 'feathered' && (
          <path d="M 130 110 Q 150 100 145 120 Q 140 130 130 125" fill={color} className="tail"/>
        )}
        {details.tail === 'straight' && (
          <path d="M 130 110 L 150 105 L 145 115 Z" fill={color} className="tail"/>
        )}
        {details.tail === 'pom' && (
          <circle cx="135" cy="115" r="8" fill={color} className="tail"/>
        )}
        {details.tail === 'short' && (
          <ellipse cx="130" cy="115" rx="4" ry="8" fill={color} className="tail"/>
        )}
        {details.tail === 'feathers' && (
          <path d="M 130 110 L 150 100 L 145 120 L 140 110 Z" fill={color} className="tail"/>
        )}
        {details.tail === 'bushy' && (
          <ellipse cx="135" cy="115" rx="10" ry="15" fill={color} className="tail"/>
        )}
        {details.tail === 'curly' && (
          <path d="M 130 110 Q 140 105 135 120 Q 130 115 125 120" fill={color} className="tail"/>
        )}
        {details.tail === 'long' && (
          <path d="M 130 110 L 160 105 L 155 115 L 130 115 Z" fill={color} className="tail"/>
        )}
        {details.tail === 'thin' && (
          <path d="M 130 110 L 145 108 L 143 112 Z" fill={color} className="tail"/>
        )}
        {details.tail === 'none' && null}
        {details.tail === 'short_feathers' && (
          <path d="M 130 110 L 140 108 L 138 112 Z" fill={color} className="tail"/>
        )}
        {details.tail === 'long_feathers' && (
          <path d="M 130 110 L 160 100 L 158 120 L 130 115 Z" fill={color} className="tail"/>
        )}
        
        {/* Ojos según tipo */}
        {details.features.eyes === 'friendly' && (
          <>
            <circle cx="92" cy="75" r="3" fill="#2c3e50" className="eye"/>
            <circle cx="108" cy="75" r="3" fill="#2c3e50" className="eye"/>
            <circle cx="92" cy="74" r="1" fill="white" className="eye-highlight"/>
            <circle cx="108" cy="74" r="1" fill="white" className="eye-highlight"/>
          </>
        )}
        {details.features.eyes === 'slanted' && (
          <>
            <ellipse cx="92" cy="75" rx="3" ry="2" fill="#2c3e50" className="eye"/>
            <ellipse cx="108" cy="75" rx="3" ry="2" fill="#2c3e50" className="eye"/>
          </>
        )}
        {details.features.eyes === 'round' && (
          <>
            <circle cx="92" cy="75" r="4" fill="#2c3e50" className="eye"/>
            <circle cx="108" cy="75" r="4" fill="#2c3e50" className="eye"/>
          </>
        )}
        {details.features.eyes === 'beady' && (
          <>
            <circle cx="92" cy="75" r="2" fill="#2c3e50" className="eye"/>
            <circle cx="108" cy="75" r="2" fill="#2c3e50" className="eye"/>
          </>
        )}
        {details.features.eyes === 'bright' && (
          <>
            <circle cx="92" cy="75" r="3" fill="#f39c12" className="eye"/>
            <circle cx="108" cy="75" r="3" fill="#f39c12" className="eye"/>
          </>
        )}
        {details.features.eyes === 'blue' && (
          <>
            <circle cx="92" cy="75" r="3" fill="#3498db" className="eye"/>
            <circle cx="108" cy="75" r="3" fill="#3498db" className="eye"/>
          </>
        )}
        {details.features.eyes === 'sad' && (
          <>
            <ellipse cx="92" cy="76" rx="3" ry="1" fill="#2c3e50" className="eye"/>
            <ellipse cx="108" cy="76" rx="3" ry="1" fill="#2c3e50" className="eye"/>
          </>
        )}
        {details.features.eyes === 'golden' && (
          <>
            <circle cx="92" cy="75" r="3" fill="#f39c12" className="eye"/>
            <circle cx="108" cy="75" r="3" fill="#f39c12" className="eye"/>
          </>
        )}
        {details.features.eyes === 'large' && (
          <>
            <circle cx="92" cy="75" r="5" fill="#2c3e50" className="eye"/>
            <circle cx="108" cy="75" r="5" fill="#2c3e50" className="eye"/>
          </>
        )}
        {details.features.eyes === 'small' && (
          <>
            <circle cx="92" cy="75" r="1.5" fill="#2c3e50" className="eye"/>
            <circle cx="108" cy="75" r="1.5" fill="#2c3e50" className="eye"/>
          </>
        )}
        {details.features.eyes === 'slit' && (
          <>
            <ellipse cx="92" cy="75" rx="2" ry="0.5" fill="#2c3e50" className="eye"/>
            <ellipse cx="108" cy="75" rx="2" ry="0.5" fill="#2c3e50" className="eye"/>
          </>
        )}
        
        {/* Nariz/Bico según tipo */}
        {details.features.nose === 'round' && (
          <circle cx="100" cy="85" r="3" fill="#2c3e50" className="nose"/>
        )}
        {details.features.nose === 'small' && (
          <ellipse cx="100" cy="85" rx="2" ry="1" fill="#2c3e50" className="nose"/>
        )}
        {details.features.nose === 'tiny' && (
          <circle cx="100" cy="85" r="1" fill="#2c3e50" className="nose"/>
        )}
        {details.features.nose === 'button' && (
          <circle cx="100" cy="85" r="2" fill="#e74c3c" className="nose"/>
        )}
        {details.features.nose === 'beak' && (
          <path d="M 95 85 L 105 85 L 100 90 Z" fill="#f39c12" className="beak"/>
        )}
        {details.features.nose === 'flat' && (
          <ellipse cx="100" cy="85" rx="3" ry="1" fill="#2c3e50" className="nose"/>
        )}
        {details.features.nose === 'pointed' && (
          <path d="M 98 85 L 102 85 L 100 88 Z" fill="#2c3e50" className="nose"/>
        )}
        {details.features.nose === 'medium' && (
          <ellipse cx="100" cy="85" rx="2.5" ry="1.5" fill="#2c3e50" className="nose"/>
        )}
        
        {/* Boca según estado de ánimo */}
        {mood === 'happy' && (
          <path d="M 95 90 Q 100 95 105 90" fill="none" stroke="#2c3e50" strokeWidth="2" className="mouth"/>
        )}
        {mood === 'sad' && (
          <path d="M 95 95 Q 100 90 105 95" fill="none" stroke="#2c3e50" strokeWidth="2" className="mouth"/>
        )}
        {mood === 'angry' && (
          <path d="M 95 90 L 105 90" fill="none" stroke="#e74c3c" strokeWidth="2" className="mouth"/>
        )}
        {mood === 'excited' && (
          <path d="M 95 90 Q 100 98 105 90" fill="none" stroke="#e67e22" strokeWidth="2" className="mouth"/>
        )}
        {mood === 'sleepy' && (
          <path d="M 95 90 L 105 90" fill="none" stroke="#9b59b6" strokeWidth="1" className="mouth"/>
        )}
        
        {/* Accesorios */}
        {accessories.includes('collar') && (
          <ellipse cx="100" cy="105" rx="20" ry="5" fill="#f39c12" className="accessory"/>
        )}
        {accessories.includes('sombrero') && (
          <ellipse cx="100" cy="55" rx="15" ry="8" fill="#8e44ad" className="accessory"/>
        )}
        {accessories.includes('gafas') && (
          <g className="accessory">
            <circle cx="92" cy="75" r="6" fill="none" stroke="#2c3e50" strokeWidth="2"/>
            <circle cx="108" cy="75" r="6" fill="none" stroke="#2c3e50" strokeWidth="2"/>
            <line x1="98" y1="75" x2="102" y2="75" stroke="#2c3e50" strokeWidth="2"/>
          </g>
        )}
        
        {/* Efectos de estado de ánimo */}
        {mood === 'happy' && (
          <g className="mood-effects">
            <circle cx="85" cy="60" r="2" fill={moodColors.happy} className="sparkle">
              <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="115" cy="60" r="2" fill={moodColors.happy} className="sparkle">
              <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}
        {mood === 'excited' && (
          <g className="mood-effects">
            <circle cx="100" cy="40" r="3" fill={moodColors.excited} className="sparkle">
              <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}
        
        {/* Efectos de animación general */}
        {animated && (
          <g className="animation-effects">
            <circle cx="100" cy="50" r="2" fill="#f1c40f" className="sparkle">
              <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
};

export default PetFigure; 