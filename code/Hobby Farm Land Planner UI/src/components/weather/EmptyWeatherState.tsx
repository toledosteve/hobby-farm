import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { CloudOff } from "lucide-react";

interface EmptyWeatherStateProps {
  onSetupLocation?: () => void;
}

export function EmptyWeatherState({ onSetupLocation }: EmptyWeatherStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <CloudOff className="w-10 h-10 text-muted-foreground" />
          </div>
          
          <h2 className="mb-3">Set Up Your Location</h2>
          
          <p className="text-muted-foreground mb-6">
            To view weather intelligence and farm-specific recommendations, we need
            to know your farm's location.
          </p>

          {onSetupLocation ? (
            <Button onClick={onSetupLocation}>
              Add Farm Location
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Please create or select a farm project to get started.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
