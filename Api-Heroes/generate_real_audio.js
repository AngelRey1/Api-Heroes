import fs from 'fs';
import path from 'path';

// Función para generar un archivo WAV básico
function generateWav(duration = 1000, frequency = 440, volume = 0.3) {
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
  
  // Generar onda sinusoidal con envelope
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 2); // Envelope exponencial
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * volume * 16384;
    buffer.writeInt16LE(sample, 44 + i * 2);
  }
  
  return buffer;
}

// Configuraciones de sonido para diferentes efectos
const soundConfigs = {
  click: { duration: 200, frequency: 800, volume: 0.2 },
  coin: { duration: 300, frequency: 1200, volume: 0.3 },
  feed: { duration: 500, frequency: 600, volume: 0.25 },
  use: { duration: 400, frequency: 900, volume: 0.25 },
  stat: { duration: 600, frequency: 700, volume: 0.3 },
  celebrate: { duration: 1000, frequency: 523, volume: 0.4 }, // C5
  levelup: { duration: 800, frequency: 659, volume: 0.4 }, // E5
  achievement: { duration: 1200, frequency: 784, volume: 0.4 }, // G5
  notification: { duration: 300, frequency: 1000, volume: 0.25 },
  error: { duration: 400, frequency: 200, volume: 0.3 },
  success: { duration: 500, frequency: 800, volume: 0.3 },
  clean: { duration: 600, frequency: 500, volume: 0.25 },
  play: { duration: 700, frequency: 600, volume: 0.3 },
  sleep: { duration: 800, frequency: 400, volume: 0.2 }
};

// Configuraciones de música de fondo
const musicConfigs = {
  'home-theme': { duration: 5000, frequency: 440, volume: 0.15 },
  'shop-theme': { duration: 5000, frequency: 523, volume: 0.15 },
  'game-theme': { duration: 5000, frequency: 659, volume: 0.15 },
  'achievement-theme': { duration: 5000, frequency: 784, volume: 0.15 },
  'social-theme': { duration: 5000, frequency: 880, volume: 0.15 }
};

// Generar archivos de audio
const assetsDir = path.join('..', 'mascota-visual', 'public', 'assets');

console.log('🎵 Generando archivos de audio WAV reales...');

Object.entries(soundConfigs).forEach(([name, config]) => {
  const filePath = path.join(assetsDir, `${name}.wav`);
  const audioData = generateWav(config.duration, config.frequency, config.volume);
  
  try {
    fs.writeFileSync(filePath, audioData);
    console.log(`✅ Generado: ${name}.wav (${config.duration}ms, ${config.frequency}Hz)`);
  } catch (error) {
    console.error(`❌ Error generando ${name}.wav:`, error.message);
  }
});

// Generar archivos de música
const musicDir = path.join(assetsDir, 'music');

console.log('\n🎼 Generando archivos de música...');

Object.entries(musicConfigs).forEach(([name, config]) => {
  const filePath = path.join(musicDir, `${name}.wav`);
  const audioData = generateWav(config.duration, config.frequency, config.volume);
  
  try {
    fs.writeFileSync(filePath, audioData);
    console.log(`✅ Generado: ${name}.wav (${config.duration}ms, ${config.frequency}Hz)`);
  } catch (error) {
    console.error(`❌ Error generando ${name}.wav:`, error.message);
  }
});

console.log('\n🎵 ¡Archivos de audio WAV generados exitosamente!');
console.log('📝 Nota: Los archivos MP3 han sido reemplazados por archivos WAV válidos.'); 