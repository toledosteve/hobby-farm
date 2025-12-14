import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowLeft, Bell, Mail, Smartphone } from "lucide-react";
import type { NotificationPreferences } from "./types";

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
  onBack: () => void;
}

export function NotificationSettings({
  preferences: initialPreferences,
  onSave,
  onBack,
}: NotificationSettingsProps) {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(initialPreferences);

  const handleSave = () => {
    onSave(preferences);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="mb-1">Notification Settings</h1>
          <p className="text-sm text-muted-foreground">
            Control how and when you receive alerts from your farm
          </p>
        </div>
      </div>

      {/* Global Toggle */}
      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <Label htmlFor="global-enabled" className="text-base font-semibold">
                Enable Notifications
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Master switch for all farm notifications
            </p>
          </div>
          <Switch
            id="global-enabled"
            checked={preferences.enabled}
            onCheckedChange={(checked) =>
              setPreferences({ ...preferences, enabled: checked })
            }
          />
        </div>
      </div>

      {/* Category Toggles */}
      <div className="space-y-4">
        <h3 className="font-semibold">Alert Categories</h3>
        <p className="text-sm text-muted-foreground">
          Choose which types of alerts you'd like to receive
        </p>

        <div className="space-y-3">
          {/* Weather Alerts */}
          <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-1">
              <Label htmlFor="category-weather" className="font-medium">
                🌦 Weather Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Frost warnings, heat stress, precipitation alerts
              </p>
            </div>
            <Switch
              id="category-weather"
              checked={preferences.categories.weather}
              disabled={!preferences.enabled}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  categories: { ...preferences.categories, weather: checked },
                })
              }
            />
          </div>

          {/* Task Alerts */}
          <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-1">
              <Label htmlFor="category-task" className="font-medium">
                ⏰ Task Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Overdue inspections, pruning windows, harvest timing
              </p>
            </div>
            <Switch
              id="category-task"
              checked={preferences.categories.task}
              disabled={!preferences.enabled}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  categories: { ...preferences.categories, task: checked },
                })
              }
            />
          </div>

          {/* Health Alerts */}
          <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-1">
              <Label htmlFor="category-health" className="font-medium">
                🦠 Health Notices
              </Label>
              <p className="text-sm text-muted-foreground">
                Medication withdrawals, disease risk, health checks
              </p>
            </div>
            <Switch
              id="category-health"
              checked={preferences.categories.health}
              disabled={!preferences.enabled}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  categories: { ...preferences.categories, health: checked },
                })
              }
            />
          </div>

          {/* Opportunity Alerts */}
          <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-1">
              <Label htmlFor="category-opportunity" className="font-medium">
                🌱 Opportunities
              </Label>
              <p className="text-sm text-muted-foreground">
                Ideal sap flow, planting windows, bloom timing
              </p>
            </div>
            <Switch
              id="category-opportunity"
              checked={preferences.categories.opportunity}
              disabled={!preferences.enabled}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  categories: {
                    ...preferences.categories,
                    opportunity: checked,
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Delivery Method */}
      <div className="space-y-4">
        <h3 className="font-semibold">Delivery Method</h3>
        <p className="text-sm text-muted-foreground">
          Choose how you'd like to receive notifications
        </p>

        <div className="p-4 rounded-lg border bg-card space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delivery-method">Notification Method</Label>
            <Select
              value={preferences.deliveryMethod}
              disabled={!preferences.enabled}
              onValueChange={(value: any) =>
                setPreferences({ ...preferences, deliveryMethod: value })
              }
            >
              <SelectTrigger id="delivery-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-app">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>In-app only</span>
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Email only</span>
                  </div>
                </SelectItem>
                <SelectItem value="both">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <Mail className="w-4 h-4 ml-1" />
                    <span>In-app + Email</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(preferences.deliveryMethod === "email" ||
            preferences.deliveryMethod === "both") && (
            <div className="space-y-2">
              <Label htmlFor="email-frequency">Email Summary Frequency</Label>
              <Select
                value={preferences.emailSummaryFrequency || "daily"}
                disabled={!preferences.enabled}
                onValueChange={(value: any) =>
                  setPreferences({
                    ...preferences,
                    emailSummaryFrequency: value,
                  })
                }
              >
                <SelectTrigger id="email-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily summary</SelectItem>
                  <SelectItem value="weekly">Weekly summary</SelectItem>
                  <SelectItem value="none">Individual emails only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-muted/50 border">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Notifications are designed to be helpful
          reminders, not urgent alarms. You can always adjust these settings or
          snooze individual alerts as needed.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={handleSave} className="flex-1">
          Save Preferences
        </Button>
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
