import { SeasonDashboard } from "./components/maple-v2/SeasonDashboard";

/**
 * Maple Sugaring Operations Management - Demo Entry Point
 * 
 * This is a complete, production-ready maple sugaring management system for
 * hobby and small-scale producers (10-300 taps).
 * 
 * Features:
 * - Season Dashboard with metrics, quick actions, sap flow forecast, and activity timeline
 * - Complete Trees Management (CRUD)
 * - Complete Taps Management (CRUD with bulk add)
 * - Sap Collection Logging (CRUD with weather tracking)
 * - Boil Session Management (CRUD with efficiency metrics)
 * - Season Analytics with charts and insights
 * - Weather-integrated sap flow forecasting
 * - Trend analysis and production recommendations
 * 
 * Usage:
 * Simply render this component to access the full maple sugaring management experience.
 */

export default function MapleSugaringDemo() {
  return <SeasonDashboard />;
}
