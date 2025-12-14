import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
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
import { Badge } from "../ui/badge";
import { Info } from "lucide-react";
import type { TapType } from "./types";

interface BulkAddTapsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taps: Array<{
    treeId: string;
    tapType: TapType;
    installDate: string;
  }>) => void;
  trees: Array<{ id: string; nickname?: string; species: string; diameter: number }>;
}

export function BulkAddTapsModal({
  open,
  onOpenChange,
  onSave,
  trees,
}: BulkAddTapsModalProps) {
  const [selectedTrees, setSelectedTrees] = useState<Set<string>>(new Set());
  const [tapType, setTapType] = useState<TapType>('bucket');
  const [installDate, setInstallDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleToggleTree = (treeId: string) => {
    const newSelected = new Set(selectedTrees);
    if (newSelected.has(treeId)) {
      newSelected.delete(treeId);
    } else {
      newSelected.add(treeId);
    }
    setSelectedTrees(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTrees.size === eligibleTrees.length) {
      setSelectedTrees(new Set());
    } else {
      setSelectedTrees(new Set(eligibleTrees.map((t) => t.id)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taps = Array.from(selectedTrees).map((treeId) => ({
      treeId,
      tapType,
      installDate,
    }));
    onSave(taps);
    handleClose();
  };

  const handleClose = () => {
    setSelectedTrees(new Set());
    setTapType('bucket');
    setInstallDate(new Date().toISOString().split('T')[0]);
    onOpenChange(false);
  };

  // Filter trees eligible for tapping (>= 10" diameter)
  const eligibleTrees = trees.filter((tree) => tree.diameter >= 10);

  const getRecommendedTaps = (diameter: number) => {
    if (diameter < 10) return 0;
    if (diameter < 18) return 1;
    if (diameter < 25) return 2;
    return 3;
  };

  const tapTypeOptions = [
    { value: 'bucket', label: 'Bucket' },
    { value: 'spile', label: 'Spile' },
    { value: 'tubing', label: 'Tubing' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Bulk Add Taps</DialogTitle>
          <DialogDescription>
            Select multiple trees and add taps to all at once
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Tap Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tapType">Tap Type *</Label>
                <Select
                  value={tapType}
                  onValueChange={(value) => setTapType(value as TapType)}
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

              <div className="space-y-2">
                <Label htmlFor="installDate">Installation Date *</Label>
                <Input
                  id="installDate"
                  type="date"
                  value={installDate}
                  onChange={(e) => setInstallDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Tree Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Trees ({selectedTrees.size} selected)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedTrees.size === eligibleTrees.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>

              {eligibleTrees.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    No eligible trees found. Add trees with diameter ≥ 10" first.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-2">
                  {eligibleTrees.map((tree) => {
                    const recommendedTaps = getRecommendedTaps(tree.diameter);
                    const isSelected = selectedTrees.has(tree.id);

                    return (
                      <button
                        key={tree.id}
                        type="button"
                        onClick={() => handleToggleTree(tree.id)}
                        className={`w-full p-3 rounded-lg border transition-colors text-left ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                              {tree.nickname || `${tree.species} - ${tree.id.slice(0, 8)}`}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {tree.diameter}" DBH
                            </p>
                          </div>
                          <Badge variant="outline" className="flex-shrink-0">
                            {recommendedTaps} tap{recommendedTaps !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Info */}
              <div className="flex gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Recommended taps: 1 for 10-17", 2 for 18-24", 3 for 25"+. This
                  will add 1 tap per tree. Add additional taps individually if needed.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={selectedTrees.size === 0}>
              Add {selectedTrees.size} Tap{selectedTrees.size !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}