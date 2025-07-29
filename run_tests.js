import fetch from 'node-fetch';

// Configuración
const BASE_URL = 'http://localhost:3001';
let authToken = '';
let userId = '';
let heroId = '';
let petId = '';

// Colores para la consola
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// Función para imprimir con colores
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para hacer requests
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        return { status: 500, data: { error: error.message } };
    }
}

// Tests de Autenticación
async function testAuth() {
    log('\n🔐 TESTING AUTHENTICATION', 'blue');
    
    // Registrar usuario
    log('1. Registrando usuario...', 'yellow');
    const registerResponse = await makeRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        })
    });
    
    if (registerResponse.status === 201) {
        log('✅ Usuario registrado exitosamente', 'green');
    } else {
        log(`❌ Error al registrar usuario: ${registerResponse.data.error}`, 'red');
    }
    
    // Login
    log('2. Iniciando sesión...', 'yellow');
    const loginResponse = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
            username: 'testuser',
            password: 'password123'
        })
    });
    
    if (loginResponse.status === 200) {
        authToken = loginResponse.data.token;
        userId = loginResponse.data.user._id;
        log('✅ Login exitoso', 'green');
        log(`Token: ${authToken.substring(0, 20)}...`, 'yellow');
    } else {
        log(`❌ Error en login: ${loginResponse.data.error}`, 'red');
    }
}

// Tests de Superhéroes
async function testHeroes() {
    log('\n🦸 TESTING HEROES', 'blue');
    
    // Crear héroe
    log('1. Creando héroe...', 'yellow');
    const createHeroResponse = await makeRequest(`${BASE_URL}/api/heroes`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
            name: 'Roberto Gómez Bolaños',
            alias: 'Chapulín Colorado',
            city: 'CDMX',
            team: 'Independiente'
        })
    });
    
    if (createHeroResponse.status === 201) {
        heroId = createHeroResponse.data._id;
        log('✅ Héroe creado exitosamente', 'green');
        log(`Hero ID: ${heroId}`, 'yellow');
    } else {
        log(`❌ Error al crear héroe: ${createHeroResponse.data.error}`, 'red');
    }
    
    // Obtener todos los héroes
    log('2. Obteniendo todos los héroes...', 'yellow');
    const getHeroesResponse = await makeRequest(`${BASE_URL}/api/heroes`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (getHeroesResponse.status === 200) {
        log(`✅ Héroes obtenidos: ${getHeroesResponse.data.length}`, 'green');
    } else {
        log(`❌ Error al obtener héroes: ${getHeroesResponse.data.error}`, 'red');
    }
    
    // Buscar héroes por ciudad
    log('3. Buscando héroes por ciudad...', 'yellow');
    const cityHeroesResponse = await makeRequest(`${BASE_URL}/api/heroes/city/CDMX`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (cityHeroesResponse.status === 200) {
        log(`✅ Héroes de CDMX encontrados: ${cityHeroesResponse.data.length}`, 'green');
    } else {
        log(`❌ Error al buscar héroes por ciudad: ${cityHeroesResponse.data.error}`, 'red');
    }
    
    // Enfrentar héroe con villano
    log('4. Enfrentando héroe con villano...', 'yellow');
    const fightResponse = await makeRequest(`${BASE_URL}/api/heroes/${heroId}/enfrentar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ villain: 'Joker' })
    });
    
    if (fightResponse.status === 200) {
        log('✅ Enfrentamiento exitoso', 'green');
        log(`Resultado: ${fightResponse.data.message}`, 'yellow');
    } else {
        log(`❌ Error en enfrentamiento: ${fightResponse.data.error}`, 'red');
    }
    
    // Actualizar héroe
    log('5. Actualizando héroe...', 'yellow');
    const updateHeroResponse = await makeRequest(`${BASE_URL}/api/heroes/${heroId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
            name: 'Roberto Gómez Bolaños Actualizado',
            alias: 'Chapulín Colorado 2.0',
            city: 'Guadalajara',
            team: 'Equipo Mejorado'
        })
    });
    
    if (updateHeroResponse.status === 200) {
        log('✅ Héroe actualizado exitosamente', 'green');
    } else {
        log(`❌ Error al actualizar héroe: ${updateHeroResponse.data.error}`, 'red');
    }
}

