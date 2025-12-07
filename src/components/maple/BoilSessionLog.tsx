import { useState } from "react";
import { Plus, Flame, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DashboardCard } from "../ui/DashboardCard";
import { EmptyState } from "../ui/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface BoilSession {
  id: string;
  date: string;
  sapBoiled: number;
  syrupProduced: number;
  fuelType?: string;
  duration?: number;
  notes?: string;
}

interface BoilSessionLogProps {
  onBack?: () => void;
}

export function BoilSessionLog({ onBack }: BoilSessionLogProps) {
  const [sessions] = useState<BoilSession[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sapBoiled: '',
    syrupProduced: '',
    fuelType: 'wood',
    duration: '',
    notes: '',
  });

  const totalSapBoiled = sessions.reduce((sum, s) => sum + s.sapBoiled, 0);
  const totalSyrupProduced = sessions.reduce((sum, s) => sum + s.syrupProduced, 0);
  const averageRatio = totalSapBoiled > 0 ? totalSapBoiled / totalSyrupProduced : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setShowAddDialog(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      sapBoiled: '',
      syrupProduced: '',
      fuelType: 'wood',
      duration: '',
      notes: '',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Boil Session Log</h1>
          <p className="text-muted-foreground">
            Track your boiling sessions and syrup production
          </p>
        </div>
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Log Boil Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Boil Session Log */}
        <div className="lg:col-span-2">
          <DashboardCard title="Boil History">
            {sessions.length === 0 ? (
              <EmptyState
                icon={Flame}
                title="No boil sessions logged"
                description="Start tracking your boiling sessions to monitor syrup production"
                action={{
                  label: 'Log First Session',
                  onClick: () => setShowAddDialog(true),
                }}
              />
            ) : (
              <div className="space-y-3">
                {sessions
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-primary" />
                          <h3>
                            {new Date(session.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </h3>
                        </div>
                        {session.fuelType && (
                          <Badge variant="outline">{session.fuelType}</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Sap Boiled</p>
                          <p className="font-medium">{session.sapBoiled} gal</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Syrup Produced</p>
                          <p className="font-medium">{session.syrupProduced} gal</p>
                        </div>
                        {session.duration && (
                          <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="font-medium">{session.duration} hours</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">Ratio</p>
                          <p className="font-medium">
                            {(session.sapBoiled / session.syrupProduced).toFixed(1)}:1
                          </p>
                        </div>
                      </div>

                      {session.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Summary Stats */}
        <div className="space-y-6">
          <DashboardCard title="Production Summary">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Sap Boiled</p>
                <p className="text-2xl font-semibold">{totalSapBoiled} gal</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Syrup</p>
                <p className="text-2xl font-semibold">{totalSyrupProduced} gal</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Boil Sessions</p>
                <p className="text-2xl font-semibold">{sessions.length}</p>
              </div>
              {averageRatio > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Ratio</p>
                  <p className="text-2xl font-semibold">
                    {averageRatio.toFixed(1)}:1
                  </p>
                </div>
              )}
            </div>
          </DashboardCard>

          <DashboardCard title="Quick Tips">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                • Typical sap-to-syrup ratio is 40:1
              </p>
              <p>
                • Maintain boil temperature around 219°F
              </p>
              <p>
                • Filter syrup while hot for best clarity
              </p>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Add Boil Session Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Log Boil Session</DialogTitle>
              <DialogDescription>
                Record a new boiling session
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="sapBoiled">Sap Boiled (gallons)</Label>
                <Input
                  id="sapBoiled"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 45"
                  value={formData.sapBoiled}
                  onChange={(e) =>
                    setFormData({ ...formData, sapBoiled: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="syrupProduced">Syrup Produced (gallons)</Label>
                <Input
                  id="syrupProduced"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.1"
                  value={formData.syrupProduced}
                  onChange={(e) =>
                    setFormData({ ...formData, syrupProduced: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="fuelType">Fuel Type (optional)</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fuelType: value })
                  }
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

              <div>
                <Label htmlFor="duration">Duration (hours, optional)</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 6"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any observations or notes..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Log Session</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
