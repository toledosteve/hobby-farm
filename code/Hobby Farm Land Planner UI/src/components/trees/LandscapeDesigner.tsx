import { useState } from "react";
import { Sparkles, Sun, Heart, Leaf, Shield, Eye, ChevronRight, Plus, Map } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface LandscapeDesign {
  id: string;
  name: string;
  description: string;
  canopyTrees: string[];
  shrubLayer: string[];
  groundCover: string[];
  benefits: string[];
  compatibilityScore: number;
  sunRequirement: string;
  maintenanceLevel: string;
}

interface LandscapeDesignerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToMap?: (design: LandscapeDesign) => void;
}

export function LandscapeDesigner({ open, onOpenChange, onAddToMap }: LandscapeDesignerProps) {
  const [step, setStep] = useState<"goals" | "constraints" | "results">("goals");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedConstraints, setSelectedConstraints] = useState<{
    sunExposure: string;
    soilType: string;
    space: string;
  }>({
    sunExposure: "",
    soilType: "",
    space: "",
  });

  const goals = [
    { id: "shade", label: "Shade & Cooling", icon: Sun },
    { id: "aesthetics", label: "Visual Interest", icon: Eye },
    { id: "pollinators", label: "Pollinator Support", icon: Leaf },
    { id: "privacy", label: "Privacy Screen", icon: Shield },
    { id: "lowMaintenance", label: "Low Maintenance", icon: Heart },
  ];

  const mockDesigns: LandscapeDesign[] = [
    {
      id: "1",
      name: "Mixed Native Woodland Edge",
      description: "A layered planting that mimics natural forest edges. Provides shade, wildlife habitat, and four-season interest with minimal maintenance once established.",
      canopyTrees: ["Sugar Maple", "Red Oak"],
      shrubLayer: ["Serviceberry", "Viburnum", "Witch Hazel"],
      groundCover: ["Wild Ginger", "Ferns", "Native Sedges"],
      benefits: ["Compatible root systems", "Seasonal visual interest", "Pollinator friendly", "Low maintenance"],
      compatibilityScore: 95,
      sunRequirement: "Partial shade to full sun",
      maintenanceLevel: "Low after establishment",
    },
    {
      id: "2",
      name: "Productive Edible Landscape",
      description: "Combines fruit and nut trees with edible shrubs and herbs. Designed for yield while maintaining visual appeal and supporting beneficial insects.",
      canopyTrees: ["Apple", "Pear"],
      shrubLayer: ["Blueberry", "Serviceberry", "Hazelnut"],
      groundCover: ["Thyme", "Strawberries", "Clover"],
      benefits: ["Multiple harvests", "Self-supporting ecosystem", "Attracts pollinators", "Beautiful blooms"],
      compatibilityScore: 88,
      sunRequirement: "Full sun",
      maintenanceLevel: "Moderate (pruning & harvest)",
    },
    {
      id: "3",
      name: "Evergreen Privacy Screen",
      description: "Year-round screening using native and adapted evergreens. Provides habitat, wind protection, and noise buffering while requiring minimal care.",
      canopyTrees: ["Eastern White Pine", "Red Spruce"],
      shrubLayer: ["Rhododendron", "Mountain Laurel", "Juniper"],
      groundCover: ["Bearberry", "Wintergreen", "Moss"],
      benefits: ["Year-round coverage", "Wind protection", "Wildlife shelter", "Soil stabilization"],
      compatibilityScore: 92,
      sunRequirement: "Full sun to partial shade",
      maintenanceLevel: "Very low",
    },
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleNext = () => {
    if (step === "goals") {
      setStep("constraints");
    } else if (step === "constraints") {
      setStep("results");
    }
  };

  const handleBack = () => {
    if (step === "constraints") {
      setStep("goals");
    } else if (step === "results") {
      setStep("constraints");
    }
  };

  const handleReset = () => {
    setStep("goals");
    setSelectedGoals([]);
    setSelectedConstraints({ sunExposure: "", soilType: "", space: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Design a Planting Layout
          </DialogTitle>
          <DialogDescription>
            Explore coordinated plant combinations based on horticultural principles and your site conditions.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="space-y-6 pr-4">
            {/* Step 1: Goals */}
            {step === "goals" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-1">What are your planting goals?</h3>
                  <p className="text-sm text-muted-foreground">
                    Select one or more priorities for this planting area.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {goals.map((goal) => {
                    const Icon = goal.icon;
                    const isSelected = selectedGoals.includes(goal.id);
                    return (
                      <Card
                        key={goal.id}
                        className={`p-4 cursor-pointer transition-all ${
                          isSelected 
                            ? "border-primary bg-primary/5" 
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => handleGoalToggle(goal.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className={isSelected ? "text-foreground" : ""}>{goal.label}</p>
                          </div>
                          <Checkbox checked={isSelected} />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Constraints */}
            {step === "constraints" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-1">Tell us about your site</h3>
                  <p className="text-sm text-muted-foreground">
                    These conditions help us suggest appropriate plants.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label className="mb-3 block">Sun Exposure</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Full Sun", "Partial Shade", "Full Shade"].map((option) => (
                        <Card
                          key={option}
                          className={`p-3 cursor-pointer text-center transition-all ${
                            selectedConstraints.sunExposure === option
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedConstraints(prev => ({ ...prev, sunExposure: option }))}
                        >
                          <p className="text-sm">{option}</p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Soil Type</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Sandy/Well-drained", "Loamy", "Clay/Heavy"].map((option) => (
                        <Card
                          key={option}
                          className={`p-3 cursor-pointer text-center transition-all ${
                            selectedConstraints.soilType === option
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedConstraints(prev => ({ ...prev, soilType: option }))}
                        >
                          <p className="text-sm">{option}</p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Available Space</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Small (<500 sq ft)", "Medium (500-1500 sq ft)", "Large (>1500 sq ft)"].map((option) => (
                        <Card
                          key={option}
                          className={`p-3 cursor-pointer text-center transition-all ${
                            selectedConstraints.space === option
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedConstraints(prev => ({ ...prev, space: option }))}
                        >
                          <p className="text-sm">{option}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {step === "results" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-1">Suggested Planting Layouts</h3>
                  <p className="text-sm text-muted-foreground">
                    These combinations are based on horticultural compatibility, your goals, and site conditions.
                  </p>
                </div>

                <div className="space-y-4">
                  {mockDesigns.map((design) => (
                    <Card key={design.id} className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4>{design.name}</h4>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <span className="px-1 py-0.5">{design.compatibilityScore}% Compatible</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {design.description}
                            </p>
                          </div>
                        </div>

                        {/* Layers */}
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Tree Layer</p>
                            <div className="space-y-1">
                              {design.canopyTrees.map((tree, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tree}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Shrub Layer</p>
                            <div className="space-y-1">
                              {design.shrubLayer.map((shrub, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {shrub}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Ground Cover</p>
                            <div className="space-y-1">
                              {design.groundCover.map((cover, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {cover}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Why This Works</p>
                          <div className="flex flex-wrap gap-2">
                            {design.benefits.map((benefit, idx) => (
                              <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <span className="px-1 py-0.5 text-xs">{benefit}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            <span>{design.sunRequirement}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>{design.maintenanceLevel}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-3 border-t">
                          <Button 
                            variant="outline" 
                            className="flex-1 gap-2"
                            onClick={() => onAddToMap?.(design)}
                          >
                            <Map className="w-4 h-4" />
                            View on Map
                          </Button>
                          <Button className="flex-1 gap-2">
                            <Plus className="w-4 h-4" />
                            Add to Plan
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Disclaimer */}
                <Card className="p-4 bg-muted/50">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    These suggestions are based on general principles of companion planting and ecology. 
                    Conditions vary by specific site, microclimate, and soil. Use these as guidance and 
                    starting points for your own planning. Always verify suitability for your exact location.
                  </p>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            {step !== "goals" && (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {step === "results" && (
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
            )}
            {step !== "results" && (
              <Button 
                onClick={handleNext}
                disabled={step === "goals" && selectedGoals.length === 0}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
