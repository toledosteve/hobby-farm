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
import { Input } from "../ui/input";
import {
  CheckCheck,
  Settings,
  Filter,
  Inbox,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "../ui/utils";
import type { Alert, AlertCategory, AlertStatus } from "./types";

interface AlertsTableProps {
  alerts: Alert[];
  onViewAlert: (alert: Alert) => void;
  onDismissAlert: (alertId: string) => void;
  onMarkAllRead: () => void;
  onOpenSettings: () => void;
  onAlertAction: (alert: Alert) => void;
}

type SortField = 'timestamp' | 'severity' | 'title' | 'category' | 'status';
type SortDirection = 'asc' | 'desc';

export function AlertsTable({
  alerts,
  onViewAlert,
  onDismissAlert,
  onMarkAllRead,
  onOpenSettings,
  onAlertAction,
}: AlertsTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<AlertCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter and sort alerts
  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = alerts.filter((alert) => {
      const matchesCategory =
        categoryFilter === "all" || alert.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || alert.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch && alert.status !== "dismissed";
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case 'timestamp':
          aVal = new Date(a.timestamp).getTime();
          bVal = new Date(b.timestamp).getTime();
          break;
        case 'severity':
          const severityOrder = { high: 3, medium: 2, low: 1 };
          aVal = severityOrder[a.severity];
          bVal = severityOrder[b.severity];
          break;
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'category':
          aVal = a.category;
          bVal = b.category;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [alerts, categoryFilter, statusFilter, searchQuery, sortField, sortDirection]);

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1" />
    );
  };

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'weather': return '🌦';
      case 'task': return '⏰';
      case 'health': return '🦠';
      case 'opportunity': return '🌱';
      default: return '📋';
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-primary text-primary-foreground">New</Badge>;
      case 'read':
        return <Badge variant="outline">Read</Badge>;
      case 'snoozed':
        return <Badge variant="secondary">Snoozed</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2">Alerts & Notifications</h1>
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

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
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

          {stats.new > 0 && (
            <Button variant="outline" size="sm" onClick={onMarkAllRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      {filteredAndSortedAlerts.length > 0 ? (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="w-8 p-3"></th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center text-sm font-semibold">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort('severity')}
                  >
                    <div className="flex items-center text-sm font-semibold">
                      Priority
                      {getSortIcon('severity')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center text-sm font-semibold">
                      Category
                      {getSortIcon('category')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center text-sm font-semibold">
                      Alert
                      {getSortIcon('title')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center text-sm font-semibold">
                      Time
                      {getSortIcon('timestamp')}
                    </div>
                  </th>
                  <th className="text-right p-3">
                    <span className="text-sm font-semibold">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedAlerts.map((alert) => (
                  <>
                    <tr
                      key={alert.id}
                      className={cn(
                        "border-b hover:bg-muted/30 transition-colors cursor-pointer",
                        alert.status === 'new' && "bg-primary/5"
                      )}
                      onClick={() => setExpandedRow(expandedRow === alert.id ? null : alert.id)}
                    >
                      <td className="p-3">
                        <button className="text-muted-foreground hover:text-foreground">
                          {expandedRow === alert.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(alert.status)}
                      </td>
                      <td className="p-3">
                        <Badge className={cn("capitalize", getSeverityColor(alert.severity))}>
                          {alert.severity}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(alert.category)}</span>
                          <span className="text-sm capitalize">{alert.category}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-md">
                          {alert.message}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(alert.timestamp)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          {alert.actionLabel && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAlertAction(alert);
                              }}
                            >
                              {alert.actionLabel}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDismissAlert(alert.id);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Row Details */}
                    {expandedRow === alert.id && (
                      <tr className="bg-muted/20 border-b">
                        <td colSpan={7} className="p-6">
                          <div className="space-y-4 max-w-3xl">
                            <div>
                              <h4 className="font-semibold mb-2">Full Details</h4>
                              <p className="text-sm">{alert.message}</p>
                            </div>
                            
                            {alert.details && (
                              <div>
                                <h4 className="font-semibold mb-2">Additional Information</h4>
                                <ul className="space-y-1">
                                  {alert.details.map((detail, idx) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                      <span className="text-primary mt-0.5">•</span>
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => onViewAlert(alert)}
                              >
                                View Full Details
                              </Button>
                              {alert.actionLabel && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onAlertAction(alert)}
                                >
                                  {alert.actionLabel}
                                </Button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-card">
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
          {(categoryFilter !== "all" || statusFilter !== "all" || searchQuery) && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setCategoryFilter("all");
                setStatusFilter("all");
                setSearchQuery("");
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      {/* Results Summary */}
      {filteredAndSortedAlerts.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredAndSortedAlerts.length} of {stats.total} alerts
        </div>
      )}
    </div>
  );
}
