import { useState, useEffect } from "react";
import { Laptop, Smartphone, Monitor, Shield } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { usersApi } from "@/services/api/users";
import { sessionsApi, Session } from "@/services/api/sessions";

export function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [sessions, setSessions] = useState<Session[]>([]);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setSessionsLoading(true);
      const data = await sessionsApi.getSessions();
      setSessions(data);
    } catch (error) {
      toast.error('Failed to load sessions');
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Validation
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await usersApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await sessionsApi.revokeSession(sessionId);
      toast.success('Session revoked successfully');
      await loadSessions();
    } catch (error) {
      toast.error('Failed to revoke session');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await sessionsApi.revokeAllExceptCurrent();
      toast.success('All other sessions logged out successfully');
      await loadSessions();
    } catch (error) {
      toast.error('Failed to log out other sessions');
    }
  };

  const handleEnable2FA = () => {
    toast.info('Two-factor authentication setup coming soon');
  };

  const getDeviceIcon = (deviceName?: string) => {
    if (!deviceName) return Laptop;
    const device = deviceName.toLowerCase();
    if (device.includes('iphone') || device.includes('android')) {
      return Smartphone;
    }
    if (device.includes('ipad') || device.includes('tablet')) {
      return Monitor;
    }
    return Laptop;
  };

  const formatLastActive = (lastActiveAt: string) => {
    const date = new Date(lastActiveAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return 'Active now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <SettingsSection
      title="Account"
      description="Manage your account security and active sessions"
    >
      {/* Password Management */}
      <SettingsCard title="Password" description="Update your password to keep your account secure">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleUpdatePassword} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })}
          >
            Cancel
          </Button>
        </div>
      </SettingsCard>

      {/* Active Sessions */}
      <SettingsCard
        title="Active Sessions"
        description="Manage devices where you're currently logged in"
      >
        {sessionsLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No active sessions found</div>
        ) : (
          <>
            <div className="space-y-3">
              {sessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.deviceName);

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
                        <span className="font-medium">{session.deviceName || 'Unknown Device'}</span>
                        {session.isCurrent && (
                          <Badge variant="outline" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.browser || 'Unknown Browser'} · {session.os || 'Unknown OS'} {session.ipAddress && `· ${session.ipAddress}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatLastActive(session.lastActiveAt)}
                      </p>
                    </div>
                    {!session.isCurrent && (
                      <Button size="sm" variant="ghost" onClick={() => handleRevokeSession(session.id)}>
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
          </>
        )}
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
