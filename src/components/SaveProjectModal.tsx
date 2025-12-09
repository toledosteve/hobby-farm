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
  onSave: (data: { name: string; location: string; acres?: number }) => Promise<any>;
}

export function SaveProjectModal({ isOpen, onClose, onSave }: SaveProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [acres, setAcres] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (projectName.trim() && location.trim()) {
      setIsSubmitting(true);
      try {
        await onSave({
          name: projectName,
          location: location,
          acres: acres ? parseFloat(acres) : undefined,
        });
        // Reset form
        setProjectName("");
        setLocation("");
        setAcres("");
        onClose();
      } catch (error) {
        // Error is handled by the hook
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setProjectName("");
      setLocation("");
      setAcres("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Start a new farm project by providing some basic information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="e.g., Livingston Farm"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Vermont, USA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acres">Acreage (optional)</Label>
            <Input
              id="acres"
              type="number"
              step="0.1"
              placeholder="e.g., 5.5"
              value={acres}
              onChange={(e) => setAcres(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!projectName.trim() || !location.trim() || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
