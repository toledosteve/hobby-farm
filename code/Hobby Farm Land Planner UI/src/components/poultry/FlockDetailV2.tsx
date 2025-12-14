import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  Settings,
  Bird,
  Egg,
  Activity,
  Heart,
  Calendar,
  TrendingUp,
  Edit,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { FlockOverviewTab } from "./tabs/FlockOverviewTab";
import { HealthMedicationTab } from "./tabs/HealthMedicationTab";
import { DailyCareTab } from "./tabs/DailyCareTab";
import { ProductionTab } from "./tabs/ProductionTab";
import type { Flock } from "./types";

interface FlockDetailV2Props {
  flock: Flock;
  onBack?: () => void;
  onEdit?: () => void;
  onLogActivity?: () => void;
  onLogHealth?: () => void;
  onLogCare?: () => void;
  onLogProduction?: () => void;
}

type TabType = 'overview' | 'health' | 'care' | 'production';

export function FlockDetailV2({
  flock,
  onBack,
  onEdit,
  onLogActivity,
  onLogHealth,
  onLogCare,
  onLogProduction,
}: FlockDetailV2Props) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const getFlockStatusBadge = (status: Flock['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'growing':
        return <Badge variant="default">Growing</Badge>;
      case 'processing-planned':
        return <Badge variant="warning">Processing Planned</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Bird },
    { id: 'health' as const, label: 'Health & Medications', icon: Heart },
    { id: 'care' as const, label: 'Daily Care', icon: Activity },
    { id: 'production' as const, label: flock.type === 'layers' ? 'Egg Production' : 'Growth', icon: flock.type === 'layers' ? Egg : TrendingUp },
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
                Back to Flocks
              </Button>
            )}
          </div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-primary/10 rounded-xl">
                {flock.type === 'layers' ? (
                  <Egg className="w-8 h-8 text-primary" />
                ) : (
                  <Bird className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1>{flock.name}</h1>
                  {getFlockStatusBadge(flock.status)}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Bird className="w-4 h-4" />
                    <span>{flock.birdCount} birds</span>
                  </div>
                  {flock.housingLocation && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{flock.housingLocation}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Flock
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex gap-1 -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
                      ${isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
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
          {activeTab === 'overview' && (
            <FlockOverviewTab flock={flock} onEdit={onEdit} />
          )}
          {activeTab === 'health' && (
            <HealthMedicationTab flock={flock} onLogHealth={onLogHealth} />
          )}
          {activeTab === 'care' && (
            <DailyCareTab flock={flock} onLogCare={onLogCare} />
          )}
          {activeTab === 'production' && (
            <ProductionTab flock={flock} onLogProduction={onLogProduction} />
          )}
        </div>
      </div>
    </div>
  );
}
