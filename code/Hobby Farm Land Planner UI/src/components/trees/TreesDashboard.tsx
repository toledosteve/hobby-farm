import { useState } from "react";
import { TreePine, Plus, Map, List, Sprout, Leaf, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TreeInventoryList } from "./TreeInventoryList";
import { TreeMapView } from "./TreeMapView";
import { TreeSuitability } from "./TreeSuitability";
import { AddTreeModal } from "./AddTreeModal";
import { TreeDetailModal } from "./TreeDetailModal";
import { SuitabilityWizard } from "./SuitabilityWizard";
import { StatCard } from "./StatCard";
import { PlantingPlanner } from "./PlantingPlanner";
import { LandscapeDesigner } from "./LandscapeDesigner";

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

export function TreesDashboard() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [addTreeOpen, setAddTreeOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  // Mock tree data
  const [trees] = useState<Tree[]>([
    {
      id: "1",
      commonName: "Sugar Maple",
      scientificName: "Acer saccharum",
      type: "maple",
      age: 35,
      status: "healthy",
      location: { x: 45, y: 30 },
      purpose: ["syrup", "shade", "timber"],
      isNative: true,
      notes: "Excellent sap producer. Tapped annually.",
    },
    {
      id: "2",
      commonName: "Red Maple",
      scientificName: "Acer rubrum",
      type: "maple",
      age: 28,
      status: "healthy",
      location: { x: 52, y: 35 },
      purpose: ["syrup", "shade"],
      isNative: true,
    },
    {
      id: "3",
      commonName: "Apple",
      scientificName: "Malus domestica",
      type: "fruit",
      plantedYear: 2019,
      status: "young",
      location: { x: 65, y: 55 },
      purpose: ["fruit", "shade"],
      isNative: false,
      notes: "Honeycrisp variety. First harvest expected 2024.",
    },
    {
      id: "4",
      commonName: "Eastern White Pine",
      scientificName: "Pinus strobus",
      type: "conifer",
      age: 45,
      status: "healthy",
      location: { x: 30, y: 60 },
      purpose: ["timber", "habitat", "windbreak"],
      isNative: true,
    },
    {
      id: "5",
      commonName: "Black Walnut",
      scientificName: "Juglans nigra",
      type: "nut",
      age: 22,
      status: "healthy",
      location: { x: 70, y: 40 },
      purpose: ["nuts", "timber"],
      isNative: true,
    },
  ]);

  const totalTrees = trees.length;
  const speciesCount = new Set(trees.map(t => t.scientificName)).size;
  const nativeTrees = trees.filter(t => t.isNative).length;
  const productiveTrees = trees.filter(t => 
    t.purpose.some(p => ["syrup", "fruit", "nuts"].includes(p))
  ).length;

  const healthyTrees = trees.filter(t => t.status === "healthy").length;
  const healthTrend = healthyTrees === totalTrees ? 0 : healthyTrees > totalTrees / 2 ? 1 : -1;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-8 py-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TreePine className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl">Trees & Land Stewardship</h1>
                <p className="text-muted-foreground">
                  Track and plan the trees on your property
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setDesignerOpen(true)}
              className="gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Design a Layout
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setWizardOpen(true)}
              className="gap-2"
            >
              <Sprout className="w-5 h-5" />
              Find Trees for My Land
            </Button>
            <Button
              size="lg"
              onClick={() => setAddTreeOpen(true)}
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Tree
            </Button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Trees"
            value={totalTrees.toString()}
            trend={0}
            icon={TreePine}
            color="blue"
          />
          <StatCard
            label="Tree Species"
            value={speciesCount.toString()}
            trend={0}
            icon={Leaf}
            color="green"
          />
          <StatCard
            label="Native Trees"
            value={nativeTrees.toString()}
            subtext={`${Math.round((nativeTrees / totalTrees) * 100)}% of inventory`}
            trend={0}
            icon={Sprout}
            color="emerald"
          />
          <StatCard
            label="Productive Trees"
            value={productiveTrees.toString()}
            subtext="Fruit, syrup, or nuts"
            trend={healthTrend}
            icon={TreePine}
            color="amber"
          />
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">
          <TabsList className="h-12 bg-muted border">
            <TabsTrigger 
              value="inventory" 
              className="text-base px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Tree Inventory
            </TabsTrigger>
            <TabsTrigger 
              value="suitability" 
              className="text-base px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Trees That Grow Well Here
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden border-t">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="inventory" className="h-full mt-0">
            <div className="h-full flex flex-col">
              {/* View Toggle */}
              <div className="px-8 py-4 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="gap-2"
                  >
                    <List className="w-4 h-4" />
                    List View
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="gap-2"
                  >
                    <Map className="w-4 h-4" />
                    Map View
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto">
                {viewMode === "list" ? (
                  <TreeInventoryList 
                    trees={trees} 
                    onSelectTree={setSelectedTree}
                  />
                ) : (
                  <TreeMapView 
                    trees={trees}
                    onSelectTree={setSelectedTree}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="suitability" className="h-full mt-0">
            <TreeSuitability onAddTree={setAddTreeOpen} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AddTreeModal
        open={addTreeOpen}
        onOpenChange={setAddTreeOpen}
      />

      <TreeDetailModal
        tree={selectedTree}
        open={!!selectedTree}
        onOpenChange={(open) => !open && setSelectedTree(null)}
      />

      <SuitabilityWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
      />

      <LandscapeDesigner
        open={designerOpen}
        onOpenChange={setDesignerOpen}
      />
    </div>
  );
}