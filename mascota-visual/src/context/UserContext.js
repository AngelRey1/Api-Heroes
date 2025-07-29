import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile, getMascotas } from '../api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
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
    localStorage.removeItem('token');
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!token) return;
    
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
        console.error('Error fetching mascotas:', err);
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
        console.error('Error fetching hero:', err);
        setHero(null);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      logout();
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
      fetchUserData();
    }
  }, [token, fetchUserData]);

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

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 