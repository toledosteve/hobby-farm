import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft, Plus, Droplets, Cloud, CloudRain, Sun, Snowflake } from "lucide-react";
import type { SapCollection } from "./types";

interface CollectionHistoryProps {
  collections: SapCollection[];
  onLogCollection: () => void;
  onBack: () => void;
}

export function CollectionHistory({
  collections,
  onLogCollection,
  onBack,
}: CollectionHistoryProps) {
  const getWeatherIcon = (condition?: string) => {
    if (!condition) return Cloud;
    switch (condition.toLowerCase()) {
      case 'sunny':
        return Sun;
      case 'rainy':
        return CloudRain;
      case 'snowy':
        return Snowflake;
      default:
        return Cloud;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'bucket':
        return 'Bucket';
      case 'tubing':
        return 'Tubing';
      case 'mixed':
        return 'Mixed';
      default:
        return method;
    }
  };

  const totalCollected = collections.reduce((sum, c) => sum + c.volumeGallons, 0);
  const avgPerCollection =
    collections.length > 0 ? totalCollected / collections.length : 0;

  // Sort by date descending
  const sortedCollections = [...collections].sort(
    (a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
  );

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
            <h2>Collection History</h2>
            <p className="text-sm text-muted-foreground">
              {collections.length} collection{collections.length !== 1 ? 's' : ''}{' '}
              logged this season
            </p>
          </div>
        </div>
        <Button onClick={onLogCollection}>
          <Plus className="w-4 h-4 mr-2" />
          Log Collection
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Total Collected</p>
          <p className="text-3xl font-semibold">{totalCollected.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">gallons</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Total Collections</p>
          <p className="text-3xl font-semibold">{collections.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Average per Collection</p>
          <p className="text-3xl font-semibold">{avgPerCollection.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">gal/collection</p>
        </Card>
      </div>

      {/* Collections List */}
      {collections.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Droplets className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No Collections Logged</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Start logging your sap collections to track production and identify
              optimal collection times.
            </p>
            <Button onClick={onLogCollection}>
              <Plus className="w-4 h-4 mr-2" />
              Log Your First Collection
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedCollections.map((collection) => {
            const WeatherIcon = getWeatherIcon(collection.weatherCondition);
            const date = new Date(collection.date + 'T' + collection.time);

            return (
              <Card key={collection.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                    <Droplets className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-medium">
                          {collection.volumeGallons.toFixed(1)} gallons
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          at{' '}
                          {date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {getMethodLabel(collection.collectionMethod)}
                      </Badge>
                    </div>

                    {/* Weather Info */}
                    {(collection.temperature || collection.weatherCondition) && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        {collection.temperature && (
                          <span>{collection.temperature}°F</span>
                        )}
                        {collection.weatherCondition && (
                          <div className="flex items-center gap-1.5">
                            <WeatherIcon className="w-3 h-3" />
                            <span className="capitalize">
                              {collection.weatherCondition}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {collection.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {collection.notes}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
