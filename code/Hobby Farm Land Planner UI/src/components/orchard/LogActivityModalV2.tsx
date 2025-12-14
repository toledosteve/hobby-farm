import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface LogActivityModalV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (activityData: any) => void;
  trees?: Array<{ id: string; name: string }>;
  selectedTreeId?: string | null;
}

export function LogActivityModalV2({
  open,
  onOpenChange,
  onSave,
  trees = [],
  selectedTreeId,
}: LogActivityModalV2Props) {
  const [activityType, setActivityType] = useState<
    "pruning" | "harvest" | "bloom" | "health"
  >("pruning");

  // Pruning form
  const [pruningData, setPruningData] = useState({
    treeId: selectedTreeId || "",
    date: new Date().toISOString().split("T")[0],
    pruningType: "maintenance",
    amountRemoved: "moderate",
    notes: "",
  });

  // Harvest form
  const [harvestData, setHarvestData] = useState({
    treeId: selectedTreeId || "",
    harvestDate: new Date().toISOString().split("T")[0],
    yieldPounds: "",
    fruitCount: "",
    qualityRating: "good",
    qualityNotes: "",
  });

  // Bloom form
  const [bloomData, setBloomData] = useState({
    treeId: selectedTreeId || "",
    date: new Date().toISOString().split("T")[0],
    bloomStage: "bloom",
    bloomDensity: "moderate",
    frostDamageObserved: false,
    notes: "",
  });

  // Health observation form
  const [healthData, setHealthData] = useState({
    treeId: selectedTreeId || "",
    date: new Date().toISOString().split("T")[0],
    issueType: "pest-damage",
    severity: "minor",
    observations: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let activityData;
    switch (activityType) {
      case "pruning":
        activityData = { type: "pruning", ...pruningData };
        break;
      case "harvest":
        activityData = { type: "harvest", ...harvestData };
        break;
      case "bloom":
        activityData = { type: "bloom", ...bloomData };
        break;
      case "health":
        activityData = { type: "health", ...healthData };
        break;
    }

    onSave?.(activityData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Log Orchard Activity</DialogTitle>
          <DialogDescription>
            Log different types of activities in your orchard.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activityType} onValueChange={(v: any) => setActivityType(v)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pruning">Pruning</TabsTrigger>
            <TabsTrigger value="harvest">Harvest</TabsTrigger>
            <TabsTrigger value="bloom">Bloom</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>

          {/* Pruning Tab */}
          <TabsContent value="pruning">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pruning-tree">Tree</Label>
                <Select
                  value={pruningData.treeId}
                  onValueChange={(value) =>
                    setPruningData({ ...pruningData, treeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tree" />
                  </SelectTrigger>
                  <SelectContent>
                    {trees.map((tree) => (
                      <SelectItem key={tree.id} value={tree.id}>
                        {tree.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pruning-date">Date</Label>
                <Input
                  id="pruning-date"
                  type="date"
                  value={pruningData.date}
                  onChange={(e) =>
                    setPruningData({ ...pruningData, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pruning-type">Pruning Type</Label>
                <Select
                  value={pruningData.pruningType}
                  onValueChange={(value) =>
                    setPruningData({ ...pruningData, pruningType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="structural">
                      Structural (shaping young trees)
                    </SelectItem>
                    <SelectItem value="maintenance">
                      Maintenance (annual pruning)
                    </SelectItem>
                    <SelectItem value="renewal">
                      Renewal (rejuvenating old trees)
                    </SelectItem>
                    <SelectItem value="corrective">
                      Corrective (fixing problems)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount-removed">Amount Removed</Label>
                <Select
                  value={pruningData.amountRemoved}
                  onValueChange={(value) =>
                    setPruningData({ ...pruningData, amountRemoved: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light (&lt; 20%)</SelectItem>
                    <SelectItem value="moderate">Moderate (20-30%)</SelectItem>
                    <SelectItem value="heavy">Heavy (&gt; 30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pruning-notes">Notes</Label>
                <Textarea
                  id="pruning-notes"
                  value={pruningData.notes}
                  onChange={(e) =>
                    setPruningData({ ...pruningData, notes: e.target.value })
                  }
                  placeholder="Describe what was pruned and why..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Log Pruning</Button>
              </div>
            </form>
          </TabsContent>

          {/* Harvest Tab */}
          <TabsContent value="harvest">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="harvest-tree">Tree</Label>
                <Select
                  value={harvestData.treeId}
                  onValueChange={(value) =>
                    setHarvestData({ ...harvestData, treeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tree" />
                  </SelectTrigger>
                  <SelectContent>
                    {trees.map((tree) => (
                      <SelectItem key={tree.id} value={tree.id}>
                        {tree.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="harvest-date">Harvest Date</Label>
                <Input
                  id="harvest-date"
                  type="date"
                  value={harvestData.harvestDate}
                  onChange={(e) =>
                    setHarvestData({
                      ...harvestData,
                      harvestDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yield-pounds">Yield (pounds)</Label>
                  <Input
                    id="yield-pounds"
                    type="number"
                    step="0.1"
                    value={harvestData.yieldPounds}
                    onChange={(e) =>
                      setHarvestData({
                        ...harvestData,
                        yieldPounds: e.target.value,
                      })
                    }
                    placeholder="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fruit-count">Fruit Count (optional)</Label>
                  <Input
                    id="fruit-count"
                    type="number"
                    value={harvestData.fruitCount}
                    onChange={(e) =>
                      setHarvestData({
                        ...harvestData,
                        fruitCount: e.target.value,
                      })
                    }
                    placeholder="200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality-rating">Quality</Label>
                <Select
                  value={harvestData.qualityRating}
                  onValueChange={(value) =>
                    setHarvestData({ ...harvestData, qualityRating: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality-notes">Quality Notes</Label>
                <Textarea
                  id="quality-notes"
                  value={harvestData.qualityNotes}
                  onChange={(e) =>
                    setHarvestData({
                      ...harvestData,
                      qualityNotes: e.target.value,
                    })
                  }
                  placeholder="Notes about fruit size, color, flavor, storage quality..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Log Harvest</Button>
              </div>
            </form>
          </TabsContent>

          {/* Bloom Tab */}
          <TabsContent value="bloom">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bloom-tree">Tree</Label>
                <Select
                  value={bloomData.treeId}
                  onValueChange={(value) =>
                    setBloomData({ ...bloomData, treeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tree" />
                  </SelectTrigger>
                  <SelectContent>
                    {trees.map((tree) => (
                      <SelectItem key={tree.id} value={tree.id}>
                        {tree.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloom-date">Observation Date</Label>
                <Input
                  id="bloom-date"
                  type="date"
                  value={bloomData.date}
                  onChange={(e) =>
                    setBloomData({ ...bloomData, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloom-stage">Bloom Stage</Label>
                <Select
                  value={bloomData.bloomStage}
                  onValueChange={(value) =>
                    setBloomData({ ...bloomData, bloomStage: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dormant">Dormant</SelectItem>
                    <SelectItem value="bud-swell">Bud Swell</SelectItem>
                    <SelectItem value="pink-bud">
                      Pink Bud / Tight Cluster
                    </SelectItem>
                    <SelectItem value="bloom">Full Bloom</SelectItem>
                    <SelectItem value="petal-fall">Petal Fall</SelectItem>
                    <SelectItem value="fruit-set">Fruit Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloom-density">Bloom Density</Label>
                <Select
                  value={bloomData.bloomDensity}
                  onValueChange={(value) =>
                    setBloomData({ ...bloomData, bloomDensity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sparse">Sparse</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="frost-damage"
                  checked={bloomData.frostDamageObserved}
                  onChange={(e) =>
                    setBloomData({
                      ...bloomData,
                      frostDamageObserved: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <Label htmlFor="frost-damage" className="cursor-pointer">
                  Frost damage observed
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloom-notes">Notes</Label>
                <Textarea
                  id="bloom-notes"
                  value={bloomData.notes}
                  onChange={(e) =>
                    setBloomData({ ...bloomData, notes: e.target.value })
                  }
                  placeholder="Pollinator activity, weather conditions, any concerns..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Log Observation</Button>
              </div>
            </form>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="health-tree">Tree</Label>
                <Select
                  value={healthData.treeId}
                  onValueChange={(value) =>
                    setHealthData({ ...healthData, treeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tree" />
                  </SelectTrigger>
                  <SelectContent>
                    {trees.map((tree) => (
                      <SelectItem key={tree.id} value={tree.id}>
                        {tree.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="health-date">Observation Date</Label>
                <Input
                  id="health-date"
                  type="date"
                  value={healthData.date}
                  onChange={(e) =>
                    setHealthData({ ...healthData, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue-type">Issue Type</Label>
                <Select
                  value={healthData.issueType}
                  onValueChange={(value) =>
                    setHealthData({ ...healthData, issueType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fire-blight">Fire Blight</SelectItem>
                    <SelectItem value="apple-scab">Apple Scab</SelectItem>
                    <SelectItem value="brown-rot">Brown Rot</SelectItem>
                    <SelectItem value="powdery-mildew">Powdery Mildew</SelectItem>
                    <SelectItem value="cedar-apple-rust">
                      Cedar Apple Rust
                    </SelectItem>
                    <SelectItem value="canker">Canker</SelectItem>
                    <SelectItem value="pest-damage">Pest Damage</SelectItem>
                    <SelectItem value="nutrient-deficiency">
                      Nutrient Deficiency
                    </SelectItem>
                    <SelectItem value="drought-stress">Drought Stress</SelectItem>
                    <SelectItem value="winter-damage">Winter Damage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={healthData.severity}
                  onValueChange={(value) =>
                    setHealthData({ ...healthData, severity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor (monitoring)</SelectItem>
                    <SelectItem value="moderate">
                      Moderate (action needed)
                    </SelectItem>
                    <SelectItem value="severe">Severe (urgent)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="health-observations">Observations</Label>
                <Textarea
                  id="health-observations"
                  value={healthData.observations}
                  onChange={(e) =>
                    setHealthData({
                      ...healthData,
                      observations: e.target.value,
                    })
                  }
                  placeholder="Describe what you're observing..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Log Observation</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}