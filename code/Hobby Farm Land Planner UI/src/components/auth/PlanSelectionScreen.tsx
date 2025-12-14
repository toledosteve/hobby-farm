import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { AuthLayout } from "./AuthLayout";
import { Check, Sprout, TrendingUp, ArrowLeft } from "lucide-react";

interface PlanSelectionScreenProps {
  onSelectPlan: (plan: "basic" | "premium") => void;
  onBack: () => void;
  userEmail?: string;
}

export function PlanSelectionScreen({ 
  onSelectPlan, 
  onBack,
  userEmail 
}: PlanSelectionScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | null>(null);

  const plans = [
    {
      id: "basic" as const,
      name: "Basic Plan",
      icon: Sprout,
      price: 4.99,
      period: "month",
      description: "Perfect for getting started",
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
      id: "premium" as const,
      name: "Premium Plan",
      icon: TrendingUp,
      price: 12.99,
      period: "month",
      description: "Everything you need",
      popular: true,
      features: [
        { text: "Unlimited farm projects", included: true },
        { text: "All modules + advanced features", included: true },
        { text: "20 GB storage", included: true },
        { text: "Mobile access", included: true },
        { text: "Advanced weather forecasting", included: true },
        { text: "Priority email support", included: true },
      ],
    },
  ];

  const handleContinue = () => {
    if (selectedPlan) {
      onSelectPlan(selectedPlan);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-5xl">
        {/* Back Button */}
        <button
          onClick={onBack}
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
            Start with a 3-day free trial, then continue with your selected plan
          </p>
        </div>

        {/* Free Trial Banner */}
        <div className="backdrop-blur-2xl bg-primary/20 border border-white/30 rounded-2xl p-4 mb-6 text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium drop-shadow-md">
              3-day free trial included • Cancel anytime
            </span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {plans.map((plan) => {
            const PlanIcon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`p-6 relative cursor-pointer transition-all backdrop-blur-2xl ${
                  isSelected
                    ? "ring-2 ring-white shadow-2xl bg-white/25 border-white/40"
                    : "bg-white/15 border-white/25 hover:bg-white/20"
                } ${plan.popular ? "border-primary/50" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-4 bg-primary shadow-lg">
                    Most Popular
                  </Badge>
                )}
                {isSelected && (
                  <Badge className="absolute -top-2 right-4 bg-white text-foreground shadow-lg">
                    Selected
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
                      ${plan.price}
                    </span>
                    <span className="text-white/80 drop-shadow-md">
                      / {plan.period}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mt-1 drop-shadow-md">
                    After 3-day free trial
                  </p>
                </div>

                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 text-sm ${
                        !feature.included ? "opacity-40" : ""
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 drop-shadow-md ${
                          feature.included ? "text-white" : "text-white/50"
                        }`}
                      />
                      <span className="text-white drop-shadow-md">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center gap-2 text-xs text-white/70 drop-shadow-md">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>No commitment • Cancel anytime</span>
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
            disabled={!selectedPlan}
            size="lg"
            className="w-full text-base h-12 shadow-lg"
          >
            {selectedPlan
              ? `Start 3-Day Free Trial with ${plans.find(p => p.id === selectedPlan)?.name}`
              : "Select a plan to continue"}
          </Button>
          <p className="text-xs text-center text-white/70 mt-3 drop-shadow-md">
            Your card will be charged ${plans.find(p => p.id === selectedPlan)?.price || "0.00"} after the trial ends
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}