import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile, getMascotas } from '../api';
import { clearAllStorage, isValidToken } from '../utils/clearStorage';
import { checkBackendStatus, showBackendError } from '../utils/backendStatus';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken && isValidToken(savedToken)) {
      return savedToken;
    } else if (savedToken) {
      // Si hay un token pero es inválido, limpiarlo
      console.log('Token guardado es inválido, limpiando...');
      clearAllStorage();
    }
    return null;
  });
  const [user, setUser] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [hero, setHero] = useState(null);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setMascotas([]);
    setHero(null);
    setCoins(0);
    clearAllStorage();
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!token) return;
    
    // Verificar si el backend está funcionando
    const backendOk = await checkBackendStatus();
    if (!backendOk) {
      showBackendError();
      return;
    }
    
    try {
      setLoading(true);
      const userData = await getUserProfile(token);
      setUser(userData);
      setCoins(userData.coins || 0);
      
      // Obtener mascotas
      try {
        const mascotasData = await getMascotas(token);
        setMascotas(mascotasData);
      } catch (err) {
        console.warn('Error fetching mascotas:', err.message);
        setMascotas([]);
      }
      
      // Obtener héroe
      try {
        if (userData.heroes && userData.heroes.length > 0) {
          setHero(userData.heroes[0]);
        } else {
          setHero(null);
        }
      } catch (err) {
        console.warn('Error fetching hero:', err.message);
        setHero(null);
      }
    } catch (err) {
      // Solo hacer logout si es un error de autenticación (401, 403)
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('Token inválido o expirado, cerrando sesión...');
        logout();
      } else {
        console.error('Error fetching user data:', err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setCoins(userData.coins || 0);
    localStorage.setItem('token', newToken);
  };

  const updateCoins = (newCoins) => {
    setCoins(newCoins);
  };

  const updateMascotas = (newMascotas) => {
    setMascotas(newMascotas);
  };

  const updateHero = (newHero) => {
    setHero(newHero);
  };

  useEffect(() => {
    if (token) {
      // Verificar si el token es válido antes de hacer la petición
      if (!isValidToken(token)) {
        console.log('Token inválido, expirado o corrupto, cerrando sesión...');
        logout();
        return;
      }
      
      fetchUserData();
    }
  }, [token, fetchUserData, logout]);

  const value = {
    token,
    user,
    mascotas,
    hero,
    coins,
    loading,
    setToken,
    setUser,
    login,
    logout,
    updateCoins,
    updateMascotas,
    updateHero,
    fetchUserData
  };

  // Función global para limpiar localStorage desde la consola
  if (typeof window !== 'undefined') {
    window.clearAppStorage = clearAllStorage;
    window.isValidAppToken = isValidToken;
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 