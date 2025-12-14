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
import type { Tap, TapType } from "./types";

interface AddTapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tap: Omit<Tap, 'id' | 'seasonId' | 'isActive'>) => void;
  trees: Array<{ id: string; nickname?: string; species: string }>;
  editTap?: Tap;
}

export function AddTapModal({
  open,
  onOpenChange,
  onSave,
  trees,
  editTap,
}: AddTapModalProps) {
  const [formData, setFormData] = useState({
    treeId: editTap?.treeId || '',
    tapType: editTap?.tapType || ('bucket' as TapType),
    installDate: editTap?.installDate || new Date().toISOString().split('T')[0],
    notes: editTap?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      treeId: formData.treeId,
      tapType: formData.tapType,
      installDate: formData.installDate,
      notes: formData.notes || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      treeId: '',
      tapType: 'bucket',
      installDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    onOpenChange(false);
  };

  const tapTypeOptions = [
    { value: 'bucket', label: 'Bucket' },
    { value: 'spile', label: 'Spile' },
    { value: 'tubing', label: 'Tubing' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{editTap ? 'Edit Tap' : 'Add Tap'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Tree Selection */}
            <div className="space-y-2">
              <Label htmlFor="tree">Tree *</Label>
              <Select
                value={formData.treeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, treeId: value })
                }
              >
                <SelectTrigger id="tree">
                  <SelectValue placeholder="Select a tree" />
                </SelectTrigger>
                <SelectContent>
                  {trees.map((tree) => (
                    <SelectItem key={tree.id} value={tree.id}>
                      {tree.nickname || `${tree.species} - ${tree.id.slice(0, 8)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {trees.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Add trees first before creating taps
                </p>
              )}
            </div>

            {/* Tap Type */}
            <div className="space-y-2">
              <Label htmlFor="tapType">Tap Type *</Label>
              <Select
                value={formData.tapType}
                onValueChange={(value) =>
                  setFormData({ ...formData, tapType: value as TapType })
                }
              >
                <SelectTrigger id="tapType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tapTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Install Date */}
            <div className="space-y-2">
              <Label htmlFor="installDate">Installation Date *</Label>
              <Input
                id="installDate"
                type="date"
                value={formData.installDate}
                onChange={(e) =>
                  setFormData({ ...formData, installDate: e.target.value })
                }
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Position on tree, special considerations..."
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
            <Button type="submit" disabled={!formData.treeId}>
              {editTap ? 'Save Changes' : 'Add Tap'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}