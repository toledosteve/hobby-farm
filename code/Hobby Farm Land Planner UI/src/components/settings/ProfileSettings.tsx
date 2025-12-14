import { useState } from "react";
import { User, Mail, Phone, Globe, Scale } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner@2.0.3";

export function ProfileSettings() {
  const [formData, setFormData] = useState({
    fullName: 'John Farmer',
    email: 'john@hobbyfarmer.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    units: 'us',
  });

  const handleSave = () => {
    toast.success('Profile updated successfully');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires confirmation');
  };

  return (
    <SettingsSection
      title="Profile"
      description="Manage your personal information and preferences"
    >
      {/* Profile Header */}
      <SettingsCard>
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-14 h-14 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{formData.fullName}</h3>
            <p className="text-base text-muted-foreground mb-4">{formData.email}</p>
            <Button variant="outline">
              Change Photo
            </Button>
          </div>
        </div>
      </SettingsCard>

      {/* Personal Information */}
      <SettingsCard title="Personal Information">
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email changes require verification
            </p>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="units">Preferred Units</Label>
            <Select value={formData.units} onValueChange={(value) => setFormData({ ...formData, units: value })}>
              <SelectTrigger id="units">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">US / Imperial</SelectItem>
                <SelectItem value="metric">Metric</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </SettingsCard>

      {/* Danger Zone */}
      <SettingsCard title="Delete Account" danger>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete My Account
        </Button>
      </SettingsCard>
    </SettingsSection>
  );
}