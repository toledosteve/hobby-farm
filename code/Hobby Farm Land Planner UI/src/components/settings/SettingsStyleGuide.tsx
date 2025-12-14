/**
 * Settings & Profile Style Guide
 * 
 * This component demonstrates the design system used throughout the Settings area.
 * It serves as a reference for colors, typography, component patterns, and layouts.
 */

import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Settings, Droplet, Bird, Home, Egg } from "lucide-react";

export function SettingsStyleGuide() {
  return (
    <SettingsSection
      title="Settings Style Guide"
      description="Design system reference for the Hobby Farm Planner settings area"
    >
      {/* Color Palette */}
      <SettingsCard title="Color Palette" description="Nature-inspired color system">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="h-16 rounded-lg bg-primary mb-2" />
            <p className="text-sm font-medium">Primary</p>
            <p className="text-xs text-muted-foreground">#2D5F3F (Forest Green)</p>
          </div>
          <div>
            <div className="h-16 rounded-lg bg-muted mb-2" />
            <p className="text-sm font-medium">Muted</p>
            <p className="text-xs text-muted-foreground">Soft neutral backgrounds</p>
          </div>
          <div>
            <div className="h-16 rounded-lg bg-card border border-border mb-2" />
            <p className="text-sm font-medium">Card</p>
            <p className="text-xs text-muted-foreground">White/cream surfaces</p>
          </div>
          <div>
            <div className="h-16 rounded-lg bg-destructive mb-2" />
            <p className="text-sm font-medium">Destructive</p>
            <p className="text-xs text-muted-foreground">Warning/danger states</p>
          </div>
        </div>
      </SettingsCard>

      {/* Typography */}
      <SettingsCard title="Typography Scale">
        <div className="space-y-4">
          <div>
            <h1 className="mb-1">Heading 1 - Page Title</h1>
            <p className="text-xs text-muted-foreground font-mono">
              font-size: 2.25rem (36px) · font-weight: 600
            </p>
          </div>
          <div>
            <h2 className="mb-1">Heading 2 - Section Title</h2>
            <p className="text-xs text-muted-foreground font-mono">
              font-size: 1.875rem (30px) · font-weight: 600
            </p>
          </div>
          <div>
            <h3 className="mb-1">Heading 3 - Card Title</h3>
            <p className="text-xs text-muted-foreground font-mono">
              font-size: 1.25rem (20px) · font-weight: 600
            </p>
          </div>
          <div>
            <p className="mb-1">Body Text - Regular paragraph content</p>
            <p className="text-xs text-muted-foreground font-mono">
              font-size: 1rem (16px) · font-weight: 400
            </p>
          </div>
          <div>
            <p className="text-sm mb-1">Small Text - Secondary information</p>
            <p className="text-xs text-muted-foreground font-mono">
              font-size: 0.875rem (14px) · font-weight: 400
            </p>
          </div>
          <div>
            <p className="text-xs mb-1">Extra Small - Captions and hints</p>
            <p className="text-xs text-muted-foreground font-mono">
              font-size: 0.75rem (12px) · font-weight: 400
            </p>
          </div>
        </div>
      </SettingsCard>

      {/* Button Styles */}
      <SettingsCard title="Button Variants">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>Primary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </SettingsCard>

      {/* Badges */}
      <SettingsCard title="Badge Styles">
        <div className="flex flex-wrap gap-3">
          <Badge>Default Badge</Badge>
          <Badge variant="outline">Outline Badge</Badge>
          <Badge variant="secondary">Secondary Badge</Badge>
          <Badge variant="destructive">Destructive Badge</Badge>
        </div>
      </SettingsCard>

      {/* Module Icons */}
      <SettingsCard title="Module Iconography">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-2">
              <Droplet className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Maple Sugaring</p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-2">
              <Bird className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Poultry</p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-2">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Farm Settings</p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-2">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">General</p>
          </div>
        </div>
      </SettingsCard>

      {/* Card Patterns */}
      <SettingsCard title="Common Card Patterns">
        <div className="space-y-4">
          {/* Info Card */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Egg className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Info Card Pattern</p>
                <p className="text-sm text-muted-foreground">
                  Used for highlighting important information or features
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Card */}
          <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Interactive Card Pattern</p>
                <p className="text-sm text-muted-foreground">
                  Hover effect for clickable items
                </p>
              </div>
              <Button size="sm" variant="ghost">
                Action
              </Button>
            </div>
          </div>

          {/* Danger Card */}
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
            <p className="font-medium text-destructive mb-1">Danger Zone Pattern</p>
            <p className="text-sm text-muted-foreground">
              Used for destructive actions like account deletion
            </p>
          </div>
        </div>
      </SettingsCard>

      {/* Spacing System */}
      <SettingsCard title="Spacing System">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-20 text-xs text-muted-foreground">Gap 2 (8px)</div>
            <div className="flex-1 flex gap-2">
              <div className="h-8 w-20 bg-primary/20 rounded" />
              <div className="h-8 w-20 bg-primary/20 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 text-xs text-muted-foreground">Gap 3 (12px)</div>
            <div className="flex-1 flex gap-3">
              <div className="h-8 w-20 bg-primary/20 rounded" />
              <div className="h-8 w-20 bg-primary/20 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 text-xs text-muted-foreground">Gap 4 (16px)</div>
            <div className="flex-1 flex gap-4">
              <div className="h-8 w-20 bg-primary/20 rounded" />
              <div className="h-8 w-20 bg-primary/20 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 text-xs text-muted-foreground">Gap 6 (24px)</div>
            <div className="flex-1 flex gap-6">
              <div className="h-8 w-20 bg-primary/20 rounded" />
              <div className="h-8 w-20 bg-primary/20 rounded" />
            </div>
          </div>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}
