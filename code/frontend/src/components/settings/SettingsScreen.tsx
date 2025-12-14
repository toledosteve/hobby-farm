import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SettingsLayout } from "./SettingsLayout";
import { ProfileSettings } from "./ProfileSettings";
import { AccountSettings } from "./AccountSettings";
import { AppPreferences } from "./AppPreferences";
import { FarmSettings } from "./FarmSettings";
import { MapleModuleSettings } from "./MapleModuleSettings";
import { PoultryModuleSettings } from "./PoultryModuleSettings";
import { BillingSettings } from "./BillingSettings";

type SettingsPage =
  | 'profile'
  | 'account'
  | 'preferences'
  | 'farm-settings'
  | 'maple-settings'
  | 'poultry-settings'
  | 'billing';

const VALID_PAGES: SettingsPage[] = [
  'profile',
  'account',
  'preferences',
  'farm-settings',
  'maple-settings',
  'poultry-settings',
  'billing',
];

export function SettingsScreen() {
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get('page');

  // Determine initial page from query param or default to 'profile'
  const getInitialPage = (): SettingsPage => {
    if (pageParam && VALID_PAGES.includes(pageParam as SettingsPage)) {
      return pageParam as SettingsPage;
    }
    return 'profile';
  };

  const [activePage, setActivePage] = useState<SettingsPage>(getInitialPage);

  // Update active page when URL param changes
  useEffect(() => {
    if (pageParam && VALID_PAGES.includes(pageParam as SettingsPage)) {
      setActivePage(pageParam as SettingsPage);
    }
  }, [pageParam]);

  const renderPage = () => {
    switch (activePage) {
      case 'profile':
        return <ProfileSettings />;
      case 'account':
        return <AccountSettings />;
      case 'preferences':
        return <AppPreferences />;
      case 'farm-settings':
        return <FarmSettings />;
      case 'maple-settings':
        return <MapleModuleSettings />;
      case 'poultry-settings':
        return <PoultryModuleSettings />;
      case 'billing':
        return <BillingSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <SettingsLayout activePage={activePage} onPageChange={(page) => setActivePage(page as SettingsPage)}>
      {renderPage()}
    </SettingsLayout>
  );
}
