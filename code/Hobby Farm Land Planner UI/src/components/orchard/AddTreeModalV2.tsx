import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import type { FruitSpecies, TrainingSystem } from "./types";

interface AddTreeModalV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (treeData: any) => void;
}

export function AddTreeModalV2({
  open,
  onOpenChange,
  onSave,
}: AddTreeModalV2Props) {
  const [formData, setFormData] = useState({
    name: "",
    species: "apple" as FruitSpecies,
    variety: "",
    rootstock: "",
    plantingDate: "",
    location: "",
    rowNumber: "",
    position: "",
    trainingSystem: "central-leader" as TrainingSystem,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      name: "",
      species: "apple",
      variety: "",
      rootstock: "",
      plantingDate: "",
      location: "",
      rowNumber: "",
      position: "",
      trainingSystem: "central-leader",
      notes: "",
    });
  };

  const speciesOptions = [
    { value: "apple", label: "Apple" },
    { value: "pear", label: "Pear" },
    { value: "peach", label: "Peach" },
    { value: "cherry", label: "Cherry" },
    { value: "plum", label: "Plum" },
    { value: "apricot", label: "Apricot" },
    { value: "nectarine", label: "Nectarine" },
    { value: "fig", label: "Fig" },
    { value: "quince", label: "Quince" },
    { value: "persimmon", label: "Persimmon" },
    { value: "other", label: "Other" },
  ];

  const trainingSystemOptions = [
    { value: "central-leader", label: "Central Leader" },
    { value: "open-center", label: "Open Center (Vase)" },
    { value: "modified-central", label: "Modified Central Leader" },
    { value: "espalier", label: "Espalier" },
    { value: "vase", label: "Vase" },
    { value: "other", label: "Other" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Fruit Tree</DialogTitle>
          <DialogDescription>
            Add a new fruit tree to your orchard with detailed information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tree Name / ID *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Honeycrisp #1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select
                  value={formData.species}
                  onValueChange={(value) =>
                    setFormData({ ...formData, species: value as FruitSpecies })
                  }
                >
                  <SelectTrigger>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variety">Variety</Label>
                <Input
                  id="variety"
                  value={formData.variety}
                  onChange={(e) =>
                    setFormData({ ...formData, variety: e.target.value })
                  }
                  placeholder="e.g., Honeycrisp, Bartlett"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rootstock">Rootstock</Label>
                <Input
                  id="rootstock"
                  value={formData.rootstock}
                  onChange={(e) =>
                    setFormData({ ...formData, rootstock: e.target.value })
                  }
                  placeholder="e.g., M.7, M.26, OHxF 87"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plantingDate">Planting Date</Label>
              <Input
                id="plantingDate"
                type="date"
                value={formData.plantingDate}
                onChange={(e) =>
                  setFormData({ ...formData, plantingDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="font-semibold">Location in Orchard</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location Description</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., North Row 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rowNumber">Row Number</Label>
                <Input
                  id="rowNumber"
                  type="number"
                  value={formData.rowNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, rowNumber: e.target.value })
                  }
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position in Row</Label>
                <Input
                  id="position"
                  type="number"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* Training System */}
          <div className="space-y-2">
            <Label htmlFor="trainingSystem">Training System</Label>
            <Select
              value={formData.trainingSystem}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  trainingSystem: value as TrainingSystem,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {trainingSystemOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Training system affects pruning approach and tree shape
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any additional notes about this tree..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Tree</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}