import { Card } from "../ui/card";
import {
  PlayCircle,
  Trees,
  Target,
  Droplets,
  Beaker,
  StopCircle,
} from "lucide-react";
import type { ActivityTimelineItem } from "./types";

interface ActivityTimelineProps {
  activities: ActivityTimelineItem[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'season-start':
        return PlayCircle;
      case 'tree-added':
        return Trees;
      case 'tap-installed':
        return Target;
      case 'collection':
        return Droplets;
      case 'boil':
        return Beaker;
      case 'season-closed':
        return StopCircle;
      default:
        return PlayCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'season-start':
        return 'text-primary';
      case 'season-closed':
        return 'text-muted-foreground';
      default:
        return 'text-primary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="p-5">
      <h3 className="font-medium mb-4">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No activity yet this season
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);

            return (
              <div key={activity.id} className="flex gap-4">
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-muted flex-shrink-0 ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
