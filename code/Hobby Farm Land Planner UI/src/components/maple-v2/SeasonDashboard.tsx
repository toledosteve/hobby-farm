import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Settings,
  Calendar,
  ChevronDown,
  Trees as TreesIcon,
  Target,
  Droplets,
  Beaker,
  BarChart3,
} from "lucide-react";
import { SeasonMetrics } from "./SeasonMetrics";
import { QuickActions } from "./QuickActions";
import { SapFlowForecast } from "./SapFlowForecast";
import { ActivityTimeline } from "./ActivityTimeline";
import { SapCollectionChart } from "./SapCollectionChart";
import { AddTreeModal } from "./AddTreeModal";
import { AddTapModal } from "./AddTapModal";
import { BulkAddTapsModal } from "./BulkAddTapsModal";
import { LogCollectionModal } from "./LogCollectionModal";
import { LogBoilModal } from "./LogBoilModal";
import { TreesManagement } from "./TreesManagement";
import { TapsManagement } from "./TapsManagement";
import { CollectionHistory } from "./CollectionHistory";
import { BoilHistory } from "./BoilHistory";
import { SeasonAnalytics } from "./SeasonAnalytics";
import type {
  Season,
  MapleTree,
  Tap,
  SapCollection,
  BoilSession,
  SeasonMetrics as SeasonMetricsType,
  SapFlowForecast as SapFlowForecastType,
  ActivityTimelineItem,
} from "./types";
import { toast } from "sonner@2.0.3";

interface SeasonDashboardProps {
  // No props needed - left nav handles navigation
}

type ViewMode = 'dashboard' | 'trees' | 'taps' | 'collections' | 'boils' | 'analytics';

