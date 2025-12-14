// Farm Intelligence Map Types

export type MapMode = 
  | 'land-suitability'
  | 'trees-orchard'
  | 'poultry-livestock'
  | 'pollination-bees'
  | 'weather-water'
  | 'planning';

export type SoilType = 
  | 'loam'
  | 'sandy-loam'
  | 'clay-loam'
  | 'silt-loam'
  | 'clay'
  | 'sandy'
  | 'organic';

export type DrainageClass = 
  | 'well-drained'
  | 'moderately-well-drained'
  | 'somewhat-poorly-drained'
  | 'poorly-drained'
  | 'very-poorly-drained';

export type RunoffPotential = 'low' | 'moderate' | 'high' | 'very-high';

export type SuitabilityLevel = 'excellent' | 'good' | 'fair' | 'marginal' | 'poor';

export interface SoilData {
  type: SoilType;
  drainageClass: DrainageClass;
  runoffPotential: RunoffPotential;
  slope: number; // percentage
  pH: number;
  organicMatter: number; // percentage
  primeFarmland: boolean;
}

export interface MapInsight {
  id: string;
  title: string;
  description: string; // "What's happening"
  impact: string; // "Why it matters"
  suggestions: string[]; // "What you can do"
  severity: 'info' | 'notice' | 'important';
  relatedModules?: string[];
  location?: { lat: number; lng: number };
}

export interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  category: 'data' | 'module' | 'planning';
  mapMode?: MapMode;
  opacity?: number;
}

export interface TreeMapObject {
  id: string;
  name: string;
  species: string;
  location: { lat: number; lng: number };
  rootZoneRadius: number; // meters
  healthStatus: string;
}

export interface HiveMapObject {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  foragingRadius: number; // meters
  colonyStatus: string;
}

export interface CoopMapObject {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  capacity: number;
  currentFlocks: number;
}

export interface PlannedArea {
  id: string;
  type: 'orchard' | 'garden' | 'pasture' | 'infrastructure';
  name: string;
  coordinates: Array<{ lat: number; lng: number }>;
  notes?: string;
  suitability?: SuitabilityLevel;
  warnings?: string[];
}

export interface WeatherZone {
  id: string;
  type: 'frost-pocket' | 'wind-corridor' | 'standing-water' | 'heat-zone';
  coordinates: Array<{ lat: number; lng: number }>;
  severity: 'low' | 'moderate' | 'high';
  description: string;
}

export interface MapTool {
  id: 'draw-area' | 'measure' | 'add-marker' | 'select';
  name: string;
  icon: string;
  active: boolean;
}
