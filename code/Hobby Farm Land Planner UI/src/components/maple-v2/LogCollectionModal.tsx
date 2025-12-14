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
import { Cloud, CloudRain, Sun, Snowflake } from "lucide-react";
import type { SapCollection } from "./types";

interface LogCollectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (collection: Omit<SapCollection, 'id' | 'seasonId' | 'createdAt'>) => void;
  editCollection?: SapCollection;
}

export function LogCollectionModal({
  open,
  onOpenChange,
  onSave,
  editCollection,
}: LogCollectionModalProps) {
  const [formData, setFormData] = useState({
    date: editCollection?.date || new Date().toISOString().split('T')[0],
    time: editCollection?.time || new Date().toTimeString().slice(0, 5),
    volumeGallons: editCollection?.volumeGallons?.toString() || '',
    collectionMethod: editCollection?.collectionMethod || ('bucket' as const),
    temperature: editCollection?.temperature?.toString() || '',
    weatherCondition: editCollection?.weatherCondition || '',
    notes: editCollection?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: formData.date,
      time: formData.time,
      volumeGallons: parseFloat(formData.volumeGallons),
      collectionMethod: formData.collectionMethod,
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
      weatherCondition: formData.weatherCondition || undefined,
      notes: formData.notes || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      volumeGallons: '',
      collectionMethod: 'bucket',
      temperature: '',
      weatherCondition: '',
      notes: '',
    });
    onOpenChange(false);
  };

  const collectionMethods = [
    { value: 'bucket', label: 'Bucket Collection' },
    { value: 'tubing', label: 'Tubing System' },
    { value: 'mixed', label: 'Mixed Methods' },
  ];

  const weatherConditions = [
    { value: 'sunny', label: 'Sunny', icon: Sun },
    { value: 'cloudy', label: 'Cloudy', icon: Cloud },
    { value: 'rainy', label: 'Rainy', icon: CloudRain },
    { value: 'snowy', label: 'Snowy', icon: Snowflake },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {editCollection ? 'Edit Collection Log' : 'Log Sap Collection'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
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
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <Label htmlFor="volume">Sap Volume *</Label>
              <div className="flex gap-2">
                <Input
                  id="volume"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="5.5"
                  value={formData.volumeGallons}
                  onChange={(e) =>
                    setFormData({ ...formData, volumeGallons: e.target.value })
                  }
                  required
                  className="flex-1"
                />
                <div className="flex items-center px-3 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                  gal
                </div>
              </div>
            </div>

            {/* Collection Method */}
            <div className="space-y-2">
              <Label htmlFor="method">Collection Method *</Label>
              <Select
                value={formData.collectionMethod}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, collectionMethod: value })
                }
              >
                <SelectTrigger id="method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {collectionMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Weather Snapshot */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="1"
                  placeholder="42"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({ ...formData, temperature: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weather">Conditions</Label>
                <Select
                  value={formData.weatherCondition}
                  onValueChange={(value) =>
                    setFormData({ ...formData, weatherCondition: value })
                  }
                >
                  <SelectTrigger id="weather">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {weatherConditions.map((condition) => {
                      const Icon = condition.icon;
                      return (
                        <SelectItem key={condition.value} value={condition.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-3 h-3" />
                            {condition.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Sap quality, flow rate, any observations..."
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
            <Button type="submit" disabled={!formData.volumeGallons}>
              {editCollection ? 'Save Changes' : 'Log Collection'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}