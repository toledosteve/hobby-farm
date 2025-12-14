import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft, TrendingUp, Award, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MapleTree, Tap, SapCollection, BoilSession } from "./types";

interface SeasonAnalyticsProps {
  trees: MapleTree[];
  taps: Tap[];
  collections: SapCollection[];
  boils: BoilSession[];
  onBack: () => void;
}

export function SeasonAnalytics({
  trees,
  taps,
  collections,
  boils,
  onBack,
}: SeasonAnalyticsProps) {
  // Calculate metrics
  const totalSap = collections.reduce((sum, c) => sum + c.volumeGallons, 0);
  const totalSyrup = boils.reduce((sum, b) => sum + b.syrupOutputGallons, 0);
  const activeTaps = taps.filter((t) => t.isActive).length;
  const avgSapPerTap = activeTaps > 0 ? totalSap / activeTaps : 0;
  const overallRatio = totalSyrup > 0 ? totalSap / totalSyrup : 0;

  // Collection trend data
  const collectionTrend = collections
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((c) => ({
      date: new Date(c.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      gallons: c.volumeGallons,
      perTap: activeTaps > 0 ? c.volumeGallons / activeTaps : 0,
    }));

  // Boil efficiency data
  const boilEfficiency = boils.map((b, index) => {
    const ratio = b.sapInputGallons / b.syrupOutputGallons;
    return {
      session: `Boil ${index + 1}`,
      ratio: parseFloat(ratio.toFixed(1)),
      syrup: b.syrupOutputGallons,
    };
  });

  // Tree production
  const treeProduction = trees.map((tree) => {
    const treeTaps = taps.filter((t) => t.treeId === tree.id && t.isActive);
    return {
      name: tree.nickname || `${tree.species} ${tree.id.slice(0, 6)}`,
      taps: treeTaps.length,
      diameter: tree.diameter,
      species: tree.species,
    };
  });

  // Best performing indicators
  const bestCollectionDay = collections.reduce(
    (max, c) => (c.volumeGallons > (max?.volumeGallons || 0) ? c : max),
    collections[0]
  );

  const mostEfficientBoil = boils.reduce(
    (best, b) => {
      const ratio = b.sapInputGallons / b.syrupOutputGallons;
      const bestRatio = best ? best.sapInputGallons / best.syrupOutputGallons : Infinity;
      return ratio < bestRatio ? b : best;
    },
    boils[0]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h2>Season Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Production metrics and efficiency insights
          </p>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Avg Sap per Tap</p>
          <p className="text-3xl font-semibold">{avgSapPerTap.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">gal/tap</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Overall Ratio</p>
          <p className="text-3xl font-semibold">{overallRatio.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">:1 sap-to-syrup</p>
          {overallRatio < 45 && (
            <Badge
              variant="outline"
              className="mt-2 bg-primary/10 text-primary border-primary/20"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Excellent
            </Badge>
          )}
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Production Rate</p>
          <p className="text-3xl font-semibold">
            {(totalSyrup / Math.max(trees.length, 1)).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">gal syrup/tree</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Season Progress</p>
          <p className="text-3xl font-semibold">{collections.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            collections • {boils.length} boils
          </p>
        </Card>
      </div>

      {/* Highlights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium mb-1">Best Collection Day</p>
              <p className="text-sm text-muted-foreground">
                {bestCollectionDay
                  ? `${bestCollectionDay.volumeGallons.toFixed(1)} gallons on ${new Date(
                      bestCollectionDay.date
                    ).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    })}`
                  : 'No collections yet'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium mb-1">Most Efficient Boil</p>
              <p className="text-sm text-muted-foreground">
                {mostEfficientBoil
                  ? `${(
                      mostEfficientBoil.sapInputGallons /
                      mostEfficientBoil.syrupOutputGallons
                    ).toFixed(1)}:1 ratio producing ${mostEfficientBoil.syrupOutputGallons.toFixed(
                      2
                    )} gal`
                  : 'No boils yet'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Collection Trend Chart */}
      {collectionTrend.length > 0 && (
        <Card className="p-5">
          <h3 className="font-medium mb-4">Sap Collection Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={collectionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  label={{
                    value: 'Gallons',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gallons"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Total Gallons"
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line
                  type="monotone"
                  dataKey="perTap"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Per Tap"
                  dot={{ fill: 'hsl(var(--muted-foreground))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Boil Efficiency Chart */}
      {boilEfficiency.length > 0 && (
        <Card className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-medium mb-1">Boil Efficiency</h3>
              <p className="text-sm text-muted-foreground">
                Lower ratios indicate sweeter sap
              </p>
            </div>
            <Badge variant="outline" className="bg-muted">
              Target: 40:1
            </Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={boilEfficiency}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="session"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  label={{
                    value: 'Sap-to-Syrup Ratio',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="ratio" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Tree Production Overview */}
      {treeProduction.length > 0 && (
        <Card className="p-5">
          <h3 className="font-medium mb-4">Tree Tap Distribution</h3>
          <div className="space-y-3">
            {treeProduction.map((tree, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{tree.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tree.diameter}" DBH • {tree.species}
                  </p>
                </div>
                <Badge variant="outline">{tree.taps} taps</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="p-5 bg-muted/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium mb-2">Insights & Recommendations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {avgSapPerTap < 5 && (
                <li>
                  • Your per-tap average is below typical. Consider checking tap health
                  and optimizing collection timing.
                </li>
              )}
              {overallRatio > 50 && (
                <li>
                  • Your sap-to-syrup ratio is higher than average, suggesting lower sap
                  sugar content. This can be normal early or late in the season.
                </li>
              )}
              {overallRatio < 35 && (
                <li>
                  • Excellent sap quality! Your ratio is better than average, indicating
                  high sugar content.
                </li>
              )}
              {collections.length > boils.length * 5 && (
                <li>
                  • You have a lot of sap collected. Consider scheduling another boil
                  session soon.
                </li>
              )}
              <li>
                • Industry average sap-to-syrup ratio is 40:1. Your current ratio is{' '}
                {overallRatio.toFixed(1)}:1.
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
