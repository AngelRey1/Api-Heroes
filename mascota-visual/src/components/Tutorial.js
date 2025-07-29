import React, { useState, useEffect } from 'react';
import { useSoundEffects } from './SoundEffects';
import './Tutorial.css';

const Tutorial = ({ isVisible, onComplete, onSkip }) => {
  const { playClick, playCoin } = useSoundEffects();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const tutorialSteps = [
    {
      id: 'welcome',
      title: '¡Bienvenido a Mascota Hero! 🎮',
      content: 'Te guiaremos a través de las funciones principales del juego.',
      icon: '🎮',
      position: 'center'
    },
    {
      id: 'mascota',
      title: '🐾 Tu Mascota',
      content: 'Alimenta, limpia, juega y duerme con tu mascota para mantenerla feliz y saludable.',
      icon: '🐾',
      position: 'character'
    },
    {
      id: 'actions',
      title: '⚡ Acciones',
      content: 'Usa los botones de acción para cuidar a tu mascota. Cada acción te da experiencia y monedas.',
      icon: '⚡',
      position: 'actions'
    },
    {
      id: 'coins',
      title: '💰 Monedas',
      content: 'Gana monedas cuidando a tu mascota y jugando minijuegos. Úsalas en la tienda.',
      icon: '💰',
      position: 'coins'
    },
    {
      id: 'navigation',
      title: '🧭 Navegación',
      content: 'Usa la barra de navegación para acceder a todas las funciones del juego.',
      icon: '🧭',
      position: 'nav'
    },
    {
      id: 'minigames',
      title: '🎮 Minijuegos',
      content: 'Juega minijuegos para ganar monedas y experiencia. ¡Mejora tus puntuaciones!',
      icon: '🎮',
      position: 'minigames'
    },
    {
      id: 'shop',
      title: '🛍️ Tienda',
      content: 'Compra items para personalizar a tu mascota y héroe con las monedas que ganes.',
      icon: '🛍️',
      position: 'shop'
    },
    {
      id: 'missions',
      title: '🎯 Misiones',
      content: 'Completa misiones diarias para ganar recompensas especiales.',
      icon: '🎯',
      position: 'missions'
    },
    {
      id: 'achievements',
      title: '🏆 Logros',
      content: 'Desbloquea logros completando diferentes acciones en el juego.',
      icon: '🏆',
      position: 'achievements'
    },
    {
      id: 'friends',
      title: '👥 Amigos',
      content: 'Agrega amigos, visita sus mascotas y compite en eventos sociales.',
      icon: '👥',
      position: 'friends'
    },
    {
      id: 'chat',
      title: '💬 Chat',
      content: 'Chatea con tus amigos en tiempo real y comparte experiencias.',
      icon: '💬',
      position: 'chat'
    },
    {
      id: 'profile',
      title: '👤 Perfil',
      content: 'Gestiona tu perfil, ve tus estadísticas y configura tu cuenta.',
      icon: '👤',
      position: 'profile'
    },
    {
      id: 'complete',
      title: '🎉 ¡Listo!',
      content: '¡Ya conoces las funciones principales! Explora el juego y diviértete.',
      icon: '🎉',
      position: 'center'
    }
  ];

  useEffect(() => {
    if (isVisible) {
      setIsActive(true);
      setCurrentStep(0);
    }
  }, [isVisible]);

  const handleNext = () => {
    playClick();
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    playClick();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    playCoin();
    setIsActive(false);
    onComplete();
  };

  const handleSkip = () => {
    playClick();
    setIsActive(false);
    onSkip();
  };

  const getStepPosition = (position) => {
    switch (position) {
      case 'center':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'character':
        return { top: '40%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'actions':
        return { bottom: '20%', left: '50%', transform: 'translate(-50%, 0)' };
      case 'coins':
        return { top: '10%', right: '20%' };
      case 'nav':
        return { bottom: '10%', left: '50%', transform: 'translate(-50%, 0)' };
      case 'minigames':
        return { top: '30%', right: '10%' };
      case 'shop':
        return { top: '50%', right: '10%' };
      case 'missions':
        return { top: '70%', right: '10%' };
      case 'achievements':
        return { top: '20%', left: '10%' };
      case 'friends':
        return { top: '40%', left: '10%' };
      case 'chat':
        return { top: '60%', left: '10%' };
      case 'profile':
        return { top: '80%', left: '10%' };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  if (!isActive) return null;

  const currentTutorialStep = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-backdrop"></div>
      
      <div 
        className="tutorial-tooltip"
        style={getStepPosition(currentTutorialStep.position)}
      >
        <div className="tutorial-header">
          <div className="tutorial-icon">{currentTutorialStep.icon}</div>
          <h3 className="tutorial-title">{currentTutorialStep.title}</h3>
        </div>
        
        <div className="tutorial-content">
          <p className="tutorial-text">{currentTutorialStep.content}</p>
        </div>

        <div className="tutorial-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {currentStep + 1} de {tutorialSteps.length}
          </span>
        </div>

        <div className="tutorial-actions">
          <button
            className="tutorial-btn skip-btn"
            onClick={handleSkip}
          >
            ⏭️ Saltar
          </button>
          
          <div className="tutorial-nav">
            <button
              className="tutorial-btn nav-btn"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              ⬅️ Anterior
            </button>
            
            <button
              className="tutorial-btn next-btn"
              onClick={handleNext}
            >
              {currentStep === tutorialSteps.length - 1 ? '🎉 ¡Comenzar!' : 'Siguiente ➡️'}
            </button>
          </div>
        </div>
      </div>

      <div className="tutorial-highlight">
        <div className="highlight-pulse"></div>
      </div>
    </div>
  );
};

export default Tutorial; 