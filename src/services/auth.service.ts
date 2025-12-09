import {
  User,
  LoginDto,
  RegisterDto,
  PasswordResetDto,
  AuthResponse,
  ApiResponse,
} from '@/types';
import { API_CONFIG, isMockMode } from '@/config/api.config';
import { httpClient, tokenManager } from './http-client';
import { mockDatabase, simulateDelay } from './mock-data';

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    if (isMockMode) {
      await simulateDelay();
      
      // Simple mock authentication
      if (credentials.email && credentials.password) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        tokenManager.setToken(mockToken);
        
        // Store user data in localStorage
        localStorage.setItem(API_CONFIG.auth.userKey, JSON.stringify(mockDatabase.user));
        
        return {
          user: mockDatabase.user,
          token: mockToken,
        };
      }
      
      throw new Error('Invalid credentials');
    }

    const response = await httpClient.post<AuthResponse>(
      API_CONFIG.endpoints.auth.login,
      credentials
    );

    // Store tokens
    tokenManager.setToken(response.token);
    if (response.refreshToken) {
      tokenManager.setRefreshToken(response.refreshToken);
    }

    // Store user data
    localStorage.setItem(API_CONFIG.auth.userKey, JSON.stringify(response.user));

    return response;
  }

  /**
   * Register new user
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    if (isMockMode) {
      await simulateDelay();
      
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: data.name,
        email: data.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      tokenManager.setToken(mockToken);
      
      // Update mock database
      mockDatabase.user = newUser;
      
      // Store user data in localStorage
      localStorage.setItem(API_CONFIG.auth.userKey, JSON.stringify(newUser));
      
      return {
        user: newUser,
        token: mockToken,
      };
    }

    const response = await httpClient.post<AuthResponse>(
      API_CONFIG.endpoints.auth.register,
      data
    );

    // Store tokens
    tokenManager.setToken(response.token);
    if (response.refreshToken) {
      tokenManager.setRefreshToken(response.refreshToken);
    }

    // Store user data
    localStorage.setItem(API_CONFIG.auth.userKey, JSON.stringify(response.user));

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    if (isMockMode) {
      await simulateDelay(200);
      tokenManager.removeToken();
      tokenManager.removeRefreshToken();
      localStorage.removeItem(API_CONFIG.auth.userKey);
      return;
    }

    try {
      await httpClient.post(API_CONFIG.endpoints.auth.logout);
    } finally {
      // Clear tokens regardless of API response
      tokenManager.removeToken();
      tokenManager.removeRefreshToken();
      localStorage.removeItem(API_CONFIG.auth.userKey);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(data: PasswordResetDto): Promise<ApiResponse<void>> {
    if (isMockMode) {
      await simulateDelay();
      return {
        data: undefined as unknown as void,
        message: 'Password reset email sent',
      };
    }

    return httpClient.post<ApiResponse<void>>(
      API_CONFIG.endpoints.auth.resetPassword,
      data
    );
  }

  /**
   * Get current user from storage
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(API_CONFIG.auth.userKey);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!tokenManager.getToken();
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    if (isMockMode) {
      await simulateDelay(200);
      const mockToken = 'mock-jwt-token-' + Date.now();
      tokenManager.setToken(mockToken);
      
      return {
        user: mockDatabase.user,
        token: mockToken,
      };
    }

    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await httpClient.post<AuthResponse>(
      API_CONFIG.endpoints.auth.refresh,
      { refreshToken }
    );

    tokenManager.setToken(response.token);
    if (response.refreshToken) {
      tokenManager.setRefreshToken(response.refreshToken);
    }

    return response;
  }
}

export const authService = new AuthService();
