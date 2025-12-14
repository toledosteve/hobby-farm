import { ReactNode } from "react";
import { SettingsSidebar } from "./SettingsSidebar";

interface SettingsLayoutProps {
  children: ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
}

export function SettingsLayout({ children, activePage, onPageChange }: SettingsLayoutProps) {
  return (
    <div className="flex h-screen bg-muted/30">
      <SettingsSidebar activePage={activePage} onPageChange={onPageChange} />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}