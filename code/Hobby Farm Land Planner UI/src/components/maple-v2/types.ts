// Maple Sugaring Operations Types

export type TreeSpecies = 'sugar-maple' | 'red-maple' | 'silver-maple' | 'black-maple';
export type TapType = 'bucket' | 'spile' | 'tubing';
export type BoilMethod = 'evaporator' | 'pan' | 'outdoor-arch' | 'indoor-stove';
export type SeasonStatus = 'pre-season' | 'active' | 'slowdown' | 'closed';
export type SapFlowLevel = 'high' | 'moderate' | 'low' | 'dormant';
export type TreeHealth = 'healthy' | 'stressed' | 'declining';

export interface Season {
  id: string;
  year: number;
  name: string;
  startDate: string;
  endDate?: string;
  status: SeasonStatus;
  notes?: string;
}

export interface MapleTree {
  id: string;
  seasonId: string;
  nickname?: string;
  species: TreeSpecies;
  diameter: number; // DBH in inches
  latitude?: number;
  longitude?: number;
  health: TreeHealth;
  notes?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tap {
  id: string;
  seasonId: string;
  treeId: string;
  tapType: TapType;
  installDate: string;
  removeDate?: string;
  isActive: boolean;
  hasIssue?: boolean;
  issueType?: string;
  notes?: string;
}

export interface SapCollection {
  id: string;
  seasonId: string;
  date: string;
  time: string;
  volumeGallons: number;
  collectionMethod: 'bucket' | 'tubing' | 'mixed';
  temperature?: number;
  weatherCondition?: string;
  notes?: string;
  createdAt: string;
}

export interface BoilSession {
  id: string;
  seasonId: string;
  startTime: string;
  endTime: string;
  sapInputGallons: number;
  syrupOutputGallons: number;
  boilMethod: BoilMethod;
  fuelUsed?: string;
  fuelAmount?: number;
  notes?: string;
  createdAt: string;
}

export interface SeasonMetrics {
  tapsInstalled: number;
  sapCollected: number; // gallons
  boilsCompleted: number;
  syrupProduced: number; // gallons
  avgSapPerTap: number;
  sapToSyrupRatio: number;
  trends: {
    taps: 'up' | 'down' | 'neutral';
    sap: 'up' | 'down' | 'neutral';
    boils: 'up' | 'down' | 'neutral';
    syrup: 'up' | 'down' | 'neutral';
  };
}

export interface SapFlowForecast {
  date: string;
  dayOfWeek: string;
  highTemp: number;
  lowTemp: number;
  flowLevel: SapFlowLevel;
  recommendation: string;
  freezeThaw: boolean;
}

export interface ActivityTimelineItem {
  id: string;
  type: 'season-start' | 'tree-added' | 'tap-installed' | 'collection' | 'boil' | 'season-closed';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export interface SeasonComparison {
  currentSeason: {
    taps: number;
    sapCollected: number;
    syrupProduced: number;
    avgSapPerTap: number;
  };
  previousSeason?: {
    taps: number;
    sapCollected: number;
    syrupProduced: number;
    avgSapPerTap: number;
  };
  industryAverage?: {
    avgSapPerTap: number;
    avgSapToSyrupRatio: number;
  };
}
