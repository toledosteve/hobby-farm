import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, Sprout, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBilling } from '@/contexts';
import { Plan } from '@/types';

interface ChangePlanModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePlanModal({ open, onClose }: ChangePlanModalProps) {
  const { plans, currentPlan, changePlan, startCheckout, formatPrice, hasActiveSubscription } = useBilling();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowConfirmation(true);
  };

  const handleConfirmChange = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);
    try {
      if (hasActiveSubscription) {
        // Change existing subscription
        await changePlan(selectedPlan.stripePriceId);
        toast.success(`Successfully changed to ${selectedPlan.name}`);
        onClose();
      } else {
        // Start new checkout session
        await startCheckout(selectedPlan.stripePriceId);
        // User will be redirected to Stripe
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to change plan');
    } finally {
      setIsLoading(false);
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

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('pro')) {
      return TrendingUp;
    }
    return Sprout;
  };

  // Sort plans by sortOrder
  const sortedPlans = [...plans].sort((a, b) => a.sortOrder - b.sortOrder);

  if (showConfirmation && selectedPlan) {
    const isUpgrade = currentPlan ? selectedPlan.priceMonthly > currentPlan.priceMonthly : true;
    const PlanIcon = getPlanIcon(selectedPlan.name);

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
                  <PlanIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{selectedPlan.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatPrice(selectedPlan.priceMonthly)} / {selectedPlan.billingInterval}
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-2 text-sm">
              {hasActiveSubscription ? (
                <p className="text-muted-foreground">
                  {isUpgrade ? (
                    <>
                      You'll be charged a prorated amount today for the remainder of your billing period.
                    </>
                  ) : (
                    <>
                      Your plan will change immediately. Any unused time on your
                      current plan will be credited to your account.
                    </>
                  )}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  You'll be redirected to our secure checkout to complete your subscription.
                  {selectedPlan.isFree ? '' : ' Includes a 3-day free trial.'}
                </p>
              )}
              <p className="text-muted-foreground">
                Starting next billing cycle, you'll be charged{' '}
                <span className="font-medium text-foreground">
                  {formatPrice(selectedPlan.priceMonthly)} / {selectedPlan.billingInterval}
                </span>
                .
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={handleBack} className="flex-1" disabled={isLoading}>
                Go Back
              </Button>
              <Button onClick={handleConfirmChange} className="flex-1" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {hasActiveSubscription ? 'Confirm Change' : 'Continue to Checkout'}
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
          {sortedPlans.filter(plan => plan.isActive).map((plan) => {
            const isCurrent = currentPlan?.id === plan.id;
            const PlanIcon = getPlanIcon(plan.name);

            return (
              <Card
                key={plan.id}
                className={`p-6 relative ${
                  isCurrent ? 'ring-2 ring-primary' : ''
                } ${plan.isPopular ? 'border-primary/50' : ''}`}
              >
                {plan.isPopular && (
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
                      {formatPrice(plan.priceMonthly)}
                    </span>
                    <span className="text-muted-foreground">
                      / {plan.billingInterval}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 text-sm ${
                        !feature.included ? 'opacity-40' : ''
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          feature.included ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan)}
                  variant={isCurrent ? 'outline' : plan.isPopular ? 'default' : 'outline'}
                  className="w-full"
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Current Plan' : 'Select Plan'}
                </Button>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
