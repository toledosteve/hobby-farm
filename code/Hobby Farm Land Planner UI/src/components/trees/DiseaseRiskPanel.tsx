import { Bug, ShieldAlert, Info, Eye } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface DiseaseInfo {
  name: string;
  riskLevel: "low" | "moderate" | "high";
  description: string;
}

interface PestInfo {
  name: string;
  riskLevel: "low" | "moderate" | "high";
  description: string;
}

interface DiseaseRiskPanelProps {
  treeName: string;
  diseases: DiseaseInfo[];
  pests: PestInfo[];
  regionalNotes?: string;
}

export function DiseaseRiskPanel({ 
  treeName, 
  diseases, 
  pests, 
  regionalNotes 
}: DiseaseRiskPanelProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "bg-blue-50 text-blue-700 border-blue-200";
      case "moderate": return "bg-amber-50 text-amber-700 border-amber-200";
      case "high": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "low": return "Low Risk";
      case "moderate": return "Moderate Risk";
      case "high": return "Higher Risk";
      default: return "Unknown";
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h3 className="mb-1">Health & Monitoring</h3>
          <p className="text-sm text-muted-foreground">
            Being aware of common issues helps you catch problems early and maintain tree health.
          </p>
        </div>

        {/* Diseases */}
        {diseases.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-muted-foreground" />
              <h4 className="text-base">Common Diseases</h4>
            </div>
            <div className="space-y-3 ml-7">
              {diseases.map((disease, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{disease.name}</span>
                    <Badge 
                      variant="outline" 
                      className={getRiskColor(disease.riskLevel)}
                    >
                      <span className="px-1 py-0.5 text-xs">{getRiskLabel(disease.riskLevel)}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {disease.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pests */}
        {pests.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bug className="w-5 h-5 text-muted-foreground" />
              <h4 className="text-base">Common Pests</h4>
            </div>
            <div className="space-y-3 ml-7">
              {pests.map((pest, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{pest.name}</span>
                    <Badge 
                      variant="outline" 
                      className={getRiskColor(pest.riskLevel)}
                    >
                      <span className="px-1 py-0.5 text-xs">{getRiskLabel(pest.riskLevel)}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pest.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regional Notes */}
        {regionalNotes && (
          <div className="pt-3 border-t">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm mb-1">Regional Considerations</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {regionalNotes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Prevention Notes */}
        <div className="pt-4 border-t">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Eye className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm mb-1">Prevention & Monitoring</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Regular visual inspections help catch issues early</li>
                  <li>• Proper spacing reduces disease spread</li>
                  <li>• Healthy soil and appropriate watering build resilience</li>
                  <li>• Diversity in your plantings reduces overall risk</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Disease and pest pressure varies by location, season, and conditions. These are general 
            guidelines to support awareness and monitoring, not diagnostic predictions.
          </p>
        </div>
      </div>
    </Card>
  );
}
