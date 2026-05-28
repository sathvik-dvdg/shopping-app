// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiClient, instance } from '../api/client';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    loadStoredUser();
    setupResponseInterceptor();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('auth_user');
      const accessToken = await AsyncStorage.getItem('auth_access_token');
      
      if (storedUser && accessToken) {
        setUser(JSON.parse(storedUser));
        await refreshAuthToken();
      }
    } catch (error) {
      console.error('Failed to load user auth state', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuthToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('auth_refresh_token');
      if (!refreshToken) throw new Error('No refresh token available');

      const tokens = await ApiClient.refresh(refreshToken);
      if (tokens?.accessToken) {
        await AsyncStorage.setItem('auth_access_token', tokens.accessToken);
        if (tokens.refreshToken) {
          await AsyncStorage.setItem('auth_refresh_token', tokens.refreshToken);
        }
      }
    } catch (error) {
      console.error('Token refresh failed', error);
      await logout();
    }
  };

  const setupResponseInterceptor = () => {
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        const isAuthRoute = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
          originalRequest._retry = true;
          try {
            const refreshToken = await AsyncStorage.getItem('auth_refresh_token');
            if (!refreshToken) {
              await logout();
              return Promise.reject(error);
            }

            const tokens = await ApiClient.refresh(refreshToken);
            if (tokens?.accessToken) {
              await AsyncStorage.setItem('auth_access_token', tokens.accessToken);
              if (tokens.refreshToken) {
                await AsyncStorage.setItem('auth_refresh_token', tokens.refreshToken);
              }
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
              return instance(originalRequest);
            }
          } catch (refreshError) {
            await logout();
            return Promise.reject(error); 
          }
        }
        return Promise.reject(error);
      }
    );
  };
  
  const login = async (email: string, password: string) => {
    const data = await ApiClient.login({ email, password });
    const { accessToken, refreshToken, ...userData } = data;
    
    await AsyncStorage.setItem('auth_access_token', accessToken);
    await AsyncStorage.setItem('auth_refresh_token', refreshToken);
    await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await ApiClient.register({ name, email, password });
    const { accessToken, refreshToken, ...userData } = data;
    
    await AsyncStorage.setItem('auth_access_token', accessToken);
    await AsyncStorage.setItem('auth_refresh_token', refreshToken);
    await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await ApiClient.logout().catch(() => {});
    } catch (e) {
      // Quiet fail if network request fails during logout
    }
    await AsyncStorage.removeItem('auth_access_token');
    await AsyncStorage.removeItem('auth_refresh_token');
    await AsyncStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};