import { ActivityCategory } from '@/types';

/**
 * Format a timestamp as relative time (e.g., "2 hours ago", "Yesterday")
 */
export function formatActivityTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'Just now';
  } else if (diffMins < 60) {
    return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    // Format as date for older activities
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

/**
 * Get the icon name for an activity category
 */
export function getActivityIconName(category: ActivityCategory): string {
  switch (category) {
    case 'task':
      return 'CheckSquare';
    case 'module':
      return 'Package';
    case 'settings':
      return 'Settings';
    case 'project':
      return 'MapPin';
    case 'maple':
      return 'Droplets';
    case 'poultry':
      return 'Bird';
    case 'garden':
      return 'Leaf';
    case 'general':
    default:
      return 'Activity';
  }
}

/**
 * Get the emoji for an activity category (for display in badges)
 */
export function getActivityEmoji(category: ActivityCategory): string {
  switch (category) {
    case 'task':
      return '✓';
    case 'module':
      return '📦';
    case 'settings':
      return '⚙️';
    case 'project':
      return '🏡';
    case 'maple':
      return '🍁';
    case 'poultry':
      return '🐓';
    case 'garden':
      return '🥕';
    case 'general':
    default:
      return '📋';
  }
}

/**
 * Get the display label for an activity category
 */
export function getActivityCategoryLabel(category: ActivityCategory): string {
  switch (category) {
    case 'task':
      return 'Task';
    case 'module':
      return 'Module';
    case 'settings':
      return 'Settings';
    case 'project':
      return 'Farm';
    case 'maple':
      return 'Maple';
    case 'poultry':
      return 'Poultry';
    case 'garden':
      return 'Garden';
    case 'general':
    default:
      return 'General';
  }
}

/**
 * Get CSS classes for activity category styling
 */
export function getActivityCategoryColors(category: ActivityCategory): {
  bg: string;
  text: string;
  icon: string;
} {
  switch (category) {
    case 'task':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        icon: 'text-blue-600 dark:text-blue-400',
      };
    case 'module':
      return {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-300',
        icon: 'text-purple-600 dark:text-purple-400',
      };
    case 'settings':
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        icon: 'text-gray-600 dark:text-gray-400',
      };
    case 'project':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        icon: 'text-green-600 dark:text-green-400',
      };
    case 'maple':
      return {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-700 dark:text-amber-300',
        icon: 'text-amber-600 dark:text-amber-400',
      };
    case 'poultry':
      return {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-700 dark:text-orange-300',
        icon: 'text-orange-600 dark:text-orange-400',
      };
    case 'garden':
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-700 dark:text-emerald-300',
        icon: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'general':
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        icon: 'text-gray-600 dark:text-gray-400',
      };
  }
}
