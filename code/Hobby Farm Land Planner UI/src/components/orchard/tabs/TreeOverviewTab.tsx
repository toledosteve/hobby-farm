import { Calendar, MapPin, TreeDeciduous } from "lucide-react";
import type { FruitTree } from "../types";

interface TreeOverviewTabProps {
  tree: FruitTree;
}

export function TreeOverviewTab({ tree }: TreeOverviewTabProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTrainingSystemLabel = (system?: FruitTree["trainingSystem"]) => {
    if (!system) return "Not specified";
    return system
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6">
      {/* Tree Profile */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-xl mb-6">Tree Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">
                Species
              </label>
              <p className="font-medium">
                {tree.species.charAt(0).toUpperCase() + tree.species.slice(1)}
              </p>
            </div>

            {tree.variety && (
              <div>
                <label className="text-sm text-muted-foreground block mb-1">
                  Variety
                </label>
                <p className="font-medium">{tree.variety}</p>
              </div>
            )}

            {tree.rootstock && (
              <div>
                <label className="text-sm text-muted-foreground block mb-1">
                  Rootstock
                </label>
                <p className="font-medium">{tree.rootstock}</p>
              </div>
            )}

            <div>
              <label className="text-sm text-muted-foreground block mb-1">
                Planting Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">{formatDate(tree.plantingDate)}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-1">
                Tree Age
              </label>
              <p className="font-medium">{tree.treeAge} years</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {tree.location && (
              <div>
                <label className="text-sm text-muted-foreground block mb-1">
                  Location
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{tree.location}</p>
                </div>
              </div>
            )}

            {(tree.rowNumber || tree.position) && (
              <div>
                <label className="text-sm text-muted-foreground block mb-1">
                  Position
                </label>
                <p className="font-medium">
                  {tree.rowNumber && `Row ${tree.rowNumber}`}
                  {tree.rowNumber && tree.position && ", "}
                  {tree.position && `Position ${tree.position}`}
                </p>
              </div>
            )}

            {tree.trainingSystem && (
              <div>
                <label className="text-sm text-muted-foreground block mb-1">
                  Training System
                </label>
                <div className="flex items-center gap-2">
                  <TreeDeciduous className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">
                    {getTrainingSystemLabel(tree.trainingSystem)}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-muted-foreground block mb-1">
                Expected Harvest
              </label>
              <p className="font-medium">
                {tree.expectedHarvestStart &&
                  new Date(tree.expectedHarvestStart).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" }
                  )}
                {tree.expectedHarvestEnd &&
                  ` - ${new Date(tree.expectedHarvestEnd).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" }
                  )}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {tree.notes && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-xl mb-4">Notes</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {tree.notes}
          </p>
        </div>
      )}

      {/* Photos Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-xl mb-4">Photos</h3>
        {tree.photos && tree.photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tree.photos.map((photo, index) => (
              <div
                key={index}
                className="aspect-square bg-muted rounded-lg overflow-hidden"
              >
                <img
                  src={photo}
                  alt={`${tree.name} photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground text-sm">
              No photos yet. Add photos to track tree development over time.
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground mb-1">
            Last Pruned
          </div>
          <div className="text-2xl font-bold">
            {tree.lastPruneDate
              ? new Date(tree.lastPruneDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Never"}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground mb-1">
            Health Status
          </div>
          <div className="text-2xl font-bold capitalize">
            {tree.healthStatus}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground mb-1">
            Added to Orchard
          </div>
          <div className="text-2xl font-bold">
            {new Date(tree.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
