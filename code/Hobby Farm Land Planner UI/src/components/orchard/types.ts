// Orchard Module Types

export type FruitSpecies = 
  | 'apple'
  | 'pear'
  | 'peach'
  | 'cherry'
  | 'plum'
  | 'apricot'
  | 'nectarine'
  | 'fig'
  | 'quince'
  | 'persimmon'
  | 'other';

export type TreeHealth = 'excellent' | 'good' | 'fair' | 'poor' | 'declining';
export type TrainingSystem = 'central-leader' | 'open-center' | 'espalier' | 'modified-central' | 'vase' | 'other';
export type PruningType = 'structural' | 'maintenance' | 'renewal' | 'corrective';
export type BloomStage = 'dormant' | 'bud-swell' | 'pink-bud' | 'bloom' | 'petal-fall' | 'fruit-set';

export interface FruitTree {
  id: string;
  name: string;
  species: FruitSpecies;
  variety?: string;
  rootstock?: string;
  plantingDate: string;
  treeAge: number;
  location?: string;
  rowNumber?: number;
  position?: number;
  healthStatus: TreeHealth;
  trainingSystem?: TrainingSystem;
  lastPruneDate?: string;
  expectedHarvestStart?: string;
  expectedHarvestEnd?: string;
  notes?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PruningRecord {
  id: string;
  treeId: string;
  date: string;
  pruningType: PruningType;
  trainingSystem?: TrainingSystem;
  weatherConditions?: string;
  amountRemoved?: 'light' | 'moderate' | 'heavy';
  notes?: string;
  photos?: string[];
  createdAt: string;
}

export interface BloomRecord {
  id: string;
  treeId: string;
  date: string;
  bloomStage: BloomStage;
  bloomDensity?: 'sparse' | 'moderate' | 'heavy';
  frostDamageObserved: boolean;
  frostDamageNotes?: string;
  pollinationNotes?: string;
  fruitSetQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
  photos?: string[];
  createdAt: string;
}

export interface HarvestRecord {
  id: string;
  treeId: string;
  harvestDate: string;
  yieldPounds?: number;
  yieldBushels?: number;
  fruitCount?: number;
  qualityRating?: 'poor' | 'fair' | 'good' | 'excellent';
  qualityNotes?: string;
  storageMethod?: string;
  notes?: string;
  photos?: string[];
  createdAt: string;
}

export type HealthIssueType = 
  | 'fire-blight'
  | 'apple-scab'
  | 'brown-rot'
  | 'powdery-mildew'
  | 'cedar-apple-rust'
  | 'canker'
  | 'pest-damage'
  | 'nutrient-deficiency'
  | 'drought-stress'
  | 'winter-damage'
  | 'other';

export interface TreeHealthIssue {
  id: string;
  treeId: string;
  date: string;
  issueType: HealthIssueType;
  severity?: 'minor' | 'moderate' | 'severe';
  observations: string;
  actionTaken?: string;
  resolved: boolean;
  resolvedDate?: string;
  createdAt: string;
}

export type TreatmentType = 
  | 'fungicide'
  | 'insecticide'
  | 'organic-spray'
  | 'horticultural-oil'
  | 'copper-spray'
  | 'neem-oil'
  | 'fertilizer'
  | 'other';

export interface Treatment {
  id: string;
  treeId: string;
  date: string;
  treatmentType: TreatmentType;
  productName: string;
  applicationMethod?: string;
  harvestWithdrawalDays?: number;
  harvestSafeDate?: string;
  notes?: string;
  createdAt: string;
}

export interface ThinningRecord {
  id: string;
  treeId: string;
  date: string;
  percentageRemoved?: number;
  targetSpacing?: string; // e.g., "6 inches"
  notes?: string;
  createdAt: string;
}

export type SeasonalTaskType =
  | 'dormant-pruning'
  | 'fertilize'
  | 'pest-monitoring'
  | 'fruit-thinning'
  | 'summer-pruning'
  | 'harvest-prep'
  | 'winter-protection'
  | 'equipment-maintenance';

export interface OrchardTask {
  id: string;
  treeId?: string; // null = all trees
  taskType: SeasonalTaskType;
  description: string;
  dueDate?: string;
  completed: boolean;
  completedDate?: string;
  notes?: string;
  createdAt: string;
}

// Summary interfaces for dashboard
export interface OrchardMetrics {
  totalTrees: number;
  varieties: number;
  treesNeedingPruning: number;
  estimatedHarvestPounds: number;
  upcomingHarvests: number;
  healthIssues: number;
}

export interface TreeYieldData {
  treeId: string;
  treeName: string;
  data: {
    year: number;
    yield: number;
  }[];
}

export interface HarvestForecast {
  species: FruitSpecies;
  variety: string;
  treeCount: number;
  estimatedStartDate: string;
  estimatedEndDate: string;
  estimatedYieldPounds: number;
}
