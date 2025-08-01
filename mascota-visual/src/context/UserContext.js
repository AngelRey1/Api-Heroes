import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile, getPets, getAllHeroes } from '../api';
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
    return savedToken && isValidToken(savedToken) ? savedToken : null;
  });
  const [user, setUser] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [hero, setHero] = useState(null);
  const [activePet, setActivePet] = useState(null); // Nueva mascota activa
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setMascotas([]);
    setHeroes([]);
    setHero(null);
    setActivePet(null);
    setCoins(0);
    clearAllStorage();
  }, []);

  const fetchUserData = useCallback(async (force = false) => {
    if (!token) {
      console.log('fetchUserData: No hay token');
      return;
    }
    
    console.log('fetchUserData: Iniciando con token:', token.substring(0, 20) + '...');
    
    // Prevenir múltiples llamadas en un corto período
    const now = Date.now();
    if (!force && now - lastFetchTime < 2000) {
      console.log('Evitando llamada duplicada a fetchUserData');
      return;
    }
    
    const backendOk = await checkBackendStatus();
    if (!backendOk) {
      console.log('fetchUserData: Backend no disponible');
      showBackendError();
      return;
    }
    
    try {
      setLoading(true);
      setLastFetchTime(now);
      
      const userData = await getUserProfile(token);
      setUser(userData);
      setCoins(userData.coins || 0);
      
      // Obtener mascotas
      try {
        console.log('Intentando obtener mascotas...');
        const mascotasData = await getPets(token);
        console.log('Respuesta de getPets:', mascotasData);
        setMascotas(mascotasData);
        console.log('Mascotas cargadas:', mascotasData);
        console.log('Número de mascotas:', mascotasData?.length || 0);
        
        // Establecer la primera mascota como activa si no hay una activa
        if (mascotasData && mascotasData.length > 0 && !activePet) {
          setActivePet(mascotasData[0]);
          console.log('Mascota activa establecida:', mascotasData[0]);
        }
      } catch (err) {
        console.warn('Error fetching mascotas:', err.message);
        console.warn('Error completo:', err);
        setMascotas([]);
      }
      
      // Obtener héroes
      try {
        console.log('Intentando obtener héroes...');
        const heroesData = await getAllHeroes(token);
        console.log('Respuesta de getAllHeroes:', heroesData);
        setHeroes(heroesData);
        console.log('Héroes cargados:', heroesData);
        console.log('Número de héroes:', heroesData?.length || 0);
        
        // Establecer el primer héroe como activo
        if (heroesData && heroesData.length > 0) {
          setHero(heroesData[0]);
          console.log('Héroe activo establecido:', heroesData[0]);
        } else {
          setHero(null);
          console.log('No hay héroes disponibles');
        }
      } catch (err) {
        console.warn('Error fetching heroes:', err.message);
        console.warn('Error completo:', err);
        setHeroes([]);
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
  }, [token, logout, lastFetchTime, activePet]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setCoins(userData.coins || 0);
    localStorage.setItem('token', newToken);
  };

  const updateCoins = async (newCoins) => {
    setCoins(newCoins);
    if (user) {
      setUser(prev => ({ ...prev, coins: newCoins }));
      
      // Actualizar en el backend
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://api-heroes-gh4i.onrender.com/api'}/users/${user._id}/coins`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ coins: newCoins })
        });
        
        if (!response.ok) {
          console.error('Error actualizando monedas en el backend');
        }
      } catch (error) {
        console.error('Error actualizando monedas:', error);
      }
    }
  };

  const updateMascotas = (newMascotas) => {
    setMascotas(newMascotas);
  };

  const updateHero = (newHero) => {
    setHero(newHero);
  };

  const updateHeroes = (newHeroes) => {
    setHeroes(newHeroes);
    if (newHeroes && newHeroes.length > 0) {
      setHero(newHeroes[0]);
    }
  };

  // Función para cambiar la mascota activa
  const setActivePetById = (petId) => {
    const pet = mascotas.find(p => p._id === petId);
    if (pet) {
      setActivePet(pet);
      console.log('Mascota activa cambiada a:', pet.name);
    }
  };

  // Función para actualizar la mascota activa después de acciones
  const updateActivePet = (updatedPet) => {
    if (activePet && activePet._id === updatedPet._id) {
      setActivePet(updatedPet);
    }
    // También actualizar en la lista de mascotas
    setMascotas(prev => prev.map(p => p._id === updatedPet._id ? updatedPet : p));
  };

  // Cargar datos cuando cambie el token (solo una vez)
  useEffect(() => {
    if (token) {
      fetchUserData(true); // Forzar la primera carga
    }
  }, [token]); // Removido fetchUserData de las dependencias

  const value = {
    token,
    user,
    mascotas,
    heroes,
    hero,
    activePet,
    coins,
    loading,
    login,
    logout,
    fetchUserData,
    updateCoins,
    updateMascotas,
    updateHero,
    updateHeroes,
    setActivePetById,
    updateActivePet
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