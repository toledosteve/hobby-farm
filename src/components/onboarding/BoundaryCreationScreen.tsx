import { useState } from "react";
import { Button } from "../ui/button";
import { OnboardingLayout } from "./OnboardingLayout";
import { MousePointer2, Upload, Ruler, CheckCircle } from "lucide-react";

interface BoundaryCreationScreenProps {
  projectName: string;
  onContinue: (acreage: number) => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function BoundaryCreationScreen({
  projectName,
  onContinue,
  onBack,
  onLogout,
}: BoundaryCreationScreenProps) {
  const [mode, setMode] = useState<"draw" | "import" | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [boundaryComplete, setBoundaryComplete] = useState(false);
  const [calculatedAcreage, setCalculatedAcreage] = useState<number | null>(null);

  const handleStartDrawing = () => {
    setMode("draw");
    setIsDrawing(true);
  };

  const handleCompleteBoundary = () => {
    setIsDrawing(false);
    setBoundaryComplete(true);
    setCalculatedAcreage(24.7); // Mock calculation
  };

  const handleImportFile = () => {
    setMode("import");
    // In real app, trigger file upload
    setTimeout(() => {
      setBoundaryComplete(true);
      setCalculatedAcreage(26.3);
    }, 1000);
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={6} onBack={onBack} onLogout={onLogout}>
      <div className="h-[calc(100vh-65px)] flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-96 bg-card border-b lg:border-b-0 lg:border-r border-border p-6 space-y-6 overflow-y-auto">
          <div>
            <h1 className="mb-2">Draw Your Boundary</h1>
            <p className="text-sm text-muted-foreground">
              Create an accurate boundary for {projectName} by drawing on the map or
              importing a file.
            </p>
          </div>

          {/* Drawing Instructions */}
          {!mode && (
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <MousePointer2 className="w-4 h-4 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm">
                      <strong>Draw Manually</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click around the edges of your property. Double-click to close the
                      boundary.
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleStartDrawing} size="lg" className="w-full">
                <MousePointer2 className="w-4 h-4 mr-2" />
                Start Drawing Boundary
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">or</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm">
                  <strong>Import Boundary File</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Upload a KML or GeoJSON file containing your property boundary.
                </p>
                <Button
                  onClick={handleImportFile}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import KML / GeoJSON
                </Button>
              </div>
            </div>
          )}

          {/* Drawing In Progress */}
          {isDrawing && !boundaryComplete && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Drawing Mode Active</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on the map to add points. Double-click to complete the boundary.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleCompleteBoundary}
                  size="lg"
                  className="w-full"
                >
                  Complete Boundary
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDrawing(false);
                    setMode(null);
                  }}
                  className="w-full"
                >
                  Cancel Drawing
                </Button>
              </div>
            </div>
          )}

          {/* Boundary Complete */}
          {boundaryComplete && calculatedAcreage !== null && (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="w-5 h-5" />
                  <p>
                    <strong>Boundary Complete!</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Ruler className="w-4 h-4" />
                      <span className="text-sm">Calculated Area:</span>
                    </div>
                    <div>
                      <span className="text-2xl">{calculatedAcreage}</span>
                      <span className="text-sm text-muted-foreground ml-1">acres</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => onContinue(calculatedAcreage)}
                  size="lg"
                  className="w-full"
                >
                  Continue to Soil Analysis
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBoundaryComplete(false);
                    setCalculatedAcreage(null);
                    setMode(null);
                  }}
                  className="w-full"
                >
                  Redraw Boundary
                </Button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm mb-2">Tips</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Be as accurate as possible for better soil analysis</li>
              <li>• You can zoom in for precise boundary placement</li>
              <li>• Don&apos;t worry, you can edit this later</li>
            </ul>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <div className="w-full max-w-2xl mx-auto">
                {/* Mock Boundary Drawing */}
                {boundaryComplete ? (
                  <div className="relative w-full h-96 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 rounded-lg flex items-center justify-center border-2 border-primary">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 400 300"
                    >
                      <polygon
                        points="80,80 320,100 300,220 100,200"
                        fill="rgba(45, 95, 63, 0.2)"
                        stroke="rgba(45, 95, 63, 0.8)"
                        strokeWidth="3"
                      />
                      <circle cx="80" cy="80" r="6" fill="#2D5F3F" />
                      <circle cx="320" cy="100" r="6" fill="#2D5F3F" />
                      <circle cx="300" cy="220" r="6" fill="#2D5F3F" />
                      <circle cx="100" cy="200" r="6" fill="#2D5F3F" />
                    </svg>
                    <div className="relative z-10 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                      <p className="text-sm">
                        <strong>{calculatedAcreage} acres</strong>
                      </p>
                    </div>
                  </div>
                ) : isDrawing ? (
                  <div className="w-full h-96 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-primary/5 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-500/50">
                    <div className="text-center space-y-2">
                      <MousePointer2 className="w-12 h-12 text-blue-500 mx-auto animate-pulse" />
                      <p className="text-sm">Click on map to draw boundary</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center space-y-2">
                      <MousePointer2 className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Interactive map for boundary drawing
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Drawing Overlay Instruction */}
          {isDrawing && !boundaryComplete && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
              <p className="text-sm">
                Click around the edges of your land to create a boundary
              </p>
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}