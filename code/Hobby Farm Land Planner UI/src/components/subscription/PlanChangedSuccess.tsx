import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

interface PlanChangedSuccessProps {
  newPlanName: string;
  newPrice: number;
  billingPeriod: string;
  effectiveDate: string;
  onContinue: () => void;
}

export function PlanChangedSuccess({
  newPlanName,
  newPrice,
  billingPeriod,
  effectiveDate,
  onContinue,
}: PlanChangedSuccessProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Card className="p-8 text-center">
          {/* Success Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-semibold mb-3">
            Plan Updated Successfully!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your subscription has been changed to the{" "}
            <span className="font-medium text-foreground">{newPlanName}</span>
          </p>

          {/* New Plan Details */}
          <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                New billing amount
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-1">
                <span className="text-4xl font-semibold">
                  ${newPrice.toFixed(2)}
                </span>
                <span className="text-muted-foreground">
                  / {billingPeriod}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Effective immediately
              </div>
            </div>
          </Card>

          {/* What's Next */}
          <div className="text-left mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-3">What's next?</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  All new features are now available in your account
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Your next billing date is{" "}
                  <span className="font-medium text-foreground">
                    {effectiveDate}
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  A confirmation email has been sent to your inbox
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button onClick={onContinue} className="w-full" size="lg">
            Continue to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Questions about your plan?{" "}
          <button className="text-primary hover:underline">
            Contact support
          </button>
        </p>
      </div>
    </div>
  );
}
