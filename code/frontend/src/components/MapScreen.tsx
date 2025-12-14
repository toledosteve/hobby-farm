import { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { MapArea } from './MapArea';
import { SaveProjectModal } from './SaveProjectModal';
import { toast } from 'sonner';
import { useProjects } from '@/contexts/ProjectContext';
import { Boundary, GeoJSONPolygon, SoilFeatureCollection, MapMarker, MapPath, MapZone, MarkerType } from '@/types';
import {
  parseKML,
  parseGeoJSON,
  geoJSONToLatLngs,
  calculateAcres,
  calculatePerimeterFeet,
  calculatePathLength,
} from '@/lib/geo-utils';

// Drawing mode types
type DrawingMode = 'none' | 'boundary' | 'marker' | 'path' | 'zone';

export function MapScreen() {
  const { currentProject, updateProject } = useProjects();
  const [showSoilLayer, setShowSoilLayer] = useState(true);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('none');
  const [pendingMarkerType, setPendingMarkerType] = useState<MarkerType | null>(null);
  const [selectedSoil, setSelectedSoil] = useState<string | null>(null);
  const [soilGeometries, setSoilGeometries] = useState<SoilFeatureCollection | null>(null);

  // For backwards compatibility
  const isDrawing = drawingMode === 'boundary';

  // Determine if boundary exists from project
  const hasBoundary = !!currentProject?.boundary;
  const boundary = currentProject?.boundary;
  const acres = boundary?.acres ?? currentProject?.acres;
  const perimeter = boundary?.perimeterFeet;

  // Start drawing boundary mode
  const handleDrawBoundary = useCallback(() => {
    setDrawingMode('boundary');
    toast.info('Drawing mode activated. Click on the map to create your boundary.');
  }, []);

  // Handle boundary draw completion
  const handleDrawComplete = useCallback(
    async (newBoundary: Boundary) => {
      setDrawingMode('none');

      if (!currentProject) {
        toast.error('No project selected');
        return;
      }

      try {
        await updateProject(currentProject.id, {
          boundary: newBoundary,
          acres: newBoundary.acres,
        });
        toast.success(`Boundary saved! ${newBoundary.acres} acres calculated.`);
      } catch (err) {
        console.error('Failed to save boundary:', err);
        toast.error('Failed to save boundary');
      }
    },
    [currentProject, updateProject]
  );

  // Cancel any drawing mode
  const handleDrawCancel = useCallback(() => {
    setDrawingMode('none');
    setPendingMarkerType(null);
    toast.info('Drawing cancelled.');
  }, []);

  // Import boundary from file
  const handleImportBoundary = useCallback(async () => {
    if (!currentProject) {
      toast.error('No project selected');
      return;
    }

    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.kml,.geojson,.json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        let geojson: GeoJSONPolygon | null = null;

        if (file.name.toLowerCase().endsWith('.kml')) {
          geojson = await parseKML(file);
        } else {
          geojson = await parseGeoJSON(file);
        }

        if (!geojson) {
          toast.error('Could not parse boundary from file. Please ensure it contains a valid polygon.');
          return;
        }

        // Calculate area and perimeter
        const latlngs = geoJSONToLatLngs(geojson);
        const calculatedAcres = calculateAcres(latlngs);
        const perimeterFeet = calculatePerimeterFeet(latlngs);

        const newBoundary: Boundary = {
          geojson,
          acres: calculatedAcres,
          perimeterFeet,
        };

        await updateProject(currentProject.id, {
          boundary: newBoundary,
          acres: calculatedAcres,
        });

        toast.success(`Boundary imported! ${calculatedAcres} acres calculated.`);
      } catch (err) {
        console.error('Failed to import boundary:', err);
        toast.error('Failed to import boundary');
      }
    };

    input.click();
  }, [currentProject, updateProject]);

  // Redraw/clear boundary
  const handleRedraw = useCallback(async () => {
    if (!currentProject) {
      toast.error('No project selected');
      return;
    }

    try {
      await updateProject(currentProject.id, {
        boundary: null,
      });
      toast.info('Boundary cleared. You can now redraw.');
    } catch (err) {
      console.error('Failed to clear boundary:', err);
      toast.error('Failed to clear boundary');
    }
  }, [currentProject, updateProject]);

  // Start marker placement mode
  const handleAddMarker = useCallback((type: string) => {
    if (!currentProject) {
      toast.error('No project selected');
      return;
    }
    setPendingMarkerType(type as MarkerType);
    setDrawingMode('marker');
    toast.info('Click on the map to place your marker.');
  }, [currentProject]);

  // Handle marker placement
  const handleMarkerPlaced = useCallback(
    async (coordinates: [number, number]) => {
      if (!currentProject || !pendingMarkerType) return;

      const newMarker: MapMarker = {
        id: crypto.randomUUID(),
        type: pendingMarkerType,
        coordinates,
        createdAt: new Date().toISOString(),
      };

      const updatedMarkers = [...(currentProject.markers || []), newMarker];

      try {
        await updateProject(currentProject.id, { markers: updatedMarkers });
        toast.success('Marker added!');
      } catch (err) {
        console.error('Failed to add marker:', err);
        toast.error('Failed to add marker');
      }

      setDrawingMode('none');
      setPendingMarkerType(null);
    },
    [currentProject, pendingMarkerType, updateProject]
  );

  // Start path drawing mode
  const handleDrawPath = useCallback(() => {
    if (!currentProject) {
      toast.error('No project selected');
      return;
    }
    setDrawingMode('path');
    toast.info('Click to add path points. Double-click to finish.');
  }, [currentProject]);

  // Handle path completion
  const handlePathComplete = useCallback(
    async (coordinates: [number, number][]) => {
      if (!currentProject) return;

      const lengthFeet = calculatePathLength(coordinates.map(c => ({ lat: c[0], lng: c[1] })));

      const newPath: MapPath = {
        id: crypto.randomUUID(),
        coordinates,
        lengthFeet,
        createdAt: new Date().toISOString(),
      };

      const updatedPaths = [...(currentProject.paths || []), newPath];

      try {
        await updateProject(currentProject.id, { paths: updatedPaths });
        toast.success(`Path added! ${Math.round(lengthFeet).toLocaleString()} feet`);
      } catch (err) {
        console.error('Failed to add path:', err);
        toast.error('Failed to add path');
      }

      setDrawingMode('none');
    },
    [currentProject, updateProject]
  );

  // Start zone drawing mode
  const handleDrawZone = useCallback(() => {
    if (!currentProject) {
      toast.error('No project selected');
      return;
    }
    setDrawingMode('zone');
    toast.info('Click to add zone points. Double-click or click first point to close.');
  }, [currentProject]);

  // Handle zone completion
  const handleZoneComplete = useCallback(
    async (coordinates: [number, number][]) => {
      if (!currentProject) return;

      const latlngs = coordinates.map(c => ({ lat: c[0], lng: c[1] }));
      const zoneAcres = calculateAcres(latlngs);

      const newZone: MapZone = {
        id: crypto.randomUUID(),
        geojson: {
          type: 'Polygon',
          coordinates: [coordinates.map(c => [c[1], c[0]])], // Convert to [lng, lat]
        },
        acres: zoneAcres,
        createdAt: new Date().toISOString(),
      };

      const updatedZones = [...(currentProject.zones || []), newZone];

      try {
        await updateProject(currentProject.id, { zones: updatedZones });
        toast.success(`Zone added! ${zoneAcres.toFixed(2)} acres`);
      } catch (err) {
        console.error('Failed to add zone:', err);
        toast.error('Failed to add zone');
      }

      setDrawingMode('none');
    },
    [currentProject, updateProject]
  );

  // Delete a marker
  const handleDeleteMarker = useCallback(
    async (markerId: string) => {
      if (!currentProject) return;

      const updatedMarkers = (currentProject.markers || []).filter(m => m.id !== markerId);

      try {
        await updateProject(currentProject.id, { markers: updatedMarkers });
        toast.success('Marker deleted');
      } catch (err) {
        console.error('Failed to delete marker:', err);
        toast.error('Failed to delete marker');
      }
    },
    [currentProject, updateProject]
  );

  // Delete a path
  const handleDeletePath = useCallback(
    async (pathId: string) => {
      if (!currentProject) return;

      const updatedPaths = (currentProject.paths || []).filter(p => p.id !== pathId);

      try {
        await updateProject(currentProject.id, { paths: updatedPaths });
        toast.success('Path deleted');
      } catch (err) {
        console.error('Failed to delete path:', err);
        toast.error('Failed to delete path');
      }
    },
    [currentProject, updateProject]
  );

  // Delete a zone
  const handleDeleteZone = useCallback(
    async (zoneId: string) => {
      if (!currentProject) return;

      const updatedZones = (currentProject.zones || []).filter(z => z.id !== zoneId);

      try {
        await updateProject(currentProject.id, { zones: updatedZones });
        toast.success('Zone deleted');
      } catch (err) {
        console.error('Failed to delete zone:', err);
        toast.error('Failed to delete zone');
      }
    },
    [currentProject, updateProject]
  );

  const handleSaveProject = (_name: string, _notes: string) => {
    toast.success(`Project saved successfully!`);
  };

  return (
    <div className="absolute inset-0 flex overflow-hidden">
      <Sidebar
        hasBoundary={hasBoundary}
        boundary={boundary}
        acres={acres}
        perimeter={perimeter}
        onDrawBoundary={handleDrawBoundary}
        onImportBoundary={handleImportBoundary}
        onRedraw={handleRedraw}
        onAddMarker={handleAddMarker}
        onDrawPath={handleDrawPath}
        onDrawZone={handleDrawZone}
        selectedSoil={selectedSoil}
        onSelectSoil={setSelectedSoil}
        onSoilGeometriesLoaded={setSoilGeometries}
      />

      <MapArea
        address={currentProject?.address}
        city={currentProject?.city}
        state={currentProject?.state}
        zipCode={currentProject?.zipCode}
        latitude={currentProject?.latitude}
        longitude={currentProject?.longitude}
        boundary={boundary}
        isDrawing={isDrawing}
        onDrawBoundary={handleDrawBoundary}
        onDrawComplete={handleDrawComplete}
        onDrawCancel={handleDrawCancel}
        showSoilLayer={showSoilLayer}
        onToggleSoilLayer={setShowSoilLayer}
        soilGeometries={soilGeometries}
        selectedSoil={selectedSoil}
        onSelectSoil={setSelectedSoil}
        // Map annotations
        markers={currentProject?.markers || []}
        paths={currentProject?.paths || []}
        zones={currentProject?.zones || []}
        drawingMode={drawingMode}
        pendingMarkerType={pendingMarkerType}
        onMarkerPlaced={handleMarkerPlaced}
        onPathComplete={handlePathComplete}
        onZoneComplete={handleZoneComplete}
        onDeleteMarker={handleDeleteMarker}
        onDeletePath={handleDeletePath}
        onDeleteZone={handleDeleteZone}
      />

      <SaveProjectModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        onSave={handleSaveProject}
      />
    </div>
  );
}
