import { httpClient, tokenManager } from '../http-client';
import { API_CONFIG } from '@/config/api.config';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  phoneNumber?: string;
  timezone?: string;
  preferredUnits?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>(
      API_CONFIG.endpoints.auth.register,
      data
    );
    
    // Store token and user data
    tokenManager.setToken(response.accessToken);
    localStorage.setItem(API_CONFIG.auth.userKey, JSON.stringify(response.user));
    
    return response;
  },

  /**
   * Login user
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>(
      API_CONFIG.endpoints.auth.login,
      data
    );
    
    // Store token and user data
    tokenManager.setToken(response.accessToken);
    localStorage.setItem(API_CONFIG.auth.userKey, JSON.stringify(response.user));
    
    return response;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    // Clear local storage
    tokenManager.removeToken();
    tokenManager.removeRefreshToken();
    localStorage.removeItem(API_CONFIG.auth.userKey);
  },

  /**
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    return httpClient.get<User>('auth/me');
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: (): User | null => {
    const userJson = localStorage.getItem(API_CONFIG.auth.userKey);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  },
};
