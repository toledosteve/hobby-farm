import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import type { Hive, HiveType, ColonyStatus, QueenStatus } from "./types";

interface AddHiveModalV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (hive: Omit<Hive, "id" | "createdAt" | "updatedAt">) => void;
}

export function AddHiveModalV2({
  open,
  onOpenChange,
  onSave,
}: AddHiveModalV2Props) {
  const [formData, setFormData] = useState({
    name: "",
    type: "langstroth" as HiveType,
    location: "",
    apiaryName: "",
    installDate: new Date().toISOString().split("T")[0],
    colonyStatus: "unknown" as ColonyStatus,
    queenStatus: "unknown" as QueenStatus,
    queenMarked: false,
    queenColor: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hive: Omit<Hive, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      type: formData.type,
      location: formData.location || undefined,
      apiaryName: formData.apiaryName || undefined,
      installDate: formData.installDate,
      colonyStatus: formData.colonyStatus,
      queenStatus: formData.queenStatus || undefined,
      queenMarked: formData.queenMarked,
      queenColor: formData.queenMarked ? formData.queenColor : undefined,
      notes: formData.notes || undefined,
    };

    onSave(hive);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      type: "langstroth",
      location: "",
      apiaryName: "",
      installDate: new Date().toISOString().split("T")[0],
      colonyStatus: "unknown",
      queenStatus: "unknown",
      queenMarked: false,
      queenColor: "",
      notes: "",
    });
    onOpenChange(false);
  };

  // Queen marking colors by year (last digit)
  const queenColors = [
    { value: "White", year: "Years ending in 1 or 6" },
    { value: "Yellow", year: "Years ending in 2 or 7" },
    { value: "Red", year: "Years ending in 3 or 8" },
    { value: "Green", year: "Years ending in 4 or 9" },
    { value: "Blue", year: "Years ending in 5 or 0" },
  ];

  const currentYear = new Date().getFullYear();
  const lastDigit = currentYear % 10;
  const recommendedColor =
    lastDigit === 1 || lastDigit === 6
      ? "White"
      : lastDigit === 2 || lastDigit === 7
      ? "Yellow"
      : lastDigit === 3 || lastDigit === 8
      ? "Red"
      : lastDigit === 4 || lastDigit === 9
      ? "Green"
      : "Blue";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Hive</DialogTitle>
          <DialogDescription>
            Create a new hive to track inspections, health, and honey production.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hive Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Hive Name or ID *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Hive 1A, Blue Hive, North-01"
              required
            />
          </div>

          {/* Hive Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Hive Type *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "langstroth" as const, label: "Langstroth" },
                { value: "top-bar" as const, label: "Top Bar" },
                { value: "warre" as const, label: "Warré" },
                { value: "other" as const, label: "Other" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.type === type.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold text-sm">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location & Apiary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., South Apiary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiaryName">Apiary Name</Label>
              <Input
                id="apiaryName"
                value={formData.apiaryName}
                onChange={(e) =>
                  setFormData({ ...formData, apiaryName: e.target.value })
                }
                placeholder="e.g., Main Yard"
              />
            </div>
          </div>

          {/* Install Date */}
          <div className="space-y-2">
            <Label htmlFor="installDate">Install Date *</Label>
            <Input
              id="installDate"
              type="date"
              value={formData.installDate}
              onChange={(e) =>
                setFormData({ ...formData, installDate: e.target.value })
              }
              required
            />
            <p className="text-xs text-muted-foreground">
              When was this colony installed or established?
            </p>
          </div>

          {/* Colony Status */}
          <div className="space-y-2">
            <Label htmlFor="colonyStatus">Initial Colony Status</Label>
            <select
              id="colonyStatus"
              value={formData.colonyStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  colonyStatus: e.target.value as ColonyStatus,
                })
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="unknown">Unknown</option>
              <option value="strong">Strong</option>
              <option value="moderate">Moderate</option>
              <option value="weak">Weak</option>
            </select>
          </div>

          {/* Queen Information */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold">Queen Information (Optional)</h4>

            <div className="space-y-2">
              <Label htmlFor="queenStatus">Queen Status</Label>
              <select
                id="queenStatus"
                value={formData.queenStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    queenStatus: e.target.value as QueenStatus,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="unknown">Unknown</option>
                <option value="sighted">Sighted</option>
                <option value="not-sighted">Not Sighted</option>
                <option value="missing">Missing</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="queenMarked"
                checked={formData.queenMarked}
                onChange={(e) =>
                  setFormData({ ...formData, queenMarked: e.target.checked })
                }
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="queenMarked" className="cursor-pointer">
                Queen is marked
              </Label>
            </div>

            {formData.queenMarked && (
              <div className="space-y-2">
                <Label htmlFor="queenColor">Marking Color</Label>
                <select
                  id="queenColor"
                  value={formData.queenColor}
                  onChange={(e) =>
                    setFormData({ ...formData, queenColor: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">Select color...</option>
                  {queenColors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.value} ({color.year})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Recommended for {currentYear}: {recommendedColor}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any additional notes about this hive..."
              rows={3}
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name}>
              Add Hive
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
