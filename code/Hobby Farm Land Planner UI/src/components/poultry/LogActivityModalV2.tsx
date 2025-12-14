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
import { AlertCircle, Info } from "lucide-react";
import type {
  Flock,
  HealthActivityType,
  DailyCareType,
  EggLog,
  HealthLog,
  DailyCareLog,
  GrowthLog,
} from "./types";

interface LogActivityModalV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flocks: Flock[];
  onSaveEgg?: (log: Omit<EggLog, "id" | "createdAt">) => void;
  onSaveHealth?: (log: Omit<HealthLog, "id" | "createdAt">) => void;
  onSaveCare?: (log: Omit<DailyCareLog, "id" | "createdAt">) => void;
  onSaveGrowth?: (log: Omit<GrowthLog, "id" | "createdAt">) => void;
  selectedFlockId?: string;
}

type ActivityCategory = "egg" | "health" | "care" | "growth";

export function LogActivityModalV2({
  open,
  onOpenChange,
  flocks,
  onSaveEgg,
  onSaveHealth,
  onSaveCare,
  onSaveGrowth,
  selectedFlockId,
}: LogActivityModalV2Props) {
  const [category, setCategory] = useState<ActivityCategory>("egg");
  const [flockId, setFlockId] = useState(selectedFlockId || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Egg log fields
  const [eggCount, setEggCount] = useState("");
  const [eggNotes, setEggNotes] = useState("");

  // Health log fields
  const [healthType, setHealthType] = useState<HealthActivityType>("medication");
  const [productName, setProductName] = useState("");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [withdrawalDays, setWithdrawalDays] = useState("");
  const [healthNotes, setHealthNotes] = useState("");

  // Care log fields
  const [careType, setCareType] = useState<DailyCareType>("feeding");
  const [careNotes, setCareNotes] = useState("");

  // Growth log fields
  const [ageInWeeks, setAgeInWeeks] = useState("");
  const [averageWeight, setAverageWeight] = useState("");
  const [growthNotes, setGrowthNotes] = useState("");

  const selectedFlock = flocks.find((f) => f.id === flockId);

  const calculateWithdrawalEndDate = (startDate: string, days: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    switch (category) {
      case "egg":
        if (onSaveEgg) {
          onSaveEgg({
            flockId,
            date,
            count: parseInt(eggCount) || 0,
            notes: eggNotes || undefined,
          });
        }
        break;

      case "health":
        if (onSaveHealth) {
          const withdrawalEndDate =
            withdrawalDays && parseInt(withdrawalDays) > 0
              ? calculateWithdrawalEndDate(date, parseInt(withdrawalDays))
              : undefined;

          onSaveHealth({
            flockId,
            date,
            activityType: healthType,
            productName: productName || undefined,
            dosage: dosage || undefined,
            duration: duration || undefined,
            withdrawalPeriodDays: withdrawalDays
              ? parseInt(withdrawalDays)
              : undefined,
            withdrawalEndDate,
            notes: healthNotes || undefined,
          });
        }
        break;

      case "care":
        if (onSaveCare) {
          onSaveCare({
            flockId,
            date,
            careType,
            notes: careNotes || undefined,
          });
        }
        break;

      case "growth":
        if (onSaveGrowth) {
          onSaveGrowth({
            flockId,
            date,
            ageInWeeks: parseInt(ageInWeeks) || 0,
            averageWeight: averageWeight ? parseFloat(averageWeight) : undefined,
            notes: growthNotes || undefined,
          });
        }
        break;
    }

    handleClose();
  };

  const handleClose = () => {
    setCategory("egg");
    setFlockId(selectedFlockId || "");
    setDate(new Date().toISOString().split("T")[0]);
    setEggCount("");
    setEggNotes("");
    setHealthType("medication");
    setProductName("");
    setDosage("");
    setDuration("");
    setWithdrawalDays("");
    setHealthNotes("");
    setCareType("feeding");
    setCareNotes("");
    setAgeInWeeks("");
    setAverageWeight("");
    setGrowthNotes("");
    onOpenChange(false);
  };

  const renderCategoryContent = () => {
    switch (category) {
      case "egg":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eggCount">Number of Eggs *</Label>
              <Input
                id="eggCount"
                type="number"
                min="0"
                value={eggCount}
                onChange={(e) => setEggCount(e.target.value)}
                placeholder="e.g., 12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eggNotes">Notes (optional)</Label>
              <Textarea
                id="eggNotes"
                value={eggNotes}
                onChange={(e) => setEggNotes(e.target.value)}
                placeholder="Any observations..."
                rows={2}
              />
            </div>

            {selectedFlock && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Quick Math</p>
                    <p>
                      {eggCount && parseInt(eggCount) > 0
                        ? `${(parseInt(eggCount) / selectedFlock.birdCount).toFixed(2)} eggs per bird`
                        : "Enter egg count to see per-bird average"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "health":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="healthType">Activity Type *</Label>
              <select
                id="healthType"
                value={healthType}
                onChange={(e) =>
                  setHealthType(e.target.value as HealthActivityType)
                }
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="medication">Medication</option>
                <option value="supplement">Supplement</option>
                <option value="vaccination">Vaccination</option>
                <option value="illness-observation">Illness Observation</option>
                <option value="injury">Injury</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">
                Product Name{" "}
                {["medication", "supplement", "vaccination"].includes(healthType)
                  ? "*"
                  : ""}
              </Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Corid, Marek's Vaccine"
                required={["medication", "supplement", "vaccination"].includes(
                  healthType
                )}
              />
            </div>

            {["medication", "supplement"].includes(healthType) && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="e.g., 1 tsp/gallon"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 5 days"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawalDays">Withdrawal Period (days)</Label>
                  <Input
                    id="withdrawalDays"
                    type="number"
                    min="0"
                    value={withdrawalDays}
                    onChange={(e) => setWithdrawalDays(e.target.value)}
                    placeholder="e.g., 14"
                  />
                  <p className="text-xs text-muted-foreground">
                    Days to wait before consuming eggs or meat
                  </p>
                </div>

                {withdrawalDays && parseInt(withdrawalDays) > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        <p className="font-medium mb-1">Withdrawal Period Active</p>
                        <p>
                          Do not consume products from this flock until{" "}
                          {calculateWithdrawalEndDate(
                            date,
                            parseInt(withdrawalDays)
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="healthNotes">Notes</Label>
              <Textarea
                id="healthNotes"
                value={healthNotes}
                onChange={(e) => setHealthNotes(e.target.value)}
                placeholder="Observations, symptoms, or additional details..."
                rows={3}
              />
            </div>
          </div>
        );

      case "care":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="careType">Care Activity *</Label>
              <select
                id="careType"
                value={careType}
                onChange={(e) => setCareType(e.target.value as DailyCareType)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="feeding">Feeding</option>
                <option value="water-check">Water Check</option>
                <option value="coop-cleaning">Coop Cleaning</option>
                <option value="bedding-change">Bedding Change</option>
                <option value="pasture-move">Pasture Move</option>
                <option value="predator-check">Predator Check</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="careNotes">Notes (optional)</Label>
              <Textarea
                id="careNotes"
                value={careNotes}
                onChange={(e) => setCareNotes(e.target.value)}
                placeholder="Any observations or details..."
                rows={2}
              />
            </div>
          </div>
        );

      case "growth":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageInWeeks">Age (weeks) *</Label>
                <Input
                  id="ageInWeeks"
                  type="number"
                  min="0"
                  value={ageInWeeks}
                  onChange={(e) => setAgeInWeeks(e.target.value)}
                  placeholder="e.g., 4"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="averageWeight">Average Weight (lbs)</Label>
                <Input
                  id="averageWeight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={averageWeight}
                  onChange={(e) => setAverageWeight(e.target.value)}
                  placeholder="e.g., 2.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="growthNotes">Notes (optional)</Label>
              <Textarea
                id="growthNotes"
                value={growthNotes}
                onChange={(e) => setGrowthNotes(e.target.value)}
                placeholder="Growth observations, feed notes, etc..."
                rows={2}
              />
            </div>

            {selectedFlock?.type === "meat-birds" && ageInWeeks && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Processing Window</p>
                    <p>
                      {parseInt(ageInWeeks) >= 8
                        ? "Birds are at processing weight"
                        : `${8 - parseInt(ageInWeeks)} weeks until typical processing window`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
          <DialogDescription>
            Record eggs, health activities, daily care, or growth data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Category */}
          <div className="space-y-2">
            <Label>Activity Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: "egg" as const, label: "Eggs", emoji: "🥚" },
                { value: "health" as const, label: "Health", emoji: "💊" },
                { value: "care" as const, label: "Care", emoji: "✓" },
                { value: "growth" as const, label: "Growth", emoji: "📊" },
              ].map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    category === cat.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="text-sm font-medium">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Flock Selection */}
          <div className="space-y-2">
            <Label htmlFor="flock">Flock *</Label>
            <select
              id="flock"
              value={flockId}
              onChange={(e) => setFlockId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              required
            >
              <option value="">Select a flock...</option>
              {flocks
                .filter((f) => f.status !== "archived")
                .map((flock) => (
                  <option key={flock.id} value={flock.id}>
                    {flock.name} ({flock.birdCount} birds)
                  </option>
                ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Category-specific fields */}
          {renderCategoryContent()}

          {/* Footer */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Log Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
