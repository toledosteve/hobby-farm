import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { SubscriptionBilling } from "./SubscriptionBilling";
import { EmptySubscriptionState } from "./EmptySubscriptionState";
import { PaymentErrorState } from "./PaymentErrorState";
import { PlanChangedSuccess } from "./PlanChangedSuccess";

type DemoState = "active" | "empty" | "error" | "success";

export function SubscriptionShowcase() {
  const [currentState, setCurrentState] = useState<DemoState>("active");

  return (
    <div className="min-h-screen bg-background">
      {/* State Selector */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Subscription & Billing Demo</h2>
              <p className="text-sm text-muted-foreground">
                Explore different states and flows
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={currentState === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentState("active")}
              >
                Active Subscription
              </Button>
              <Button
                variant={currentState === "empty" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentState("empty")}
              >
                No Subscription
              </Button>
              <Button
                variant={currentState === "error" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentState("error")}
              >
                Payment Error
              </Button>
              <Button
                variant={currentState === "success" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentState("success")}
              >
                Success State
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Current State Display */}
      <div>
        {currentState === "active" && <SubscriptionBilling />}
        {currentState === "empty" && <EmptySubscriptionState />}
        {currentState === "error" && <PaymentErrorState />}
        {currentState === "success" && (
          <PlanChangedSuccess
            newPlanName="Professional Plan"
            newPrice={19.99}
            billingPeriod="month"
            effectiveDate="January 14, 2026"
            onContinue={() => setCurrentState("active")}
          />
        )}
      </div>

      {/* Feature Overview (Fixed at bottom for reference) */}
      <div className="fixed bottom-4 right-4 max-w-sm">
        <Card className="p-4 bg-background/95 backdrop-blur-sm shadow-xl">
          <div className="text-xs space-y-2">
            <div className="font-medium mb-2">Current State Features:</div>
            {currentState === "active" && (
              <ul className="space-y-1 text-muted-foreground">
                <li>• Full subscription overview</li>
                <li>• Change plan modal</li>
                <li>• Update payment flow</li>
                <li>• Cancel subscription dialog</li>
                <li>• Usage tracking</li>
                <li>• Billing history</li>
              </ul>
            )}
            {currentState === "empty" && (
              <ul className="space-y-1 text-muted-foreground">
                <li>• Free tier welcome</li>
                <li>• Feature comparison</li>
                <li>• Upgrade prompts</li>
                <li>• Plan selection modal</li>
              </ul>
            )}
            {currentState === "error" && (
              <ul className="space-y-1 text-muted-foreground">
                <li>• Clear error messaging</li>
                <li>• Recovery actions</li>
                <li>• Grace period explanation</li>
                <li>• Support contact</li>
              </ul>
            )}
            {currentState === "success" && (
              <ul className="space-y-1 text-muted-foreground">
                <li>• Confirmation message</li>
                <li>• New plan details</li>
                <li>• Next steps guidance</li>
                <li>• Clear CTA</li>
              </ul>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
