// Beekeeping Module Types

export type HiveType = 'langstroth' | 'top-bar' | 'warre' | 'other';
export type ColonyStatus = 'strong' | 'moderate' | 'weak' | 'unknown';
export type QueenStatus = 'sighted' | 'not-sighted' | 'unknown' | 'missing';
export type HiveTemperament = 'calm' | 'active' | 'defensive' | 'aggressive';
export type BroodPattern = 'excellent' | 'good' | 'spotty' | 'poor' | 'none';

export interface Hive {
  id: string;
  name: string;
  type: HiveType;
  location?: string;
  apiaryName?: string;
  installDate: string;
  colonyStatus: ColonyStatus;
  queenStatus?: QueenStatus;
  queenMarked?: boolean;
  queenColor?: string;
  lastInspectionDate?: string;
  notes?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  id: string;
  hiveId: string;
  date: string;
  weatherConditions?: string;
  temperatureF?: number;
  hiveTemperament: HiveTemperament;
  broodPattern?: BroodPattern;
  queenSighted: boolean;
  queenNotes?: string;
  broodFrames?: number;
  honeyFrames?: number;
  pollenStores?: 'abundant' | 'adequate' | 'low' | 'none';
  honeyStores?: 'abundant' | 'adequate' | 'low' | 'none';
  diseaseObservations?: string;
  pestObservations?: string;
  actionsTaken?: string;
  notes?: string;
  photos?: string[];
  createdAt: string;
}

export type HealthIssueType =
  | 'varroa-mite'
  | 'small-hive-beetle'
  | 'wax-moth'
  | 'chalkbrood'
  | 'foulbrood'
  | 'nosema'
  | 'other';

export interface HealthCheck {
  id: string;
  hiveId: string;
  date: string;
  issueType: HealthIssueType;
  severity?: 'minor' | 'moderate' | 'severe';
  varroaCount?: number;
  observations: string;
  actionTaken?: string;
  createdAt: string;
}

export type TreatmentType =
  | 'varroa-treatment'
  | 'antibiotic'
  | 'organic-treatment'
  | 'essential-oil'
  | 'other';

export interface Treatment {
  id: string;
  hiveId: string;
  date: string;
  treatmentType: TreatmentType;
  productName: string;
  dosage?: string;
  startDate: string;
  endDate?: string;
  honeySupersRemoved: boolean;
  withdrawalPeriodDays?: number;
  withdrawalEndDate?: string;
  notes?: string;
  createdAt: string;
}

export interface HoneyHarvest {
  id: string;
  hiveId: string;
  harvestDate: string;
  supersInstalled?: string;
  yieldPounds?: number;
  yieldGallons?: number;
  frameCount?: number;
  moistureContent?: number;
  extractionNotes?: string;
  qualityNotes?: string;
  createdAt: string;
}

export type SeasonalTaskType =
  | 'spring-inspection'
  | 'swarm-prevention'
  | 'super-installation'
  | 'honey-harvest'
  | 'fall-feeding'
  | 'winter-prep'
  | 'equipment-maintenance';

export interface SeasonalTask {
  id: string;
  hiveId?: string; // null = all hives
  taskType: SeasonalTaskType;
  description: string;
  dueDate?: string;
  completed: boolean;
  completedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface FeedingLog {
  id: string;
  hiveId: string;
  date: string;
  feedType: 'sugar-syrup' | 'fondant' | 'pollen-patty' | 'other';
  amount?: string;
  ratio?: string; // e.g., "1:1" or "2:1"
  reason?: string;
  notes?: string;
  createdAt: string;
}

// Summary interfaces for dashboard
export interface BeekeepingMetrics {
  totalHives: number;
  activeHives: number;
  hivesNeedingAttention: number;
  honeyHarvestedThisSeason: number;
  overduneInspections: number;
  activeWithdrawals: number;
}

export interface HiveProductionData {
  hiveId: string;
  hiveName: string;
  data: {
    date: string;
    yield: number;
  }[];
}
