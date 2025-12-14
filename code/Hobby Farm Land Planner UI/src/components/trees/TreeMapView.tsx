import { useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, Layers, TreeDeciduous, TreePine, Apple, Sprout, Leaf } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

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
}

interface TreeMapViewProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
}

export function TreeMapView({ trees, onSelectTree }: TreeMapViewProps) {
  const [zoom, setZoom] = useState(1);
  const [showNativeOnly, setShowNativeOnly] = useState(false);
  const [showSuitabilityLayer, setShowSuitabilityLayer] = useState(false);
  const [hoveredTree, setHoveredTree] = useState<Tree | null>(null);

  const getTreeIcon = (type: string) => {
    switch (type) {
      case "maple": return TreeDeciduous;
      case "fruit": return Apple;
      case "conifer": return TreePine;
      case "nut": return Sprout;
      default: return Leaf;
    }
  };

  const getTreeColor = (tree: Tree) => {
    if (showNativeOnly && !tree.isNative) return "#CBD5E1";
    
    switch (tree.type) {
      case "maple": return "#2F6F4E";
      case "fruit": return "#DC2626";
      case "conifer": return "#15803D";
      case "nut": return "#92400E";
      default: return "#64748B";
    }
  };

  const getStatusOpacity = (status: string) => {
    switch (status) {
      case "healthy": return 1;
      case "young": return 0.7;
      case "declining": return 0.5;
      case "removed": return 0.3;
      default: return 1;
    }
  };

  const filteredTrees = showNativeOnly 
    ? trees.filter(t => t.isNative) 
    : trees;

  return (
    <div className="bg-muted/30 relative" style={{ height: '700px' }}>
      {/* Map Controls */}
      <div className="absolute top-6 right-6 z-10 space-y-3">
        <Card className="p-2 flex flex-col gap-1 shadow-lg">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={() => setZoom(z => Math.min(z + 0.2, 3))}
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Maximize2 className="w-5 h-5" />
          </Button>
        </Card>

        <Card className="p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <Switch 
              id="native-only" 
              checked={showNativeOnly}
              onCheckedChange={setShowNativeOnly}
            />
            <Label htmlFor="native-only" className="cursor-pointer flex items-center gap-2 text-sm">
              <Sprout className="w-4 h-4" />
              Native Only
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch 
              id="suitability-layer" 
              checked={showSuitabilityLayer}
              onCheckedChange={setShowSuitabilityLayer}
            />
            <Label htmlFor="suitability-layer" className="cursor-pointer flex items-center gap-2 text-sm">
              <Layers className="w-4 h-4" />
              Suitability
            </Label>
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-4 shadow-lg">
          <p className="text-xs text-muted-foreground mb-3">Tree Types</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#2F6F4E" }} />
              <span className="text-xs">Maple</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#DC2626" }} />
              <span className="text-xs">Fruit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#15803D" }} />
              <span className="text-xs">Conifer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#92400E" }} />
              <span className="text-xs">Nut</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Map Canvas */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <div 
          className="relative bg-white rounded-lg shadow-inner border-2 border-border w-full h-full overflow-hidden"
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
        >
          {/* Satellite-style background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100" />

          {/* Grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
            <defs>
              <pattern id="tree-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tree-grid)" />
          </svg>

          {/* Property boundary */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polygon
              points="100,80 500,100 550,450 350,480 80,380"
              fill="transparent"
              stroke="#2F6F4E"
              strokeWidth="3"
              strokeDasharray="12,6"
              opacity="0.4"
            />
          </svg>

          {/* Suitability heatmap overlay */}
          {showSuitabilityLayer && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <radialGradient id="suitable-1">
                  <stop offset="0%" stopColor="#4FA87A" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4FA87A" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="suitable-2">
                  <stop offset="0%" stopColor="#84cc16" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="200" cy="250" r="120" fill="url(#suitable-1)" />
              <circle cx="400" cy="300" r="140" fill="url(#suitable-2)" />
              <circle cx="300" cy="150" r="100" fill="url(#suitable-1)" />
            </svg>
          )}

          {/* Tree markers */}
          {filteredTrees.map((tree) => {
            const Icon = getTreeIcon(tree.type);
            const color = getTreeColor(tree);
            const opacity = getStatusOpacity(tree.status);

            return (
              <div
                key={tree.id}
                className="absolute cursor-pointer group"
                style={{ 
                  left: `${tree.location.x}%`, 
                  top: `${tree.location.y}%`,
                  opacity 
                }}
                onMouseEnter={() => setHoveredTree(tree)}
                onMouseLeave={() => setHoveredTree(null)}
                onClick={() => onSelectTree(tree)}
              >
                {/* Marker */}
                <div 
                  className="w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-transform group-hover:scale-125"
                  style={{ backgroundColor: color }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Hover tooltip */}
                {hoveredTree?.id === tree.id && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20">
                    <Card className="p-3 shadow-xl min-w-[200px]">
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{tree.commonName}</p>
                          <p className="text-xs text-muted-foreground italic">{tree.scientificName}</p>
                        </div>
                      </div>
                      {tree.isNative && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                          Native
                        </Badge>
                      )}
                      {tree.age && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {tree.age} years old
                        </p>
                      )}
                    </Card>
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {filteredTrees.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <TreePine className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {showNativeOnly 
                    ? "No native trees in your inventory yet" 
                    : "Add trees to see them on the map"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="absolute bottom-6 left-6 right-6">
        <Card className="p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTrees.length} of {trees.length} trees
            </p>
            <p className="text-xs text-muted-foreground">
              Click any tree marker for details
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}