export function SeasonDashboard({}: SeasonDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  // Modal states
  const [showAddTreeModal, setShowAddTreeModal] = useState(false);
  const [showAddTapModal, setShowAddTapModal] = useState(false);
  const [showBulkTapsModal, setShowBulkTapsModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showBoilModal, setShowBoilModal] = useState(false);

  // Mock season data
  const currentSeason: Season = {
    id: 'season-2025',
    year: 2025,
    name: '2025 Season',
    startDate: '2025-02-01',
    status: 'active',
  };

  // Mock data states
  const [trees, setTrees] = useState<MapleTree[]>([
    {
      id: 'tree-1',
      seasonId: 'season-2025',
      nickname: 'Big Sugar',
      species: 'sugar-maple',
      diameter: 18,
      health: 'healthy',
      createdAt: '2025-02-01T10:00:00Z',
      updatedAt: '2025-02-01T10:00:00Z',
    },
    {
      id: 'tree-2',
      seasonId: 'season-2025',
      species: 'red-maple',
      diameter: 14,
      health: 'healthy',
      createdAt: '2025-02-01T10:05:00Z',
      updatedAt: '2025-02-01T10:05:00Z',
    },
    {
      id: 'tree-3',
      seasonId: 'season-2025',
      nickname: 'North Grove Leader',
      species: 'sugar-maple',
      diameter: 22,
      health: 'healthy',
      createdAt: '2025-02-01T10:10:00Z',
      updatedAt: '2025-02-01T10:10:00Z',
    },
  ]);

  const [taps, setTaps] = useState<Tap[]>([
    {
      id: 'tap-1',
      seasonId: 'season-2025',
      treeId: 'tree-1',
      tapType: 'bucket',
      installDate: '2025-02-05',
      isActive: true,
    },
    {
      id: 'tap-2',
      seasonId: 'season-2025',
      treeId: 'tree-2',
      tapType: 'bucket',
      installDate: '2025-02-05',
      isActive: true,
    },
    {
      id: 'tap-3',
      seasonId: 'season-2025',
      treeId: 'tree-3',
      tapType: 'bucket',
      installDate: '2025-02-05',
      isActive: true,
    },
    {
      id: 'tap-4',
      seasonId: 'season-2025',
      treeId: 'tree-3',
      tapType: 'bucket',
      installDate: '2025-02-05',
      isActive: true,
    },
  ]);

  const [collections, setCollections] = useState<SapCollection[]>([
    {
      id: 'coll-1',
      seasonId: 'season-2025',
      date: '2025-02-10',
      time: '14:30',
      volumeGallons: 8.5,
      collectionMethod: 'bucket',
      temperature: 42,
      weatherCondition: 'sunny',
      createdAt: '2025-02-10T14:30:00Z',
    },
    {
      id: 'coll-2',
      seasonId: 'season-2025',
      date: '2025-02-11',
      time: '15:00',
      volumeGallons: 12.2,
      collectionMethod: 'bucket',
      temperature: 45,
      weatherCondition: 'sunny',
      createdAt: '2025-02-11T15:00:00Z',
    },
    {
      id: 'coll-3',
      seasonId: 'season-2025',
      date: '2025-02-12',
      time: '14:00',
      volumeGallons: 6.8,
      collectionMethod: 'bucket',
      temperature: 38,
      weatherCondition: 'cloudy',
      createdAt: '2025-02-12T14:00:00Z',
    },
  ]);

  const [boils, setBoils] = useState<BoilSession[]>([
    {
      id: 'boil-1',
      seasonId: 'season-2025',
      startTime: '2025-02-12T16:00:00',
      endTime: '2025-02-12T20:30:00',
      sapInputGallons: 27.5,
      syrupOutputGallons: 0.7,
      boilMethod: 'outdoor-arch',
      fuelUsed: 'wood',
      createdAt: '2025-02-12T20:30:00Z',
    },
  ]);

  // Calculated metrics
  const metrics: SeasonMetricsType = {
    tapsInstalled: taps.filter((t) => t.isActive).length,
    sapCollected: collections.reduce((sum, c) => sum + c.volumeGallons, 0),
    boilsCompleted: boils.length,
    syrupProduced: boils.reduce((sum, b) => sum + b.syrupOutputGallons, 0),
    avgSapPerTap:
      collections.reduce((sum, c) => sum + c.volumeGallons, 0) /
      Math.max(taps.filter((t) => t.isActive).length, 1),
    sapToSyrupRatio:
      collections.reduce((sum, c) => sum + c.volumeGallons, 0) /
      Math.max(boils.reduce((sum, b) => sum + b.syrupOutputGallons, 0), 0.01),
    trends: {
      taps: 'neutral',
      sap: 'up',
      boils: 'neutral',
      syrup: 'up',
    },
  };

  // Mock sap flow forecast
  const sapFlowForecast: SapFlowForecastType[] = [
    {
      date: '2025-02-15',
      dayOfWeek: 'Sat',
      highTemp: 42,
      lowTemp: 26,
      flowLevel: 'high',
      recommendation: 'Excellent collection day. Plan for midday pickup.',
      freezeThaw: true,
    },
    {
      date: '2025-02-16',
      dayOfWeek: 'Sun',
      highTemp: 45,
      lowTemp: 28,
      flowLevel: 'high',
      recommendation: 'Strong sap flow continues. Check taps for overflow.',
      freezeThaw: true,
    },
    {
      date: '2025-02-17',
      dayOfWeek: 'Mon',
      highTemp: 48,
      lowTemp: 32,
      flowLevel: 'moderate',
      recommendation: 'Good flow expected but slightly warming trend.',
      freezeThaw: true,
    },
    {
      date: '2025-02-18',
      dayOfWeek: 'Tue',
      highTemp: 52,
      lowTemp: 36,
      flowLevel: 'low',
      recommendation: 'Flow will slow. Consider scheduling a boil.',
      freezeThaw: false,
    },
    {
      date: '2025-02-19',
      dayOfWeek: 'Wed',
      highTemp: 38,
      lowTemp: 24,
      flowLevel: 'moderate',
      recommendation: 'Cooler temps return. Flow should pick back up.',
      freezeThaw: true,
    },
  ];

  // Activity timeline
  const activities: ActivityTimelineItem[] = [
    {
      id: 'act-1',
      type: 'collection',
      title: 'Sap Collection Logged',
      description: '6.8 gallons collected from 4 taps',
      timestamp: '2025-02-12T14:00:00Z',
    },
    {
      id: 'act-2',
      type: 'boil',
      title: 'Boil Session Completed',
      description: '27.5 gal sap → 0.7 gal syrup (39:1 ratio)',
      timestamp: '2025-02-12T20:30:00Z',
    },
    {
      id: 'act-3',
      type: 'tap-installed',
      title: '4 Taps Installed',
      description: 'Taps added to 3 trees',
      timestamp: '2025-02-05T09:00:00Z',
    },
    {
      id: 'act-4',
      type: 'tree-added',
      title: '3 Trees Added',
      description: 'Sugar and red maple trees registered',
      timestamp: '2025-02-01T10:00:00Z',
    },
    {
      id: 'act-5',
      type: 'season-start',
      title: '2025 Season Started',
      description: 'Maple sugaring season is now active',
      timestamp: '2025-02-01T09:00:00Z',
    },
  ];

  // Weekly collection data
  const weeklyCollectionData = [
    { date: '2025-02-09', day: 'Sat', gallons: 0 },
    { date: '2025-02-10', day: 'Sun', gallons: 8.5, flowLevel: 'high' as const },
    { date: '2025-02-11', day: 'Mon', gallons: 12.2, flowLevel: 'high' as const },
    { date: '2025-02-12', day: 'Tue', gallons: 6.8, flowLevel: 'moderate' as const },
    { date: '2025-02-13', day: 'Wed', gallons: 0 },
    { date: '2025-02-14', day: 'Thu', gallons: 0 },
    { date: '2025-02-15', day: 'Fri', gallons: 0 },
  ];

  // CRUD handlers
  const handleAddTree = (treeData: any) => {
    const newTree: MapleTree = {
      id: `tree-${Date.now()}`,
      seasonId: currentSeason.id,
      ...treeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTrees([...trees, newTree]);
    toast.success('Tree added successfully');
  };

  const handleAddTap = (tapData: any) => {
    const newTap: Tap = {
      id: `tap-${Date.now()}`,
      seasonId: currentSeason.id,
      ...tapData,
      isActive: true,
    };
    setTaps([...taps, newTap]);
    toast.success('Tap added successfully');
  };

  const handleBulkAddTaps = (tapsData: any[]) => {
    const newTaps = tapsData.map((tapData, index) => ({
      id: `tap-${Date.now()}-${index}`,
      seasonId: currentSeason.id,
      ...tapData,
      isActive: true,
    }));
    setTaps([...taps, ...newTaps]);
    toast.success(`${newTaps.length} taps added successfully`);
  };

  const handleLogCollection = (collectionData: any) => {
    const newCollection: SapCollection = {
      id: `coll-${Date.now()}`,
      seasonId: currentSeason.id,
      ...collectionData,
      createdAt: new Date().toISOString(),
    };
    setCollections([...collections, newCollection]);
    toast.success('Collection logged successfully');
  };

  const handleLogBoil = (boilData: any) => {
    const newBoil: BoilSession = {
      id: `boil-${Date.now()}`,
      seasonId: currentSeason.id,
      ...boilData,
      createdAt: new Date().toISOString(),
    };
    setBoils([...boils, newBoil]);
    toast.success('Boil session logged successfully');
  };

  const handleCardClick = (metric: 'taps' | 'sap' | 'boils' | 'syrup') => {
    switch (metric) {
      case 'taps':
        setViewMode('taps');
        break;
      case 'sap':
        setViewMode('collections');
        break;
      case 'boils':
      case 'syrup':
        setViewMode('boils');
        break;
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'trees':
        return (
          <TreesManagement
            trees={trees}
            onAddTree={() => setShowAddTreeModal(true)}
            onBack={() => setViewMode('dashboard')}
          />
        );
      case 'taps':
        return (
          <TapsManagement
            taps={taps}
            trees={trees}
            onAddTap={() => setShowAddTapModal(true)}
            onBulkAdd={() => setShowBulkTapsModal(true)}
            onBack={() => setViewMode('dashboard')}
          />
        );
      case 'collections':
        return (
          <CollectionHistory
            collections={collections}
            onLogCollection={() => setShowCollectionModal(true)}
            onBack={() => setViewMode('dashboard')}
          />
        );
      case 'boils':
        return (
          <BoilHistory
            boils={boils}
            onLogBoil={() => setShowBoilModal(true)}
            onBack={() => setViewMode('dashboard')}
          />
        );
      case 'analytics':
        return (
          <SeasonAnalytics
            trees={trees}
            taps={taps}
            collections={collections}
            boils={boils}
            onBack={() => setViewMode('dashboard')}
          />
        );
      default:
        return (
          <div className="space-y-6">
            {/* Season Metrics */}
            <SeasonMetrics metrics={metrics} onCardClick={handleCardClick} />

            {/* Quick Actions */}
            <QuickActions
              onAddTree={() => setShowAddTreeModal(true)}
              onAddTaps={() => setShowBulkTapsModal(true)}
              onLogCollection={() => setShowCollectionModal(true)}
              onLogBoil={() => setShowBoilModal(true)}
            />

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                <SapFlowForecast forecast={sapFlowForecast} />
                <ActivityTimeline activities={activities} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <SapCollectionChart
                  weeklyData={weeklyCollectionData}
                  perTapAverage={metrics.avgSapPerTap}
                  bestDay={{ date: '2025-02-11', gallons: 12.2 }}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1>Maple Sugaring – {currentSeason.year} Season</h1>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-muted-foreground">
                Track sap collection, boiling, and syrup production
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Change Season
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sub Navigation */}
          {viewMode === 'dashboard' && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('trees')}
              >
                <TreesIcon className="w-4 h-4 mr-2" />
                Trees ({trees.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('taps')}
              >
                <Target className="w-4 h-4 mr-2" />
                Taps ({taps.filter((t) => t.isActive).length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('collections')}
              >
                <Droplets className="w-4 h-4 mr-2" />
                Collections ({collections.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('boils')}
              >
                <Beaker className="w-4 h-4 mr-2" />
                Boils ({boils.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {renderContent()}
      </div>

      {/* Modals */}
      <AddTreeModal
        open={showAddTreeModal}
        onOpenChange={setShowAddTreeModal}
        onSave={handleAddTree}
      />

      <AddTapModal
        open={showAddTapModal}
        onOpenChange={setShowAddTapModal}
        onSave={handleAddTap}
        trees={trees}
      />

      <BulkAddTapsModal
        open={showBulkTapsModal}
        onOpenChange={setShowBulkTapsModal}
        onSave={handleBulkAddTaps}
        trees={trees}
      />

      <LogCollectionModal
        open={showCollectionModal}
        onOpenChange={setShowCollectionModal}
        onSave={handleLogCollection}
      />

      <LogBoilModal
        open={showBoilModal}
        onOpenChange={setShowBoilModal}
        onSave={handleLogBoil}
      />
    </div>
  );
}