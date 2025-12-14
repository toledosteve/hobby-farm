import { httpClient } from '../http-client';

export interface UserPreferences {
  landingPage?: string;
  darkMode?: string;
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  weeklySummary?: boolean;
  temperature?: string;
  distance?: string;
  volume?: string;
  weight?: string;
}

export const preferencesApi = {
  /**
   * Get user preferences
   */
  getPreferences: async (): Promise<UserPreferences> => {
    return httpClient.get<UserPreferences>('users/me/preferences');
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    return httpClient.patch<UserPreferences>('users/me/preferences', preferences);
  },
};
