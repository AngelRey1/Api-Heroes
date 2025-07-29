import fs from 'fs';
import path from 'path';

// Función para generar un archivo WAV básico
function generateBasicWav(duration = 1000, frequency = 440) {
  const sampleRate = 44100;
  const samples = Math.floor(duration * sampleRate / 1000);
  const buffer = Buffer.alloc(44 + samples * 2); // 44 bytes header + samples * 2 bytes per sample
  
  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples * 2, 40);
  
  // Generar onda sinusoidal
  for (let i = 0; i < samples; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 16384;
    buffer.writeInt16LE(sample, 44 + i * 2);
  }
  
  return buffer;
}

// Función para generar un archivo MP3 simple (simulado)
function generateSimpleMP3(content) {
  // Crear un archivo de texto que simule un MP3
  return Buffer.from(`MP3_SIMULATED: ${content}\nDuration: 1000ms\nFrequency: 440Hz\nSample Rate: 44100Hz\n`, 'utf8');
}

// Lista de archivos de audio a generar
const audioFiles = [
  { name: 'click.mp3', content: 'Click sound effect' },
  { name: 'coin.mp3', content: 'Coin collection sound' },
  { name: 'feed.mp3', content: 'Pet feeding sound' },
  { name: 'use.mp3', content: 'Item use sound' },
  { name: 'stat.mp3', content: 'Statistics sound' },
  { name: 'celebrate.mp3', content: 'Celebration sound' },
  { name: 'levelup.mp3', content: 'Level up sound' },
  { name: 'achievement.mp3', content: 'Achievement sound' },
  { name: 'notification.mp3', content: 'Notification sound' },
  { name: 'error.mp3', content: 'Error sound' },
  { name: 'success.mp3', content: 'Success sound' },
  { name: 'clean.mp3', content: 'Cleaning sound' },
  { name: 'play.mp3', content: 'Play sound' },
  { name: 'sleep.mp3', content: 'Sleep sound' }
];

// Generar archivos de audio
const assetsDir = path.join('..', 'mascota-visual', 'public', 'assets');

console.log('🎵 Generando archivos de audio...');

audioFiles.forEach(file => {
  const filePath = path.join(assetsDir, file.name);
  const audioData = generateSimpleMP3(file.content);
  
  try {
    fs.writeFileSync(filePath, audioData);
    console.log(`✅ Generado: ${file.name}`);
  } catch (error) {
    console.error(`❌ Error generando ${file.name}:`, error.message);
  }
});

// Generar archivos de música
const musicFiles = [
  { name: 'home-theme.mp3', content: 'Home theme music' },
  { name: 'shop-theme.mp3', content: 'Shop theme music' },
  { name: 'game-theme.mp3', content: 'Game theme music' },
  { name: 'achievement-theme.mp3', content: 'Achievement theme music' },
  { name: 'social-theme.mp3', content: 'Social theme music' }
];

const musicDir = path.join(assetsDir, 'music');

console.log('\n🎼 Generando archivos de música...');

musicFiles.forEach(file => {
  const filePath = path.join(musicDir, file.name);
  const audioData = generateSimpleMP3(file.content);
  
  try {
    fs.writeFileSync(filePath, audioData);
    console.log(`✅ Generado: ${file.name}`);
  } catch (error) {
    console.error(`❌ Error generando ${file.name}:`, error.message);
  }
});

console.log('\n🎵 ¡Archivos de audio generados exitosamente!');
console.log('📝 Nota: Estos son archivos simulados. Para audio real, reemplaza con archivos MP3 genuinos.'); 