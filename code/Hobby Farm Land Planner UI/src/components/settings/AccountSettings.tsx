import { useState } from "react";
import { Laptop, Smartphone, Monitor, Shield } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastUsed: string;
  current: boolean;
}

export function AccountSettings() {
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome',
      location: 'Vermont, USA',
      lastUsed: 'Active now',
      current: true,
    },
    {
      id: '2',
      device: 'iPhone 14',
      browser: 'Safari',
      location: 'Vermont, USA',
      lastUsed: '2 hours ago',
      current: false,
    },
  ]);

  const handleUpdatePassword = () => {
    toast.success('Password updated successfully');
  };

  const handleLogoutAll = () => {
    toast.info('Logged out of all other sessions');
  };

  const handleEnable2FA = () => {
    toast.info('Two-factor authentication setup coming soon');
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return Smartphone;
    }
    if (device.toLowerCase().includes('ipad') || device.toLowerCase().includes('tablet')) {
      return Monitor;
    }
    return Laptop;
  };

  return (
    <SettingsSection
      title="Account"
      description="Manage your account security and active sessions"
    >
      {/* Password Management */}
      <SettingsCard title="Password" description="Update your password to keep your account secure">
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleUpdatePassword}>Update Password</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </SettingsCard>

      {/* Active Sessions */}
      <SettingsCard 
        title="Active Sessions" 
        description="Manage devices where you're currently logged in"
      >
        <div className="space-y-3">
          {sessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.device);
            
            return (
              <div
                key={session.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <DeviceIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{session.device}</span>
                    {session.current && (
                      <Badge variant="outline" className="text-xs">Current</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session.browser} · {session.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {session.lastUsed}
                  </p>
                </div>
                {!session.current && (
                  <Button size="sm" variant="ghost">
                    Revoke
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <Button variant="outline" className="w-full mt-4" onClick={handleLogoutAll}>
          Log Out of All Other Sessions
        </Button>
      </SettingsCard>

      {/* Two-Factor Authentication */}
      <SettingsCard 
        title="Two-Factor Authentication" 
        description="Add an extra layer of security to your account"
      >
        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium mb-1">Enhance Your Security</p>
            <p className="text-sm text-muted-foreground">
              Two-factor authentication adds an extra layer of protection to your account
            </p>
          </div>
        </div>
        <Button className="mt-4" onClick={handleEnable2FA}>
          Enable Two-Factor Authentication
        </Button>
      </SettingsCard>
    </SettingsSection>
  );
}
