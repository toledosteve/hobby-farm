import { useState, useEffect } from "react";
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
import { Badge } from "../ui/badge";
import { Calculator } from "lucide-react";
import type { BoilSession, BoilMethod } from "./types";

interface LogBoilModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (boil: Omit<BoilSession, 'id' | 'seasonId' | 'createdAt'>) => void;
  editBoil?: BoilSession;
}

export function LogBoilModal({
  open,
  onOpenChange,
  onSave,
  editBoil,
}: LogBoilModalProps) {
  const [formData, setFormData] = useState({
    startTime: editBoil?.startTime || '',
    endTime: editBoil?.endTime || '',
    sapInputGallons: editBoil?.sapInputGallons?.toString() || '',
    syrupOutputGallons: editBoil?.syrupOutputGallons?.toString() || '',
    boilMethod: editBoil?.boilMethod || ('evaporator' as BoilMethod),
    fuelUsed: editBoil?.fuelUsed || '',
    fuelAmount: editBoil?.fuelAmount?.toString() || '',
    notes: editBoil?.notes || '',
  });

  // Calculate sap-to-syrup ratio
  const ratio = formData.sapInputGallons && formData.syrupOutputGallons
    ? (parseFloat(formData.sapInputGallons) / parseFloat(formData.syrupOutputGallons)).toFixed(1)
    : null;

  // Auto-set start time to now if creating new boil
  useEffect(() => {
    if (!editBoil && open && !formData.startTime) {
      const now = new Date();
      const datetime = now.toISOString().slice(0, 16);
      setFormData((prev) => ({ ...prev, startTime: datetime }));
    }
  }, [open, editBoil]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      startTime: formData.startTime,
      endTime: formData.endTime,
      sapInputGallons: parseFloat(formData.sapInputGallons),
      syrupOutputGallons: parseFloat(formData.syrupOutputGallons),
      boilMethod: formData.boilMethod,
      fuelUsed: formData.fuelUsed || undefined,
      fuelAmount: formData.fuelAmount ? parseFloat(formData.fuelAmount) : undefined,
      notes: formData.notes || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      startTime: '',
      endTime: '',
      sapInputGallons: '',
      syrupOutputGallons: '',
      boilMethod: 'evaporator',
      fuelUsed: '',
      fuelAmount: '',
      notes: '',
    });
    onOpenChange(false);
  };

  const boilMethods = [
    { value: 'evaporator', label: 'Evaporator' },
    { value: 'pan', label: 'Flat Pan' },
    { value: 'outdoor-arch', label: 'Outdoor Arch' },
    { value: 'indoor-stove', label: 'Indoor Stove' },
  ];

  const fuelTypes = [
    { value: 'wood', label: 'Wood' },
    { value: 'propane', label: 'Propane' },
    { value: 'natural-gas', label: 'Natural Gas' },
    { value: 'electric', label: 'Electric' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {editBoil ? 'Edit Boil Session' : 'Log Boil Session'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Sap Input and Syrup Output */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sapInput">Sap Input *</Label>
                <div className="flex gap-2">
                  <Input
                    id="sapInput"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="40"
                    value={formData.sapInputGallons}
                    onChange={(e) =>
                      setFormData({ ...formData, sapInputGallons: e.target.value })
                    }
                    required
                    className="flex-1"
                  />
                  <div className="flex items-center px-3 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                    gal
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="syrupOutput">Syrup Output *</Label>
                <div className="flex gap-2">
                  <Input
                    id="syrupOutput"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="1.5"
                    value={formData.syrupOutputGallons}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        syrupOutputGallons: e.target.value,
                      })
                    }
                    required
                    className="flex-1"
                  />
                  <div className="flex items-center px-3 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                    gal
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Ratio */}
            {ratio && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  <Calculator className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Sap-to-syrup ratio:</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {ratio}:1
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Industry average is typically 40:1. Higher ratios indicate lower sugar
                  content in sap.
                </p>
              </div>
            )}

            {/* Boil Method */}
            <div className="space-y-2">
              <Label htmlFor="boilMethod">Boil Method *</Label>
              <Select
                value={formData.boilMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, boilMethod: value as BoilMethod })
                }
              >
                <SelectTrigger id="boilMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {boilMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelUsed">Fuel Type</Label>
                <Select
                  value={formData.fuelUsed}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fuelUsed: value })
                  }
                >
                  <SelectTrigger id="fuelUsed">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel.value} value={fuel.value}>
                        {fuel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelAmount">
                  Fuel Amount{' '}
                  {formData.fuelUsed === 'wood' && '(cords)'}
                  {formData.fuelUsed === 'propane' && '(lbs)'}
                </Label>
                <Input
                  id="fuelAmount"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.5"
                  value={formData.fuelAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, fuelAmount: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Syrup grade, finishing process, any issues or observations..."
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
            <Button
              type="submit"
              disabled={
                !formData.startTime ||
                !formData.endTime ||
                !formData.sapInputGallons ||
                !formData.syrupOutputGallons
              }
            >
              {editBoil ? 'Save Changes' : 'Log Boil'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}