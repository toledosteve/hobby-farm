// Alerts & Notifications Types

export type AlertCategory = 'weather' | 'task' | 'health' | 'opportunity';
export type AlertSeverity = 'notice' | 'heads-up' | 'important';
export type AlertStatus = 'new' | 'read' | 'snoozed' | 'dismissed';

export interface Alert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  affectedModules: string[]; // e.g., ['orchard', 'beekeeping']
  icon: string; // emoji or icon name
  timestamp: string;
  expiresAt?: string;
  snoozedUntil?: string;
  actionLabel?: string;
  actionLink?: string;
  metadata?: {
    weatherCondition?: string;
    temperatureF?: number;
    taskType?: string;
    moduleSpecific?: any;
  };
  createdAt: string;
}

export interface AlertFilter {
  categories: AlertCategory[];
  statuses: AlertStatus[];
  modules: string[];
}

export interface NotificationPreferences {
  enabled: boolean;
  categories: {
    weather: boolean;
    task: boolean;
    health: boolean;
    opportunity: boolean;
  };
  deliveryMethod: 'in-app' | 'email' | 'both';
  emailSummaryFrequency?: 'daily' | 'weekly' | 'none';
}
