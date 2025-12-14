import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { AuthLayout } from './AuthLayout';
import { Check, Sprout, TrendingUp, ArrowLeft, Loader2, Crown } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { useBilling } from '@/contexts';
import { Plan } from '@/types';
import { toast } from 'sonner';

export function PlanSelectionScreen() {
  const navigate = useNavigate();
  const { plans, refreshPlans, startCheckout, formatPrice, isLoading } = useBilling();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshPlans();
  }, [refreshPlans]);

  const getPlanIcon = (plan: Plan) => {
    if (plan.isFree) return Sprout;
    if (plan.name.toLowerCase().includes('premium') || plan.priceMonthly >= 1500) return Crown;
    return TrendingUp;
  };

  const handleContinue = async () => {
    if (!selectedPlan) return;

    setIsSubmitting(true);
    try {
      if (selectedPlan.isFree) {
        // Free plan - go directly to projects
        toast.success('Welcome to Hobby Farm Planner!');
        navigate(ROUTES.PROJECTS);
      } else {
        // Paid plan - start Stripe Checkout with trial
        await startCheckout(selectedPlan.stripePriceId);
        // User will be redirected to Stripe
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to select plan');
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Select free plan by default and continue
    navigate(ROUTES.PROJECTS);
  };

  // Sort plans: free first, then by price
  const sortedPlans = [...plans]
    .filter((p) => p.isActive)
    .sort((a, b) => {
      if (a.isFree && !b.isFree) return -1;
      if (!a.isFree && b.isFree) return 1;
      return a.sortOrder - b.sortOrder;
    });

  if (isLoading && plans.length === 0) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3 tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Choose Your Plan
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Start with a 3-day free trial on paid plans, then continue with your selected plan
          </p>
        </div>

        {/* Free Trial Banner */}
        <div className="backdrop-blur-2xl bg-primary/20 border border-white/30 rounded-2xl p-4 mb-6 text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 text-white">
            <Check className="w-5 h-5" />
            <span className="font-medium drop-shadow-md">
              3-day free trial on paid plans - Cancel anytime
            </span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className={`grid gap-6 mb-6 ${sortedPlans.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {sortedPlans.map((plan) => {
            const PlanIcon = getPlanIcon(plan);
            const isSelected = selectedPlan?.id === plan.id;

            return (
              <Card
                key={plan.id}
                className={`p-6 relative cursor-pointer transition-all backdrop-blur-2xl ${
                  isSelected
                    ? 'ring-2 ring-white shadow-2xl bg-white/25 border-white/40'
                    : 'bg-white/15 border-white/25 hover:bg-white/20'
                } ${plan.isPopular ? 'border-primary/50' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.isPopular && (
                  <Badge className="absolute -top-2 left-4 bg-primary shadow-lg">
                    Most Popular
                  </Badge>
                )}
                {isSelected && (
                  <Badge className="absolute -top-2 right-4 bg-white text-foreground shadow-lg">
                    Selected
                  </Badge>
                )}
                {plan.isFree && (
                  <Badge className="absolute -top-2 left-4 bg-white/80 text-foreground shadow-lg">
                    Free Forever
                  </Badge>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                    <PlanIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 text-white drop-shadow-md">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-white/80 drop-shadow-md">
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-white drop-shadow-md">
                      {plan.isFree ? 'Free' : formatPrice(plan.priceMonthly)}
                    </span>
                    {!plan.isFree && (
                      <span className="text-white/80 drop-shadow-md">
                        / {plan.billingInterval}
                      </span>
                    )}
                  </div>
                  {!plan.isFree && (
                    <p className="text-xs text-white/70 mt-1 drop-shadow-md">
                      After 3-day free trial
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 text-sm ${
                        !feature.included ? 'opacity-40' : ''
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 drop-shadow-md ${
                          feature.included ? 'text-white' : 'text-white/50'
                        }`}
                      />
                      <span className="text-white drop-shadow-md">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center gap-2 text-xs text-white/70 drop-shadow-md">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>{plan.isFree ? 'No credit card required' : 'No commitment - Cancel anytime'}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="backdrop-blur-2xl bg-white/15 border border-white/30 rounded-2xl p-6 shadow-2xl">
          <Button
            onClick={handleContinue}
            disabled={!selectedPlan || isSubmitting}
            size="lg"
            className="w-full text-base h-12 shadow-lg"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {selectedPlan
              ? selectedPlan.isFree
                ? `Continue with ${selectedPlan.name}`
                : `Start 3-Day Free Trial with ${selectedPlan.name}`
              : 'Select a plan to continue'}
          </Button>
          {selectedPlan && !selectedPlan.isFree && (
            <p className="text-xs text-center text-white/70 mt-3 drop-shadow-md">
              Your card will be charged {formatPrice(selectedPlan.priceMonthly)} after the trial ends
            </p>
          )}
        </div>

        {/* Skip option for free tier */}
        <div className="text-center mt-4">
          <button
            onClick={handleSkip}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Skip for now and start with free plan
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
