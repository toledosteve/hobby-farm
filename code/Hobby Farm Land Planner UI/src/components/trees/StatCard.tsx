import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: number; // 1 for up, -1 for down, 0 for neutral
  icon: LucideIcon;
  color?: "blue" | "green" | "emerald" | "amber" | "purple";
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  green: "bg-green-50 text-green-600 border-green-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
};

export function StatCard({
  label,
  value,
  subtext,
  trend = 0,
  icon: Icon,
  color = "blue",
}: StatCardProps) {
  const colorClass = colorClasses[color];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center border",
            colorClass
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend !== 0 && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm",
              trend > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-semibold tracking-tight mb-1">{value}</p>
        {subtext && (
          <p className="text-xs text-muted-foreground">{subtext}</p>
        )}
      </div>
    </Card>
  );
}
