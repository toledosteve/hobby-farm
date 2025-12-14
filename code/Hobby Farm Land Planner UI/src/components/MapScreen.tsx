import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MapArea } from "./MapArea";
import { SaveProjectModal } from "./SaveProjectModal";
import { FarmIntelligenceMap } from "./map/FarmIntelligenceMap";
import { Button } from "./ui/button";
import { ArrowLeft, Map as MapIcon } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface MapScreenProps {
  currentProject?: {
    name: string;
    acres: number;
  };
  onBackToDashboard: () => void;
  onLogout?: () => void;
}

export function MapScreen({ currentProject, onBackToDashboard, onLogout }: MapScreenProps) {
  const [useIntelligenceMap, setUseIntelligenceMap] = useState(true);
  const [hasBoundary, setHasBoundary] = useState(false);
  const [showSoilLayer, setShowSoilLayer] = useState(true);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [markers, setMarkers] = useState<any[]>([]);

  const handleDrawBoundary = () => {
    toast.success("Draw mode activated. Click on the map to create your boundary.");
    // Simulate drawing a boundary
    setTimeout(() => {
      setHasBoundary(true);
      toast.success("Boundary created! Analyzing soil data...");
    }, 1500);
  };

  const handleImportBoundary = () => {
    toast.info("File import dialog would open here");
  };

  const handleRedraw = () => {
    setHasBoundary(false);
    setMarkers([]);
    toast.info("Boundary cleared. You can now redraw.");
  };

  const handleAddMarker = (type: string) => {
    const newMarker = {
      id: Date.now().toString(),
      type,
      x: 50 + Math.random() * 20,
      y: 30 + Math.random() * 30,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Marker`,
    };
    setMarkers([...markers, newMarker]);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} marker added`);
  };

  const handleDrawPath = () => {
    toast.info("Path drawing tool activated");
  };

  const handleDrawZone = () => {
    toast.info("Zone drawing tool activated");
  };

  const handleSaveProject = (name: string, notes: string) => {
    toast.success(`Project \"${name}\" saved successfully!`);
  };

  // If using Intelligence Map, show full-screen map experience
  if (useIntelligenceMap) {
    return (
      <div className="h-full relative">
        <FarmIntelligenceMap currentProject={currentProject} />
        
        {/* Toggle button to switch back to classic map */}
        <div className="absolute top-4 right-96 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseIntelligenceMap(false)}
            className="bg-white shadow-lg"
          >
            <MapIcon className="w-4 h-4 mr-2" />
            Classic Map
          </Button>
        </div>
      </div>
    );
  }

  // Classic map view with sidebar
  return (
    <div className="h-full flex overflow-hidden relative">
      {/* Toggle to Intelligence Map */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="default"
          size="sm"
          onClick={() => setUseIntelligenceMap(true)}
          className="shadow-lg"
        >
          <MapIcon className="w-4 h-4 mr-2" />
          Intelligence Map
        </Button>
      </div>

      <Sidebar
        hasBoundary={hasBoundary}
        acres={currentProject?.acres || 25}
        perimeter={4250}
        onDrawBoundary={handleDrawBoundary}
        onImportBoundary={handleImportBoundary}
        onRedraw={handleRedraw}
        onAddMarker={handleAddMarker}
        onDrawPath={handleDrawPath}
        onDrawZone={handleDrawZone}
      />
      
      <MapArea
        hasBoundary={hasBoundary}
        markers={markers}
        showSoilLayer={showSoilLayer}
        onToggleSoilLayer={setShowSoilLayer}
      />

      <SaveProjectModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        onSave={handleSaveProject}
      />
    </div>
  );
}