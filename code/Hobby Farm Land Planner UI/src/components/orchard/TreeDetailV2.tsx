import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Apple, TrendingUp } from "lucide-react";
import type { FruitTree } from "./types";
import { TreeOverviewTab } from "./tabs/TreeOverviewTab";
import { PruningTab } from "./tabs/PruningTab";
import { BloomFruitSetTab } from "./tabs/BloomFruitSetTab";
import { HarvestTab } from "./tabs/HarvestTab";
import { TreeHealthTab } from "./tabs/TreeHealthTab";

interface TreeDetailV2Props {
  treeId: string;
  onBack: () => void;
  onLogPruning?: () => void;
  onLogHarvest?: () => void;
  onLogBloom?: () => void;
}

type TreeTab = "overview" | "pruning" | "bloom" | "harvest" | "health";

export function TreeDetailV2({
  treeId,
  onBack,
  onLogPruning,
  onLogHarvest,
  onLogBloom,
}: TreeDetailV2Props) {
  const [activeTab, setActiveTab] = useState<TreeTab>("overview");

  // Mock data - replace with real data fetched by treeId
  const tree: FruitTree = {
    id: treeId,
    name: "Honeycrisp #1",
    species: "apple",
    variety: "Honeycrisp",
    rootstock: "M.7",
    plantingDate: "2020-04-15",
    treeAge: 5,
    location: "North Row 1",
    rowNumber: 1,
    position: 1,
    healthStatus: "excellent",
    trainingSystem: "central-leader",
    lastPruneDate: "2025-02-01",
    expectedHarvestStart: "2025-09-15",
    expectedHarvestEnd: "2025-10-05",
    notes: "Excellent producer, very vigorous",
    createdAt: "2020-04-15T10:00:00Z",
    updatedAt: "2025-02-01T14:00:00Z",
  };

  const getHealthStatusBadge = (status: FruitTree["healthStatus"]) => {
    switch (status) {
      case "excellent":
        return (
          <Badge variant="success" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            Excellent
          </Badge>
        );
      case "good":
        return <Badge variant="default">Good</Badge>;
      case "fair":
        return <Badge variant="warning">Fair</Badge>;
      case "poor":
        return <Badge variant="destructive">Poor</Badge>;
      case "declining":
        return <Badge variant="destructive">Declining</Badge>;
    }
  };

  const getSpeciesLabel = (species: FruitTree["species"]) => {
    const labels: Record<FruitTree["species"], string> = {
      apple: "Apple",
      pear: "Pear",
      peach: "Peach",
      cherry: "Cherry",
      plum: "Plum",
      apricot: "Apricot",
      nectarine: "Nectarine",
      fig: "Fig",
      quince: "Quince",
      persimmon: "Persimmon",
      other: "Other",
    };
    return labels[species];
  };

  const tabs: { id: TreeTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "pruning", label: "Pruning & Training" },
    { id: "bloom", label: "Bloom & Fruit Set" },
    { id: "harvest", label: "Harvest" },
    { id: "health", label: "Health & Issues" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orchard
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-rose-50 dark:bg-rose-950 rounded-xl">
                <Apple className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl">{tree.name}</h1>
                  {getHealthStatusBadge(tree.healthStatus)}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span>
                    {getSpeciesLabel(tree.species)}
                    {tree.variety && ` - ${tree.variety}`}
                  </span>
                  {tree.location && (
                    <>
                      <span>•</span>
                      <span>{tree.location}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{tree.treeAge} years old</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onLogBloom}>
                Log Bloom
              </Button>
              <Button variant="outline" onClick={onLogPruning}>
                Log Pruning
              </Button>
              <Button onClick={onLogHarvest}>Log Harvest</Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && <TreeOverviewTab tree={tree} />}
          {activeTab === "pruning" && (
            <PruningTab treeId={tree.id} onLogPruning={onLogPruning} />
          )}
          {activeTab === "bloom" && (
            <BloomFruitSetTab treeId={tree.id} onLogBloom={onLogBloom} />
          )}
          {activeTab === "harvest" && (
            <HarvestTab treeId={tree.id} onLogHarvest={onLogHarvest} />
          )}
          {activeTab === "health" && <TreeHealthTab treeId={tree.id} />}
        </div>
      </div>
    </div>
  );
}
