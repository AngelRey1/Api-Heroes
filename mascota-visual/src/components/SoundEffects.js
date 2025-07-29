import React, { useEffect, useState } from 'react';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.volume = parseFloat(localStorage.getItem('soundVolume')) || 0.7;
    this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    this.loadSounds();
  }

           loadSounds() {
           const soundFiles = {
             click: '/assets/click.wav',
             coin: '/assets/coin.wav',
             feed: '/assets/feed.wav',
             use: '/assets/use.wav',
             stat: '/assets/stat.wav',
             celebrate: '/assets/celebrate.wav',
             levelup: '/assets/levelup.wav',
             achievement: '/assets/achievement.wav',
             notification: '/assets/notification.wav',
             error: '/assets/error.wav',
             success: '/assets/success.wav',
             clean: '/assets/clean.wav',
             play: '/assets/play.wav',
             sleep: '/assets/sleep.wav'
           };
       
           Object.entries(soundFiles).forEach(([key, src]) => {
             const audio = new Audio(src);
             audio.preload = 'auto';
             
             // Manejar errores de carga de audio
             audio.addEventListener('error', () => {
               console.warn(`Could not load audio file: ${src} - Audio disabled for this session`);
               // Deshabilitar audio si hay errores de carga
               this.enabled = false;
               localStorage.setItem('soundEnabled', false);
             });
             
             audio.addEventListener('loadeddata', () => {
               console.log(`Audio loaded successfully: ${key}`);
             });
             
             this.sounds[key] = audio;
           });
         }

           play(soundName) {
           if (!this.enabled || !this.sounds[soundName]) return;
           
           try {
             const sound = this.sounds[soundName];
             // Verificar si el archivo de audio es válido
             if (sound.duration === 0 || sound.duration === Infinity) {
               console.warn(`Audio file for ${soundName} is not valid - skipping playback`);
               return;
             }
             sound.currentTime = 0;
             sound.volume = this.volume;
             sound.play().catch(error => {
               console.warn(`Could not play sound ${soundName}:`, error);
               // Deshabilitar audio si hay errores de reproducción
               this.enabled = false;
               localStorage.setItem('soundEnabled', false);
             });
           } catch (error) {
             console.warn('Error playing sound:', error);
             // Deshabilitar audio si hay errores
             this.enabled = false;
             localStorage.setItem('soundEnabled', false);
           }
         }

  setVolume(volume) {
    this.volume = volume;
    localStorage.setItem('soundVolume', volume);
    Object.values(this.sounds).forEach(sound => {
      sound.volume = volume;
    });
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('soundEnabled', enabled);
  }

  // Métodos específicos para cada sonido
  playClick() {
    this.play('click');
  }

  playCoin() {
    this.play('coin');
  }

  playCelebrate() {
    this.play('celebrate');
  }

  playFeed() {
    this.play('feed');
  }

  playUse() {
    this.play('use');
  }

  playStat() {
    this.play('stat');
  }

  playLevelUp() {
    this.play('levelup');
  }

  playAchievement() {
    this.play('achievement');
  }

  playNotification() {
    this.play('notification');
  }

  playError() {
    this.play('error');
  }

  playSuccess() {
    this.play('success');
  }

  playClean() {
    this.play('clean');
  }

  playPlay() {
    this.play('play');
  }

  playSleep() {
    this.play('sleep');
  }
}

// Instancia global del SoundManager
const soundManager = new SoundManager();

export const useSoundEffects = () => {
  const [volume, setVolume] = useState(soundManager.volume);
  const [enabled, setEnabled] = useState(soundManager.enabled);

  useEffect(() => {
    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      const newVolume = parseFloat(localStorage.getItem('soundVolume')) || 0.7;
      const newEnabled = localStorage.getItem('soundEnabled') !== 'false';
      
      setVolume(newVolume);
      setEnabled(newEnabled);
      
      soundManager.setVolume(newVolume);
      soundManager.setEnabled(newEnabled);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateVolume = (newVolume) => {
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
  };

  const updateEnabled = (newEnabled) => {
    setEnabled(newEnabled);
    soundManager.setEnabled(newEnabled);
  };

  return {
    // Métodos de reproducción
    playClick: () => soundManager.playClick(),
    playCoin: () => soundManager.playCoin(),
    playCelebrate: () => soundManager.playCelebrate(),
    playFeed: () => soundManager.playFeed(),
    playUse: () => soundManager.playUse(),
    playStat: () => soundManager.playStat(),
    playLevelUp: () => soundManager.playLevelUp(),
    playAchievement: () => soundManager.playAchievement(),
    playNotification: () => soundManager.playNotification(),
    playError: () => soundManager.playError(),
    playSuccess: () => soundManager.playSuccess(),
    playClean: () => soundManager.playClean(),
    playPlay: () => soundManager.playPlay(),
    playSleep: () => soundManager.playSleep(),
    
    // Métodos de control
    setVolume: updateVolume,
    setEnabled: updateEnabled,
    volume,
    enabled
  };
};

export default soundManager; 