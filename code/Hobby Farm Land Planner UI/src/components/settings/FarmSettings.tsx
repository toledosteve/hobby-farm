import { useState } from "react";
import { MapPin, Map, Calendar, Droplets, Bird, Trees, Apple, Sprout, PawPrint } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
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
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";

interface Module {
  id: string;
  name: string;
  icon: React.ElementType;
  enabled: boolean;
}

export function FarmSettings() {
  const [farmData, setFarmData] = useState({
    name: 'Livingston Farm',
    description: 'A small hobby farm in Vermont focused on maple syrup production and sustainable poultry',
    address: '123 Maple Lane',
    city: 'Stowe',
    state: 'VT',
    zipCode: '05672',
    acres: 25,
    defaultMapLayer: 'imagery',
    currentSeason: '2025',
  });

  const [modules, setModules] = useState<Module[]>([
    { id: 'maple-sugaring', name: 'Maple Sugaring', icon: Droplets, enabled: true },
    { id: 'poultry', name: 'Poultry', icon: Bird, enabled: true },
    { id: 'gardening', name: 'Gardening', icon: Sprout, enabled: false },
    { id: 'orchard', name: 'Orchard', icon: Apple, enabled: false },
    { id: 'christmas-trees', name: 'Christmas Trees', icon: Trees, enabled: false },
    { id: 'wildlife', name: 'Wildlife Habitat', icon: PawPrint, enabled: false },
  ]);

  const handleSave = () => {
    toast.success('Farm settings saved successfully');
  };

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const handleStartNewSeason = () => {
    toast.info('Start new season dialog would open');
  };

  const enabledModules = modules.filter(m => m.enabled);
  const disabledModules = modules.filter(m => !m.enabled);

  return (
    <SettingsSection
      title="Farm Settings"
      description="Configure settings for your current farm project"
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

      {/* Boundary & Mapping */}
      <SettingsCard title="Boundary & Mapping">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Map className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Land Boundary</p>
                <p className="text-sm text-muted-foreground">
                  {farmData.acres} acres defined
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit Boundary
            </Button>
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
              <Badge variant="outline">{enabledModules.length} active</Badge>
            </div>
            <div className="space-y-2">
              {enabledModules.map((module) => {
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
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Available Modules</Label>
            <div className="space-y-2">
              {disabledModules.map((module) => {
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
                  {farmData.currentSeason} growing season
                </p>
              </div>
            </div>
            <Badge>Active</Badge>
          </div>

          <Button variant="outline" className="w-full" onClick={handleStartNewSeason}>
            <Calendar className="w-4 h-4 mr-2" />
            Start New Season
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Starting a new season will archive current season data and create fresh logs for the new year
          </p>
        </div>
      </SettingsCard>

      <div className="flex gap-3">
        <Button onClick={handleSave}>Save Changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </SettingsSection>
  );
}
