// Core domain models

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Season {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

// GeoJSON types for map boundaries
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // [[[lng, lat], [lng, lat], ...]]
}

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: number[][]; // [[lng, lat], [lng, lat], ...]
}

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: number[]; // [lng, lat]
}

export interface Boundary {
  geojson: GeoJSONPolygon;
  acres: number;
  perimeterFeet: number;
}

// Map annotation types
export type MarkerType = 'tree' | 'barn' | 'sugar-shack' | 'water' | 'gate' | 'other';

export interface MapMarker {
  id: string;
  type: MarkerType;
  label?: string;
  coordinates: [number, number]; // [lat, lng]
  notes?: string;
  createdAt: string;
}

export interface MapPath {
  id: string;
  name?: string;
  color?: string;
  coordinates: [number, number][]; // [[lat, lng], ...]
  lengthFeet?: number;
  notes?: string;
  createdAt: string;
}

export interface MapZone {
  id: string;
  name?: string;
  color?: string;
  geojson: GeoJSONPolygon;
  acres?: number;
  zoneType?: 'pasture' | 'garden' | 'orchard' | 'woods' | 'wetland' | 'custom';
  notes?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  acres?: number;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  enabledModules?: string[];
  seasons?: Season[];
  currentSeasonId?: string;
  boundary?: Boundary;
  latitude?: number;
  longitude?: number;
  // Map annotations
  markers?: MapMarker[];
  paths?: MapPath[];
  zones?: MapZone[];
  createdAt: string;
  updatedAt: string;
}

export interface Flock {
  id: string;
  projectId: string;
  name: string;
  breed: string;
  birdCount: number;
  startDate: string;
  purpose: 'eggs' | 'meat' | 'dual-purpose' | 'ornamental';
  housingType: string;
  createdAt: string;
  updatedAt: string;
}

