import { useState } from "react";
import { TreePine, Leaf, Apple, Droplet, Sun, MapPin, Plus, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SuitableTree {
  id: string;
  commonName: string;
  scientificName: string;
  isNative: boolean;
  suitability: "excellent" | "good" | "fair" | "poor";
  purposes: string[];
  climateZones: string[];
  soilPreference: string;
  moistureNeeds: string;
  sunRequirement: string;
  matureHeight: string;
  growthRate: string;
  description: string;
  image?: string;
}

interface TreeSuitabilityProps {
  onAddTree: (open: boolean) => void;
}

export function TreeSuitability({ onAddTree }: TreeSuitabilityProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("all");

  // Mock suitable trees data
  const suitableTrees: SuitableTree[] = [
    {
      id: "1",
      commonName: "Sugar Maple",
      scientificName: "Acer saccharum",
      isNative: true,
      suitability: "excellent",
      purposes: ["syrup", "shade", "timber", "fall color"],
      climateZones: ["3", "4", "5", "6", "7"],
      soilPreference: "Well-drained, slightly acidic to neutral",
      moistureNeeds: "Moderate",
      sunRequirement: "Full sun to partial shade",
      matureHeight: "60-75 feet",
      growthRate: "Slow to medium",
      description: "The quintessential New England maple. Excellent for syrup production, stunning fall color, and valuable timber.",
    },
    {
      id: "2",
      commonName: "Red Maple",
      scientificName: "Acer rubrum",
      isNative: true,
      suitability: "excellent",
      purposes: ["shade", "fall color", "syrup", "habitat"],
      climateZones: ["3", "4", "5", "6", "7", "8", "9"],
      soilPreference: "Adaptable, prefers moist soils",
      moistureNeeds: "Moderate to high",
      sunRequirement: "Full sun to partial shade",
      matureHeight: "40-60 feet",
      growthRate: "Medium to fast",
      description: "Highly adaptable native maple. Beautiful red fall foliage. Can be tapped for syrup though less productive than sugar maple.",
    },
    {
      id: "3",
      commonName: "Eastern White Pine",
      scientificName: "Pinus strobus",
      isNative: true,
      suitability: "excellent",
      purposes: ["timber", "windbreak", "habitat", "evergreen"],
      climateZones: ["3", "4", "5", "6", "7"],
      soilPreference: "Well-drained, acidic to neutral",
      moistureNeeds: "Low to moderate",
      sunRequirement: "Full sun",
      matureHeight: "50-80 feet",
      growthRate: "Fast",
      description: "Fast-growing native conifer. Excellent for timber, windbreaks, and wildlife habitat. Soft needles and attractive form.",
    },
    {
      id: "4",
      commonName: "American Apple",
      scientificName: "Malus domestica",
      isNative: false,
      suitability: "good",
      purposes: ["fruit", "pollinator support", "orchard"],
      climateZones: ["3", "4", "5", "6", "7", "8"],
      soilPreference: "Well-drained, slightly acidic",
      moistureNeeds: "Moderate",
      sunRequirement: "Full sun",
      matureHeight: "12-20 feet (standard), 6-12 feet (dwarf)",
      growthRate: "Medium",
      description: "Classic fruit tree for homesteads. Many varieties available for different climates and uses. Requires pollinator partner.",
    },
    {
      id: "5",
      commonName: "Black Walnut",
      scientificName: "Juglans nigra",
      isNative: true,
      suitability: "good",
      purposes: ["nuts", "timber", "shade"],
      climateZones: ["4", "5", "6", "7", "8", "9"],
      soilPreference: "Deep, well-drained, fertile",
      moistureNeeds: "Moderate",
      sunRequirement: "Full sun",
      matureHeight: "50-75 feet",
      growthRate: "Medium",
      description: "Valuable native tree for nuts and timber. Note: produces juglone which inhibits growth of some nearby plants.",
    },
    {
      id: "6",
      commonName: "American Hazelnut",
      scientificName: "Corylus americana",
      isNative: true,
      suitability: "excellent",
      purposes: ["nuts", "wildlife", "understory"],
      climateZones: ["4", "5", "6", "7", "8", "9"],
      soilPreference: "Well-drained, adaptable",
      moistureNeeds: "Low to moderate",
      sunRequirement: "Full sun to partial shade",
      matureHeight: "8-15 feet (shrub form)",
      growthRate: "Medium",
      description: "Native shrub producing edible hazelnuts. Excellent for wildlife. Good understory planting for larger trees.",
    },
    {
      id: "7",
      commonName: "American Chestnut (Hybrid)",
      scientificName: "Castanea dentata hybrid",
      isNative: false,
      suitability: "fair",
      purposes: ["nuts", "restoration", "timber"],
      climateZones: ["4", "5", "6", "7", "8"],
      soilPreference: "Well-drained, acidic",
      moistureNeeds: "Moderate",
      sunRequirement: "Full sun",
      matureHeight: "40-60 feet",
      growthRate: "Fast",
      description: "Blight-resistant hybrids bringing back this iconic native. Good nut producer. Supports restoration efforts.",
    },
    {
      id: "8",
      commonName: "Serviceberry",
      scientificName: "Amelanchier spp.",
      isNative: true,
      suitability: "excellent",
      purposes: ["fruit", "wildlife", "ornamental", "understory"],
      climateZones: ["4", "5", "6", "7", "8", "9"],
      soilPreference: "Well-drained, adaptable",
      moistureNeeds: "Low to moderate",
      sunRequirement: "Full sun to partial shade",
      matureHeight: "15-25 feet",
      growthRate: "Medium",
      description: "Beautiful native small tree. Edible berries loved by birds and people. White spring flowers. Excellent four-season interest.",
    },
  ];

  const purposes = ["all", "syrup", "fruit", "nuts", "timber", "shade", "habitat", "windbreak"];

  const filteredTrees = suitableTrees.filter(tree => {
    const matchesSearch = 
      tree.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPurpose = selectedPurpose === "all" || tree.purposes.includes(selectedPurpose);

    return matchesSearch && matchesPurpose;
  });

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "excellent": return "bg-green-100 text-green-800 border-green-200";
      case "good": return "bg-blue-100 text-blue-800 border-blue-200";
      case "fair": return "bg-amber-100 text-amber-800 border-amber-200";
      case "poor": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Climate Zone Info */}
      <div className="border-b bg-card px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3>Your Climate Zone: 5a</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Based on your location. USDA Hardiness Zones help determine which plants will thrive in your area.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground">
              Trees shown are generally suitable for your region. Local conditions may vary.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-card px-8 py-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search tree species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex gap-2">
            {purposes.map(purpose => (
              <Button
                key={purpose}
                variant={selectedPurpose === purpose ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPurpose(purpose)}
                className="capitalize"
              >
                {purpose}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tree Cards */}
      <ScrollArea className="flex-1">
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6">
            {filteredTrees.map((tree) => (
              <Card key={tree.id} className="p-6 hover:border-primary/50 transition-all">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <TreePine className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1">{tree.commonName}</h4>
                          <p className="text-sm text-muted-foreground italic">
                            {tree.scientificName}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {tree.isNative && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <span className="px-1.5 py-0.5">Native</span>
                          </Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className={getSuitabilityColor(tree.suitability)}
                        >
                          <span className="px-1.5 py-0.5 capitalize">{tree.suitability}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tree.description}
                  </p>

                  {/* Purposes */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Primary Uses</p>
                    <div className="flex flex-wrap gap-2">
                      {tree.purposes.map((purpose) => (
                        <Badge key={purpose} variant="secondary" className="text-xs capitalize">
                          {purpose}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Growing Conditions */}
                  <div className="space-y-2 pt-3 border-t">
                    <div className="flex items-start gap-2 text-sm">
                      <Sun className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-muted-foreground">Sun: </span>
                        <span>{tree.sunRequirement}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Droplet className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-muted-foreground">Water: </span>
                        <span>{tree.moistureNeeds}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Leaf className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-muted-foreground">Mature Size: </span>
                        <span>{tree.matureHeight}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => onAddTree(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add to Plan
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Results footer */}
      <div className="border-t bg-card px-8 py-3">
        <p className="text-sm text-muted-foreground">
          Showing {filteredTrees.length} suitable species
        </p>
      </div>
    </div>
  );
}