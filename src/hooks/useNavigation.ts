import { useState, useCallback } from 'react';

export type AuthView = 'welcome' | 'signup' | 'signin' | 'forgot-password' | 'reset-confirmation';
export type MainView = 'project-list' | 'onboarding' | 'app';
export type AppTab = 'dashboard' | 'map' | 'calendar' | 'modules' | 'settings';

/**
 * Hook for managing application navigation state
 */
export function useNavigation() {
  const [authView, setAuthView] = useState<AuthView>('welcome');
  const [mainView, setMainView] = useState<MainView>('project-list');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  const navigateToAuth = useCallback((view: AuthView) => {
    setAuthView(view);
  }, []);

  const navigateToMain = useCallback((view: MainView) => {
    setMainView(view);
  }, []);

  const navigateToTab = useCallback((tab: AppTab) => {
    setActiveTab(tab);
  }, []);

  const resetNavigation = useCallback(() => {
    setAuthView('welcome');
    setMainView('project-list');
    setActiveTab('dashboard');
  }, []);

  return {
    authView,
    mainView,
    activeTab,
    navigateToAuth,
    navigateToMain,
    navigateToTab,
    resetNavigation,
    setAuthView,
    setMainView,
    setActiveTab,
  };
}
