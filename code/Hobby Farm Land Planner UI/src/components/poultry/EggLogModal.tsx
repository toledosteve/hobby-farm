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

interface EggLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flocks?: Array<{ id: string; name: string }>;
  onSave?: (data: EggLogData) => void;
}

export interface EggLogData {
  date: string;
  flockId: string;
  eggCount: number;
  crackedCount: number;
  notes: string;
}

export function EggLogModal({ open, onOpenChange, flocks = [], onSave }: EggLogModalProps) {
  const [formData, setFormData] = useState<EggLogData>({
    date: new Date().toISOString().split('T')[0],
    flockId: '',
    eggCount: 0,
    crackedCount: 0,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onOpenChange(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      flockId: '',
      eggCount: 0,
      crackedCount: 0,
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Log Egg Collection</DialogTitle>
            <DialogDescription>
              Record today&apos;s egg collection for a flock
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

            <div>
              <Label htmlFor="eggCount">Eggs Collected</Label>
              <Input
                id="eggCount"
                type="number"
                min="0"
                placeholder="e.g., 12"
                value={formData.eggCount || ''}
                onChange={(e) =>
                  setFormData({ ...formData, eggCount: parseInt(e.target.value) || 0 })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="crackedCount">Cracked / Unusable (optional)</Label>
              <Input
                id="crackedCount"
                type="number"
                min="0"
                placeholder="e.g., 1"
                value={formData.crackedCount || ''}
                onChange={(e) =>
                  setFormData({ ...formData, crackedCount: parseInt(e.target.value) || 0 })
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
