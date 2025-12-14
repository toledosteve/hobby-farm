import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, RefreshCw, Settings } from "lucide-react";
import { FarmWeatherSummary } from "./FarmWeatherSummary";
import { ActivityRecommendations } from "./ActivityRecommendations";
import { WeatherWindows } from "./WeatherWindows";
import { WeatherAlerts } from "./WeatherAlerts";
import { ActivityDetailModal } from "./ActivityDetailModal";
import type {
  WeatherCondition,
  DailyForecast,
  FarmIndicator,
  ActivityRecommendation,
  WeatherWindow,
  WeatherAlert,
} from "./types";

interface WeatherDashboardProps {
  onBack?: () => void;
}

export function WeatherDashboard({ onBack }: WeatherDashboardProps) {
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityRecommendation | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<WeatherAlert[]>(mockAlerts);

  // Mock data - replace with real weather API data
  const currentWeather: WeatherCondition = {
    temperature: 38,
    feelsLike: 32,
    humidity: 75,
    precipitation: 0,
    wind: 8,
    condition: "Partly Cloudy",
    icon: "partly-cloudy",
  };

  const forecast: DailyForecast[] = [
    {
      date: "2025-02-15",
      dayOfWeek: "Sat",
      high: 42,
      low: 28,
      precipitation: 0,
      condition: "Sunny",
      icon: "sunny",
    },
    {
      date: "2025-02-16",
      dayOfWeek: "Sun",
      high: 45,
      low: 31,
      precipitation: 10,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
    },
    {
      date: "2025-02-17",
      dayOfWeek: "Mon",
      high: 40,
      low: 26,
      precipitation: 0,
      condition: "Clear",
      icon: "clear",
    },
    {
      date: "2025-02-18",
      dayOfWeek: "Tue",
      high: 38,
      low: 22,
      precipitation: 0,
      condition: "Sunny",
      icon: "sunny",
    },
    {
      date: "2025-02-19",
      dayOfWeek: "Wed",
      high: 41,
      low: 24,
      precipitation: 5,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
    },
    {
      date: "2025-02-20",
      dayOfWeek: "Thu",
      high: 44,
      low: 29,
      precipitation: 15,
      condition: "Cloudy",
      icon: "cloudy",
    },
    {
      date: "2025-02-21",
      dayOfWeek: "Fri",
      high: 39,
      low: 27,
      precipitation: 20,
      condition: "Light Rain",
      icon: "rain",
    },
  ];

  const indicators: FarmIndicator[] = [
    {
      id: "freeze-thaw",
      label: "Freeze-Thaw Pattern",
      value: "Active",
      status: "normal",
    },
    {
      id: "frost-risk",
      label: "Frost Risk",
      value: "Tonight",
      status: "warning",
    },
    {
      id: "ground-saturation",
      label: "Ground Saturation",
      value: "Low",
      status: "normal",
    },
  ];

  const activities: ActivityRecommendation[] = [
    {
      id: "maple-tapping",
      activityName: "Maple Tapping",
      category: "maple",
      status: "good",
      summary:
        "Nighttime freezes and daytime highs between 35–45°F support sap flow.",
      explanation:
        "The consistent freeze-thaw pattern over the next 5 days creates ideal conditions for maple sap production. Daytime temperatures are in the sweet spot for strong sap runs.",
      conditions: [
        "Nighttime temperatures dropping below freezing (20-28°F)",
        "Daytime highs reaching 38-45°F",
        "Minimal precipitation expected",
        "Moderate wind speeds won't affect tapping",
      ],
      thresholds: [
        {
          label: "Daytime Temperature",
          current: "38-45°F",
          ideal: "35-50°F",
        },
        {
          label: "Nighttime Temperature",
          current: "22-31°F",
          ideal: "Below 32°F",
        },
      ],
      risks: [
        "Warming trend expected late next week may reduce sap flow",
        "Any rain on Friday could dilute collection buckets",
      ],
      tips: [
        "Best collection times are typically mid-morning to early afternoon",
        "Check taps daily during active runs",
        "Keep collection containers covered to prevent contamination",
      ],
      confidence: "high",
    },
    {
      id: "ground-work",
      activityName: "Ground Work",
      category: "general",
      status: "caution",
      summary: "Soil may be too soft from freeze-thaw cycles. Wait for drier period.",
      explanation:
        "While temperatures are favorable, the freeze-thaw pattern is creating variable ground conditions. Soil compaction and rutting are risks during this period.",
      conditions: [
        "Freeze-thaw cycles softening top soil layers",
        "Ground saturation currently low but increasing",
        "Rain expected late week will worsen conditions",
      ],
      thresholds: [
        {
          label: "Ground Saturation",
          current: "Moderate",
          ideal: "Low to Dry",
        },
        {
          label: "Soil Temperature",
          current: "32-38°F",
          ideal: "Above 40°F",
        },
      ],
      risks: [
        "Heavy equipment may cause soil compaction",
        "Friday's rain will make ground work impractical",
        "Rutting damage could persist into spring",
      ],
      tips: [
        "Consider waiting 2-3 days after last freeze for more stable conditions",
        "Use lighter equipment if work is urgent",
        "Avoid driving on the same paths repeatedly",
      ],
      confidence: "high",
    },
    {
      id: "poultry-outdoor",
      activityName: "Poultry Outdoor Access",
      category: "poultry",
      status: "good",
      summary: "Daytime temperatures are suitable for supervised outdoor time.",
      explanation:
        "Mild daytime temperatures and dry conditions make this week favorable for allowing chickens supervised outdoor access, promoting health and natural behaviors.",
      conditions: [
        "Daytime highs in comfortable range (38-45°F)",
        "Minimal precipitation most days",
        "Low wind speeds reduce chill factor",
      ],
      thresholds: [
        {
          label: "Temperature Range",
          current: "38-45°F",
          ideal: "Above 35°F",
        },
        {
          label: "Wind Speed",
          current: "8 mph",
          ideal: "Below 15 mph",
        },
      ],
      risks: [
        "Friday's rain should keep birds inside",
        "Overnight frost—ensure coops are secure by evening",
      ],
      tips: [
        "Midday access provides warmest temperatures",
        "Provide windbreaks and covered areas",
        "Monitor for signs of cold stress in smaller or older birds",
      ],
      confidence: "high",
    },
    {
      id: "planting",
      activityName: "Early Spring Planting",
      category: "garden",
      status: "not-recommended",
      summary: "Frost risk remains too high. Wait until late March.",
      explanation:
        "Current nighttime temperatures are still regularly dropping below freezing, making it too early for most cold-hardy crops. Soil temperatures are also below optimal germination range.",
      conditions: [
        "Nighttime lows still below freezing regularly",
        "Soil temperature averaging 32-38°F",
        "Frost risk continues through February",
      ],
      thresholds: [
        {
          label: "Soil Temperature",
          current: "32-38°F",
          ideal: "Above 45°F for most crops",
        },
        {
          label: "Frost Risk",
          current: "High (nightly)",
          ideal: "Last frost date passed",
        },
      ],
      risks: [
        "Seedlings will likely be damaged or killed by frost",
        "Soil too cold for germination",
        "Investment in seeds and time will be wasted",
      ],
      tips: [
        "Use this time to prepare beds and plan layouts",
        "Start seeds indoors for transplanting in 4-6 weeks",
        "Cold frames or row covers can extend season but still too early",
      ],
      confidence: "high",
    },
  ];

  const windows: WeatherWindow[] = [
    {
      id: "maple-window-1",
      activity: "Maple Tapping",
      startDate: "2025-02-15",
      endDate: "2025-02-19",
      confidence: "high",
      reason:
        "Consistent freeze-thaw pattern with ideal daytime temperatures (38-45°F)",
    },
    {
      id: "outdoor-poultry-1",
      activity: "Poultry Outdoor Access",
      startDate: "2025-02-15",
      endDate: "2025-02-20",
      confidence: "high",
      reason: "Mild days with low precipitation and comfortable temperatures",
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="mb-2">Weather Intelligence</h1>
              <p className="text-muted-foreground">
                Weather-driven guidance for your farm activities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Updating..." : "Refresh"}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Alerts */}
          {alerts.length > 0 && (
            <WeatherAlerts alerts={alerts} onDismiss={handleDismissAlert} />
          )}

          {/* Section 1: Farm Weather Summary */}
          <FarmWeatherSummary
            current={currentWeather}
            forecast={forecast}
            indicators={indicators}
            summary="Consistent freeze-thaw pattern expected over the next 5 days. Ideal for maple tapping. Light rain possible Friday."
          />

          {/* Section 2: Activity Recommendations */}
          <ActivityRecommendations
            activities={activities}
            onViewDetails={setSelectedActivity}
          />

          {/* Section 3: Weather Windows */}
          <WeatherWindows windows={windows} />
        </div>
      </div>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        open={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
}

// Mock alerts data
const mockAlerts: WeatherAlert[] = [
  {
    id: "frost-warning",
    severity: "warning",
    title: "Frost Warning Tonight",
    message:
      "Temperatures expected to drop to 24°F overnight. Protect sensitive plants and ensure livestock have adequate shelter.",
    timeframe: "Tonight, 10 PM - Tomorrow, 8 AM",
    actions: [
      "Cover any early plantings with row covers or cloches",
      "Ensure poultry coops are sealed and draft-free",
      "Check livestock water sources for ice in the morning",
    ],
  },
  {
    id: "maple-opportunity",
    severity: "info",
    title: "Prime Maple Tapping Window",
    message:
      "The next 5 days show excellent freeze-thaw conditions for maple sap production. This may be the best opportunity this season.",
    timeframe: "Feb 15 - Feb 19",
    actions: [
      "Prepare tapping equipment and collection containers",
      "Check existing taps for proper flow",
      "Plan for daily collection during peak hours (10 AM - 2 PM)",
    ],
  },
];