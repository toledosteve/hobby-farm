import { httpClient, tokenManager } from '../http-client';
import { User } from './auth';
import { API_CONFIG } from '@/config/api.config';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  timezone?: string;
  preferredUnits?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const usersApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return httpClient.get<User>('users/me');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    return httpClient.patch<User>('users/me', data);
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordData): Promise<void> => {
    return httpClient.patch<void>('users/me/password', data);
  },

  /**
   * Upload profile photo
   */
  uploadProfilePhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);

    const token = tokenManager.getToken();
    const baseUrl = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl : `${API_CONFIG.baseUrl}/`;

    const response = await fetch(`${baseUrl}users/me/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to upload photo' }));
      throw new Error(error.message || 'Failed to upload photo');
    }

    const data = await response.json();
    return data.profilePhotoUrl;
  },

  /**
   * Delete account
   */
  deleteAccount: async (): Promise<void> => {
    return httpClient.delete('users/me');
  },
};
