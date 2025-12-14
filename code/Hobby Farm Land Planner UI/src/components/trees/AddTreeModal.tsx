import { useState } from "react";
import { TreePine, MapPin, Calendar, Target, FileText, Camera } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";

interface AddTreeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTreeModal({ open, onOpenChange }: AddTreeModalProps) {
  const [treeType, setTreeType] = useState<"existing" | "planned">("existing");
  const [commonName, setCommonName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("healthy");
  const [purposes, setPurposes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const purposeOptions = ["syrup", "fruit", "nuts", "timber", "shade", "habitat", "windbreak", "ornamental"];

  const handlePurposeToggle = (purpose: string) => {
    setPurposes(prev => 
      prev.includes(purpose) 
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  const handleSubmit = () => {
    if (!commonName) {
      toast.error("Please enter a tree species name");
      return;
    }

    toast.success(`${treeType === "existing" ? "Tree added" : "Tree planned"} successfully!`);
    onOpenChange(false);
    
    // Reset form
    setCommonName("");
    setScientificName("");
    setType("");
    setAge("");
    setStatus("healthy");
    setPurposes([]);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <TreePine className="w-6 h-6 text-primary" />
            Add Tree
          </DialogTitle>
          <DialogDescription>
            Add an existing tree to your inventory or plan a future planting
          </DialogDescription>
        </DialogHeader>

        <Tabs value={treeType} onValueChange={(v) => setTreeType(v as "existing" | "planned")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="existing">Existing Tree</TabsTrigger>
            <TabsTrigger value="planned">Plan Future Tree</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-5">
            {/* Species */}
            <div className="space-y-2">
              <Label htmlFor="common-name">Species Name *</Label>
              <Input
                id="common-name"
                placeholder="e.g., Sugar Maple, Red Oak"
                value={commonName}
                onChange={(e) => setCommonName(e.target.value)}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Don't know the species? Enter "Unknown" and add photos for later identification
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scientific-name">Scientific Name (Optional)</Label>
              <Input
                id="scientific-name"
                placeholder="e.g., Acer saccharum"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Type & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tree Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type" className="h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maple">Maple</SelectItem>
                    <SelectItem value="fruit">Fruit</SelectItem>
                    <SelectItem value="conifer">Conifer</SelectItem>
                    <SelectItem value="nut">Nut</SelectItem>
                    <SelectItem value="oak">Oak</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Estimated Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 35"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Current Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="young">Young / Establishing</SelectItem>
                  <SelectItem value="declining">Declining / Stressed</SelectItem>
                  <SelectItem value="removed">Removed / Dead</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Purposes */}
            <div className="space-y-2">
              <Label>Primary Purposes</Label>
              <div className="flex flex-wrap gap-2">
                {purposeOptions.map((purpose) => (
                  <Badge
                    key={purpose}
                    variant={purposes.includes(purpose) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => handlePurposeToggle(purpose)}
                  >
                    {purpose}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Button variant="outline" className="w-full justify-start gap-2 h-11">
                <MapPin className="w-4 h-4" />
                Mark on Map
              </Button>
              <p className="text-xs text-muted-foreground">
                Click to pin this tree's location on your property map
              </p>
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <Label>Photos (Optional)</Label>
              <Button variant="outline" className="w-full justify-start gap-2 h-11">
                <Camera className="w-4 h-4" />
                Add Photos
              </Button>
              <p className="text-xs text-muted-foreground">
                Photos help with identification and tracking health over time
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any observations, health notes, or management history..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="planned" className="space-y-5">
            {/* Species */}
            <div className="space-y-2">
              <Label htmlFor="planned-name">Tree Species *</Label>
              <Input
                id="planned-name"
                placeholder="e.g., Sugar Maple, Apple"
                value={commonName}
                onChange={(e) => setCommonName(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planned-scientific">Scientific Name (Optional)</Label>
              <Input
                id="planned-scientific"
                placeholder="e.g., Acer saccharum"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Type & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="planned-type">Tree Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="planned-type" className="h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maple">Maple</SelectItem>
                    <SelectItem value="fruit">Fruit</SelectItem>
                    <SelectItem value="conifer">Conifer</SelectItem>
                    <SelectItem value="nut">Nut</SelectItem>
                    <SelectItem value="oak">Oak</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="1"
                  defaultValue="1"
                  className="h-11"
                />
              </div>
            </div>

            {/* Planned Date */}
            <div className="space-y-2">
              <Label htmlFor="planned-date">Target Planting Date</Label>
              <Input
                id="planned-date"
                type="date"
                className="h-11"
              />
            </div>

            {/* Purposes */}
            <div className="space-y-2">
              <Label>Primary Purposes</Label>
              <div className="flex flex-wrap gap-2">
                {purposeOptions.map((purpose) => (
                  <Badge
                    key={purpose}
                    variant={purposes.includes(purpose) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => handlePurposeToggle(purpose)}
                  >
                    {purpose}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Planned Location</Label>
              <Button variant="outline" className="w-full justify-start gap-2 h-11">
                <MapPin className="w-4 h-4" />
                Mark on Map
              </Button>
              <p className="text-xs text-muted-foreground">
                Choose where you plan to plant this tree
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="planned-notes">Planning Notes</Label>
              <Textarea
                id="planned-notes"
                placeholder="Site preparation needed, sourcing information, planting requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} size="lg">
            {treeType === "existing" ? "Add Tree" : "Add to Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
