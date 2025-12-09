import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { OnboardingLayout } from "./OnboardingLayout";
import { MapPin, Target, Ruler } from "lucide-react";

interface ProjectData {
  name: string;
  location: string;
  acreage: string;
  goals: string[];
}

interface CreateProjectScreenProps {
  onContinue: (data: ProjectData) => void;
  onCancel: () => void;
  onLogout?: () => void;
}

const GOAL_OPTIONS = [
  { id: "maple", label: "Maple Sugaring", icon: "🍁" },
  { id: "orchard", label: "Orchard", icon: "🍎" },
  { id: "garden", label: "Vegetable Garden", icon: "🥕" },
  { id: "livestock", label: "Livestock", icon: "🐄" },
  { id: "forestry", label: "Forestry", icon: "🌲" },
  { id: "bees", label: "Beekeeping", icon: "🐝" },
  { id: "poultry", label: "Poultry", icon: "🐔" },
  { id: "berries", label: "Berry Farming", icon: "🫐" },
];

export function CreateProjectScreen({ onContinue, onCancel, onLogout }: CreateProjectScreenProps) {
  const [formData, setFormData] = useState<ProjectData>({
    name: "",
    location: "",
    acreage: "",
    goals: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onContinue(formData);
    }
  };

  const toggleGoal = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={6} showBack={false}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="mb-3">Create Your Farm Project</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Let&apos;s get started by setting up your project. You can always update these
            details later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2>Project Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">
                  Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Maple Ridge Farm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">
                  Location (Address) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., 123 Valley Road, Vermont"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-destructive mt-1">{errors.location}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  We&apos;ll use this to find your property on the map
                </p>
              </div>

              <div>
                <Label htmlFor="acreage">Acreage (Optional)</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="acreage"
                    type="number"
                    placeholder="e.g., 25"
                    value={formData.acreage}
                    onChange={(e) =>
                      setFormData({ ...formData, acreage: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  We&apos;ll calculate this once you draw your boundary
                </p>
              </div>
            </div>
          </div>

          {/* Goals Selection Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h2>What are your goals? (Optional)</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Select all that apply. This helps us provide better recommendations.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {GOAL_OPTIONS.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.goals.includes(goal.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-2">{goal.icon}</div>
                  <div className="text-sm">{goal.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel} size="lg">
              Cancel
            </Button>
            <Button type="submit" size="lg" className="sm:min-w-[200px]">
              Continue to Map
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}