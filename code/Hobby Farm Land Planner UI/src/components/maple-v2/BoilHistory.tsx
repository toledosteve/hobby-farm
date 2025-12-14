import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft, Plus, Beaker, Clock, TrendingUp } from "lucide-react";
import type { BoilSession } from "./types";

interface BoilHistoryProps {
  boils: BoilSession[];
  onLogBoil: () => void;
  onBack: () => void;
}

export function BoilHistory({ boils, onLogBoil, onBack }: BoilHistoryProps) {
  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'evaporator':
        return 'Evaporator';
      case 'pan':
        return 'Flat Pan';
      case 'outdoor-arch':
        return 'Outdoor Arch';
      case 'indoor-stove':
        return 'Indoor Stove';
      default:
        return method;
    }
  };

  const totalSyrup = boils.reduce((sum, b) => sum + b.syrupOutputGallons, 0);
  const totalSap = boils.reduce((sum, b) => sum + b.sapInputGallons, 0);
  const avgRatio = totalSap / Math.max(totalSyrup, 0.01);

  // Sort by date descending
  const sortedBoils = [...boils].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  const getBoilDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
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
            <h2>Boil History</h2>
            <p className="text-sm text-muted-foreground">
              {boils.length} boil session{boils.length !== 1 ? 's' : ''} completed
              this season
            </p>
          </div>
        </div>
        <Button onClick={onLogBoil}>
          <Plus className="w-4 h-4 mr-2" />
          Log Boil
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Total Syrup</p>
          <p className="text-3xl font-semibold">{totalSyrup.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">gallons</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Sap Boiled</p>
          <p className="text-3xl font-semibold">{totalSap.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">gallons</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Avg Ratio</p>
          <p className="text-3xl font-semibold">{avgRatio.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">:1 sap-to-syrup</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Boil Sessions</p>
          <p className="text-3xl font-semibold">{boils.length}</p>
        </Card>
      </div>

      {/* Boils List */}
      {boils.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Beaker className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No Boil Sessions</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Log your boil sessions to track syrup production, efficiency, and fuel
              usage over the season.
            </p>
            <Button onClick={onLogBoil}>
              <Plus className="w-4 h-4 mr-2" />
              Log Your First Boil
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedBoils.map((boil) => {
            const ratio = (boil.sapInputGallons / boil.syrupOutputGallons).toFixed(1);
            const duration = getBoilDuration(boil.startTime, boil.endTime);
            const startDate = new Date(boil.startTime);

            return (
              <Card key={boil.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                    <Beaker className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-medium mb-1">
                          {boil.syrupOutputGallons.toFixed(2)} gal syrup produced
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {startDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {getMethodLabel(boil.boilMethod)}
                      </Badge>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 rounded-lg bg-muted/30 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Sap Input</p>
                        <p className="text-sm font-medium">
                          {boil.sapInputGallons.toFixed(1)} gal
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Syrup Output</p>
                        <p className="text-sm font-medium">
                          {boil.syrupOutputGallons.toFixed(2)} gal
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Ratio</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-primary" />
                          <p className="text-sm font-medium">{ratio}:1</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <p className="text-sm font-medium">{duration}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fuel Info */}
                    {boil.fuelUsed && (
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="capitalize">{boil.fuelUsed}</span>
                        {boil.fuelAmount && `: ${boil.fuelAmount} `}
                        {boil.fuelUsed === 'wood' && boil.fuelAmount && 'cords'}
                        {boil.fuelUsed === 'propane' && boil.fuelAmount && 'lbs'}
                      </div>
                    )}

                    {/* Notes */}
                    {boil.notes && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground">{boil.notes}</p>
                      </div>
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
