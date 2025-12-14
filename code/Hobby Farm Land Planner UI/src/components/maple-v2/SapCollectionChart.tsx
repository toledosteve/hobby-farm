import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { TrendingUp, Award } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface SapCollectionChartProps {
  weeklyData: Array<{
    date: string;
    day: string;
    gallons: number;
    flowLevel?: 'high' | 'moderate' | 'low';
  }>;
  perTapAverage?: number;
  bestDay?: {
    date: string;
    gallons: number;
  };
}

export function SapCollectionChart({
  weeklyData,
  perTapAverage,
  bestDay,
}: SapCollectionChartProps) {
  const maxGallons = Math.max(...weeklyData.map((d) => d.gallons));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm mb-1">{data.day}</p>
          <p className="text-sm text-muted-foreground">
            {data.gallons.toFixed(1)} gallons collected
          </p>
          {data.flowLevel && (
            <p className="text-xs text-muted-foreground mt-1">
              {data.flowLevel} flow day
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-medium mb-1">Sap Collection This Week</h3>
          <p className="text-sm text-muted-foreground">
            Daily collection volumes and trends
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-2 items-end">
          {perTapAverage !== undefined && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="w-3 h-3 mr-1.5" />
              {perTapAverage.toFixed(2)} gal/tap avg
            </Badge>
          )}
          {bestDay && (
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              <Award className="w-3 h-3 mr-1.5" />
              Best: {bestDay.gallons.toFixed(1)} gal
            </Badge>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              label={{
                value: 'Gallons',
                angle: -90,
                position: 'insideLeft',
                style: {
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 12,
                },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
            <Bar
              dataKey="gallons"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Total This Week</p>
            <p className="font-medium">
              {weeklyData.reduce((sum, day) => sum + day.gallons, 0).toFixed(1)} gal
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Daily Average</p>
            <p className="font-medium">
              {(
                weeklyData.reduce((sum, day) => sum + day.gallons, 0) /
                weeklyData.length
              ).toFixed(1)}{' '}
              gal
            </p>
          </div>
          {bestDay && (
            <div>
              <p className="text-muted-foreground mb-1">Best Collection Day</p>
              <p className="font-medium">
                {new Date(bestDay.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}