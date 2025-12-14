// API Configuration
// This file centralizes all API-related configuration
// making it easy to switch between mock data and real backend

export const API_CONFIG = {
  // Base URL - can be overridden by environment variable
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  
  // Enable mock mode (uses local data instead of API calls)
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || false,
  
  // Request timeout in milliseconds
  timeout: 30000,
  
  // Authentication
  auth: {
    tokenKey: 'hobby-farm-auth-token',
    refreshTokenKey: 'hobby-farm-refresh-token',
    userKey: 'hobby-farm-user',
  },
  
  // API endpoints
  endpoints: {
    auth: {
      login: 'auth/login',
      register: 'auth/register',
      logout: 'auth/logout',
      refresh: 'auth/refresh',
      resetPassword: 'auth/reset-password',
      verifyEmail: 'auth/verify-email',
    },
    projects: {
      list: 'projects',
      create: 'projects',
      get: (id: string) => `projects/${id}`,
      update: (id: string) => `projects/${id}`,
      delete: (id: string) => `projects/${id}`,
    },
    poultry: {
      flocks: 'poultry/flocks',
      eggs: 'poultry/eggs',
      feed: 'poultry/feed',
      health: 'poultry/health',
    },
    maple: {
      trees: 'maple/trees',
      collections: 'maple/collections',
      boilSessions: 'maple/boil-sessions',
    },
    tasks: {
      list: 'tasks',
      create: 'tasks',
      update: (id: string) => `tasks/${id}`,
      delete: (id: string) => `tasks/${id}`,
    },
  },
};

// Helper to check if we're in development mode
export const isDevelopment = import.meta.env.DEV;

// Helper to check if we're using mock data
export const isMockMode = API_CONFIG.useMockData;
