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
import { CheckCircle2, Info } from "lucide-react";
import type {
  Hive,
  Inspection,
  HiveTemperament,
  BroodPattern,
} from "./types";

interface LogInspectionModalV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hives: Hive[];
  onSave: (inspection: Omit<Inspection, "id" | "createdAt">) => void;
  selectedHiveId?: string;
}

export function LogInspectionModalV2({
  open,
  onOpenChange,
  hives,
  onSave,
  selectedHiveId,
}: LogInspectionModalV2Props) {
  const [hiveId, setHiveId] = useState(selectedHiveId || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weatherConditions, setWeatherConditions] = useState("");
  const [temperatureF, setTemperatureF] = useState("");
  const [hiveTemperament, setHiveTemperament] =
    useState<HiveTemperament>("calm");
  const [broodPattern, setBroodPattern] = useState<BroodPattern | "">("");
  const [queenSighted, setQueenSighted] = useState<boolean | null>(null);
  const [queenNotes, setQueenNotes] = useState("");
  const [broodFrames, setBroodFrames] = useState("");
  const [honeyFrames, setHoneyFrames] = useState("");
  const [pollenStores, setPollenStores] = useState<
    "abundant" | "adequate" | "low" | "none" | ""
  >("");
  const [honeyStores, setHoneyStores] = useState<
    "abundant" | "adequate" | "low" | "none" | ""
  >("");
  const [diseaseObservations, setDiseaseObservations] = useState("");
  const [pestObservations, setPestObservations] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (queenSighted === null) {
      alert("Please indicate if the queen was sighted");
      return;
    }

    const inspection: Omit<Inspection, "id" | "createdAt"> = {
      hiveId,
      date,
      weatherConditions: weatherConditions || undefined,
      temperatureF: temperatureF ? parseInt(temperatureF) : undefined,
      hiveTemperament,
      broodPattern: broodPattern || undefined,
      queenSighted,
      queenNotes: queenNotes || undefined,
      broodFrames: broodFrames ? parseInt(broodFrames) : undefined,
      honeyFrames: honeyFrames ? parseInt(honeyFrames) : undefined,
      pollenStores: pollenStores || undefined,
      honeyStores: honeyStores || undefined,
      diseaseObservations: diseaseObservations || undefined,
      pestObservations: pestObservations || undefined,
      actionsTaken: actionsTaken || undefined,
      notes: notes || undefined,
    };

    onSave(inspection);
    handleClose();
  };

  const handleClose = () => {
    setHiveId(selectedHiveId || "");
    setDate(new Date().toISOString().split("T")[0]);
    setWeatherConditions("");
    setTemperatureF("");
    setHiveTemperament("calm");
    setBroodPattern("");
    setQueenSighted(null);
    setQueenNotes("");
    setBroodFrames("");
    setHoneyFrames("");
    setPollenStores("");
    setHoneyStores("");
    setDiseaseObservations("");
    setPestObservations("");
    setActionsTaken("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Hive Inspection</DialogTitle>
          <DialogDescription>
            Record your observations and actions. All fields except required ones
            are optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hive & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hive">Hive *</Label>
              <select
                id="hive"
                value={hiveId}
                onChange={(e) => setHiveId(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                required
              >
                <option value="">Select a hive...</option>
                {hives.map((hive) => (
                  <option key={hive.id} value={hive.id}>
                    {hive.name}
                  </option>
                ))}
              </select>
            </div>

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
          </div>

          {/* Weather Conditions */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="weather">Weather Conditions</Label>
              <Input
                id="weather"
                value={weatherConditions}
                onChange={(e) => setWeatherConditions(e.target.value)}
                placeholder="e.g., Sunny, light breeze"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temp">Temperature (°F)</Label>
              <Input
                id="temp"
                type="number"
                value={temperatureF}
                onChange={(e) => setTemperatureF(e.target.value)}
                placeholder="e.g., 68"
              />
            </div>
          </div>

          {/* Hive Temperament */}
          <div className="space-y-2">
            <Label htmlFor="temperament">Hive Temperament *</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "calm" as const, label: "Calm", emoji: "😌" },
                { value: "active" as const, label: "Active", emoji: "🐝" },
                { value: "defensive" as const, label: "Defensive", emoji: "⚠️" },
                { value: "aggressive" as const, label: "Aggressive", emoji: "😠" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setHiveTemperament(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    hiveTemperament === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Queen Status */}
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Label>Queen Sighted? *</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setQueenSighted(true)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  queenSighted === true
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                    : "border-border hover:border-primary/50 bg-white dark:bg-gray-950"
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 mx-auto mb-1 ${
                    queenSighted === true ? "text-emerald-600" : "text-gray-400"
                  }`}
                />
                <div className="text-sm font-medium">Yes, sighted</div>
              </button>
              <button
                type="button"
                onClick={() => setQueenSighted(false)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  queenSighted === false
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                    : "border-border hover:border-primary/50 bg-white dark:bg-gray-950"
                }`}
              >
                <Info
                  className={`w-5 h-5 mx-auto mb-1 ${
                    queenSighted === false ? "text-amber-600" : "text-gray-400"
                  }`}
                />
                <div className="text-sm font-medium">Not sighted</div>
              </button>
            </div>

            {queenSighted !== null && (
              <div className="space-y-2">
                <Label htmlFor="queenNotes">Queen Notes</Label>
                <Textarea
                  id="queenNotes"
                  value={queenNotes}
                  onChange={(e) => setQueenNotes(e.target.value)}
                  placeholder={
                    queenSighted
                      ? "Marking color, laying pattern, behavior..."
                      : "Signs of eggs, larvae, or queen cells..."
                  }
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Brood Assessment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="broodPattern">Brood Pattern</Label>
              <select
                id="broodPattern"
                value={broodPattern}
                onChange={(e) => setBroodPattern(e.target.value as BroodPattern)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="">Not assessed</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="spotty">Spotty</option>
                <option value="poor">Poor</option>
                <option value="none">None</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="broodFrames">Frames of Brood</Label>
              <Input
                id="broodFrames"
                type="number"
                min="0"
                value={broodFrames}
                onChange={(e) => setBroodFrames(e.target.value)}
                placeholder="e.g., 6"
              />
            </div>
          </div>

          {/* Stores Assessment */}
          <div className="space-y-3">
            <h4 className="font-medium">Food Stores</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="honeyStores">Honey Stores</Label>
                <select
                  id="honeyStores"
                  value={honeyStores}
                  onChange={(e) => setHoneyStores(e.target.value as typeof honeyStores)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">Not assessed</option>
                  <option value="abundant">Abundant</option>
                  <option value="adequate">Adequate</option>
                  <option value="low">Low</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pollenStores">Pollen Stores</Label>
                <select
                  id="pollenStores"
                  value={pollenStores}
                  onChange={(e) => setPollenStores(e.target.value as typeof pollenStores)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">Not assessed</option>
                  <option value="abundant">Abundant</option>
                  <option value="adequate">Adequate</option>
                  <option value="low">Low</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="honeyFrames">Frames of Honey</Label>
              <Input
                id="honeyFrames"
                type="number"
                min="0"
                value={honeyFrames}
                onChange={(e) => setHoneyFrames(e.target.value)}
                placeholder="e.g., 3"
              />
            </div>
          </div>

          {/* Health Observations */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="disease">Disease Observations</Label>
              <Textarea
                id="disease"
                value={diseaseObservations}
                onChange={(e) => setDiseaseObservations(e.target.value)}
                placeholder="Any signs of disease..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pests">Pest Observations</Label>
              <Textarea
                id="pests"
                value={pestObservations}
                onChange={(e) => setPestObservations(e.target.value)}
                placeholder="Varroa, SHB, wax moth..."
                rows={2}
              />
            </div>
          </div>

          {/* Actions & Notes */}
          <div className="space-y-2">
            <Label htmlFor="actions">Actions Taken</Label>
            <Textarea
              id="actions"
              value={actionsTaken}
              onChange={(e) => setActionsTaken(e.target.value)}
              placeholder="Added supers, reversed boxes, added feed..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">General Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Overall observations and thoughts..."
              rows={3}
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!hiveId || queenSighted === null}>
              Log Inspection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
