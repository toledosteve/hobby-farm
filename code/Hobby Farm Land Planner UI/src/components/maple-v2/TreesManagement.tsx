import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft, Plus, MoreVertical, MapPin } from "lucide-react";
import type { MapleTree } from "./types";

interface TreesManagementProps {
  trees: MapleTree[];
  onAddTree: () => void;
  onBack: () => void;
}

export function TreesManagement({ trees, onAddTree, onBack }: TreesManagementProps) {
  const getSpeciesLabel = (species: string) => {
    switch (species) {
      case 'sugar-maple':
        return 'Sugar Maple';
      case 'red-maple':
        return 'Red Maple';
      case 'silver-maple':
        return 'Silver Maple';
      case 'black-maple':
        return 'Black Maple';
      default:
        return species;
    }
  };

  const getHealthConfig = (health: string) => {
    switch (health) {
      case 'healthy':
        return {
          label: 'Healthy',
          className: 'bg-primary/10 text-primary border-primary/20',
        };
      case 'stressed':
        return {
          label: 'Stressed',
          className:
            'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
        };
      case 'declining':
        return {
          label: 'Declining',
          className: 'bg-destructive/10 text-destructive border-destructive/20',
        };
      default:
        return {
          label: health,
          className: 'bg-muted text-muted-foreground border-border',
        };
    }
  };

  const getRecommendedTaps = (diameter: number) => {
    if (diameter < 10) return 0;
    if (diameter < 18) return 1;
    if (diameter < 25) return 2;
    return 3;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h2>Sugar Bush Management</h2>
            <p className="text-sm text-muted-foreground">
              {trees.length} tree{trees.length !== 1 ? 's' : ''} registered
            </p>
          </div>
        </div>
        <Button onClick={onAddTree}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tree
        </Button>
      </div>

      {/* Trees Grid */}
      {trees.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No Trees Yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Start by adding the maple trees in your sugar bush. Track their
              health, size, and tap capacity.
            </p>
            <Button onClick={onAddTree}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Tree
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trees.map((tree) => {
            const healthConfig = getHealthConfig(tree.health);
            const recommendedTaps = getRecommendedTaps(tree.diameter);

            return (
              <Card key={tree.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 truncate">
                      {tree.nickname || `${getSpeciesLabel(tree.species)}`}
                    </h3>
                    {tree.nickname && (
                      <p className="text-xs text-muted-foreground">
                        {getSpeciesLabel(tree.species)}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* Diameter */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Diameter (DBH)</span>
                    <span className="font-medium">{tree.diameter}"</span>
                  </div>

                  {/* Recommended Taps */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Recommended Taps</span>
                    <span className="font-medium">{recommendedTaps}</span>
                  </div>

                  {/* Health Status */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Health</span>
                    <Badge variant="outline" className={healthConfig.className}>
                      {healthConfig.label}
                    </Badge>
                  </div>

                  {/* Notes */}
                  {tree.notes && (
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tree.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