export interface EggLog {
  id: string;
  projectId: string;
  flockId: string;
  date: string;
  count: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedLog {
  id: string;
  projectId: string;
  flockId?: string;
  date: string;
  feedType: string;
  amount: number;
  unit: 'lbs' | 'kg';
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthEvent {
  id: string;
  projectId: string;
  flockId?: string;
  birdId?: string;
  date: string;
  eventType: 'treatment' | 'illness' | 'injury' | 'vaccination' | 'other';
  description: string;
  treatment?: string;
  outcome?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MapleTree {
  id: string;
  projectId: string;
  treeNumber: string;
  species: 'sugar-maple' | 'red-maple' | 'silver-maple' | 'black-maple';
  diameter: number;
  tapCount: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SapCollection {
  id: string;
  projectId: string;
  treeId?: string;
  date: string;
  gallons: number;
  sugarContent?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoilSession {
  id: string;
  projectId: string;
  date: string;
  startTime: string;
  endTime: string;
  sapInput: number;
  syrupOutput: number;
  grade?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  moduleType?: 'maple' | 'poultry' | 'general';
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export type ActivityCategory =
  | 'task'
  | 'module'
  | 'settings'
  | 'project'
  | 'maple'
  | 'poultry'
  | 'garden'
  | 'general';

export interface Activity {
  id: string;
  projectId: string;
  action: string;
  category: ActivityCategory;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// DTOs (Data Transfer Objects)
export interface CreateProjectDto {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  acres?: number;
  boundary?: Boundary;
  latitude?: number;
  longitude?: number;
}

export interface UpdateProjectDto {
  name?: string;
  acres?: number;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  enabledModules?: string[];
  boundary?: Boundary | null;
  latitude?: number;
  longitude?: number;
  markers?: MapMarker[];
  paths?: MapPath[];
  zones?: MapZone[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PasswordResetDto {
  email: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// ==================== Billing Types ====================

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid'
  | 'paused';

export interface PlanLimits {
  maxProjects: number | null; // null = unlimited
  maxModules: number | null;
  maxStorageBytes: number;
  hasWeatherForecasting: boolean;
  hasPrioritySupport: boolean;
  hasMobileAccess: boolean;
  hasAdvancedFeatures: boolean;
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string;
  stripePriceId: string;
  stripeProductId: string;
  name: string;
  description: string;
  priceMonthly: number; // in cents
  billingInterval: 'month' | 'year';
  limits: PlanLimits;
  features: PlanFeature[];
  sortOrder: number;
  isPopular: boolean;
  isActive: boolean;
  isFree: boolean;
}

export interface PaymentMethod {
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  status: SubscriptionStatus;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  paymentMethod?: PaymentMethod;
}

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export interface Invoice {
  id: string;
  userId: string;
  stripeInvoiceId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  amountDue: number; // in cents
  amountPaid: number;
  currency: string;
  status: InvoiceStatus;
  invoiceNumber?: string;
  invoicePdfUrl?: string;
  hostedInvoiceUrl?: string;
  description?: string;
  periodStart: string;
  periodEnd: string;
  paidAt?: string;
  createdAt: string;
}

export interface Usage {
  id: string;
  userId: string;
  projectCount: number;
  moduleCount: number;
  storageUsedBytes: number;
  lastCalculatedAt?: string;
}

export interface BillingSummary {
  subscription: Subscription | null;
  plan: Plan | null;
  usage: Usage | null;
  paymentMethod: PaymentMethod | null;
}

export interface CheckLimitResult {
  allowed: boolean;
  current: number;
  limit: number | null;
  message?: string;
}

// Billing DTOs
export interface CreateCheckoutSessionDto {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface ChangePlanDto {
  newPriceId: string;
}

// UI State types
export type AuthView = 'welcome' | 'signup' | 'signin' | 'forgot-password' | 'reset-confirmation';
export type MainView = 'project-list' | 'onboarding' | 'app';
export type AppTab = 'dashboard' | 'map' | 'calendar' | 'modules' | 'settings';
export type MapleView = 'dashboard' | 'trees' | 'collection-log' | 'boil-log';
export type PoultryView = 'dashboard' | 'flocks' | 'egg-log';

// ==================== Soil Types ====================

export interface SoilMapUnit {
  mukey: string;
  musym: string;
  muname: string;
  mukind: string;
  muacres?: number;
  farmlndcl?: string;
}

export interface SoilInsight {
  type: 'strength' | 'limitation' | 'recommendation';
  category: string;
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface DominantSoil {
  name: string;
  percentage: number;
  description: string;
  drainageClass?: string;
  hydrologicGroup?: string;
  slopeRange?: string;
  farmlandClass?: string;
  capabilityClass?: string;
}

export interface RecommendedZone {
  type: string;
  title: string;
  name?: string;
  description: string;
  soilTypes?: string[];
  suggestedUses?: string[];
}

export type SuitabilityRating = 'excellent' | 'good' | 'fair' | 'poor' | 'not_suited';

export interface SoilSuitability {
  cropland: SuitabilityRating;
  pasture: SuitabilityRating;
  woodland: SuitabilityRating;
  garden: SuitabilityRating;
}

export interface SoilSummary {
  provider: string;
  queryBounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  totalAcres: number;
  mapUnits: SoilMapUnit[];
  dominantSoils: DominantSoil[];
  insights: SoilInsight[];
  suitability: SoilSuitability;
  recommendedZones: RecommendedZone[];
}

export interface SoilWmsConfig {
  url: string;
  layers: string;
  format: string;
  transparent: boolean;
  attribution: string;
  version?: string;
  crs?: string;
}

export interface SoilProvider {
  name: string;
  wms: SoilWmsConfig;
}

export interface SoilFeature {
  type: 'Feature';
  properties: {
    mukey: string;
    musym: string;
    muname: string;
  };
  geometry: GeoJSONPolygon;
}

export interface SoilFeatureCollection {
  type: 'FeatureCollection';
  features: SoilFeature[];
}

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
