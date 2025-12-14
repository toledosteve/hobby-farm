import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ChevronRight,
  Info,
  AlertCircle,
  Lightbulb,
  MapPin,
  X,
} from "lucide-react";
import { cn } from "../ui/utils";
import type { MapInsight, MapMode } from "./types";

interface InsightsDrawerProps {
  mapMode: MapMode;
  insights: MapInsight[];
  selectedArea?: string;
  onInsightClick?: (insight: MapInsight) => void;
}

export function InsightsDrawer({
  mapMode,
  insights,
  selectedArea,
  onInsightClick,
}: InsightsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getModeTitle = (mode: MapMode) => {
    switch (mode) {
      case 'land-suitability':
        return 'Land Suitability Insights';
      case 'trees-orchard':
        return 'Orchard Intelligence';
      case 'poultry-livestock':
        return 'Livestock Insights';
      case 'pollination-bees':
        return 'Pollination Analysis';
      case 'weather-water':
        return 'Weather & Water Insights';
      case 'planning':
        return 'Planning Guidance';
    }
  };

  const getSeverityIcon = (severity: MapInsight['severity']) => {
    switch (severity) {
      case 'important':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'notice':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'info':
        return <Lightbulb className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border-2 border-l-0 border-border rounded-r-lg px-2 py-6 hover:bg-muted/50 transition-colors group"
        >
          <div className="flex flex-col items-center gap-2">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <div className="writing-mode-vertical text-xs font-semibold">
              Insights
            </div>
            {insights.length > 0 && (
              <div className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {insights.length}
              </div>
            )}
          </div>
        </button>
      )}

      {/* Drawer */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-r-2 border-border flex flex-col z-30 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b bg-muted/50 flex items-center justify-between shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{getModeTitle(mapMode)}</h2>
            {selectedArea && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Selected: {selectedArea}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {insights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No Insights Yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Select an area on the map or add module data to see relevant
                insights for this view.
              </p>
            </div>
          ) : (
            insights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onInsightClick?.(insight)}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  {getSeverityIcon(insight.severity)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{insight.title}</h3>
                    {insight.relatedModules && insight.relatedModules.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {insight.relatedModules.map((module) => (
                          <Badge key={module} variant="outline" className="text-xs">
                            {module}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* What's happening */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      What's happening
                    </p>
                    <p className="text-sm">{insight.description}</p>
                  </div>

                  {/* Why it matters */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Why it matters
                    </p>
                    <p className="text-sm">{insight.impact}</p>
                  </div>

                  {/* What you can do */}
                  {insight.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        What you can do
                      </p>
                      <ul className="space-y-1">
                        {insight.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span className="flex-1">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {insights.length > 0 && (
          <div className="p-3 border-t bg-muted/30 shrink-0">
            <p className="text-xs text-muted-foreground text-center">
              {insights.length} insight{insights.length !== 1 ? 's' : ''} for this
              view
            </p>
          </div>
        )}
      </div>
    </>
  );
}
