import { useState, useEffect, useCallback } from "react";
import { Map, Calendar, Droplets, Bird, Trees, Apple, Sprout, PawPrint } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { LocationPicker } from "./LocationPicker";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { useProjects } from "@/contexts/ProjectContext";

// Module definitions with icons
const MODULE_DEFINITIONS = [
  { id: 'maple', name: 'Maple Sugaring', icon: Droplets },
  { id: 'poultry', name: 'Poultry', icon: Bird },
  { id: 'garden', name: 'Gardening', icon: Sprout },
  { id: 'orchard', name: 'Orchard', icon: Apple },
  { id: 'christmas-trees', name: 'Christmas Trees', icon: Trees },
  { id: 'wildlife', name: 'Wildlife Habitat', icon: PawPrint },
];

interface FarmFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  acres: number;
  latitude?: number;
  longitude?: number;
  defaultMapLayer: string;
}

export function FarmSettings() {
  const { currentProject, updateProject, startNewSeason } = useProjects();
  const [isSaving, setIsSaving] = useState(false);
  const [isStartingSeason, setIsStartingSeason] = useState(false);
  const [showSeasonDialog, setShowSeasonDialog] = useState(false);

  const [farmData, setFarmData] = useState<FarmFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    acres: 0,
    latitude: undefined,
    longitude: undefined,
    defaultMapLayer: 'imagery',
  });

  const [enabledModules, setEnabledModules] = useState<string[]>([]);

  // Initialize form from current project
  useEffect(() => {
    if (currentProject) {
      setFarmData({
        name: currentProject.name || '',
        description: currentProject.description || '',
        address: currentProject.address || '',
        city: currentProject.city || '',
        state: currentProject.state || '',
        zipCode: currentProject.zipCode || '',
        acres: currentProject.acres || 0,
        latitude: currentProject.latitude,
        longitude: currentProject.longitude,
        defaultMapLayer: 'imagery', // UI-only for now
      });
      setEnabledModules(currentProject.enabledModules || []);
    }
  }, [currentProject]);

  // Get current active season
  const currentSeason = currentProject?.seasons?.find(s => s.isActive);

  const handleSave = async () => {
    if (!currentProject) {
      toast.error('No farm selected');
      return;
    }

    setIsSaving(true);
    try {
      await updateProject(currentProject.id, {
        name: farmData.name,
        description: farmData.description,
        address: farmData.address,
        city: farmData.city,
        state: farmData.state,
        zipCode: farmData.zipCode,
        acres: farmData.acres,
        latitude: farmData.latitude,
        longitude: farmData.longitude,
        enabledModules,
      });
      toast.success('Farm settings saved successfully');
    } catch (error) {
      toast.error('Failed to save farm settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle location change from LocationPicker
  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setFarmData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  }, []);

  const handleCancel = () => {
    // Reset form to current project data
    if (currentProject) {
      setFarmData({
        name: currentProject.name || '',
        description: currentProject.description || '',
        address: currentProject.address || '',
        city: currentProject.city || '',
        state: currentProject.state || '',
        zipCode: currentProject.zipCode || '',
        acres: currentProject.acres || 0,
        latitude: currentProject.latitude,
        longitude: currentProject.longitude,
        defaultMapLayer: 'imagery',
      });
      setEnabledModules(currentProject.enabledModules || []);
    }
  };

  const toggleModule = (moduleId: string) => {
    setEnabledModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleStartNewSeason = async () => {
    if (!currentProject) return;

    setIsStartingSeason(true);
    try {
      await startNewSeason(currentProject.id);
      toast.success('New season started successfully');
      setShowSeasonDialog(false);
    } catch (error) {
      toast.error('Failed to start new season');
    } finally {
      setIsStartingSeason(false);
    }
  };

  // Build modules list with enabled state
  const modules = MODULE_DEFINITIONS.map(mod => ({
    ...mod,
    enabled: enabledModules.includes(mod.id),
  }));

  const enabledModulesList = modules.filter(m => m.enabled);
  const disabledModulesList = modules.filter(m => !m.enabled);

  if (!currentProject) {
    return (
      <SettingsSection
        title="Farm Settings"
        description="Configure settings for your current farm"
      >
        <SettingsCard title="No Farm Selected">
          <p className="text-muted-foreground">
            Please select a farm to configure settings.
          </p>
        </SettingsCard>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection
      title="Farm Settings"
      description="Configure settings for your current farm"
    >
      {/* Farm Information */}
      <SettingsCard title="Farm Information">
        <div className="space-y-4">
          <div>
            <Label htmlFor="farmName">Farm Name</Label>
            <Input
              id="farmName"
              value={farmData.name}
              onChange={(e) => setFarmData({ ...farmData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={farmData.description}
              onChange={(e) => setFarmData({ ...farmData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={farmData.address}
              onChange={(e) => setFarmData({ ...farmData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={farmData.city}
                onChange={(e) => setFarmData({ ...farmData, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={farmData.state}
                onChange={(e) => setFarmData({ ...farmData, state: e.target.value })}
                maxLength={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={farmData.zipCode}
                onChange={(e) => setFarmData({ ...farmData, zipCode: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="acres">Acreage</Label>
              <Input
                id="acres"
                type="number"
                value={farmData.acres}
                onChange={(e) => setFarmData({ ...farmData, acres: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Location & Mapping */}
      <SettingsCard title="Location & Mapping">
        <div className="space-y-6">
          {/* Location Picker */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Farm Location</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Look up your address to set the map center, then drag the pin to fine-tune the exact location.
            </p>
            <LocationPicker
              address={farmData.address}
              city={farmData.city}
              state={farmData.state}
              zipCode={farmData.zipCode}
              latitude={farmData.latitude}
              longitude={farmData.longitude}
              onLocationChange={handleLocationChange}
            />
          </div>

          {/* Boundary info */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Map className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Land Boundary</p>
                <p className="text-sm text-muted-foreground">
                  {currentProject?.boundary
                    ? `${currentProject.boundary.acres} acres defined`
                    : 'No boundary set - use the Map tab to draw one'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="mapLayer">Default Map Layer</Label>
            <Select
              value={farmData.defaultMapLayer}
              onValueChange={(value) => setFarmData({ ...farmData, defaultMapLayer: value })}
            >
              <SelectTrigger id="mapLayer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imagery">Satellite Imagery</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
                <SelectItem value="soil">Soil Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsCard>

      {/* Active Modules */}
      <SettingsCard title="Farm Activities & Modules">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Enabled Modules</Label>
              <Badge variant="outline">{enabledModulesList.length} active</Badge>
            </div>
            <div className="space-y-2">
              {enabledModulesList.map((module) => {
                const Icon = module.icon;
                return (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-primary/50 bg-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="font-medium">{module.name}</span>
                    </div>
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={() => toggleModule(module.id)}
                    />
                  </div>
                );
              })}
              {enabledModulesList.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">
                  No modules enabled yet. Enable modules below to get started.
                </p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Available Modules</Label>
            <div className="space-y-2">
              {disabledModulesList.map((module) => {
                const Icon = module.icon;
                return (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span>{module.name}</span>
                    </div>
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={() => toggleModule(module.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Season Management */}
      <SettingsCard title="Season Management">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Current Season</p>
                <p className="text-sm text-muted-foreground">
                  {currentSeason ? currentSeason.name : 'No active season'}
                </p>
              </div>
            </div>
            {currentSeason && <Badge>Active</Badge>}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowSeasonDialog(true)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Start New Season
          </Button>

          <p className="text-xs text-muted-foreground">
            Starting a new season will archive current season data and create fresh logs for the new year
          </p>
        </div>
      </SettingsCard>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>

      {/* Start New Season Confirmation Dialog */}
      <AlertDialog open={showSeasonDialog} onOpenChange={setShowSeasonDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start New Season?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive the current season's data and create a new season for {new Date().getFullYear()}.
              All existing logs will be preserved but associated with the previous season.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isStartingSeason}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartNewSeason} disabled={isStartingSeason}>
              {isStartingSeason ? 'Starting...' : 'Start New Season'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsSection>
  );
}
