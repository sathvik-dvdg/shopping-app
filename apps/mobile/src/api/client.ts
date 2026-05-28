import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getBaseUrl = (): string => {
  const configUrl = Constants.expoConfig?.extra?.apiUrl;
  if (configUrl) return configUrl;
  
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:5000`;
  }
  
  return process.env.EXPO_PUBLIC_API_URL || '';
};

export const instance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export class ApiClient {
  static async register(data: any) {
    const response = await instance.post('/api/auth/register', data);
    return response.data;
  }

  static async login(data: any) {
    const response = await instance.post('/api/auth/login', data);
    return response.data;
  }

  static async refresh(refreshToken: string) {
    const response = await instance.post('/api/auth/refresh', { refreshToken });
    return response.data;
  }

  static async logout() {
    const response = await instance.post('/api/auth/logout');
    return response.data;
  }

  static async me() {
    const response = await instance.get('/api/auth/me');
    return response.data;
  }
}

// Backward compatibility for existing hooks (e.g., useProducts.ts)
export { instance as apiClient };