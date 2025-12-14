import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface CompatibilityData {
  compatible: Array<{ name: string; reason: string }>;
  caution: Array<{ name: string; reason: string }>;
  avoid: Array<{ name: string; reason: string }>;
}

interface TreeCompatibilityProps {
  treeName: string;
  compatibility: CompatibilityData;
}

export function TreeCompatibility({ treeName, compatibility }: TreeCompatibilityProps) {
  return (
    <Card className="p-6">
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h3 className="mb-1">Companion Planting Guide</h3>
          <p className="text-sm text-muted-foreground">
            Understanding which plants grow well together helps create healthier, more resilient landscapes.
          </p>
        </div>

        {/* Compatible Neighbors */}
        {compatibility.compatible.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h4 className="text-base">Grows Well With</h4>
            </div>
            <div className="space-y-2 ml-7">
              {compatibility.compatible.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <Badge 
                            variant="outline" 
                            className="bg-green-50 text-green-800 border-green-200"
                          >
                            <span className="px-1 py-0.5">{item.name}</span>
                          </Badge>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">{item.reason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Caution */}
        {compatibility.caution.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="text-base">Use Caution Near</h4>
            </div>
            <div className="space-y-2 ml-7">
              {compatibility.caution.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <Badge 
                            variant="outline" 
                            className="bg-amber-50 text-amber-800 border-amber-200"
                          >
                            <span className="px-1 py-0.5">{item.name}</span>
                          </Badge>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">{item.reason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avoid */}
        {compatibility.avoid.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-red-600" />
              <h4 className="text-base">Avoid Planting Near</h4>
            </div>
            <div className="space-y-2 ml-7">
              {compatibility.avoid.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <Badge 
                            variant="outline" 
                            className="bg-red-50 text-red-800 border-red-200"
                          >
                            <span className="px-1 py-0.5">{item.name}</span>
                          </Badge>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">{item.reason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            These recommendations are based on general horticultural principles. Local soil, moisture, 
            and light conditions can affect compatibility. Use as guidance, not absolute rules.
          </p>
        </div>
      </div>
    </Card>
  );
}
