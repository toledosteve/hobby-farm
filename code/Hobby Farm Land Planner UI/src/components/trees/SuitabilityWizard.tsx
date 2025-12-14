import { useState } from "react";
import { MapPin, Target, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner@2.0.3";

interface SuitabilityWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuitabilityWizard({ open, onOpenChange }: SuitabilityWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goals = [
    {
      id: "syrup",
      label: "Maple Syrup Production",
      description: "Sugar maples and other syrup-producing trees",
    },
    {
      id: "fruit",
      label: "Fruit Production",
      description: "Apple, pear, cherry, and other fruit trees",
    },
    {
      id: "nuts",
      label: "Nut Production",
      description: "Walnut, chestnut, hazelnut, and other nut trees",
    },
    {
      id: "timber",
      label: "Timber & Wood Products",
      description: "Trees suitable for lumber and woodworking",
    },
    {
      id: "shade",
      label: "Shade & Cooling",
      description: "Large canopy trees for property cooling",
    },
    {
      id: "windbreak",
      label: "Windbreak & Privacy",
      description: "Evergreens and dense trees for wind protection",
    },
    {
      id: "habitat",
      label: "Wildlife Habitat",
      description: "Trees that support birds, pollinators, and wildlife",
    },
    {
      id: "conservation",
      label: "Native Species & Conservation",
      description: "Support local ecosystems with native trees",
    },
  ];

  const recommendations = [
    {
      name: "Sugar Maple",
      scientific: "Acer saccharum",
      suitability: "excellent",
      matches: ["syrup", "shade", "timber", "conservation"],
    },
    {
      name: "Red Maple",
      scientific: "Acer rubrum",
      suitability: "excellent",
      matches: ["syrup", "shade", "habitat", "conservation"],
    },
    {
      name: "Apple (Various)",
      scientific: "Malus domestica",
      suitability: "good",
      matches: ["fruit", "habitat"],
    },
    {
      name: "Black Walnut",
      scientific: "Juglans nigra",
      suitability: "good",
      matches: ["nuts", "timber", "shade", "conservation"],
    },
    {
      name: "Eastern White Pine",
      scientific: "Pinus strobus",
      suitability: "excellent",
      matches: ["timber", "windbreak", "habitat", "conservation"],
    },
  ];

  const filteredRecommendations = selectedGoals.length > 0
    ? recommendations.filter(rec => 
        rec.matches.some(match => selectedGoals.includes(match))
      )
    : recommendations;

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleComplete = () => {
    toast.success("Tree recommendations ready! Check the 'Trees That Grow Well Here' tab.");
    onOpenChange(false);
    setStep(1);
    setSelectedGoals([]);
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "excellent": return "bg-green-100 text-green-800 border-green-200";
      case "good": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Find Trees for Your Land
          </DialogTitle>
          <DialogDescription>
            Let's find trees that will thrive on your property
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 py-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
            }`}>
              {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
            </div>
            <span className="text-sm font-medium">Location</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
            }`}>
              {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : "2"}
            </div>
            <span className="text-sm font-medium">Goals</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 3 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
            }`}>
              {step > 3 ? <CheckCircle2 className="w-5 h-5" /> : "3"}
            </div>
            <span className="text-sm font-medium">Recommendations</span>
          </div>
        </div>

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">Your Location</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Climate Zone:</span>
                      <span className="font-medium">USDA Zone 5a</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Region:</span>
                      <span className="font-medium">New England</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Growing Season:</span>
                      <span className="font-medium">~150 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Precipitation:</span>
                      <span className="font-medium">~45 inches</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> These recommendations are based on your property location. 
                Local microclimates, soil conditions, and site-specific factors may affect tree suitability. 
                Consider consulting with a local arborist or extension service for specific guidance.
              </p>
            </div>

            <div className="flex justify-end">
              <Button size="lg" onClick={() => setStep(2)} className="gap-2">
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2">What are your goals?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select all that apply. We'll recommend trees that match your interests.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {goals.map((goal) => (
                <Card
                  key={goal.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedGoals.includes(goal.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedGoals.includes(goal.id)}
                      onCheckedChange={() => handleGoalToggle(goal.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">
                        {goal.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button 
                size="lg" 
                onClick={() => setStep(3)} 
                disabled={selectedGoals.length === 0}
                className="gap-2"
              >
                See Recommendations
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Recommendations */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2">Recommended Trees</h3>
              <p className="text-sm text-muted-foreground">
                Based on your location and goals, these trees are generally suitable for your property.
              </p>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredRecommendations.map((tree) => (
                <Card key={tree.name} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="mb-1">{tree.name}</h4>
                          <p className="text-sm text-muted-foreground italic">
                            {tree.scientific}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-8">
                        <Badge 
                          variant="outline" 
                          className={getSuitabilityColor(tree.suitability)}
                        >
                          {tree.suitability}
                        </Badge>
                        {tree.matches
                          .filter(match => selectedGoals.includes(match))
                          .map(match => (
                            <Badge key={match} variant="secondary" className="capitalize text-xs">
                              {goals.find(g => g.id === match)?.label.split(" ")[0]}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Next steps:</strong> You can add these trees to your plan or explore more details 
                in the "Trees That Grow Well Here" section.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button size="lg" onClick={handleComplete} className="gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
