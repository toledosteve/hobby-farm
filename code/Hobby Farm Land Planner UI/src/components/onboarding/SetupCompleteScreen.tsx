import { Button } from "../ui/button";
import { OnboardingLayout } from "./OnboardingLayout";
import { CheckCircle, MapPin, Ruler, Leaf, ArrowRight } from "lucide-react";

interface SetupCompleteScreenProps {
  projectName: string;
  location: string;
  acreage: number;
  goals: string[];
  onOpenEditor: () => void;
  onLogout?: () => void;
}

const GOAL_LABELS: Record<string, string> = {
  maple: "Maple Sugaring",
  orchard: "Fruit Orchard",
  garden: "Vegetable Garden",
  livestock: "Livestock Pasture",
  forestry: "Forestry Management",
  bees: "Beekeeping",
  poultry: "Poultry",
  berries: "Berry Farming",
  trails: "Hiking Trails",
  wetland: "Wetland Conservation",
};

export function SetupCompleteScreen({
  projectName,
  location,
  acreage,
  goals,
  onOpenEditor,
  onLogout,
}: SetupCompleteScreenProps) {
  return (
    <OnboardingLayout currentStep={6} totalSteps={6} showBack={false} onLogout={onLogout}>
      <div className="h-[calc(100vh-65px)] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Animated circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 animate-pulse"></div>
              </div>
              <div className="relative w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <h1 className="mb-3">Your farm is ready!</h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Let&apos;s start planning your land. You can now add markers, draw trails, and
              create zones based on your goals.
            </p>
          </div>

          {/* Project Summary Card */}
          <div className="bg-card border border-border rounded-lg p-6 text-left max-w-md mx-auto">
            <h2 className="mb-4 text-center">Project Summary</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Project Name</p>
                  <p>{projectName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Ruler className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Total Area</p>
                  <p>{acreage} acres</p>
                </div>
              </div>

              {goals.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">Goals</p>
                    <div className="flex flex-wrap gap-2">
                      {goals.map((goalId) => (
                        <span
                          key={goalId}
                          className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                        >
                          {GOAL_LABELS[goalId] || goalId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-muted rounded-lg p-6 text-left max-w-md mx-auto">
            <h3 className="text-sm mb-3">What you can do next:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Add markers for barns, sugar shacks, and other features</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Draw paths and trails across your property</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Create recommended zones based on soil analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>View detailed soil insights for different areas</span>
              </li>
            </ul>
          </div>

          {/* Action */}
          <div className="pt-4">
            <Button onClick={onOpenEditor} size="lg" className="min-w-[250px]">
              Open Map Editor
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}