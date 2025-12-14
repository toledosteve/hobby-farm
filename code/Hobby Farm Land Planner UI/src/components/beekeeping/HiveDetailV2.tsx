import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  Settings,
  Edit,
  MapPin,
  Eye,
  Heart,
  Droplet,
  Calendar,
  Pill,
} from "lucide-react";
import { HiveOverviewTab } from "./tabs/HiveOverviewTab";
import { InspectionLogTab } from "./tabs/InspectionLogTab";
import { HealthPestsTab } from "./tabs/HealthPestsTab";
import { TreatmentsTab } from "./tabs/TreatmentsTab";
import { HoneyProductionTab } from "./tabs/HoneyProductionTab";
import type { Hive } from "./types";

interface HiveDetailV2Props {
  hive: Hive;
  onBack?: () => void;
  onEdit?: () => void;
  onLogInspection?: () => void;
  onLogHealth?: () => void;
  onLogTreatment?: () => void;
  onLogHarvest?: () => void;
}

type TabType = "overview" | "inspections" | "health" | "treatments" | "production";

export function HiveDetailV2({
  hive,
  onBack,
  onEdit,
  onLogInspection,
  onLogHealth,
  onLogTreatment,
  onLogHarvest,
}: HiveDetailV2Props) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const getColonyStatusBadge = (status: Hive["colonyStatus"]) => {
    switch (status) {
      case "strong":
        return <Badge variant="success">Strong</Badge>;
      case "moderate":
        return <Badge variant="default">Moderate</Badge>;
      case "weak":
        return <Badge variant="warning">Weak</Badge>;
      case "unknown":
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: MapPin },
    { id: "inspections" as const, label: "Inspection Log", icon: Eye },
    { id: "health" as const, label: "Health & Pests", icon: Heart },
    { id: "treatments" as const, label: "Treatments", icon: Pill },
    { id: "production" as const, label: "Honey Production", icon: Droplet },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hives
              </Button>
            )}
          </div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-xl">
                <svg
                  className="w-8 h-8 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1>{hive.name}</h1>
                  {getColonyStatusBadge(hive.colonyStatus)}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Installed{" "}
                      {new Date(hive.installDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {hive.location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{hive.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Hive
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex gap-1 -mb-px overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap
                      ${
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === "overview" && (
            <HiveOverviewTab hive={hive} onEdit={onEdit} />
          )}
          {activeTab === "inspections" && (
            <InspectionLogTab hive={hive} onLogInspection={onLogInspection} />
          )}
          {activeTab === "health" && (
            <HealthPestsTab hive={hive} onLogHealth={onLogHealth} />
          )}
          {activeTab === "treatments" && (
            <TreatmentsTab hive={hive} onLogTreatment={onLogTreatment} />
          )}
          {activeTab === "production" && (
            <HoneyProductionTab hive={hive} onLogHarvest={onLogHarvest} />
          )}
        </div>
      </div>
    </div>
  );
}
