import { useState } from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Plus,
  CheckCircle2,
  Droplets,
  Utensils,
  Sparkles,
  Wind,
  ShieldAlert,
  Calendar,
  Filter,
} from "lucide-react";
import type { Flock, DailyCareLog } from "../types";

interface DailyCareTabProps {
  flock: Flock;
  onLogCare?: () => void;
}

export function DailyCareTab({ flock, onLogCare }: DailyCareTabProps) {
  const [filterType, setFilterType] = useState<"all" | DailyCareLog["careType"]>("all");

  // Mock care logs - replace with real data
  const careLogs: DailyCareLog[] = [
    {
      id: "care-1",
      flockId: flock.id,
      date: "2025-02-14",
      careType: "feeding",
      notes: "Morning feeding - layer pellets",
      createdAt: "2025-02-14T08:00:00Z",
    },
    {
      id: "care-2",
      flockId: flock.id,
      date: "2025-02-14",
      careType: "water-check",
      notes: "Water refilled, all waterers clean",
      createdAt: "2025-02-14T08:15:00Z",
    },
    {
      id: "care-3",
      flockId: flock.id,
      date: "2025-02-13",
      careType: "coop-cleaning",
      notes: "Weekly deep clean, droppings board scraped",
      createdAt: "2025-02-13T10:00:00Z",
    },
    {
      id: "care-4",
      flockId: flock.id,
      date: "2025-02-12",
      careType: "bedding-change",
      notes: "Fresh pine shavings added to nesting boxes",
      createdAt: "2025-02-12T09:30:00Z",
    },
  ];

  const filteredLogs =
    filterType === "all"
      ? careLogs
      : careLogs.filter((log) => log.careType === filterType);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCareIcon = (type: DailyCareLog["careType"]) => {
    switch (type) {
      case "feeding":
        return <Utensils className="w-4 h-4" />;
      case "water-check":
        return <Droplets className="w-4 h-4" />;
      case "coop-cleaning":
        return <Sparkles className="w-4 h-4" />;
      case "bedding-change":
        return <Wind className="w-4 h-4" />;
      case "pasture-move":
        return <Calendar className="w-4 h-4" />;
      case "predator-check":
        return <ShieldAlert className="w-4 h-4" />;
    }
  };

  const getCareLabel = (type: DailyCareLog["careType"]) => {
    const labels: Record<DailyCareLog["careType"], string> = {
      feeding: "Feeding",
      "water-check": "Water Check",
      "coop-cleaning": "Coop Cleaning",
      "bedding-change": "Bedding Change",
      "pasture-move": "Pasture Move",
      "predator-check": "Predator Check",
    };
    return labels[type];
  };

  const careTypeOptions: Array<{ value: "all" | DailyCareLog["careType"]; label: string }> = [
    { value: "all", label: "All Activities" },
    { value: "feeding", label: "Feeding" },
    { value: "water-check", label: "Water Checks" },
    { value: "coop-cleaning", label: "Cleaning" },
    { value: "bedding-change", label: "Bedding" },
    { value: "pasture-move", label: "Pasture" },
    { value: "predator-check", label: "Predator Checks" },
  ];

  // Group logs by date
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const date = log.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, DailyCareLog[]>);

  const sortedDates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Today's Checklist Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
              Today's Care Checklist
            </h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Quick daily tasks for healthy birds
            </p>
          </div>
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            3 of 6 done
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { type: "feeding", label: "Morning Feeding", done: true },
            { type: "water-check", label: "Water Check", done: true },
            { type: "coop-cleaning", label: "Coop Check", done: true },
            { type: "feeding", label: "Evening Feeding", done: false },
            { type: "predator-check", label: "Predator Check", done: false },
            { type: "water-check", label: "Evening Water", done: false },
          ].map((task, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                task.done
                  ? "bg-white/80 dark:bg-gray-900/80"
                  : "bg-white/50 dark:bg-gray-900/50"
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  task.done
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-emerald-300 dark:border-emerald-700"
                }`}
              >
                {task.done && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span
                className={`text-sm ${
                  task.done
                    ? "text-emerald-900 dark:text-emerald-100"
                    : "text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {task.label}
              </span>
            </div>
          ))}
        </div>

        <Button onClick={onLogCare} className="w-full mt-4" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Log Care Activity
        </Button>
      </div>

      {/* Header and Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Care History</h3>
          <p className="text-sm text-muted-foreground">
            Daily care and maintenance activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background"
          >
            {careTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Care Log Timeline */}
      <div className="bg-card rounded-xl border border-border">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No Care Logs Yet</h4>
            <p className="text-muted-foreground mb-6">
              Start tracking daily care activities for this flock.
            </p>
            <Button onClick={onLogCare}>
              <Plus className="w-4 h-4 mr-2" />
              Log First Activity
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedDates.map((date) => (
              <div key={date} className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(date)}</span>
                  <Badge variant="outline" className="ml-auto">
                    {groupedLogs[date].length} activit{groupedLogs[date].length !== 1 ? "ies" : "y"}
                  </Badge>
                </div>

                <div className="space-y-3 ml-6">
                  {groupedLogs[date].map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        {getCareIcon(log.careType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium mb-1">
                          {getCareLabel(log.careType)}
                        </div>
                        {log.notes && (
                          <p className="text-sm text-muted-foreground">
                            {log.notes}
                          </p>
                        )}
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Care Tips */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Daily Care Essentials
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Fresh water twice daily prevents disease and keeps birds healthy</li>
              <li>• Consistent feeding times help establish routine and reduce stress</li>
              <li>• Regular coop checks help catch issues before they become problems</li>
              <li>• Evening predator checks provide peace of mind and flock safety</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
