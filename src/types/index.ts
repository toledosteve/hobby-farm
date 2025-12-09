// Core domain models

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  location: string;
  acres?: number;
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

// DTOs (Data Transfer Objects)
export interface CreateProjectDto {
  name: string;
  location: string;
  acres?: number;
}

export interface UpdateProjectDto {
  name?: string;
  location?: string;
  acres?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
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

// UI State types
export type AuthView = 'welcome' | 'signup' | 'signin' | 'forgot-password' | 'reset-confirmation';
export type MainView = 'project-list' | 'onboarding' | 'app';
export type AppTab = 'dashboard' | 'map' | 'calendar' | 'modules' | 'settings';
export type MapleView = 'dashboard' | 'trees' | 'collection-log' | 'boil-log';
export type PoultryView = 'dashboard' | 'flocks' | 'egg-log';

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
