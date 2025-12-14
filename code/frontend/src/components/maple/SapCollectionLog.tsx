import { useState } from "react";
import { Plus, Droplets, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
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

interface SapCollection {
  id: string;
  date: string;
  source: string;
  volume: number;
  notes?: string;
}

export function SapCollectionLog() {
  const navigate = useNavigate();
  const [collections] = useState<SapCollection[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    source: 'whole-farm',
    volume: '',
    notes: '',
  });

  const groupedCollections = collections.reduce((acc, collection) => {
    const date = collection.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(collection);
    return acc;
  }, {} as Record<string, SapCollection[]>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setShowAddDialog(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      source: 'whole-farm',
      volume: '',
      notes: '',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Sap Collection Log</h1>
          <p className="text-muted-foreground">
            Track daily sap collection volumes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(ROUTES.MAPLE.DASHBOARD)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Log Collection
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Log */}
        <div className="lg:col-span-2">
          <DashboardCard title="Collection History">
            {collections.length === 0 ? (
              <EmptyState
                icon={Droplets}
                title="No collections logged"
                description="Start tracking your sap collections to see trends and totals"
                action={{
                  label: 'Log First Collection',
                  onClick: () => setShowAddDialog(true),
                }}
              />
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedCollections)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([date, items]) => (
                    <div key={date}>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <h3>
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {items.map((collection) => (
                          <div
                            key={collection.id}
                            className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-primary" />
                                <span className="font-medium">
                                  {collection.volume} gallons
                                </span>
                              </div>
                              <Badge variant="outline">{collection.source}</Badge>
                            </div>
                            {collection.notes && (
                              <p className="text-sm text-muted-foreground">
                                {collection.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Summary Stats */}
        <div className="space-y-6">
          <DashboardCard title="Collection Summary">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Collected</p>
                <p className="text-2xl font-semibold">
                  {collections.reduce((sum, c) => sum + c.volume, 0)} gal
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Collections</p>
                <p className="text-2xl font-semibold">{collections.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average per Day</p>
                <p className="text-2xl font-semibold">
                  {collections.length > 0
                    ? (
                        collections.reduce((sum, c) => sum + c.volume, 0) /
                        Object.keys(groupedCollections).length
                      ).toFixed(1)
                    : 0}{' '}
                  gal
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Add Collection Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Log Sap Collection</DialogTitle>
              <DialogDescription>
                Record a new sap collection entry
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
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) =>
                    setFormData({ ...formData, source: value })
                  }
                >
                  <SelectTrigger id="source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whole-farm">Whole Farm</SelectItem>
                    <SelectItem value="east-ridge">East Ridge</SelectItem>
                    <SelectItem value="lower-stand">Lower Stand</SelectItem>
                    <SelectItem value="individual-tree">Individual Tree</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="volume">Volume (gallons)</Label>
                <Input
                  id="volume"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 12.5"
                  value={formData.volume}
                  onChange={(e) =>
                    setFormData({ ...formData, volume: e.target.value })
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
              <Button type="submit">Log Collection</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
