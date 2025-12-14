import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Sprout, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { ChangePlanModal } from "./ChangePlanModal";

export function EmptySubscriptionState() {
  const [showPlanModal, setShowPlanModal] = useState(false);

  const starterFeatures = [
    "1 farm project to get started",
    "2 basic modules (try Maple or Poultry)",
    "1 GB cloud storage for your data",
    "Mobile access to check on the go",
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sprout className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <h1 className="mb-3">Welcome to Hobby Farm Planner</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              You're currently on our free Starter plan. Ready to unlock the full
              potential of your farm?
            </p>
          </div>

          <Card className="p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl">Starter Plan (Free)</h2>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Current Plan
                </span>
              </div>
              <p className="text-muted-foreground">
                You have access to basic farm management features
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {starterFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t">
              <Button onClick={() => setShowPlanModal(true)} className="w-full" size="lg">
                View All Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Why Upgrade Section */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium mb-2">More Projects</h3>
              <p className="text-xs text-muted-foreground">
                Manage multiple farms and properties
              </p>
            </Card>
            
            <Card className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-2">Full Modules</h3>
              <p className="text-xs text-muted-foreground">
                Access all farm management tools
              </p>
            </Card>
            
            <Card className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-2">Weather Insights</h3>
              <p className="text-xs text-muted-foreground">
                Plan ahead with forecasting
              </p>
            </Card>
          </div>
        </div>
      </div>

      <ChangePlanModal
        open={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentPlan="Starter Plan"
      />
    </>
  );
}
