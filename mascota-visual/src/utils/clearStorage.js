// Función para limpiar completamente el localStorage
export const clearAllStorage = () => {
  try {
    // Limpiar todos los datos relacionados con la sesión
    localStorage.removeItem('token');
    localStorage.removeItem('soundEnabled');
    localStorage.removeItem('soundVolume');
    localStorage.removeItem('musicEnabled');
    localStorage.removeItem('musicVolume');
    localStorage.removeItem('user');
    localStorage.removeItem('mascotas');
    localStorage.removeItem('hero');
    localStorage.removeItem('coins');
    
    console.log('✅ localStorage limpiado completamente');
    return true;
  } catch (error) {
    console.error('❌ Error limpiando localStorage:', error);
    return false;
  }
};

// Función para verificar si hay un token válido
export const isValidToken = (token) => {
  if (!token) return false;
  
  try {
    // Verificar formato básico
    if (!token.includes('.') || token.split('.').length !== 3) {
      return false;
    }
    
    // Decodificar y verificar expiración
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}; 