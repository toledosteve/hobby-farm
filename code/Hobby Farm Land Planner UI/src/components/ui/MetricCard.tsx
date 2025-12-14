import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "./utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    isPositive?: boolean;
  };
  subtitle?: string;
  colorScheme?: 'primary' | 'secondary' | 'accent' | 'warning';
  className?: string;
}

const colorSchemes = {
  primary: {
    bg: 'bg-[#2F6F4E]',
    iconBg: 'bg-white/20',
    text: 'text-white',
    trendPositive: 'text-white/90',
    trendNegative: 'text-white/70',
  },
  secondary: {
    bg: 'bg-[#1E5A3F]',
    iconBg: 'bg-white/20',
    text: 'text-white',
    trendPositive: 'text-white/90',
    trendNegative: 'text-white/70',
  },
  accent: {
    bg: 'bg-[#4FA87A]',
    iconBg: 'bg-white/20',
    text: 'text-white',
    trendPositive: 'text-white/90',
    trendNegative: 'text-white/70',
  },
  warning: {
    bg: 'bg-[#F59E0B]',
    iconBg: 'bg-white/20',
    text: 'text-white',
    trendPositive: 'text-white/90',
    trendNegative: 'text-white/70',
  },
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  colorScheme = 'primary',
  className,
}: MetricCardProps) {
  const scheme = colorSchemes[colorScheme];

  return (
    <div
      className={cn(
        "rounded-xl p-6 shadow-sm transition-all hover:shadow-md",
        scheme.bg,
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-lg", scheme.iconBg)}>
          <Icon className={cn("w-5 h-5", scheme.text)} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className={cn("text-sm font-medium", scheme.text, "opacity-90")}>
          {title}
        </h3>
        <div className="flex items-baseline gap-3">
          <p className={cn("text-3xl font-bold tracking-tight", scheme.text)}>
            {value}
          </p>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive !== false
                  ? scheme.trendPositive
                  : scheme.trendNegative
              )}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        {subtitle && (
          <p className={cn("text-xs", scheme.text, "opacity-75")}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
