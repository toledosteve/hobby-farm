import { Badge } from "./badge";
import { Card } from "./card";

interface SoilCardProps {
  name: string;
  description: string;
  tags: string[];
  color?: string;
}

export function SoilCard({ name, description, tags, color = "#84A98C" }: SoilCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div 
          className="w-3 h-3 rounded-full mt-1 flex-shrink-0" 
          style={{ backgroundColor: color }}
        />
        <div className="flex-1 min-w-0">
          <h4 className="mb-1">{name}</h4>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
