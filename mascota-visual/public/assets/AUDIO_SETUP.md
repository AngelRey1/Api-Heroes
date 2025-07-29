# Configuración de Audio para Mascota Hero 🎵

## Problema Actual
Los archivos de audio actuales están vacíos (1 byte cada uno), lo que causa errores `NotSupportedError: The element has no supported sources.`

## Archivos de Audio Necesarios

### Efectos de Sonido (en `/assets/`)
- `click.mp3` - Sonido de clics (duración: 0.1-0.3s)
- `coin.mp3` - Sonido de monedas (duración: 0.2-0.5s)
- `feed.mp3` - Sonido de alimentar mascota (duración: 0.3-0.6s)
- `use.mp3` - Sonido de usar items (duración: 0.2-0.4s)
- `stat.mp3` - Sonido de estadísticas (duración: 0.2-0.4s)
- `celebrate.mp3` - Sonido de celebración (duración: 0.5-1s)
- `levelup.mp3` - Sonido de subir nivel (duración: 0.5-1s)
- `achievement.mp3` - Sonido de logro (duración: 0.3-0.6s)
- `notification.mp3` - Sonido de notificación (duración: 0.2-0.4s)
- `error.mp3` - Sonido de error (duración: 0.2-0.4s)
- `success.mp3` - Sonido de éxito (duración: 0.3-0.5s)
- `clean.mp3` - Sonido de limpiar mascota (duración: 0.3-0.6s)
- `play.mp3` - Sonido de jugar con mascota (duración: 0.3-0.6s)
- `sleep.mp3` - Sonido de dormir (duración: 0.3-0.6s)

### Música de Fondo (en `/assets/music/`)
- `home-theme.mp3` - Música relajante para pantalla principal (duración: 1-3 min)
- `shop-theme.mp3` - Música alegre para tienda (duración: 1-3 min)
- `game-theme.mp3` - Música energética para minijuegos (duración: 1-3 min)
- `achievement-theme.mp3` - Música épica para logros (duración: 1-3 min)
- `social-theme.mp3` - Música amigable para secciones sociales (duración: 1-3 min)

## Soluciones Temporales

### Opción 1: Deshabilitar Audio Temporalmente
Si no tienes archivos de audio, puedes comentar temporalmente las llamadas a `playClick()`, `playCoin()`, etc. en los componentes.

### Opción 2: Usar Archivos de Audio de Ejemplo
Puedes descargar archivos de audio gratuitos de sitios como:
- https://freesound.org/
- https://mixkit.co/free-sound-effects/
- https://www.zapsplat.com/

### Opción 3: Crear Archivos de Audio Silenciosos
Puedes crear archivos MP3 silenciosos de 0.1 segundos como placeholders.

## Especificaciones Técnicas
- **Formato**: MP3 (mejor compatibilidad)
- **Tamaño**: Máximo 2MB por archivo
- **Calidad**: 128-192 kbps
- **Frecuencia**: 44.1 kHz
- **Canales**: Mono o Stereo

## Estructura de Directorios
```
public/assets/
├── click.mp3
├── coin.mp3
├── feed.mp3
├── use.mp3
├── stat.mp3
├── celebrate.mp3
├── levelup.mp3
├── achievement.mp3
├── notification.mp3
├── error.mp3
├── success.mp3
├── clean.mp3
├── play.mp3
├── sleep.mp3
└── music/
    ├── home-theme.mp3
    ├── shop-theme.mp3
    ├── game-theme.mp3
    ├── achievement-theme.mp3
    └── social-theme.mp3
```

## Notas Importantes
1. Los archivos deben ser válidos y reproducibles
2. El tamaño debe ser razonable para carga web
3. Usar música libre de derechos o con licencia apropiada
4. Los efectos de sonido deben ser cortos y claros
5. La música debe ser apropiada para el público objetivo (niños)

## Verificación
Una vez que agregues los archivos, verifica que:
1. No hay errores en la consola del navegador
2. Los sonidos se reproducen correctamente
3. El volumen se puede ajustar
4. Los controles de audio funcionan 