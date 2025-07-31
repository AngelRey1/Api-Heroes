// Función para verificar si el backend está funcionando
export const checkBackendStatus = async () => {
  try {
    const backendUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://api-heroes-gh4i.onrender.com';
    const response = await fetch(`${backendUrl}/health`);
    if (response.ok) {
      console.log('✅ Backend funcionando correctamente');
      return true;
    } else {
      console.log('❌ Backend respondió con error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend no disponible:', error.message);
    return false;
  }
};

// Función para mostrar un mensaje de error amigable
export const showBackendError = () => {
  const message = `
🚨 **Backend no disponible**

El servidor backend no está respondiendo. Esto puede deberse a:

1. **El servidor está iniciando** - Espera unos minutos y recarga
2. **Problema temporal** - Intenta recargar la página
3. **Mantenimiento** - El servidor puede estar en mantenimiento

Si el problema persiste, contacta al administrador.
  `;
  
  console.log(message);
  alert('Backend no disponible. Por favor, espera unos minutos y recarga la página.');
}; 