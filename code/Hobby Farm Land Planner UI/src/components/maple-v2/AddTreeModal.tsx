import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { MapleTree, TreeSpecies, TreeHealth } from "./types";

interface AddTreeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tree: Omit<MapleTree, 'id' | 'seasonId' | 'createdAt' | 'updatedAt'>) => void;
  editTree?: MapleTree;
}

export function AddTreeModal({
  open,
  onOpenChange,
  onSave,
  editTree,
}: AddTreeModalProps) {
  const [formData, setFormData] = useState({
    nickname: editTree?.nickname || '',
    species: editTree?.species || ('sugar-maple' as TreeSpecies),
    diameter: editTree?.diameter?.toString() || '',
    health: editTree?.health || ('healthy' as TreeHealth),
    notes: editTree?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nickname: formData.nickname || undefined,
      species: formData.species,
      diameter: parseFloat(formData.diameter),
      health: formData.health,
      notes: formData.notes || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      nickname: '',
      species: 'sugar-maple',
      diameter: '',
      health: 'healthy',
      notes: '',
    });
    onOpenChange(false);
  };

  const speciesOptions = [
    { value: 'sugar-maple', label: 'Sugar Maple' },
    { value: 'red-maple', label: 'Red Maple' },
    { value: 'silver-maple', label: 'Silver Maple' },
    { value: 'black-maple', label: 'Black Maple' },
  ];

  const healthOptions = [
    { value: 'healthy', label: 'Healthy' },
    { value: 'stressed', label: 'Stressed' },
    { value: 'declining', label: 'Declining' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{editTree ? 'Edit Tree' : 'Add Tree'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Nickname */}
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname (Optional)</Label>
              <Input
                id="nickname"
                placeholder="e.g., Big Sugar, Front Yard Maple"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
              />
            </div>

            {/* Species */}
            <div className="space-y-2">
              <Label htmlFor="species">Species *</Label>
              <Select
                value={formData.species}
                onValueChange={(value) =>
                  setFormData({ ...formData, species: value as TreeSpecies })
                }
              >
                <SelectTrigger id="species">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {speciesOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Diameter */}
            <div className="space-y-2">
              <Label htmlFor="diameter">Diameter at Breast Height (DBH) *</Label>
              <div className="flex gap-2">
                <Input
                  id="diameter"
                  type="number"
                  step="0.1"
                  min="10"
                  placeholder="12"
                  value={formData.diameter}
                  onChange={(e) =>
                    setFormData({ ...formData, diameter: e.target.value })
                  }
                  required
                  className="flex-1"
                />
                <div className="flex items-center px-3 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                  inches
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Measure circumference at 4.5 feet above ground, then divide by π (3.14)
              </p>
            </div>

            {/* Health */}
            <div className="space-y-2">
              <Label htmlFor="health">Tree Health</Label>
              <Select
                value={formData.health}
                onValueChange={(value) =>
                  setFormData({ ...formData, health: value as TreeHealth })
                }
              >
                <SelectTrigger id="health">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {healthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Location, special characteristics, or other observations..."
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.diameter || !formData.species}>
              {editTree ? 'Save Changes' : 'Add Tree'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}