import { useState, useEffect } from "react";
import { Home, Moon, Globe, Bell, Thermometer, Ruler, Droplet, Weight } from "lucide-react";
import { useTheme } from "@/contexts";
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
import { toast } from "sonner";
import { preferencesApi } from "@/services/api/preferences";

export function AppPreferences() {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    landingPage: 'dashboard',
    darkMode: theme,
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    weeklySummary: true,
    temperature: 'fahrenheit',
    distance: 'miles',
    volume: 'gallons',
    weight: 'pounds',
  });

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  // Sync theme changes with preferences
  useEffect(() => {
    setPreferences(prev => ({ ...prev, darkMode: theme }));
  }, [theme]);

  const loadPreferences = async () => {
    try {
      const userPrefs = await preferencesApi.getPreferences();
      setPreferences(prev => ({
        ...prev,
        ...userPrefs,
      }));
      // Sync theme from loaded preferences
      if (userPrefs.darkMode) {
        setTheme(userPrefs.darkMode as 'light' | 'dark');
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      toast.error('Failed to load preferences');
    }
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark');
    setPreferences(prev => ({ ...prev, darkMode: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await preferencesApi.updatePreferences(preferences);
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const defaults = {
        landingPage: 'dashboard',
        darkMode: 'light',
        language: 'en',
        emailNotifications: true,
        pushNotifications: false,
        weeklySummary: true,
        temperature: 'fahrenheit',
        distance: 'miles',
        volume: 'gallons',
        weight: 'pounds',
      };
      await preferencesApi.updatePreferences(defaults);
      setPreferences(defaults);
      setTheme('light');
      toast.success('Preferences reset to defaults');
    } catch (error) {
      toast.error('Failed to reset preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsSection
      title="App Preferences"
      description="Customize your Hobby Farm Planner experience"
    >
      {/* General Settings */}
      <SettingsCard title="General">
        <div className="space-y-4">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label>Appearance</Label>
            <RadioGroup
              value={preferences.darkMode}
              onValueChange={handleThemeChange}
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
            </RadioGroup>
          </div>

          <div className="space-y-2">
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
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Reset to Defaults
        </Button>
      </div>
    </SettingsSection>
  );
}