// Tests de Mascotas
async function testPets() {
    log('\n🐕 TESTING PETS', 'blue');
    
    // Crear mascota
    log('1. Creando mascota...', 'yellow');
    const createPetResponse = await makeRequest(`${BASE_URL}/api/pets`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
            name: 'Firulais',
            type: 'Perro',
            superPower: 'Volar'
        })
    });
    
    if (createPetResponse.status === 201) {
        petId = createPetResponse.data._id;
        log('✅ Mascota creada exitosamente', 'green');
        log(`Pet ID: ${petId}`, 'yellow');
    } else {
        log(`❌ Error al crear mascota: ${createPetResponse.data.error}`, 'red');
    }
    
    // Obtener todas las mascotas
    log('2. Obteniendo todas las mascotas...', 'yellow');
    const getPetsResponse = await makeRequest(`${BASE_URL}/api/pets`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (getPetsResponse.status === 200) {
        log(`✅ Mascotas obtenidas: ${getPetsResponse.data.length}`, 'green');
    } else {
        log(`❌ Error al obtener mascotas: ${getPetsResponse.data.error}`, 'red');
    }
    
    // Obtener mascota por ID
    log('3. Obteniendo mascota por ID...', 'yellow');
    const getPetResponse = await makeRequest(`${BASE_URL}/api/pets/${petId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (getPetResponse.status === 200) {
        log('✅ Mascota obtenida exitosamente', 'green');
    } else {
        log(`❌ Error al obtener mascota: ${getPetResponse.data.error}`, 'red');
    }
    
    // Actualizar mascota
    log('4. Actualizando mascota...', 'yellow');
    const updatePetResponse = await makeRequest(`${BASE_URL}/api/pets/${petId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
            name: 'Firulais Actualizado',
            type: 'Perro',
            superPower: 'Super Velocidad'
        })
    });
    
    if (updatePetResponse.status === 200) {
        log('✅ Mascota actualizada exitosamente', 'green');
    } else {
        log(`❌ Error al actualizar mascota: ${updatePetResponse.data.error}`, 'red');
    }
    
    // Adoptar mascota
    log('5. Adoptando mascota...', 'yellow');
    const adoptPetResponse = await makeRequest(`${BASE_URL}/api/pets/${petId}/adopt`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
            heroId: heroId,
            reason: 'Necesita compañía',
            notes: 'Mascota muy cariñosa'
        })
    });
    
    if (adoptPetResponse.status === 200) {
        log('✅ Mascota adoptada exitosamente', 'green');
    } else {
        log(`❌ Error al adoptar mascota: ${adoptPetResponse.data.error}`, 'red');
    }
    
    // Obtener mascotas del héroe
    log('6. Obteniendo mascotas del héroe...', 'yellow');
    const heroPetsResponse = await makeRequest(`${BASE_URL}/api/heroes/${heroId}/pets`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (heroPetsResponse.status === 200) {
        log(`✅ Mascotas del héroe obtenidas: ${heroPetsResponse.data.length}`, 'green');
    } else {
        log(`❌ Error al obtener mascotas del héroe: ${heroPetsResponse.data.error}`, 'red');
    }
}

// Tests de Cuidado de Mascotas
async function testPetCare() {
    log('\n🏥 TESTING PET CARE', 'blue');
    
    // Alimentar mascota
    log('1. Alimentando mascota...', 'yellow');
    const feedResponse = await makeRequest(`${BASE_URL}/api/pet-care/${petId}/feed`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ food: 'Croquetas Premium' })
    });
    
    if (feedResponse.status === 200) {
        log('✅ Mascota alimentada exitosamente', 'green');
    } else {
        log(`❌ Error al alimentar mascota: ${feedResponse.data.error}`, 'red');
    }
    
    // Pasear mascota
    log('2. Paseando mascota...', 'yellow');
    const walkResponse = await makeRequest(`${BASE_URL}/api/pet-care/${petId}/walk`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (walkResponse.status === 200) {
        log('✅ Mascota paseada exitosamente', 'green');
    } else {
        log(`❌ Error al pasear mascota: ${walkResponse.data.error}`, 'red');
    }
    
    // Customizar mascota
    log('3. Customizando mascota...', 'yellow');
    const customizeResponse = await makeRequest(`${BASE_URL}/api/pet-care/${petId}/customize`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
            item: 'Sombrero de Vaquero',
            type: 'accesorio'
        })
    });
    
    if (customizeResponse.status === 200) {
        log('✅ Mascota customizada exitosamente', 'green');
    } else {
        log(`❌ Error al customizar mascota: ${customizeResponse.data.error}`, 'red');
    }
    
    // Enfermar mascota
    log('4. Enfermando mascota...', 'yellow');
    const sickResponse = await makeRequest(`${BASE_URL}/api/pet-care/${petId}/sick`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ disease: 'Gripe Canina' })
    });
    
    if (sickResponse.status === 200) {
        log('✅ Mascota enfermada exitosamente', 'green');
    } else {
        log(`❌ Error al enfermar mascota: ${sickResponse.data.error}`, 'red');
    }
    
    // Curar mascota
    log('5. Curando mascota...', 'yellow');
    const healResponse = await makeRequest(`${BASE_URL}/api/pet-care/${petId}/heal`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ disease: 'Gripe Canina' })
    });
    
    if (healResponse.status === 200) {
        log('✅ Mascota curada exitosamente', 'green');
    } else {
        log(`❌ Error al curar mascota: ${healResponse.data.error}`, 'red');
    }
    
    // Simular decaimiento
    log('6. Simulando decaimiento...', 'yellow');
    const decayResponse = await makeRequest(`${BASE_URL}/api/pet-care/${petId}/decay`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ hours: 5 })
    });
    
    if (decayResponse.status === 200) {
        log('✅ Decaimiento simulado exitosamente', 'green');
    } else {
        log(`❌ Error al simular decaimiento: ${decayResponse.data.error}`, 'red');
    }
}

// Limpieza
async function cleanup() {
    log('\n🧹 CLEANUP', 'blue');
    
    // Eliminar mascota
    log('1. Eliminando mascota...', 'yellow');
    const deletePetResponse = await makeRequest(`${BASE_URL}/api/pets/${petId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (deletePetResponse.status === 200) {
        log('✅ Mascota eliminada exitosamente', 'green');
    } else {
        log(`❌ Error al eliminar mascota: ${deletePetResponse.data.error}`, 'red');
    }
}

// Función principal
async function runAllTests() {
    log('🚀 INICIANDO PRUEBAS AUTOMATIZADAS DE LA API', 'blue');
    log('==============================================', 'blue');
    
    try {
        await testAuth();
        await testHeroes();
        await testPets();
        await testPetCare();
        await cleanup();
        
        log('\n🎉 ¡TODAS LAS PRUEBAS COMPLETADAS!', 'green');
        log('==============================================', 'green');
        
    } catch (error) {
        log(`\n❌ Error en las pruebas: ${error.message}`, 'red');
    }
}

// Ejecutar pruebas
runAllTests(); 