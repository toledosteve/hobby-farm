import { useState } from "react";
import { Plus, AlertTriangle, CheckCircle2, Info, MapPin, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PlannedTree {
  id: string;
  commonName: string;
  scientificName: string;
  type: string;
  location?: string;
}

interface CompatibilityIssue {
  severity: "warning" | "caution" | "info";
  message: string;
  affectedTrees: string[];
}

export function PlantingPlanner() {
  const [selectedTrees, setSelectedTrees] = useState<PlannedTree[]>([
    {
      id: "1",
      commonName: "Sugar Maple",
      scientificName: "Acer saccharum",
      type: "maple",
      location: "North section",
    },
    {
      id: "2",
      commonName: "Black Walnut",
      scientificName: "Juglans nigra",
      type: "nut",
      location: "East section",
    },
  ]);

  const [selectedTreeToAdd, setSelectedTreeToAdd] = useState<string>("");

  const availableTrees = [
    { id: "3", commonName: "Red Maple", scientificName: "Acer rubrum", type: "maple" },
    { id: "4", commonName: "Apple", scientificName: "Malus domestica", type: "fruit" },
    { id: "5", commonName: "Eastern White Pine", scientificName: "Pinus strobus", type: "conifer" },
    { id: "6", commonName: "American Beech", scientificName: "Fagus grandifolia", type: "deciduous" },
  ];

  // Mock compatibility analysis
  const getCompatibilityIssues = (): CompatibilityIssue[] => {
    const issues: CompatibilityIssue[] = [];

    // Check for Black Walnut
    const hasWalnut = selectedTrees.some(t => t.commonName === "Black Walnut");
    const hasMaple = selectedTrees.some(t => t.type === "maple");

    if (hasWalnut && hasMaple) {
      issues.push({
        severity: "warning",
        message: "Black Walnut produces juglone, which can inhibit growth of nearby maples. Consider spacing at least 50 feet apart or choosing alternative locations.",
        affectedTrees: ["Black Walnut", "Sugar Maple"],
      });
    }

    // Check for disease clustering
    const mapleCount = selectedTrees.filter(t => t.type === "maple").length;
    if (mapleCount >= 2) {
      issues.push({
        severity: "caution",
        message: "Multiple maple species in close proximity can increase risk of disease spread. Ensure good spacing and air circulation.",
        affectedTrees: selectedTrees.filter(t => t.type === "maple").map(t => t.commonName),
      });
    }

    return issues;
  };

  const issues = getCompatibilityIssues();

  const handleAddTree = () => {
    if (!selectedTreeToAdd) return;
    
    const treeToAdd = availableTrees.find(t => t.id === selectedTreeToAdd);
    if (treeToAdd) {
      setSelectedTrees([...selectedTrees, treeToAdd]);
      setSelectedTreeToAdd("");
    }
  };

  const handleRemoveTree = (treeId: string) => {
    setSelectedTrees(selectedTrees.filter(t => t.id !== treeId));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "warning": return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "caution": return <Info className="w-5 h-5 text-blue-600" />;
      case "info": return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "warning": return "bg-amber-50 border-amber-200";
      case "caution": return "bg-blue-50 border-blue-200";
      case "info": return "bg-green-50 border-green-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-8 py-6 border-b space-y-4">
        <div>
          <h2 className="mb-1">Planting Plan Builder</h2>
          <p className="text-sm text-muted-foreground">
            Group trees together and check for compatibility issues before planting.
          </p>
        </div>

        {/* Add Tree Section */}
        <div className="flex gap-3">
          <Select value={selectedTreeToAdd} onValueChange={setSelectedTreeToAdd}>
            <SelectTrigger className="flex-1 h-11">
              <SelectValue placeholder="Select a tree to add..." />
            </SelectTrigger>
            <SelectContent>
              {availableTrees.map((tree) => (
                <SelectItem key={tree.id} value={tree.id}>
                  {tree.commonName} ({tree.scientificName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddTree} 
            disabled={!selectedTreeToAdd}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to Plan
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Compatibility Analysis */}
          {issues.length > 0 && (
            <div className="space-y-3">
              <h3>Compatibility Analysis</h3>
              {issues.map((issue, idx) => (
                <Card key={idx} className={`p-5 border-l-4 ${getSeverityColor(issue.severity)}`}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSeverityIcon(issue.severity)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm leading-relaxed">{issue.message}</p>
                      <div className="flex flex-wrap gap-2">
                        {issue.affectedTrees.map((tree, tIdx) => (
                          <Badge key={tIdx} variant="outline" className="text-xs">
                            {tree}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* No Issues State */}
          {issues.length === 0 && selectedTrees.length > 0 && (
            <Card className="p-5 border-l-4 bg-green-50 border-green-200">
              <div className="flex gap-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">
                    No major compatibility concerns detected with your current selection. 
                    Remember to provide adequate spacing and follow proper planting practices.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Selected Trees */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>Trees in This Plan</h3>
              <Badge variant="secondary">
                {selectedTrees.length} {selectedTrees.length === 1 ? "tree" : "trees"}
              </Badge>
            </div>

            {selectedTrees.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h4>No Trees Added Yet</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add trees to your plan to check compatibility and get planting recommendations.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid gap-3">
                {selectedTrees.map((tree) => (
                  <Card key={tree.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-base">{tree.commonName}</h4>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {tree.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic">{tree.scientificName}</p>
                        {tree.location && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{tree.location}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTree(tree.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          {selectedTrees.length > 0 && (
            <Card className="p-5 bg-muted/30">
              <h4 className="mb-3">Planting Recommendations</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Space trees according to their mature canopy size to reduce competition</p>
                <p>• Plant in groups of compatible species to create healthy micro-ecosystems</p>
                <p>• Consider seasonal interest and stagger blooming times for pollinators</p>
                <p>• Mix native and adapted species for resilience</p>
                <p>• Plan for long-term care and maintenance access</p>
              </div>
            </Card>
          )}

          {/* Disclaimer */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Compatibility assessments are based on general horticultural knowledge. Actual compatibility 
              depends on specific site conditions, spacing, soil quality, and local factors. Use these 
              recommendations as guidance for planning, and consult local extension services or arborists 
              for site-specific advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
