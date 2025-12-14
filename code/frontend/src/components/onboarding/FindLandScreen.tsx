import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { OnboardingLayout } from "./OnboardingLayout";
import { Search, MapPin, Navigation } from "lucide-react";

interface FindLandScreenProps {
  projectName: string;
  city: string;
  state: string;
  onContinue: () => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function FindLandScreen({
  projectName,
  city,
  state,
  onContinue,
  onBack,
  onLogout,
}: FindLandScreenProps) {
  const displayLocation = [city, state].filter(Boolean).join(', ');
  const [searchQuery, setSearchQuery] = useState(displayLocation);
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });

  return (
    <OnboardingLayout currentStep={2} totalSteps={6} onBack={onBack} onLogout={onLogout}>
      <div className="h-[calc(100vh-65px)] flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-96 bg-card border-b lg:border-b-0 lg:border-r border-border p-6 space-y-6 overflow-y-auto">
          <div>
            <h1 className="mb-2">Find Your Land</h1>
            <p className="text-sm text-muted-foreground">
              Locate your property on the map to get started. You can search by address,
              enter coordinates, or zoom manually.
            </p>
          </div>

          {/* Search by Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="text-sm">Search Address</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter address or place name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full">
              Search on Map
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Enter Coordinates */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              <h3 className="text-sm">Enter Coordinates</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Latitude"
                value={coordinates.lat}
                onChange={(e) =>
                  setCoordinates({ ...coordinates, lat: e.target.value })
                }
              />
              <Input
                placeholder="Longitude"
                value={coordinates.lng}
                onChange={(e) =>
                  setCoordinates({ ...coordinates, lng: e.target.value })
                }
              />
            </div>
            <Button variant="outline" className="w-full">
              Go to Location
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <strong>Next Step:</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Once you&apos;ve located your property, click the button below to start
                drawing your land boundary.
              </p>
            </div>
          </div>

          <Button onClick={onContinue} size="lg" className="w-full">
            Start Boundary Drawing
          </Button>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-muted">
          {/* Placeholder Map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="space-y-2">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Interactive Map View
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Location: {displayLocation}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                In production, this would show an interactive map centered on{" "}
                <strong>{displayLocation}</strong> where you can pan, zoom, and locate your
                property.
              </p>
            </div>
          </div>

          {/* Map Controls (Placeholder) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="sm" variant="outline" className="bg-card">
              +
            </Button>
            <Button size="sm" variant="outline" className="bg-card">
              −
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}