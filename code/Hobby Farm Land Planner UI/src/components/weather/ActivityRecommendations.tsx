import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Sprout,
  Beef,
  MapPin,
  Hammer,
} from "lucide-react";
import type { ActivityRecommendation } from "./types";

interface ActivityRecommendationsProps {
  activities: ActivityRecommendation[];
  onViewDetails: (activity: ActivityRecommendation) => void;
}

export function ActivityRecommendations({
  activities,
  onViewDetails,
}: ActivityRecommendationsProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "good":
        return {
          icon: CheckCircle2,
          label: "Good Conditions",
          className: "bg-primary/10 text-primary border-primary/20",
          iconColor: "text-primary",
        };
      case "caution":
        return {
          icon: AlertTriangle,
          label: "Use Caution",
          className:
            "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
          iconColor: "text-orange-600 dark:text-orange-400",
        };
      case "not-recommended":
        return {
          icon: XCircle,
          label: "Not Recommended",
          className: "bg-destructive/10 text-destructive border-destructive/20",
          iconColor: "text-destructive",
        };
      default:
        return {
          icon: AlertTriangle,
          label: "Unknown",
          className: "bg-muted text-muted-foreground border-border",
          iconColor: "text-muted-foreground",
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "maple":
        return Sprout;
      case "poultry":
        return Beef;
      case "garden":
        return Sprout;
      default:
        return Hammer;
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="mb-2">What This Means for Your Farm</h2>
        <p className="text-muted-foreground">
          Weather-based guidance for your farm activities over the next 7 days
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activities.map((activity) => {
          const statusConfig = getStatusConfig(activity.status);
          const StatusIcon = statusConfig.icon;
          const CategoryIcon = getCategoryIcon(activity.category);

          return (
            <Card
              key={activity.id}
              className="p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewDetails(activity)}
            >
              <div className="flex items-start gap-4">
                {/* Category Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted flex-shrink-0">
                  <CategoryIcon className="w-6 h-6 text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-medium">{activity.activityName}</h3>
                    <Badge
                      variant="outline"
                      className={`${statusConfig.className} flex-shrink-0`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1.5" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {activity.summary}
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs -ml-2 text-muted-foreground hover:text-foreground"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Confidence Indicator */}
              {activity.confidence === "low" && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    Forecast confidence is lower for this timeframe
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {activities.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No Activities Configured</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Set up your farm activities to get personalized weather-based
              recommendations and timing guidance.
            </p>
            <Button>Configure Activities</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
