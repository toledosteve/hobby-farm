import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Check, Sprout, TrendingUp } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ChangePlanModalProps {
  open: boolean;
  onClose: () => void;
  currentPlan: string;
}

export function ChangePlanModal({ open, onClose, currentPlan }: ChangePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      icon: Sprout,
      price: 4.99,
      period: "month",
      description: "Perfect for getting started with your farm",
      popular: false,
      features: [
        { text: "Up to 2 farm projects", included: true },
        { text: "Basic modules (Maple, Poultry)", included: true },
        { text: "2 GB storage", included: true },
        { text: "Mobile access", included: true },
        { text: "Weather forecasting", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      id: "premium",
      name: "Premium Plan",
      icon: TrendingUp,
      price: 12.99,
      period: "month",
      description: "Everything you need to manage your farm",
      popular: true,
      features: [
        { text: "Unlimited farm projects", included: true },
        { text: "All farm modules + advanced features", included: true },
        { text: "20 GB storage", included: true },
        { text: "Mobile access", included: true },
        { text: "Advanced weather forecasting", included: true },
        { text: "Priority email support", included: true },
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowConfirmation(true);
  };

  const handleConfirmChange = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      toast.success(`Successfully changed to ${plan.name}`);
      onClose();
      setShowConfirmation(false);
      setSelectedPlan(null);
    }
  };

  const handleBack = () => {
    setShowConfirmation(false);
    setSelectedPlan(null);
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
    setSelectedPlan(null);
    onClose();
  };

  if (showConfirmation && selectedPlan) {
    const plan = plans.find(p => p.id === selectedPlan)!;
    const currentPlanPrice = currentPlan.includes("Basic") ? 4.99 : 12.99;
    const isUpgrade = plan.price > currentPlanPrice;
    
    return (
      <Dialog open={open} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Plan Change</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <plan.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ${plan.price} / {plan.period}
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                {isUpgrade ? (
                  <>
                    You'll be charged a prorated amount of{" "}
                    <span className="font-medium text-foreground">
                      ${((plan.price || 0) - currentPlanPrice).toFixed(2)}
                    </span>{" "}
                    today for the remainder of your billing period.
                  </>
                ) : (
                  <>
                    Your plan will change immediately. Any unused time on your
                    current plan will be credited to your account.
                  </>
                )}
              </p>
              <p className="text-muted-foreground">
                Starting next billing cycle, you'll be charged{" "}
                <span className="font-medium text-foreground">
                  ${plan.price} / {plan.period}
                </span>
                .
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Go Back
              </Button>
              <Button onClick={handleConfirmChange} className="flex-1">
                Confirm Change
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <p className="text-sm text-muted-foreground pt-2">
            Select the plan that best fits your farming needs
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {plans.map((plan) => {
            const isCurrent = plan.name === currentPlan;
            const PlanIcon = plan.icon;

            return (
              <Card
                key={plan.id}
                className={`p-6 relative ${
                  isCurrent ? "ring-2 ring-primary" : ""
                } ${plan.popular ? "border-primary/50" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-4 bg-primary">
                    Most Popular
                  </Badge>
                )}
                {isCurrent && (
                  <Badge className="absolute -top-2 right-4 bg-muted text-foreground">
                    Current Plan
                  </Badge>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <PlanIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      / {plan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 text-sm ${
                        !feature.included ? "opacity-40" : ""
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          feature.included ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={isCurrent ? "outline" : plan.popular ? "default" : "outline"}
                  className="w-full"
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current Plan" : "Select Plan"}
                </Button>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
