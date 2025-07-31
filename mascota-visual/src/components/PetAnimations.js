import React, { useState, useEffect } from 'react';
import './PetAnimations.css';

const PetAnimations = ({ pet, onAnimationComplete }) => {
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [animationElements, setAnimationElements] = useState([]);

  // Determinar el estado de ánimo de la mascota
  const getPetMood = () => {
    if (!pet) return 'normal';
    
    if (pet.status === 'dead' || pet.health === 0) return 'dead';
    if (pet.happiness > 80 && pet.health > 80) return 'happy';
    if (pet.happiness < 30) return 'sad';
    if (pet.health < 30) return 'sick';
    if (pet.energy < 30) return 'sleepy';
    if (pet.diseases && pet.diseases.length > 0) return 'sick';
    
    return 'normal';
  };

  // Generar elementos de animación según el estado
  const generateAnimationElements = (mood) => {
    const elements = [];
    
    switch (mood) {
      case 'happy':
        // Corazones flotantes
        for (let i = 0; i < 5; i++) {
          elements.push({
            id: `heart-${i}`,
            type: 'heart',
            emoji: '❤️',
            style: {
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }
          });
        }
        // Estrellas brillantes
        for (let i = 0; i < 3; i++) {
          elements.push({
            id: `star-${i}`,
            type: 'star',
            emoji: '⭐',
            style: {
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`
            }
          });
        }
        break;
        
      case 'sad':
        // Lágrimas
        for (let i = 0; i < 3; i++) {
          elements.push({
            id: `tear-${i}`,
            type: 'tear',
            emoji: '💧',
            style: {
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }
          });
        }
        // Nubes grises
        elements.push({
          id: 'cloud-1',
          type: 'cloud',
          emoji: '☁️',
          style: {
            left: '20%',
            animationDelay: '0s',
            animationDuration: '4s'
          }
        });
        break;
        
      case 'sick':
        // Moscas (cuando está muerto o muy enfermo)
        if (mood === 'dead' || pet.health < 20) {
          for (let i = 0; i < 4; i++) {
            elements.push({
              id: `fly-${i}`,
              type: 'fly',
              emoji: '🪰',
              style: {
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }
            });
          }
        }
        // Gotas de medicina
        for (let i = 0; i < 2; i++) {
          elements.push({
            id: `medicine-${i}`,
            type: 'medicine',
            emoji: '💊',
            style: {
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${2 + Math.random() * 1}s`
            }
          });
        }
        break;
        
      case 'sleepy':
        // Z's de sueño
        for (let i = 0; i < 3; i++) {
          elements.push({
            id: `sleep-${i}`,
            type: 'sleep',
            emoji: '💤',
            style: {
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + Math.random() * 1}s`
            }
          });
        }
        break;
        
      case 'dead':
        // Moscas
        for (let i = 0; i < 6; i++) {
          elements.push({
            id: `fly-${i}`,
            type: 'fly',
            emoji: '🪰',
            style: {
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }
          });
        }
        // Calavera
        elements.push({
          id: 'skull',
          type: 'skull',
          emoji: '💀',
          style: {
            left: '50%',
            animationDelay: '0s',
            animationDuration: '3s'
          }
        });
        break;
        
      default:
        // Estado normal - burbujas ocasionales
        if (Math.random() > 0.7) {
          elements.push({
            id: 'bubble-1',
            type: 'bubble',
            emoji: '💭',
            style: {
              left: `${Math.random() * 100}%`,
              animationDelay: '0s',
              animationDuration: '2s'
            }
          });
        }
        break;
    }
    
    return elements;
  };

  // Efecto para actualizar animaciones cuando cambia el estado
  useEffect(() => {
    const mood = getPetMood();
    const newElements = generateAnimationElements(mood);
    setAnimationElements(newElements);
    
    // Limpiar animaciones anteriores después de un tiempo
    if (newElements.length > 0) {
      const timer = setTimeout(() => {
        setAnimationElements([]);
        if (onAnimationComplete) {
          onAnimationComplete(mood);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [pet]);

  // Efecto para animaciones periódicas
  useEffect(() => {
    const interval = setInterval(() => {
      const mood = getPetMood();
      if (mood === 'normal' && Math.random() > 0.8) {
        const newElements = generateAnimationElements(mood);
        setAnimationElements(newElements);
      }
    }, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, [pet]);

  if (!pet) return null;

  return (
    <div className="pet-animations-container">
      {animationElements.map(element => (
        <div
          key={element.id}
          className={`animation-element ${element.type}`}
          style={element.style}
        >
          {element.emoji}
        </div>
      ))}
    </div>
  );
};

export default PetAnimations; 