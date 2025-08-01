# Sistema de Mascota Virtual Completo

## 🐾 Descripción General

Se ha implementado un sistema completo de mascota virtual similar a Tamagotchi/Pou con estadísticas en tiempo real, degradación automática, consecuencias por negligencia y múltiples acciones de cuidado.

## 📊 Estadísticas del Sistema

### Stats Principales (como en la imagen)
- **Salud**: 0-100% (afectada por otros stats)
- **Felicidad**: 0-100% (aumenta con interacciones)
- **Sueño**: 0-100% (se recupera durmiendo)
- **Hambre**: 0-100% (aumenta con el tiempo)
- **Limpieza**: 0-100% (disminuye con el tiempo)
- **Energía**: 0-100% (se gasta en actividades)

### Estados de Vida
- **Viva**: Estado normal
- **Enferma**: Cuando la salud baja de 30%
- **Muerta**: Cuando la salud llega a 0%

### Estados de Ánimo
- **Happy**: Feliz (estado normal)
- **Sad**: Triste (felicidad baja)
- **Excited**: Emocionado (felicidad y salud altas)
- **Tired**: Cansado (energía baja)
- **Hungry**: Hambriento (hambre alta)
- **Dirty**: Sucio (limpieza baja)
- **Sick**: Enfermo
- **Sleepy**: Durmiendo

## ⚡ Acciones Disponibles

### 1. 🍽️ Alimentar (`feed`)
- **Efecto**: Hambre -30, Felicidad +10, Salud +5
- **Requisito**: Mascota viva
- **Frecuencia**: Sin límite

### 2. 💧 Dar Agua (`water`)
- **Efecto**: Felicidad +5, Salud +3
- **Requisito**: Mascota viva
- **Frecuencia**: Sin límite

### 3. 🎾 Jugar (`play`)
- **Efecto**: Energía -15, Felicidad +20, Hambre +10
- **Requisito**: Energía ≥ 15, mascota viva
- **Frecuencia**: Limitada por energía

### 4. 🦮 Pasear (`walk`)
- **Efecto**: Energía -20, Felicidad +15, Hambre +15, Limpieza -5
- **Requisito**: Energía ≥ 20, mascota viva
- **Frecuencia**: Limitada por energía

### 5. 🛁 Bañar (`bathe`)
- **Efecto**: Limpieza +100, Felicidad +10
- **Requisito**: Mascota viva
- **Frecuencia**: Sin límite

### 6. 😴 Dormir (`sleep`)
- **Efecto**: Inicia sueño, recupera energía y sueño
- **Requisito**: No estar durmiendo, mascota viva
- **Frecuencia**: Una vez por vez

### 7. ⏰ Despertar (`wake`)
- **Efecto**: Termina sueño, calcula recuperación basada en tiempo dormido
- **Requisito**: Estar durmiendo, mascota viva
- **Frecuencia**: Una vez por vez

### 8. ❤️ Acariciar (`pet`)
- **Efecto**: Felicidad +15, Salud +3
- **Requisito**: Mascota viva
- **Frecuencia**: Sin límite

### 9. 🩹 Curar (`heal`)
- **Efecto**: Salud +30, cura enfermedades
- **Requisito**: Mascota viva
- **Frecuencia**: Sin límite

## 🔄 Degradación Automática

### Tasas de Degradación (por hora)
- **Hambre**: +3 puntos/hora
- **Sed**: +4 puntos/hora
- **Energía**: -2 puntos/hora
- **Felicidad**: -1 punto/hora
- **Limpieza**: -1.5 puntos/hora
- **Sueño**: -2 puntos/hora
- **Salud**: -0.5 puntos/hora (cuando está mal cuidada)

### Consecuencias por Negligencia
1. **Salud baja**: Si hambre > 80% o limpieza < 20% o felicidad < 20%
2. **Enfermedad**: Si salud < 30% (estado "enferma")
3. **Muerte**: Si salud ≤ 0% (estado "muerta")

## 🎮 Componente Frontend

### VirtualPet.js
- **Interfaz visual**: Similar a la imagen proporcionada
- **Stats en tiempo real**: Barras de progreso animadas
- **Acciones interactivas**: Botones con efectos visuales
- **Actualización automática**: Cada 30 segundos
- **Responsive**: Adaptable a móviles

### Características Visuales
- **Avatar con glow**: Efecto de brillo personalizable
- **Barras de progreso**: Con animaciones y colores según el estado
- **Indicadores de estado**: Iconos de ánimo y estado de vida
- **Botones de acción**: Con gradientes y efectos hover
- **Mensajes toast**: Notificaciones de acciones realizadas

## 🗄️ Base de Datos

