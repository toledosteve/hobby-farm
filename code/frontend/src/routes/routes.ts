// Route definitions
export const ROUTES = {
  // Auth routes
  AUTH: {
    WELCOME: '/welcome',
    SIGNIN: '/signin',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_CONFIRMATION: '/reset-confirmation',
    SELECT_PLAN: '/select-plan',
  },
  
  // Main app routes
  PROJECTS: '/projects',
  ONBOARDING: '/onboarding',
  
  // App routes (require project context)
  APP: {
    DASHBOARD: '/app/dashboard',
    MAP: '/app/map',
    CALENDAR: '/app/calendar',
    MODULES: '/app/modules',
    SETTINGS: '/app/settings',
  },
  
  // Module routes
  MAPLE: {
    DASHBOARD: '/app/modules/maple',
    TREES: '/app/modules/maple/trees',
    COLLECTION_LOG: '/app/modules/maple/collection-log',
    BOIL_LOG: '/app/modules/maple/boil-log',
  },
  
  POULTRY: {
    DASHBOARD: '/app/modules/poultry',
    FLOCKS: '/app/modules/poultry/flocks',
    EGG_LOG: '/app/modules/poultry/egg-log',
  },
} as const;

// Helper function to generate app routes with project context
export const getAppRoute = (path: string, projectId?: string): string => {
  if (projectId) {
    return `${path}?project=${projectId}`;
  }
  return path;
};
