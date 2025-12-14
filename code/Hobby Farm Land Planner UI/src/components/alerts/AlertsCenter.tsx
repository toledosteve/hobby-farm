import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Bell, CheckCheck, Settings, Filter, Inbox } from "lucide-react";
import { AlertCard } from "./AlertCard";
import type { Alert, AlertCategory, AlertStatus } from "./types";

interface AlertsCenterProps {
  alerts: Alert[];
  onViewAlert: (alert: Alert) => void;
  onDismissAlert: (alertId: string) => void;
  onMarkAllRead: () => void;
  onOpenSettings: () => void;
  onAlertAction: (alert: Alert) => void;
}

export function AlertsCenter({
  alerts,
  onViewAlert,
  onDismissAlert,
  onMarkAllRead,
  onOpenSettings,
  onAlertAction,
}: AlertsCenterProps) {
  const [categoryFilter, setCategoryFilter] = useState<AlertCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesCategory =
        categoryFilter === "all" || alert.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || alert.status === statusFilter;
      return matchesCategory && matchesStatus && alert.status !== "dismissed";
    });
  }, [alerts, categoryFilter, statusFilter]);

  // Count stats
  const stats = useMemo(() => {
    const activeAlerts = alerts.filter((a) => a.status !== "dismissed");
    return {
      total: activeAlerts.length,
      new: activeAlerts.filter((a) => a.status === "new").length,
      weather: activeAlerts.filter((a) => a.category === "weather").length,
      tasks: activeAlerts.filter((a) => a.category === "task").length,
      health: activeAlerts.filter((a) => a.category === "health").length,
      opportunities: activeAlerts.filter((a) => a.category === "opportunity")
        .length,
    };
  }, [alerts]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2">Alerts</h1>
          <p className="text-muted-foreground">
            Things to keep an eye on across your farm
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenSettings}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-2xl font-bold text-primary">{stats.new}</div>
          <div className="text-sm text-muted-foreground">New Alerts</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-2xl font-bold">{stats.weather}</div>
          <div className="text-sm text-muted-foreground">🌦 Weather</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-2xl font-bold">{stats.tasks}</div>
          <div className="text-sm text-muted-foreground">⏰ Tasks</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-2xl font-bold">{stats.opportunities}</div>
          <div className="text-sm text-muted-foreground">🌱 Opportunities</div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Select
              value={categoryFilter}
              onValueChange={(value: any) => setCategoryFilter(value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="weather">🌦 Weather</SelectItem>
                <SelectItem value="task">⏰ Tasks</SelectItem>
                <SelectItem value="health">🦠 Health</SelectItem>
                <SelectItem value="opportunity">🌱 Opportunities</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value: any) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="snoozed">Snoozed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {stats.new > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Alerts List */}
      {filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onView={onViewAlert}
              onDismiss={onDismissAlert}
              onAction={onAlertAction}
            />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">
            {stats.total === 0 ? "All Caught Up!" : "No Alerts Match Filters"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {stats.total === 0
              ? "You don't have any active alerts right now. We'll let you know when something needs your attention."
              : "Try adjusting your filters to see more alerts, or check back later."}
          </p>
          {categoryFilter !== "all" || statusFilter !== "all" ? (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
