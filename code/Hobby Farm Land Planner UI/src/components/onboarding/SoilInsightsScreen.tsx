import { Button } from "../ui/button";
import { OnboardingLayout } from "./OnboardingLayout";
import { Droplets, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface SoilInsightsScreenProps {
  projectName: string;
  acreage: number;
  onContinue: () => void;
  onBack: () => void;
  onLogout?: () => void;
}

const MOCK_SOIL_DATA = [
  {
    id: 1,
    name: "Windsor Loamy Sand",
    drainageClass: "Excessively Drained",
    percentage: 45,
    color: "#8B7355",
    insights: [
      { text: "Excellent for orchards and berry crops", type: "positive" },
      { text: "Requires frequent irrigation", type: "warning" },
    ],
  },
  {
    id: 2,
    name: "Hadley Silt Loam",
    drainageClass: "Well Drained",
    percentage: 35,
    color: "#6B5844",
    insights: [
      { text: "Ideal for vegetable gardens", type: "positive" },
      { text: "Good moisture retention", type: "positive" },
    ],
  },
  {
    id: 3,
    name: "Raynham Silt Loam",
    drainageClass: "Poorly Drained",
    percentage: 20,
    color: "#4A4238",
    insights: [
      { text: "Avoid construction in this area", type: "warning" },
      { text: "Suitable for wetland habitat or forestry", type: "neutral" },
    ],
  },
];

export function SoilInsightsScreen({
  projectName,
  acreage,
  onContinue,
  onBack,
  onLogout,
}: SoilInsightsScreenProps) {
  return (
    <OnboardingLayout currentStep={4} totalSteps={6} onBack={onBack} onLogout={onLogout}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="mb-2">Soil Analysis Results</h1>
          <p className="text-muted-foreground">
            Based on your {acreage} acre boundary, we&apos;ve analyzed the soil composition
            of {projectName}. Here&apos;s what we found:
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm">Soil Types</h3>
            </div>
            <p className="text-2xl">{MOCK_SOIL_DATA.length}</p>
            <p className="text-sm text-muted-foreground">Different classifications</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm">Drainage</h3>
            </div>
            <p className="text-2xl">80%</p>
            <p className="text-sm text-muted-foreground">Well to excessively drained</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm">Suitability</h3>
            </div>
            <p className="text-2xl">High</p>
            <p className="text-sm text-muted-foreground">For agriculture</p>
          </div>
        </div>

        {/* Soil Type Cards */}
        <div className="space-y-4 mb-8">
          <h2>Soil Composition</h2>
          {MOCK_SOIL_DATA.map((soil) => (
            <div
              key={soil.id}
              className="bg-card border border-border rounded-lg p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: soil.color }}
                    />
                    <h3>{soil.name}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-4 h-4" />
                      {soil.drainageClass}
                    </div>
                    <div>
                      {soil.percentage}% of total area (~
                      {(acreage * (soil.percentage / 100)).toFixed(1)} acres)
                    </div>
                  </div>
                </div>

                {/* Percentage Badge */}
                <div className="bg-muted px-3 py-1 rounded-lg">
                  <span className="text-sm">{soil.percentage}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${soil.percentage}%`,
                    backgroundColor: soil.color,
                  }}
                />
              </div>

              {/* Insights */}
              <div className="space-y-2 pt-2">
                {soil.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-sm"
                  >
                    {insight.type === "positive" && (
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    )}
                    {insight.type === "warning" && (
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    )}
                    {insight.type === "neutral" && (
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <span className={
                      insight.type === "positive"
                        ? "text-foreground"
                        : insight.type === "warning"
                        ? "text-yellow-700"
                        : "text-muted-foreground"
                    }>
                      {insight.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Overall Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
          <h3 className="mb-3">Summary & Recommendations</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p>
                The majority of your land (80%) has good to excellent drainage, making it
                well-suited for orchards, vegetable gardens, and most agricultural uses.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p>
                The poorly drained areas (20%) should be avoided for buildings or
                infrastructure. Consider using these areas for wetland conservation or
                forestry.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p>
                Windsor Loamy Sand areas are ideal for orchards and berry production but
                will need regular irrigation during dry periods.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={onContinue} size="lg" className="min-w-[200px]">
            Continue to Recommendations
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}