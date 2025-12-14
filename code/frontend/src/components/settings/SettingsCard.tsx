import { ReactNode } from "react";
import { cn } from "../ui/utils";

interface SettingsCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  danger?: boolean;
  className?: string;
}

export function SettingsCard({ title, description, children, danger, className }: SettingsCardProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-6",
      danger && "border-destructive/50",
      className
    )}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className={cn(danger && "text-destructive")}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}