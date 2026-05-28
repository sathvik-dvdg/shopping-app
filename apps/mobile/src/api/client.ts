import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getBaseUrl = (): string => {
  // 1. Highest Priority: Explicit environment variable
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Fallback to Expo app.config.js
  const configUrl = Constants.expoConfig?.extra?.apiUrl;
  if (configUrl) return configUrl;

  // 3. Fallback to dynamic host IP (explicitly block 127.0.0.1 to prevent device/emulator loopback errors)
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    if (ip !== '127.0.0.1') {
      return `http://${ip}:5000`;
    }
  }

  // 4. Ultimate fallback for Android Emulators
  return 'http://10.0.2.2:5000';
};

export const instance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add this right after creating the 'instance' in client.ts

instance.interceptors.request.use(
  async (config) => {
    console.log('\n====================================');
    console.log('🚀 REQUEST STARTED');
    console.log(`URL: ${config.baseURL}${config.url}`);
    console.log(`Method: ${config.method?.toUpperCase()}`);
    console.log(`Payload:`, JSON.stringify(config.data, null, 2));
    
    const token = await AsyncStorage.getItem('auth_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Auth Header Attached: Yes`);
    } else {
      console.log(`Auth Header Attached: No`);
    }
    console.log('====================================\n');
    return config;
  },
  (error) => {
    console.error('❌ REQUEST SETUP ERROR:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log('\n====================================');
    console.log('✅ RESPONSE SUCCESS');
    console.log(`URL: ${response.config.url}`);
    console.log(`Status: ${response.status}`);
    console.log(`Data:`, JSON.stringify(response.data, null, 2));
    console.log('====================================\n');
    return response;
  },
  (error) => {
    console.log('\n====================================');
    console.log('❌ RESPONSE FAILED');
    console.log(`URL: ${error.config?.url}`);
    console.log(`Status: ${error.response?.status || 'NETWORK_ERROR'}`);
    console.log(`Reason:`, error.response?.data || error.message);
    console.log('====================================\n');
    return Promise.reject(error);
  }
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