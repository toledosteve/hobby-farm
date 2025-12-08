import { useState } from "react";
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

export function SettingsScreen() {
  const [activePage, setActivePage] = useState<SettingsPage>('profile');

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
