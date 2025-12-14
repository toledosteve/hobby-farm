import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    acres?: number;
  }) => Promise<any>;
}

export function SaveProjectModal({ isOpen, onClose, onSave }: SaveProjectModalProps) {
  const [farmName, setFarmName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [acres, setAcres] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (farmName.trim()) {
      setIsSubmitting(true);
      try {
        await onSave({
          name: farmName,
          address: address.trim() || undefined,
          city: city.trim() || undefined,
          state: state.trim() || undefined,
          zipCode: zipCode.trim() || undefined,
          acres: acres ? parseFloat(acres) : undefined,
        });
        // Reset form
        resetForm();
        onClose();
      } catch (error) {
        // Error is handled by the hook
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFarmName("");
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
    setAcres("");
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Farm</DialogTitle>
          <DialogDescription>
            Add a new farm to manage. You can add more details in Farm Settings later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="farm-name">Farm Name</Label>
            <Input
              id="farm-name"
              placeholder="e.g., Cub Lake Farms"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="e.g., 1781 Lilac Rd."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g., Hillsdale"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="MI"
                value={state}
                onChange={(e) => setState(e.target.value)}
                maxLength={2}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                placeholder="e.g., 49242"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acres">Acreage (optional)</Label>
              <Input
                id="acres"
                type="number"
                step="0.1"
                placeholder="e.g., 24.5"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!farmName.trim() || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Farm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
