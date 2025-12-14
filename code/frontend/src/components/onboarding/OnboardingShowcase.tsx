/**
 * Onboarding Flow Showcase
 * 
 * This component displays all onboarding screens and their features
 * for design reference and documentation.
 */

import { Button } from "../ui/button";

export function OnboardingShowcase() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="mb-2">New Farm Project Workflow</h1>
          <p className="text-muted-foreground">
            A comprehensive 6-step onboarding flow for creating and setting up farm projects
          </p>
        </div>

        {/* Flow Overview */}
        <section className="space-y-6">
          <h2>Workflow Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="text-sm mb-2">Create Project</h3>
              <p className="text-sm text-muted-foreground">
                Set project name, location, optional acreage, and initial goals
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="text-sm mb-2">Find Your Land</h3>
              <p className="text-sm text-muted-foreground">
                Locate property on map via address search, coordinates, or manual zoom
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="text-sm mb-2">Draw Boundary</h3>
              <p className="text-sm text-muted-foreground">
                Create land boundary by drawing or importing KML/GeoJSON files
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="text-sm mb-2">Soil Analysis</h3>
              <p className="text-sm text-muted-foreground">
                View automated soil insights with drainage, suitability, and recommendations
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
                5
              </div>
              <h3 className="text-sm mb-2">Set Goals</h3>
              <p className="text-sm text-muted-foreground">
                Select farm goals with soil-based recommendations (optional)
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
                6
              </div>
              <h3 className="text-sm mb-2">Setup Complete</h3>
              <p className="text-sm text-muted-foreground">
                Review project summary and transition to main map editor
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="space-y-6">
          <h2>Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <h3 className="text-sm">Progress Tracking</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Visual progress bar showing current step</li>
                <li>• Step counter (e.g., "Step 3 of 6")</li>
                <li>• Persistent app logo and branding</li>
                <li>• Back navigation for all steps</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <h3 className="text-sm">Multi-Method Input</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Address search for location</li>
                <li>• Coordinate entry option</li>
                <li>• Manual boundary drawing</li>
                <li>• KML/GeoJSON file import</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <h3 className="text-sm">Smart Recommendations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Soil-based activity suggestions</li>
                <li>• Drainage class analysis</li>
                <li>• Area percentage breakdown</li>
                <li>• Recommended goals highlighting</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <h3 className="text-sm">Flexible Workflow</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Optional fields (acreage, goals)</li>
                <li>• Skip option for goal selection</li>
                <li>• Cancel/back navigation</li>
                <li>• Auto-calculated acreage from boundary</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Form Components */}
        <section className="space-y-6">
          <h2>Form Components Used</h2>
          <div className="space-y-4 max-w-2xl">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-sm">Input Fields</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm mb-1 block">Project Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Maple Ridge Farm"
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block">Location with Icon</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search address..."
                      className="w-full px-3 py-2 pl-10 border border-border rounded-lg"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">🔍</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-sm">Goal Selection Cards</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 rounded-lg border-2 border-primary bg-primary/5 text-left">
                  <div className="text-2xl mb-2">🍎</div>
                  <div className="text-sm">Fruit Orchard</div>
                  <div className="absolute top-2 right-2">
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      ✨ Recommended
                    </div>
                  </div>
                </button>
                <button className="p-4 rounded-lg border-2 border-border text-left hover:border-primary/50">
                  <div className="text-2xl mb-2">🐄</div>
                  <div className="text-sm">Livestock</div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Responsive */}
        <section className="space-y-6">
          <h2>Responsive Design</h2>
          <div className="bg-muted rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-sm mb-2">Mobile (sm)</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sidebar stacks above map on mobile</li>
                <li>• Single column form layouts</li>
                <li>• Full-width buttons</li>
                <li>• Goal cards in 2-column grid</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm mb-2">Tablet & Desktop (lg+)</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sidebar + map side-by-side layout</li>
                <li>• Multi-column goal grid (3-4 columns)</li>
                <li>• Wider forms with comfortable spacing</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Color Usage */}
        <section className="space-y-6">
          <h2>Visual States</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm mb-2">
                <strong>Info/Instructions</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Primary color at 5% opacity for helpful guidance
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm mb-2">
                <strong>Active Drawing</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Blue accent for interactive drawing mode
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm mb-2">
                <strong>Success/Complete</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Primary color at 10% for completion states
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-6">
          <h2>Button Patterns</h2>
          <div className="space-y-4 max-w-xl">
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm text-muted-foreground">Primary Action</p>
              <Button size="lg" className="w-full">
                Continue to Next Step
              </Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm text-muted-foreground">Secondary Action</p>
              <Button variant="outline" size="lg" className="w-full">
                Import KML / GeoJSON
              </Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm text-muted-foreground">Tertiary Action</p>
              <Button variant="ghost">Skip This Step</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
