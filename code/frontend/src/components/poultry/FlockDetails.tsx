import { useState } from "react";
import { Bird, Calendar, Egg, TrendingUp, Settings, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Flock {
  id: string;
  name: string;
  birdCount: number;
  breed: string;
  startDate: string;
  notes?: string;
}

interface FlockDetailsProps {
  flock: Flock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export function FlockDetails({ flock, open, onOpenChange, onEdit }: FlockDetailsProps) {
  const [activeTab, setActiveTab] = useState('eggs');

  if (!flock) return null;

  // Mock data for production chart
  const productionData = Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    eggs: 0,
  }));

  const eggLogs = [];
  const feedLogs = [];
  const healthEvents = [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bird className="w-6 h-6 text-primary" />
              </div>
              <div>
                <SheetTitle>{flock.name}</SheetTitle>
                <SheetDescription>{flock.breed}</SheetDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Settings className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Flock Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bird Count</p>
              <p className="text-xl font-semibold">{flock.birdCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Started</p>
              <p className="text-xl font-semibold">
                {new Date(flock.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {flock.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Notes</p>
              <p className="text-sm p-3 bg-muted rounded-lg">{flock.notes}</p>
            </div>
          )}

          {/* Production Mini-Graph */}
          <div>
            <h3 className="mb-3">Egg Production (30 Days)</h3>
            <div className="h-[200px] bg-muted/50 rounded-lg p-4">
              {productionData.some(d => d.eggs > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                    <XAxis dataKey="date" stroke="#78716C" />
                    <YAxis stroke="#78716C" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="eggs"
                      stroke="#2D5F3F"
                      strokeWidth={2}
                      dot={{ fill: '#2D5F3F' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Egg className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No egg production logged yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="eggs">Egg Logs</TabsTrigger>
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="eggs" className="space-y-3 mt-4">
              {eggLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Egg className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No egg logs for this flock yet</p>
                </div>
              ) : (
                eggLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    {/* Egg log content */}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="feed" className="space-y-3 mt-4">
              {feedLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No feed logs for this flock yet</p>
                </div>
              ) : (
                feedLogs.map((log: any) => (
                  <div key={log.id}>
                    {/* Feed log content */}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="health" className="space-y-3 mt-4">
              {healthEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No health events logged</p>
                </div>
              ) : (
                healthEvents.map((event: any) => (
                  <div key={event.id}>
                    {/* Health event content */}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={onEdit}>
                  Edit Flock Details
                </Button>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                  Archive Flock
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
