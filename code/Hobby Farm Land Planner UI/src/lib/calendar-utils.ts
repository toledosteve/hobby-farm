// Calendar and Task Management Utilities

export type TaskModule = 'maple' | 'poultry' | 'garden' | 'greenhouse' | 'livestock' | 'general';
export type TaskPriority = 'low' | 'medium' | 'high';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'custom' | 'none';
export type ViewType = 'month' | 'week' | 'day' | 'list';

export interface Task {
  id: string;
  title: string;
  description?: string;
  module: TaskModule;
  date: string; // ISO date string
  endDate?: string; // For multi-day tasks
  time?: string; // HH:MM format
  allDay: boolean;
  completed: boolean;
  priority: TaskPriority;
  recurrence?: RecurrenceSettings;
  reminders?: Reminder[];
  subtasks?: Subtask[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface RecurrenceSettings {
  type: RecurrenceType;
  interval: number; // e.g., every 2 weeks
  daysOfWeek?: number[]; // 0-6 (Sun-Sat)
  endDate?: string;
  occurrences?: number;
}

export interface Reminder {
  id: string;
  minutes: number; // Minutes before task
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

// Module color configuration
export const MODULE_COLORS: Record<TaskModule, { bg: string; text: string; border: string; icon: string }> = {
  maple: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    icon: '🍁',
  },
  poultry: {
    bg: 'bg-amber-50 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    icon: '🐔',
  },
  garden: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    icon: '🌱',
  },
  greenhouse: {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: '🏠',
  },
  livestock: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    icon: '🐄',
  },
  general: {
    bg: 'bg-slate-50 dark:bg-slate-900',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    icon: '📋',
  },
};

export const PRIORITY_COLORS: Record<TaskPriority, { bg: string; text: string }> = {
  low: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
  },
  medium: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  high: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
  },
};

// Date utilities
export function formatDate(dateStr: string, format: 'short' | 'long' | 'full' = 'short'): string {
  const date = new Date(dateStr);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'long':
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    case 'full':
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    default:
      return dateStr;
  }
}

export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isPast(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function isSameDay(date1: string, date2: string): boolean {
  return new Date(date1).toDateString() === new Date(date2).toDateString();
}

export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day;
  const sunday = new Date(date.setDate(diff));
  
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

export function dateToString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return dateToString(date);
}

export function addWeeks(dateStr: string, weeks: number): string {
  return addDays(dateStr, weeks * 7);
}

export function addMonths(dateStr: string, months: number): string {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return dateToString(date);
}

// Task filtering utilities
export function getTasksForDate(tasks: Task[], dateStr: string): Task[] {
  return tasks.filter(task => {
    if (task.endDate) {
      // Multi-day task
      return dateStr >= task.date && dateStr <= task.endDate;
    }
    return task.date === dateStr;
  });
}

export function getTasksForWeek(tasks: Task[], startDate: Date): Task[] {
  const weekDates = getWeekDates(new Date(startDate));
  const startStr = dateToString(weekDates[0]);
  const endStr = dateToString(weekDates[6]);
  
  return tasks.filter(task => {
    return task.date >= startStr && task.date <= endStr;
  });
}

export function getTasksForMonth(tasks: Task[], month: Date): Task[] {
  const year = month.getFullYear();
  const monthNum = month.getMonth();
  
  return tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate.getFullYear() === year && taskDate.getMonth() === monthNum;
  });
}

export function sortTasksByDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    
    // If same date, sort by time
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    if (a.allDay && !b.allDay) return 1;
    if (!a.allDay && b.allDay) return -1;
    
    return 0;
  });
}

export function getUpcomingTasks(tasks: Task[], limit: number = 10): Task[] {
  const today = dateToString(new Date());
  return sortTasksByDate(
    tasks.filter(task => !task.completed && task.date >= today)
  ).slice(0, limit);
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  const today = dateToString(new Date());
  return tasks.filter(task => !task.completed && task.date < today);
}

export function getTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const overdue = getOverdueTasks(tasks).length;
  
  return { total, completed, pending, overdue };
}

// Module name formatting
export function formatModuleName(module: TaskModule): string {
  return module.charAt(0).toUpperCase() + module.slice(1);
}