### Modelo Pet (petModel.js)
```javascript
{
  name: String,
  type: String,
  superPower: String,
  personality: String,
  status: String, // 'viva', 'enferma', 'dead'
  
  // Stats principales
  health: Number,
  happiness: Number,
  sleep: Number,
  hunger: Number,
  cleanliness: Number,
  energy: Number,
  
  // Estado
  mood: String,
  isSleeping: Boolean,
  isSick: Boolean,
  
  // Timestamps
  lastFed: Date,
  lastWatered: Date,
  lastPlayed: Date,
  lastWalked: Date,
  lastBathed: Date,
  lastSlept: Date,
  lastPet: Date,
  lastHealed: Date,
  
  // Historial
  activityHistory: Array
}
```

## 🔧 API Endpoints

### Rutas de Cuidado (`/api/pet-care`)
- `POST /:petId/feed` - Alimentar
- `POST /:petId/water` - Dar agua
- `POST /:petId/play` - Jugar
- `POST /:petId/walk` - Pasear
- `POST /:petId/bathe` - Bañar
- `POST /:petId/sleep` - Dormir
- `POST /:petId/wake` - Despertar
- `POST /:petId/pet` - Acariciar
- `POST /:petId/heal` - Curar
- `GET /:petId/status` - Obtener stats
- `GET /:petId/history` - Historial de actividades

## 🚀 Servicios

### PetService
- **Gestión de stats**: Actualización automática
- **Validaciones**: Verificación de permisos y estados
- **Manejo de errores**: Mensajes específicos por acción
- **Historial**: Registro de todas las actividades

### AutoUpdateService
- **Actualización automática**: Cada 5 minutos
- **Degradación de stats**: Cálculo basado en tiempo
- **Consecuencias**: Aplicación de efectos por negligencia
- **Logging**: Registro de actividades del sistema

## 🎯 Funcionalidades Clave

### 1. Tiempo Real
- Stats se actualizan automáticamente
- Degradación continua de necesidades
- Consecuencias por negligencia

### 2. Interactividad
- 9 acciones diferentes disponibles
- Validaciones de energía y estado
- Efectos visuales y feedback

### 3. Personalización
- Avatar personalizable
- Color de glow configurable
- Personalidad y tipo de mascota

### 4. Consecuencias
- Sistema de enfermedades
- Muerte por negligencia extrema
- Estados de ánimo dinámicos

### 5. Historial
- Registro de todas las actividades
- Timestamps de acciones
- Efectos de cada acción

## 📱 Uso del Componente

```javascript
import VirtualPet from './components/VirtualPet';

// En tu componente padre
<VirtualPet 
  pet={selectedPet} 
  token={userToken} 
  onUpdate={handlePetUpdate} 
/>
```

## 🎨 Personalización Visual

### Colores de Estado
- **Verde** (≥80%): Excelente
- **Naranja** (≥60%): Bueno
- **Amarillo** (≥40%): Regular
- **Rojo** (<40%): Crítico

### Animaciones
- **Glow del avatar**: Efecto pulsante
- **Barras de progreso**: Animación shimmer
- **Botones**: Efectos hover y disabled
- **Mensajes**: Slide-in animation

## 🔄 Flujo de Datos

1. **Usuario realiza acción** → Frontend llama API
2. **API valida y procesa** → Backend actualiza stats
3. **Stats se guardan** → Base de datos actualizada
4. **Frontend recibe respuesta** → UI se actualiza
5. **AutoUpdateService** → Actualiza stats cada 5 min

## 🛠️ Configuración

### Variables de Entorno
```env
# Tasas de degradación (opcional)
HUNGER_RATE=3
THIRST_RATE=4
ENERGY_DECAY_RATE=2
HAPPINESS_DECAY_RATE=1
CLEANLINESS_DECAY_RATE=1.5
SLEEP_DECAY_RATE=2
HEALTH_DECAY_RATE=0.5
```

### Personalización de Mascota
```javascript
// Al crear una mascota
{
  name: "Pio pio",
  type: "Pájaro",
  superPower: "Volar en el agua",
  personality: "normal",
  avatar: "/assets/bird-avatar.png",
  glowColor: "#FF69B4"
}
```

## 🎯 Próximas Mejoras

1. **Sistema de niveles**: Mascotas que evolucionan
2. **Múltiples mascotas**: Gestión de varias mascotas
3. **Sistema de logros**: Desbloqueos por cuidado
4. **Interacción social**: Mascotas entre usuarios
5. **Eventos especiales**: Actividades temporales
6. **Sistema de items**: Comida y juguetes especiales

Este sistema proporciona una experiencia completa de mascota virtual con todas las características mostradas en la imagen y funcionalidades adicionales para una experiencia más rica y envolvente. 