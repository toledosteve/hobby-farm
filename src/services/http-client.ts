import { API_CONFIG } from '@/config/api.config';
import { ApiError } from '@/types';

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(API_CONFIG.auth.tokenKey);
  },

  setToken: (token: string): void => {
    localStorage.setItem(API_CONFIG.auth.tokenKey, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(API_CONFIG.auth.tokenKey);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(API_CONFIG.auth.refreshTokenKey);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(API_CONFIG.auth.refreshTokenKey, token);
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(API_CONFIG.auth.refreshTokenKey);
  },
};

// HTTP client configuration
interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

class HttpClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.timeout = API_CONFIG.timeout;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, ...fetchConfig } = config;

    // Build URL with query parameters
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Set default headers
    const headers = new Headers(fetchConfig.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Add auth token if available
    const token = tokenManager.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        ...fetchConfig,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || 'An error occurred',
          response.status,
          errorData.errors
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      throw new ApiError('Network error', 0);
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
