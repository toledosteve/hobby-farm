import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {description && (
          <p className="text-base text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}