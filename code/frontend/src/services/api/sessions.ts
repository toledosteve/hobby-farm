import { httpClient } from '../http-client';

export interface Session {
  id: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export const sessionsApi = {
  /**
   * Get all active sessions
   */
  getSessions: async (): Promise<Session[]> => {
    return httpClient.get<Session[]>('sessions');
  },

  /**
   * Revoke a specific session
   */
  revokeSession: async (sessionId: string): Promise<void> => {
    return httpClient.delete(`sessions/${sessionId}`);
  },

  /**
   * Revoke all sessions except current one
   */
  revokeAllExceptCurrent: async (): Promise<void> => {
    return httpClient.delete('sessions');
  },
};
