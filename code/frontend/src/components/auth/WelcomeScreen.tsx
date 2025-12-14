import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { AuthLayout } from "./AuthLayout";
import { AuthCard } from "./AuthCard";
import { AuthInput } from "./AuthInput";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth, useBilling } from "@/contexts";
import { ROUTES } from "@/routes/routes";
import { toast } from "sonner";
import { Check, Sprout, TrendingUp, Crown, Loader2, ArrowLeft } from "lucide-react";
import { Plan } from "@/types";

type AuthView = 'welcome' | 'signin' | 'signup-details' | 'signup-plan';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { plans, refreshPlans, formatPrice, isLoading: plansLoading, startTrial } = useBilling();

  const [view, setView] = useState<AuthView>('welcome');
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshPlans();
  }, [refreshPlans]);

  // Auto-select first paid plan as default (or free if no paid plans)
  useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      const sortedPlans = [...plans].filter(p => p.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
      const defaultPlan = sortedPlans.find(p => !p.isFree) || sortedPlans[0];
      if (defaultPlan) setSelectedPlan(defaultPlan);
    }
  }, [plans, selectedPlan]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!signInData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!signInData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await login(signInData.email, signInData.password);
        toast.success("Welcome back!");
        navigate(ROUTES.PROJECTS);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to sign in");
      }
    }
  };

  const validateSignUpDetails = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!signUpData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!signUpData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!signUpData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!signUpData.password) {
      newErrors.password = "Password is required";
    } else if (signUpData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignUpDetails()) {
      setView('signup-plan');
    }
  };

  const handleFinalSignUp = async () => {
    if (!selectedPlan) return;

    setIsSubmitting(true);
    try {
      // First, create the account
      await register(signUpData.firstName, signUpData.lastName, signUpData.email, signUpData.password);

      // Then start trial with selected plan
      await startTrial(selectedPlan.stripePriceId);

      toast.success(
        selectedPlan.isFree
          ? 'Welcome to Hobby Farm Planner!'
          : `Your 3-day ${selectedPlan.name} trial has started!`
      );
      navigate(ROUTES.PROJECTS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
      setIsSubmitting(false);
    }
  };

  const getPlanIcon = (plan: Plan) => {
    if (plan.isFree) return Sprout;
    if (plan.name.toLowerCase().includes('premium') || plan.priceMonthly >= 1500) return Crown;
    return TrendingUp;
  };

  // Sort plans by sortOrder
  const sortedPlans = [...plans]
    .filter((p) => p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Welcome view
  if (view === 'welcome') {
    return (
      <AuthLayout>
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl ring-4 ring-white/20">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 8L19 14H16V20H12V14H9L14 8Z"
                    fill="white"
                  />
                  <path
                    d="M8 20H20"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Main Heading with Strong Shadow */}
            <h1 className="text-6xl md:text-7xl font-semibold text-white mb-4 tracking-tight [text-shadow:_0_4px_12px_rgba(0,0,0,0.5)]">
              Welcome to Hobby Farm Planner
            </h1>
            <p className="text-2xl md:text-3xl text-white mb-8 max-w-2xl mx-auto font-light [text-shadow:_0_2px_8px_rgba(0,0,0,0.4)]">
              Map your land. Understand your soil. Plan your future.
            </p>

            {/* Action Buttons */}
            <div className="max-w-md mx-auto">
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => setView('signin')}
                  size="lg"
                  className="w-full text-lg h-14 bg-white hover:bg-gray-100 hover:scale-[1.02] text-foreground shadow-lg font-medium transition-all duration-200"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setView('signup-details')}
                  size="lg"
                  className="w-full text-lg h-14 bg-primary hover:bg-[#3A7550] hover:scale-[1.02] shadow-lg font-medium transition-all duration-200"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Sign in view
  if (view === 'signin') {
    return (
      <AuthLayout>
        <AuthCard
          title="Welcome Back"
          subtitle="Sign in to continue to your farm"
          onBack={() => setView('welcome')}
        >
          <form onSubmit={handleSignIn} className="space-y-4">
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="sarah@example.com"
              value={signInData.email}
              onChange={(e) => {
                setSignInData({ ...signInData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              error={errors.email}
              required
            />
            <AuthInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={signInData.password}
              onChange={(e) => {
                setSignInData({ ...signInData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              error={errors.password}
              required
            />
            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <button
              type="button"
              onClick={() => setView('signup-details')}
              className="text-primary hover:underline font-medium"
            >
              Create one
            </button>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  // Sign up - account details view
  if (view === 'signup-details') {
    return (
      <AuthLayout>
        <AuthCard
          title="Create Your Account"
          subtitle="Get started planning your land in minutes"
          onBack={() => setView('welcome')}
        >
          <form onSubmit={handleContinueToPlan} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <AuthInput
                id="firstName"
                label="First Name"
                placeholder="Sarah"
                value={signUpData.firstName}
                onChange={(e) => {
                  setSignUpData({ ...signUpData, firstName: e.target.value });
                  if (errors.firstName) setErrors({ ...errors, firstName: "" });
                }}
                error={errors.firstName}
                required
              />
              <AuthInput
                id="lastName"
                label="Last Name"
                placeholder="Smith"
                value={signUpData.lastName}
                onChange={(e) => {
                  setSignUpData({ ...signUpData, lastName: e.target.value });
                  if (errors.lastName) setErrors({ ...errors, lastName: "" });
                }}
                error={errors.lastName}
                required
              />
            </div>
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="sarah@example.com"
              value={signUpData.email}
              onChange={(e) => {
                setSignUpData({ ...signUpData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              error={errors.email}
              required
            />
            <AuthInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={signUpData.password}
              onChange={(e) => {
                setSignUpData({ ...signUpData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              error={errors.password}
              required
            />
            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg">
                Continue to Plan Selection
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button
              type="button"
              onClick={() => setView('signin')}
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </button>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  // Sign up - plan selection view
  if (plansLoading && plans.length === 0) {
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
          onClick={() => setView('signup-details')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to account details</span>
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
        <div className="bg-primary/90 border border-primary rounded-2xl p-4 mb-6 text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 text-white">
            <Check className="w-5 h-5" />
            <span className="font-medium">
              3-day free trial included - Cancel anytime
            </span>
          </div>
        </div>

        {/* Plan Cards - White Background */}
        <div className={`grid gap-6 mb-6 ${sortedPlans.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {sortedPlans.map((plan) => {
            const PlanIcon = getPlanIcon(plan);
            const isSelected = selectedPlan?.id === plan.id;

            return (
              <Card
                key={plan.id}
                className={`p-6 relative cursor-pointer transition-all bg-white ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-2xl border-primary'
                    : 'border-gray-200 hover:shadow-lg hover:border-gray-300'
                } ${plan.isPopular ? 'border-primary/50' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.isPopular && (
                  <Badge className="absolute -top-2 left-4 bg-primary shadow-lg">
                    Most Popular
                  </Badge>
                )}
                {isSelected && (
                  <Badge className="absolute -top-2 right-4 bg-primary shadow-lg">
                    Selected
                  </Badge>
                )}
                {plan.isFree && !plan.isPopular && (
                  <Badge className="absolute -top-2 left-4 bg-gray-600 shadow-lg">
                    Free Forever
                  </Badge>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <PlanIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 text-foreground">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-foreground">
                      {plan.isFree ? 'Free' : formatPrice(plan.priceMonthly)}
                    </span>
                    {!plan.isFree && (
                      <span className="text-muted-foreground">
                        / {plan.billingInterval}
                      </span>
                    )}
                  </div>
                  {!plan.isFree && (
                    <p className="text-xs text-muted-foreground mt-1">
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
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          feature.included ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <span className="text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>No credit card required</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <Card className="p-6 bg-white shadow-xl">
          <Button
            onClick={handleFinalSignUp}
            disabled={!selectedPlan || isSubmitting}
            size="lg"
            className="w-full text-base h-12 shadow-lg"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {selectedPlan
              ? selectedPlan.isFree
                ? `Create Account with ${selectedPlan.name}`
                : `Start 3-Day Free Trial with ${selectedPlan.name}`
              : 'Select a plan to continue'}
          </Button>
          {selectedPlan && !selectedPlan.isFree && (
            <p className="text-xs text-center text-muted-foreground mt-3">
              No credit card required. After trial ends, add payment or switch to free plan.
            </p>
          )}
        </Card>
      </div>
    </AuthLayout>
  );
}
