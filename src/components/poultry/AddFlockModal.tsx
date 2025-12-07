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

interface AddFlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: FlockData) => void;
}

export interface FlockData {
  name: string;
  birdCount: number;
  breed: string;
  startDate: string;
  notes: string;
}

export function AddFlockModal({ open, onOpenChange, onSave }: AddFlockModalProps) {
  const [formData, setFormData] = useState<FlockData>({
    name: '',
    birdCount: 0,
    breed: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onOpenChange(false);
    setFormData({
      name: '',
      birdCount: 0,
      breed: '',
      startDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const popularBreeds = [
    'Rhode Island Red',
    'Leghorn',
    'Plymouth Rock',
    'Wyandotte',
    'Orpington',
    'Sussex',
    'Australorp',
    'Brahma',
    'Silkie',
    'Mixed/Other',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Flock</DialogTitle>
            <DialogDescription>
              Create a new flock to start tracking egg production
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Flock Name</Label>
              <Input
                id="name"
                placeholder="e.g., Main Coop, Tractor 1"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="birdCount">Number of Birds</Label>
              <Input
                id="birdCount"
                type="number"
                min="1"
                placeholder="e.g., 12"
                value={formData.birdCount || ''}
                onChange={(e) =>
                  setFormData({ ...formData, birdCount: parseInt(e.target.value) || 0 })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="breed">Breed</Label>
              <Select
                value={formData.breed}
                onValueChange={(value) =>
                  setFormData({ ...formData, breed: value })
                }
                required
              >
                <SelectTrigger id="breed">
                  <SelectValue placeholder="Select a breed" />
                </SelectTrigger>
                <SelectContent>
                  {popularBreeds.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this flock..."
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
            <Button type="submit">Add Flock</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
