// src/api/client.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your machine's local IP address (e.g., http://192.168.1.5:3000)
// Do not use localhost or 127.0.0.1 for React Native testing on physical devices/emulators.
export const API_URL = 'http://10.77.102.68:3000'; 

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});