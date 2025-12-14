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
      "bg-card border border-border rounded-xl p-7 shadow-sm",
      danger && "border-destructive/50 bg-destructive/5",
      className
    )}>
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <h3 className={cn("text-lg font-semibold", danger && "text-destructive")}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1.5">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}