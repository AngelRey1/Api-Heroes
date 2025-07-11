# API Superhéroes y Mascotas 🦸‍♂️🐕

API REST para gestionar superhéroes y sus mascotas, con documentación completa en Swagger.

## 🚀 Características

- **Gestión de Superhéroes**: CRUD completo para héroes
- **Gestión de Mascotas**: CRUD completo para mascotas
- **Sistema de Adopción**: Los héroes pueden adoptar mascotas
- **Documentación Swagger**: API completamente documentada
- **Validación de Datos**: Validación de entrada con express-validator
- **Arquitectura MVC**: Separación clara de responsabilidades

## 📋 Endpoints Disponibles

### Superhéroes
- `GET /api/heroes` - Listar todos los héroes
- `POST /api/heroes` - Crear nuevo héroe
- `GET /api/heroes/city/{city}` - Buscar héroes por ciudad
- `POST /api/heroes/{id}/enfrentar` - Enfrentar héroe con villano
- `GET /api/heroes/{id}/pets` - Ver mascotas de un héroe
- `PUT /api/heroes/{id}` - Actualizar héroe
- `DELETE /api/heroes/{id}` - Eliminar héroe

### Mascotas
- `GET /api/pets` - Listar todas las mascotas
- `POST /api/pets` - Crear nueva mascota
- `GET /api/pets/{id}` - Obtener mascota por ID
- `PUT /api/pets/{id}` - Actualizar mascota
- `DELETE /api/pets/{id}` - Eliminar mascota
- `GET /api/pets/{id}/adoptedBy` - Ver quién adoptó la mascota
- `POST /api/pets/{id}/adopt` - Adoptar mascota
- `POST /api/pets/{id}/return` - Devolver mascota
- `GET /api/pets/adopted` - Listar mascotas adoptadas

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd api-superheroes
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor**
   ```bash
   npm start
   ```
   o
   ```bash
   node app.js
   ```

## 📖 Documentación

Una vez que el servidor esté corriendo, puedes acceder a la documentación de Swagger en:

**http://localhost:3001/api-docs**

## 🏗️ Estructura del Proyecto

```
api-superheroes/
├── app.js                 # Servidor principal
├── package.json           # Dependencias y scripts
├── superheroes.json       # Datos de héroes
├── superpets.json         # Datos de mascotas
└── src/
    ├── controllers/       # Controladores de rutas
    │   ├── heroController.js
    │   └── petController.js
    ├── models/           # Modelos de datos
    ├── repositories/     # Acceso a datos
    └── services/         # Lógica de negocio
```

## 🎯 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Swagger** - Documentación de API
- **express-validator** - Validación de datos
- **fs-extra** - Manejo de archivos

## 📝 Ejemplos de Uso

### Crear un Héroe
```bash
curl -X POST http://localhost:3001/api/heroes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Roberto Gómez Bolaños",
    "alias": "Chapulin Colorado",
    "city": "CDMX",
    "team": "Independiente"
  }'
```

### Adoptar una Mascota
```bash
curl -X POST http://localhost:3001/api/pets/1/adopt \
  -H "Content-Type: application/json" \
  -d '{
    "heroId": 1,
    "reason": "Necesita compañía",
    "notes": "Mascota muy cariñosa"
  }'
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

**javerage** - [GitHub](https://github.com/javerage)

---

¡Disfruta usando la API de Superhéroes y Mascotas! 🦸‍♂️🐕 