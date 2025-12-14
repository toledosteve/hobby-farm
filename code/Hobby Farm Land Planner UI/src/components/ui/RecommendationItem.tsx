import { LucideIcon } from "lucide-react";
import { Card } from "./card";

interface RecommendationItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

export function RecommendationItem({ 
  icon: Icon, 
  title, 
  description,
  iconColor = "#2D5F3F"
}: RecommendationItemProps) {
  return (
    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div 
          className="p-2 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="mb-0.5 text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
