import { useState } from "react";
import { Plus, Egg, Filter, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DashboardCard } from "../ui/DashboardCard";
import { EmptyState } from "../ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface EggLog {
  id: string;
  date: string;
  flockName: string;
  eggCount: number;
  crackedCount: number;
  notes?: string;
}

interface EggLogTableProps {
  onLogEggs?: () => void;
  onBack?: () => void;
}

export function EggLogTable({ onLogEggs, onBack }: EggLogTableProps) {
  const [logs] = useState<EggLog[]>([]);
  const [flockFilter, setFlockFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    if (flockFilter !== 'all' && log.flockName !== flockFilter) return false;
    // Add date range filtering logic here
    return true;
  });

  const totalEggs = filteredLogs.reduce((sum, log) => sum + log.eggCount, 0);
  const totalCracked = filteredLogs.reduce((sum, log) => sum + log.crackedCount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Egg Collection Log</h1>
          <p className="text-muted-foreground">
            Track daily egg collection across all flocks
          </p>
        </div>
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button onClick={onLogEggs}>
            <Plus className="w-4 h-4 mr-2" />
            Log Eggs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Egg Log Table */}
        <div className="lg:col-span-2">
          <DashboardCard 
            title="Collection History"
            action={
              <div className="flex gap-2">
                <Select value={flockFilter} onValueChange={setFlockFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Flocks</SelectItem>
                    <SelectItem value="main-coop">Main Coop</SelectItem>
                    <SelectItem value="tractor-1">Tractor 1</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          >
            {logs.length === 0 ? (
              <EmptyState
                icon={Egg}
                title="No egg logs yet"
                description="Start by logging today's collection to track production over time"
                action={{
                  label: 'Log First Collection',
                  onClick: onLogEggs || (() => {}),
                }}
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Flock</TableHead>
                      <TableHead>Eggs</TableHead>
                      <TableHead>Cracked</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(log.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.flockName}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Egg className="w-4 h-4 text-primary" />
                            <span className="font-medium">{log.eggCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.crackedCount > 0 ? (
                            <span className="text-destructive">{log.crackedCount}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.notes ? (
                            <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                              {log.notes}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              Edit
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Summary Stats */}
        <div className="space-y-6">
          <DashboardCard title="Summary">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Eggs</p>
                <p className="text-2xl font-semibold">{totalEggs}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Cracked</p>
                <p className="text-2xl font-semibold text-destructive">{totalCracked}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Collection Logs</p>
                <p className="text-2xl font-semibold">{filteredLogs.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                <p className="text-2xl font-semibold">
                  {totalEggs > 0
                    ? ((totalEggs - totalCracked) / totalEggs * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}