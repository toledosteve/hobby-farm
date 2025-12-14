import { useState } from "react";
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
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface FeedLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flocks?: Array<{ id: string; name: string }>;
  onSave?: (data: FeedLogData) => void;
}

export interface FeedLogData {
  date: string;
  flockId: string;
  amount: number;
  unit: 'lbs' | 'kg';
  feedType: string;
  cost: number;
  notes: string;
}

export function FeedLogModal({ open, onOpenChange, flocks = [], onSave }: FeedLogModalProps) {
  const [formData, setFormData] = useState<FeedLogData>({
    date: new Date().toISOString().split('T')[0],
    flockId: '',
    amount: 0,
    unit: 'lbs',
    feedType: 'layer-pellets',
    cost: 0,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onOpenChange(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      flockId: '',
      amount: 0,
      unit: 'lbs',
      feedType: 'layer-pellets',
      cost: 0,
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Log Feed</DialogTitle>
            <DialogDescription>
              Record feed given to a flock
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
                required
              />
            </div>

            <div>
              <Label htmlFor="flock">Flock</Label>
              <Select
                value={formData.flockId}
                onValueChange={(value) =>
                  setFormData({ ...formData, flockId: value })
                }
                required
              >
                <SelectTrigger id="flock">
                  <SelectValue placeholder="Select a flock" />
                </SelectTrigger>
                <SelectContent>
                  {flocks.map((flock) => (
                    <SelectItem key={flock.id} value={flock.id}>
                      {flock.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g., 25"
                  value={formData.amount || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value: 'lbs' | 'kg') =>
                    setFormData({ ...formData, unit: value })
                  }
                >
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="feedType">Feed Type</Label>
              <Select
                value={formData.feedType}
                onValueChange={(value) =>
                  setFormData({ ...formData, feedType: value })
                }
              >
                <SelectTrigger id="feedType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="layer-pellets">Layer Pellets</SelectItem>
                  <SelectItem value="starter-crumbles">Starter Crumbles</SelectItem>
                  <SelectItem value="grower-feed">Grower Feed</SelectItem>
                  <SelectItem value="scratch-grains">Scratch Grains</SelectItem>
                  <SelectItem value="custom">Custom Mix</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cost">Cost (optional)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 24.99"
                value={formData.cost || ''}
                onChange={(e) =>
                  setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })
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
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
