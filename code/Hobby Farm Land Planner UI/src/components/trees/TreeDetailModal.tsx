import { TreePine, MapPin, Calendar, Leaf, Sun, Droplet, Edit2, Trash2, Camera, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TreeCompatibility } from "./TreeCompatibility";
import { DiseaseRiskPanel } from "./DiseaseRiskPanel";

interface Tree {
  id: string;
  commonName: string;
  scientificName: string;
  type: string;
  age?: number;
  plantedYear?: number;
  status: "healthy" | "young" | "declining" | "removed";
  location: { x: number; y: number };
  purpose: string[];
  isNative: boolean;
  notes?: string;
  photos?: string[];
}

interface TreeDetailModalProps {
  tree: Tree | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TreeDetailModal({ tree, open, onOpenChange }: TreeDetailModalProps) {
  if (!tree) return null;

  const treeAge = tree.age || (tree.plantedYear ? new Date().getFullYear() - tree.plantedYear : null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800 border-green-200";
      case "young": return "bg-blue-100 text-blue-800 border-blue-200";
      case "declining": return "bg-amber-100 text-amber-800 border-amber-200";
      case "removed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Mock suitability data
  const suitabilityData = {
    climateZones: ["4", "5", "6", "7"],
    soilPreference: "Well-drained, slightly acidic to neutral loam",
    moistureTolerance: "Moderate - prefers consistent moisture",
    sunRequirement: "Full sun to partial shade (6+ hours sun)",
    matureHeight: "60-75 feet",
    matureSpread: "40-50 feet",
    growthRate: "Slow to medium (1-2 feet per year)",
  };

  // Mock management data
  const managementNotes = [
    {
      date: "March 2024",
      note: "Tapped for syrup production. 2 taps placed. Good sap flow.",
    },
    {
      date: "October 2023",
      note: "Excellent fall color. No signs of stress or disease.",
    },
    {
      date: "June 2023",
      note: "Light pruning of dead branches. Overall health excellent.",
    },
  ];

  // Mock compatibility data
  const compatibilityData = {
    compatible: [
      { name: "American Beech", reason: "Similar moisture and light requirements. Root systems coexist well." },
      { name: "Red Oak", reason: "Complementary canopy layers. Both thrive in similar forest conditions." },
      { name: "Basswood", reason: "Compatible root systems. Both benefit from forest floor ecology." },
    ],
    caution: [
      { name: "Black Walnut", reason: "Walnut produces juglone, which can inhibit maple growth. Maintain 50+ foot spacing." },
    ],
    avoid: [
      { name: "Tree-of-Heaven", reason: "Invasive species that competes aggressively for resources and produces allelopathic compounds." },
    ],
  };

  // Mock disease/pest data
  const diseaseData = [
    {
      name: "Tar Spot",
      riskLevel: "low" as const,
      description: "Cosmetic fungal issue causing black spots on leaves. Does not significantly harm tree health.",
    },
    {
      name: "Anthracnose",
      riskLevel: "moderate" as const,
      description: "Can cause leaf drop in wet springs. Monitor during prolonged moisture. Usually not fatal.",
    },
  ];

  const pestData = [
    {
      name: "Asian Longhorned Beetle",
      riskLevel: "high" as const,
      description: "Serious invasive pest in some regions. Report sightings to local extension. Preventable through monitoring.",
    },
    {
      name: "Aphids",
      riskLevel: "low" as const,
      description: "Common but rarely serious. Beneficial insects usually provide control.",
    },
  ];

  const regionalNotes = "Sugar maples in Zone 5a typically face minimal disease pressure when properly sited. Monitor for signs of stress during drought.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TreePine className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div>{tree.commonName}</div>
              <DialogDescription className="italic text-base">
                {tree.scientificName}
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 -mt-2">
          {tree.isNative && (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Native Species
            </Badge>
          )}
          <Badge variant="outline" className={getStatusColor(tree.status)}>
            {tree.status}
          </Badge>
          {tree.purpose.map((purpose) => (
            <Badge key={purpose} variant="secondary" className="capitalize">
              {purpose}
            </Badge>
          ))}
        </div>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="compatibility" className="flex-1">Compatibility</TabsTrigger>
              <TabsTrigger value="health" className="flex-1">Health & Monitoring</TabsTrigger>
            </TabsList>

            <div className="pr-4">
              <TabsContent value="overview" className="mt-0 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Age</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {treeAge ? `${treeAge} years` : "Unknown"}
                    </p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">Location</span>
                    </div>
                    <p className="text-lg font-semibold">Marked</p>
                    <p className="text-xs text-muted-foreground">View on map</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Leaf className="w-4 h-4" />
                      <span className="text-xs">Type</span>
                    </div>
                    <p className="text-lg font-semibold capitalize">{tree.type}</p>
                  </Card>
                </div>

                {/* Suitability & Growing Conditions */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    Growing Conditions
                  </h4>
                  <Card className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Climate Zones</p>
                        <p className="text-sm">{suitabilityData.climateZones.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Growth Rate</p>
                        <p className="text-sm">{suitabilityData.growthRate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Mature Size</p>
                        <p className="text-sm">{suitabilityData.matureHeight}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Spread</p>
                        <p className="text-sm">{suitabilityData.matureSpread}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Sun className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-muted-foreground">Sun: </span>
                          <span>{suitabilityData.sunRequirement}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Droplet className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-muted-foreground">Water: </span>
                          <span>{suitabilityData.moistureTolerance}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Leaf className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-muted-foreground">Soil: </span>
                          <span>{suitabilityData.soilPreference}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Notes */}
                {tree.notes && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Notes
                    </h4>
                    <Card className="p-5">
                      <p className="text-sm leading-relaxed">{tree.notes}</p>
                    </Card>
                  </div>
                )}

                {/* Management History */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Management History
                    </h4>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Add Note
                    </Button>
                  </div>
                  <Card className="p-5">
                    <div className="space-y-4">
                      {managementNotes.map((entry, index) => (
                        <div key={index}>
                          {index > 0 && <Separator className="my-4" />}
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">{entry.date}</p>
                            <p className="text-sm">{entry.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Photos */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Photos
                    </h4>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Camera className="w-4 h-4" />
                      Add Photo
                    </Button>
                  </div>
                  <Card className="p-5">
                    <div className="text-center py-8 text-muted-foreground">
                      <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No photos yet</p>
                      <p className="text-xs mt-1">Add photos to track this tree over time</p>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="compatibility" className="mt-0 space-y-6">
                <TreeCompatibility 
                  treeName={tree.commonName}
                  compatibility={compatibilityData} 
                />
              </TabsContent>

              <TabsContent value="health" className="mt-0 space-y-6">
                <DiseaseRiskPanel
                  treeName={tree.commonName}
                  diseases={diseaseData}
                  pests={pestData}
                  regionalNotes={regionalNotes}
                />
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="flex-1 gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Details
          </Button>
          <Button variant="outline" className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <Trash2 className="w-4 h-4" />
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}