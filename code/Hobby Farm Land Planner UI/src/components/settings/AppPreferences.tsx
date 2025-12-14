import { useState } from "react";
import { Home, Moon, Globe, Bell, Thermometer, Ruler, Droplet, Weight } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
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
import { Button } from "../ui/button";
import { useTheme } from "../../contexts/ThemeContext";
import { toast } from "sonner@2.0.3";

export function AppPreferences() {
  const { theme, setTheme } = useTheme();
  
  const [preferences, setPreferences] = useState({
    landingPage: 'dashboard',
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    weeklySummary: true,
    temperature: 'fahrenheit',
    distance: 'miles',
    volume: 'gallons',
    weight: 'pounds',
  });

  const handleSave = () => {
    toast.success('Preferences saved successfully');
  };

  return (
    <SettingsSection
      title="App Preferences"
      description="Customize your Hobby Farm Planner experience"
    >
      {/* General Settings */}
      <SettingsCard title="General">
        <div className="space-y-4">
          <div>
            <Label htmlFor="landingPage">Default Landing Page</Label>
            <Select
              value={preferences.landingPage}
              onValueChange={(value) => setPreferences({ ...preferences, landingPage: value })}
            >
              <SelectTrigger id="landingPage">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="map">Map</SelectItem>
                <SelectItem value="calendar">Calendar</SelectItem>
                <SelectItem value="modules">Modules</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dark Mode</Label>
            <RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="font-normal cursor-pointer">
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="font-normal cursor-pointer">
                  Dark
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="auto" />
                <Label htmlFor="auto" className="font-normal cursor-pointer">
                  Auto (System)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => setPreferences({ ...preferences, language: value })}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsCard>

      {/* Notifications */}
      <SettingsCard title="Notifications" description="Control how you receive updates">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications" className="font-normal">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive updates and alerts via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pushNotifications" className="font-normal">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get real-time notifications on your device
              </p>
            </div>
            <Switch
              id="pushNotifications"
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, pushNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weeklySummary" className="font-normal">
                Weekly Farm Summary
              </Label>
              <p className="text-sm text-muted-foreground">
                Get a weekly digest of your farm activity
              </p>
            </div>
            <Switch
              id="weeklySummary"
              checked={preferences.weeklySummary}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, weeklySummary: checked })
              }
            />
          </div>
        </div>
      </SettingsCard>

      {/* Units & Measurements */}
      <SettingsCard 
        title="Units & Measurements" 
        description="Set your preferred measurement units for all modules"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Thermometer className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Label htmlFor="temperature">Temperature</Label>
            </div>
            <Select
              value={preferences.temperature}
              onValueChange={(value) => setPreferences({ ...preferences, temperature: value })}
            >
              <SelectTrigger id="temperature" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <Ruler className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Label htmlFor="distance">Distance</Label>
            </div>
            <Select
              value={preferences.distance}
              onValueChange={(value) => setPreferences({ ...preferences, distance: value })}
            >
              <SelectTrigger id="distance" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="miles">Miles</SelectItem>
                <SelectItem value="kilometers">Kilometers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <Droplet className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Label htmlFor="volume">Volume</Label>
            </div>
            <Select
              value={preferences.volume}
              onValueChange={(value) => setPreferences({ ...preferences, volume: value })}
            >
              <SelectTrigger id="volume" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gallons">Gallons</SelectItem>
                <SelectItem value="liters">Liters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <Weight className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Label htmlFor="weight">Weight</Label>
            </div>
            <Select
              value={preferences.weight}
              onValueChange={(value) => setPreferences({ ...preferences, weight: value })}
            >
              <SelectTrigger id="weight" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pounds">Pounds (lbs)</SelectItem>
                <SelectItem value="kilograms">Kilograms (kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsCard>

      <div className="flex gap-3">
        <Button onClick={handleSave}>Save Preferences</Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </SettingsSection>
  );
}