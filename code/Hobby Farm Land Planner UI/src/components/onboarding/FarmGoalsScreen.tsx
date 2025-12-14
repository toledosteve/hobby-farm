import { useState } from "react";
import { Button } from "../ui/button";
import { OnboardingLayout } from "./OnboardingLayout";
import { Target, Sparkles } from "lucide-react";

interface FarmGoalsScreenProps {
  projectName: string;
  initialGoals?: string[];
  onContinue: (goals: string[]) => void;
  onBack: () => void;
  onSkip: () => void;
  onLogout?: () => void;
}

const GOAL_OPTIONS = [
  {
    id: "maple",
    label: "Maple Sugaring",
    icon: "🍁",
    description: "Tap maple trees for syrup production",
    soilMatch: "good",
  },
  {
    id: "orchard",
    label: "Fruit Orchard",
    icon: "🍎",
    description: "Apples, pears, and stone fruits",
    soilMatch: "excellent",
  },
  {
    id: "garden",
    label: "Vegetable Garden",
    icon: "🥕",
    description: "Grow vegetables and herbs",
    soilMatch: "excellent",
  },
  {
    id: "livestock",
    label: "Livestock Pasture",
    icon: "🐄",
    description: "Cattle, sheep, or goats",
    soilMatch: "good",
  },
  {
    id: "forestry",
    label: "Forestry Management",
    icon: "🌲",
    description: "Timber and woodland conservation",
    soilMatch: "good",
  },
  {
    id: "bees",
    label: "Beekeeping",
    icon: "🐝",
    description: "Honey production and pollination",
    soilMatch: "good",
  },
  {
    id: "poultry",
    label: "Poultry",
    icon: "🐔",
    description: "Chickens, ducks, or turkeys",
    soilMatch: "good",
  },
  {
    id: "berries",
    label: "Berry Farming",
    icon: "🫐",
    description: "Blueberries, raspberries, strawberries",
    soilMatch: "excellent",
  },
  {
    id: "trails",
    label: "Hiking Trails",
    icon: "🥾",
    description: "Recreation and nature walks",
    soilMatch: "good",
  },
  {
    id: "wetland",
    label: "Wetland Conservation",
    icon: "🦆",
    description: "Wildlife habitat preservation",
    soilMatch: "good",
  },
];

export function FarmGoalsScreen({
  projectName,
  initialGoals = [],
  onContinue,
  onBack,
  onSkip,
  onLogout,
}: FarmGoalsScreenProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialGoals);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId]
    );
  };

  return (
    <OnboardingLayout currentStep={5} totalSteps={6} onBack={onBack} onLogout={onLogout}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h1 className="mb-2">What do you want to do with your land?</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your goals for {projectName}. We&apos;ll use this to provide personalized
            recommendations and zone suggestions. You can always update these later.
          </p>
        </div>

        {/* Soil-Based Recommendations Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="mb-1">
              <strong>Based on your soil analysis:</strong>
            </p>
            <p className="text-muted-foreground">
              Your land is especially well-suited for orchards, berry farming, and vegetable
              gardens. The well-drained areas are ideal for most agricultural activities.
            </p>
          </div>
        </div>

        {/* Goal Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {GOAL_OPTIONS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            const isRecommended = goal.soilMatch === "excellent";

            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                className={`relative p-5 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Recommended</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">{goal.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-sm mb-1">{goal.label}</h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{goal.description}</p>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute bottom-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Count */}
        {selectedGoals.length > 0 && (
          <div className="bg-muted rounded-lg p-4 mb-8 text-center">
            <p className="text-sm text-muted-foreground">
              You&apos;ve selected{" "}
              <strong className="text-foreground">{selectedGoals.length}</strong>{" "}
              {selectedGoals.length === 1 ? "goal" : "goals"} for your farm
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button variant="ghost" onClick={onSkip}>
            Skip This Step
          </Button>
          <Button
            onClick={() => onContinue(selectedGoals)}
            size="lg"
            className="min-w-[200px]"
            disabled={selectedGoals.length === 0}
          >
            {selectedGoals.length > 0 ? "Finish Setup" : "Select at least one goal"}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}