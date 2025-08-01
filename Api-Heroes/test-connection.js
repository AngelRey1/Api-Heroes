import axios from 'axios';

const API_URL = 'https://api-heroes-gh4i.onrender.com/api';

async function testConnection() {
  console.log('🔍 Probando conexión con la API...');
  
  try {
    // Test 1: Health check
    console.log('\n1. Probando health check...');
    const healthResponse = await axios.get(`${API_URL.replace('/api', '')}/health`);
    console.log('✅ Health check exitoso:', healthResponse.data);
    
    // Test 2: Login (si tienes credenciales de prueba)
    console.log('\n2. Probando autenticación...');
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        username: 'test',
        password: 'test123'
      });
      console.log('✅ Login exitoso:', loginResponse.data);
      
      const token = loginResponse.data.token;
      
      // Test 3: Crear héroe
      console.log('\n3. Probando creación de héroe...');
      const heroData = {
        name: 'Test Hero',
        alias: 'TestHero',
        city: 'Test City',
        team: 'Test Team',
        type: 'Test Type',
        color: '#FF0000'
      };
      
      const heroResponse = await axios.post(`${API_URL}/heroes`, heroData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Héroe creado exitosamente:', heroResponse.data);
      
      // Test 4: Obtener héroes
      console.log('\n4. Probando obtención de héroes...');
      const heroesResponse = await axios.get(`${API_URL}/heroes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Héroes obtenidos exitosamente:', heroesResponse.data.length, 'héroes');
      
    } catch (loginError) {
      console.log('⚠️ Login falló (normal si no hay usuario de prueba):', loginError.response?.data || loginError.message);
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba de conexión:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Ejecutar la prueba
testConnection(); 