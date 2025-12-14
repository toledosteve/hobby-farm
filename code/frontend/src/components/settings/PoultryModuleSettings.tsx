import { useState } from "react";
import { Bird, Egg, Droplet, Heart } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { toast } from "sonner@2.0.3";

export function PoultryModuleSettings() {
  const [settings, setSettings] = useState({
    defaultFlockNaming: 'custom',
    defaultBirdCount: '12',
    showBrokenEggs: true,
    eggUnit: 'count',
    enableFeedLogs: true,
    defaultFeedUnit: 'lbs',
    coopCleaningFrequency: 'weekly',
    miteInspectionReminders: true,
    moltingInsights: true,
  });

  const handleSave = () => {
    toast.success('Poultry module settings saved successfully');
  };

  return (
    <SettingsSection
      title="Poultry Module"
      description="Configure settings for your poultry management"
    >
      {/* Flock Defaults */}
      <SettingsCard title="Flock Defaults" description="Set default values for new flocks">
        <div className="space-y-4">
          <div>
            <Label>Default Flock Naming Pattern</Label>
            <RadioGroup
              value={settings.defaultFlockNaming}
              onValueChange={(value) => setSettings({ ...settings, defaultFlockNaming: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal cursor-pointer">
                  Custom (e.g., &quot;Main Coop&quot;, &quot;Spring Batch&quot;)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tractor" id="tractor" />
                <Label htmlFor="tractor" className="font-normal cursor-pointer">
                  Tractor Pattern (e.g., &quot;Tractor 1&quot;, &quot;Tractor 2&quot;)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="date" />
                <Label htmlFor="date" className="font-normal cursor-pointer">
                  Date-Based (e.g., &quot;March 2025 Flock&quot;)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="defaultBirdCount">Default Bird Count</Label>
            <Input
              id="defaultBirdCount"
              type="number"
              min="1"
              value={settings.defaultBirdCount}
              onChange={(e) => setSettings({ ...settings, defaultBirdCount: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Pre-fill this value when creating new flocks
            </p>
          </div>
        </div>
      </SettingsCard>

      {/* Egg Logging */}
      <SettingsCard title="Egg Logging">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showBrokenEggs" className="font-normal">
                Track Broken/Unusable Eggs
              </Label>
              <p className="text-sm text-muted-foreground">
                Show field for cracked or unusable eggs when logging
              </p>
            </div>
            <Switch
              id="showBrokenEggs"
              checked={settings.showBrokenEggs}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showBrokenEggs: checked })
              }
            />
          </div>

          <div>
            <Label>Egg Display Unit</Label>
            <RadioGroup
              value={settings.eggUnit}
              onValueChange={(value) => setSettings({ ...settings, eggUnit: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="count" id="count" />
                <Label htmlFor="count" className="font-normal cursor-pointer">
                  Count (individual eggs)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dozens" id="dozens" />
                <Label htmlFor="dozens" className="font-normal cursor-pointer">
                  Dozens
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </SettingsCard>

      {/* Feed Tracking */}
      <SettingsCard title="Feed Tracking">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableFeedLogs" className="font-normal">
                Enable Feed Logs
              </Label>
              <p className="text-sm text-muted-foreground">
                Track feed consumption and costs
              </p>
            </div>
            <Switch
              id="enableFeedLogs"
              checked={settings.enableFeedLogs}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enableFeedLogs: checked })
              }
            />
          </div>

          {settings.enableFeedLogs && (
            <div>
              <Label htmlFor="defaultFeedUnit">Default Feed Unit</Label>
              <Select
                value={settings.defaultFeedUnit}
                onValueChange={(value) => setSettings({ ...settings, defaultFeedUnit: value })}
              >
                <SelectTrigger id="defaultFeedUnit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </SettingsCard>

      {/* Health & Husbandry */}
      <SettingsCard title="Health & Husbandry">
        <div className="space-y-4">
          <div>
            <Label htmlFor="coopCleaningFrequency">Coop Cleaning Reminders</Label>
            <Select
              value={settings.coopCleaningFrequency}
              onValueChange={(value) => setSettings({ ...settings, coopCleaningFrequency: value })}
            >
              <SelectTrigger id="coopCleaningFrequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Get automatic reminders to clean and maintain coops
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="miteInspectionReminders" className="font-normal">
                Mite Inspection Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Monthly reminders to check birds for mites
              </p>
            </div>
            <Switch
              id="miteInspectionReminders"
              checked={settings.miteInspectionReminders}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, miteInspectionReminders: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="moltingInsights" className="font-normal">
                Molting Season Insights
              </Label>
              <p className="text-sm text-muted-foreground">
                Get seasonal insights about molting and reduced egg production
              </p>
            </div>
            <Switch
              id="moltingInsights"
              checked={settings.moltingInsights}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, moltingInsights: checked })
              }
            />
          </div>
        </div>
      </SettingsCard>

      <div className="flex gap-3">
        <Button onClick={handleSave}>Save Settings</Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </SettingsSection>
  );
}
