import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MapArea } from "./MapArea";
import { SaveProjectModal } from "./SaveProjectModal";
import { toast } from "sonner";
import { useProjects } from "@/contexts/ProjectContext";

export function MapScreen() {
  const { currentProject } = useProjects();
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
    toast.success(`Project "${name}" saved successfully!`);
  };

  return (
    <div className="h-full flex overflow-hidden">
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