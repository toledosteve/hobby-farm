// Poultry Module Types

export type FlockType = 'layers' | 'meat-birds';
export type FlockStatus = 'active' | 'growing' | 'processing-planned' | 'archived';
export type BirdBreed = 'rhode-island-red' | 'plymouth-rock' | 'leghorn' | 'orpington' | 'wyandotte' | 'brahma' | 'sussex' | 'cornish-cross' | 'freedom-ranger' | 'jersey-giant' | 'other';

export interface Flock {
  id: string;
  name: string;
  type: FlockType;
  breeds: BirdBreed[];
  birdCount: number;
  hatchDate?: string;
  acquiredDate: string;
  housingLocation?: string;
  status: FlockStatus;
  photos?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EggLog {
  id: string;
  flockId: string;
  date: string;
  count: number;
  notes?: string;
  createdAt: string;
}

export type HealthActivityType = 
  | 'medication' 
  | 'supplement' 
  | 'vaccination' 
  | 'illness-observation' 
  | 'injury';

export interface HealthLog {
  id: string;
  flockId: string;
  date: string;
  activityType: HealthActivityType;
  productName?: string;
  dosage?: string;
  duration?: string;
  withdrawalPeriodDays?: number;
  withdrawalEndDate?: string;
  notes?: string;
  createdAt: string;
}

export type DailyCareType = 
  | 'feeding' 
  | 'water-check' 
  | 'coop-cleaning' 
  | 'bedding-change' 
  | 'pasture-move' 
  | 'predator-check';

export interface DailyCareLog {
  id: string;
  flockId: string;
  date: string;
  careType: DailyCareType;
  notes?: string;
  createdAt: string;
}

export interface MortalityLog {
  id: string;
  flockId: string;
  date: string;
  numberLost: number;
  cause?: string;
  notes?: string;
  createdAt: string;
}

export interface FeedLog {
  id: string;
  flockId: string;
  date: string;
  feedType: string;
  amount?: number;
  unit?: 'lbs' | 'kg' | 'bags';
  cost?: number;
  notes?: string;
  createdAt: string;
}

export interface GrowthLog {
  id: string;
  flockId: string;
  date: string;
  ageInWeeks: number;
  averageWeight?: number;
  notes?: string;
  createdAt: string;
}

// Summary interfaces for dashboard
export interface PoultryMetrics {
  totalFlocks: number;
  totalBirds: number;
  eggsThisWeek: number;
  healthAlerts: number;
  activeWithdrawals: number;
}

export interface FlockProductionData {
  flockId: string;
  flockName: string;
  data: {
    date: string;
    count: number;
  }[];
}
