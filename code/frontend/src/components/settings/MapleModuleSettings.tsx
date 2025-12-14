import { useState } from "react";
import { Calendar, Droplet, Flame, Bell } from "lucide-react";
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

export function MapleModuleSettings() {
  const [settings, setSettings] = useState({
    seasonStart: '02-15',
    seasonEnd: '04-15',
    sapUnit: 'gallons',
    defaultSweetness: '2',
    collectionMethod: 'tubing',
    boilOffRate: '8',
    fuelType: 'wood',
    trackFuelConsumption: true,
    flowcastAlerts: true,
    freezeThawAlerts: true,
  });

  const handleSave = () => {
    toast.success('Maple Sugaring settings saved successfully');
  };

  return (
    <SettingsSection
      title="Maple Sugaring Module"
      description="Configure settings for your maple syrup production"
    >
      {/* Season Settings */}
      <SettingsCard title="Season Settings" description="Set default dates for your tapping season">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seasonStart">Season Start (Month-Day)</Label>
              <Input
                id="seasonStart"
                placeholder="MM-DD"
                value={settings.seasonStart}
                onChange={(e) => setSettings({ ...settings, seasonStart: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Typical: February 15
              </p>
            </div>
            <div>
              <Label htmlFor="seasonEnd">Season End (Month-Day)</Label>
              <Input
                id="seasonEnd"
                placeholder="MM-DD"
                value={settings.seasonEnd}
                onChange={(e) => setSettings({ ...settings, seasonEnd: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Typical: April 15
              </p>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Collection Settings */}
      <SettingsCard title="Collection Settings">
        <div className="space-y-4">
          <div>
            <Label htmlFor="sapUnit">Sap Volume Unit</Label>
            <Select
              value={settings.sapUnit}
              onValueChange={(value) => setSettings({ ...settings, sapUnit: value })}
            >
              <SelectTrigger id="sapUnit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gallons">Gallons</SelectItem>
                <SelectItem value="liters">Liters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="defaultSweetness">Default Sap Sweetness (Brix)</Label>
            <Select
              value={settings.defaultSweetness}
              onValueChange={(value) => setSettings({ ...settings, defaultSweetness: value })}
            >
              <SelectTrigger id="defaultSweetness">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.5">1.5% (Low)</SelectItem>
                <SelectItem value="2">2% (Average)</SelectItem>
                <SelectItem value="2.5">2.5% (Good)</SelectItem>
                <SelectItem value="3">3% (Excellent)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Collection Method</Label>
            <RadioGroup
              value={settings.collectionMethod}
              onValueChange={(value) => setSettings({ ...settings, collectionMethod: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tubing" id="tubing" />
                <Label htmlFor="tubing" className="font-normal cursor-pointer">
                  Tubing System
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bucket" id="bucket" />
                <Label htmlFor="bucket" className="font-normal cursor-pointer">
                  Buckets
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed" className="font-normal cursor-pointer">
                  Mixed (Tubing & Buckets)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </SettingsCard>

      {/* Boil Settings */}
      <SettingsCard title="Boil Settings">
        <div className="space-y-4">
          <div>
            <Label htmlFor="boilOffRate">Boil-Off Rate (gallons/hour)</Label>
            <Input
              id="boilOffRate"
              type="number"
              step="0.5"
              value={settings.boilOffRate}
              onChange={(e) => setSettings({ ...settings, boilOffRate: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              How many gallons of sap your evaporator processes per hour
            </p>
          </div>

          <div>
            <Label htmlFor="fuelType">Primary Fuel Type</Label>
            <Select
              value={settings.fuelType}
              onValueChange={(value) => setSettings({ ...settings, fuelType: value })}
            >
              <SelectTrigger id="fuelType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wood">Wood</SelectItem>
                <SelectItem value="propane">Propane</SelectItem>
                <SelectItem value="oil">Oil</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="trackFuelConsumption" className="font-normal">
                Track Fuel Consumption
              </Label>
              <p className="text-sm text-muted-foreground">
                Log fuel usage during boil sessions
              </p>
            </div>
            <Switch
              id="trackFuelConsumption"
              checked={settings.trackFuelConsumption}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, trackFuelConsumption: checked })
              }
            />
          </div>
        </div>
      </SettingsCard>

      {/* Notifications & Alerts */}
      <SettingsCard title="Notifications & Alerts">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="flowcastAlerts" className="font-normal">
                Sap Flow Forecast Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when conditions are ideal for sap collection
              </p>
            </div>
            <Switch
              id="flowcastAlerts"
              checked={settings.flowcastAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, flowcastAlerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="freezeThawAlerts" className="font-normal">
                Freeze/Thaw Cycle Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Alerts when overnight freeze and daytime thaw is predicted
              </p>
            </div>
            <Switch
              id="freezeThawAlerts"
              checked={settings.freezeThawAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, freezeThawAlerts: checked })
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
