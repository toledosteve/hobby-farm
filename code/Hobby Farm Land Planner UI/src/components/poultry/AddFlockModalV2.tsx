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
import { X } from "lucide-react";
import type { Flock, FlockType, BirdBreed, FlockStatus } from "./types";

interface AddFlockModalV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (flock: Omit<Flock, "id" | "createdAt" | "updatedAt">) => void;
}

export function AddFlockModalV2({
  open,
  onOpenChange,
  onSave,
}: AddFlockModalV2Props) {
  const [formData, setFormData] = useState({
    name: "",
    type: "layers" as FlockType,
    breeds: [] as BirdBreed[],
    birdCount: "",
    hatchDate: "",
    acquiredDate: new Date().toISOString().split("T")[0],
    housingLocation: "",
    status: "active" as FlockStatus,
    notes: "",
  });

  const [selectedBreeds, setSelectedBreeds] = useState<BirdBreed[]>([]);

  const breedOptions: { value: BirdBreed; label: string; type: FlockType }[] = [
    // Layer breeds
    { value: "rhode-island-red", label: "Rhode Island Red", type: "layers" },
    { value: "plymouth-rock", label: "Plymouth Rock", type: "layers" },
    { value: "leghorn", label: "Leghorn", type: "layers" },
    { value: "orpington", label: "Orpington", type: "layers" },
    { value: "wyandotte", label: "Wyandotte", type: "layers" },
    { value: "brahma", label: "Brahma", type: "layers" },
    { value: "sussex", label: "Sussex", type: "layers" },
    // Meat bird breeds
    { value: "cornish-cross", label: "Cornish Cross", type: "meat-birds" },
    { value: "freedom-ranger", label: "Freedom Ranger", type: "meat-birds" },
    { value: "jersey-giant", label: "Jersey Giant", type: "meat-birds" },
    { value: "other", label: "Other / Mixed", type: "layers" },
  ];

  const availableBreeds = breedOptions.filter(
    (breed) => breed.type === formData.type || breed.value === "other"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const flock: Omit<Flock, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      type: formData.type,
      breeds: selectedBreeds,
      birdCount: parseInt(formData.birdCount) || 0,
      hatchDate: formData.hatchDate || undefined,
      acquiredDate: formData.acquiredDate,
      housingLocation: formData.housingLocation || undefined,
      status: formData.status,
      notes: formData.notes || undefined,
    };

    onSave(flock);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      type: "layers",
      breeds: [],
      birdCount: "",
      hatchDate: "",
      acquiredDate: new Date().toISOString().split("T")[0],
      housingLocation: "",
      status: "active",
      notes: "",
    });
    setSelectedBreeds([]);
    onOpenChange(false);
  };

  const toggleBreed = (breed: BirdBreed) => {
    setSelectedBreeds((prev) =>
      prev.includes(breed)
        ? prev.filter((b) => b !== breed)
        : [...prev, breed]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Flock</DialogTitle>
          <DialogDescription>
            Create a new flock to track health, productivity, and care.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Flock Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Flock Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Layer Hens – Coop A"
              required
            />
          </div>

          {/* Flock Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Flock Type *</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: "layers" });
                  setSelectedBreeds([]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === "layers"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-semibold mb-1">Laying Hens</div>
                <div className="text-xs text-muted-foreground">
                  Track egg production
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: "meat-birds" });
                  setSelectedBreeds([]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === "meat-birds"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-semibold mb-1">Meat Birds</div>
                <div className="text-xs text-muted-foreground">
                  Track growth & processing
                </div>
              </button>
            </div>
          </div>

          {/* Breed Selection */}
          <div className="space-y-2">
            <Label>Breed(s) *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableBreeds.map((breed) => (
                <button
                  key={breed.value}
                  type="button"
                  onClick={() => toggleBreed(breed.value)}
                  className={`p-2 text-sm rounded-lg border transition-all ${
                    selectedBreeds.includes(breed.value)
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {breed.label}
                </button>
              ))}
            </div>
            {selectedBreeds.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Select at least one breed
              </p>
            )}
          </div>

          {/* Bird Count */}
          <div className="space-y-2">
            <Label htmlFor="birdCount">Number of Birds *</Label>
            <Input
              id="birdCount"
              type="number"
              min="1"
              value={formData.birdCount}
              onChange={(e) =>
                setFormData({ ...formData, birdCount: e.target.value })
              }
              placeholder="e.g., 12"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hatchDate">Hatch Date (optional)</Label>
              <Input
                id="hatchDate"
                type="date"
                value={formData.hatchDate}
                onChange={(e) =>
                  setFormData({ ...formData, hatchDate: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Leave blank if unknown
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquiredDate">Acquired Date *</Label>
              <Input
                id="acquiredDate"
                type="date"
                value={formData.acquiredDate}
                onChange={(e) =>
                  setFormData({ ...formData, acquiredDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Housing Location */}
          <div className="space-y-2">
            <Label htmlFor="housingLocation">Housing Location</Label>
            <Input
              id="housingLocation"
              value={formData.housingLocation}
              onChange={(e) =>
                setFormData({ ...formData, housingLocation: e.target.value })
              }
              placeholder="e.g., Main Coop, Broiler Pen A"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as FlockStatus,
                })
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="active">Active</option>
              <option value="growing">Growing</option>
              <option value="processing-planned">Processing Planned</option>
            </select>
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
              placeholder="Any additional notes about this flock..."
              rows={3}
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.name ||
                selectedBreeds.length === 0 ||
                !formData.birdCount
              }
            >
              Add Flock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
