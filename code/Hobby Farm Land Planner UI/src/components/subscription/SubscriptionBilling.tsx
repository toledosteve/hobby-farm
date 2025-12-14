import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Check, 
  CreditCard, 
  Calendar, 
  Download,
  ChevronRight,
  AlertCircle,
  Sprout,
  Map,
  Smartphone,
  Cloud,
  LifeBuoy,
  CloudRain
} from "lucide-react";
import { ChangePlanModal } from "./ChangePlanModal";
import { UpdatePaymentModal } from "./UpdatePaymentModal";
import { CancelSubscriptionModal } from "./CancelSubscriptionModal";

interface SubscriptionBillingProps {
  onBack?: () => void;
}

export function SubscriptionBilling({ onBack }: SubscriptionBillingProps) {
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock data - replace with real data from your backend
  const subscription = {
    planName: "Premium Plan",
    status: "active" as "active" | "canceled" | "past_due" | "trial",
    price: 12.99,
    billingPeriod: "month",
    nextBillingDate: "January 14, 2026",
    description: "Everything you need to manage your farm",
    features: [
      { icon: Sprout, text: "Unlimited farm projects", included: true },
      { icon: Map, text: "All farm modules + advanced features", included: true },
      { icon: Cloud, text: "20 GB cloud storage", included: true },
      { icon: Smartphone, text: "Mobile access", included: true },
      { icon: CloudRain, text: "Advanced weather forecasting", included: true },
      { icon: LifeBuoy, text: "Priority email support", included: true },
    ],
    paymentMethod: {
      brand: "Visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2027",
    },
    usage: {
      projects: { current: 1, limit: "unlimited" },
      modules: { current: 2, limit: "unlimited" },
      storage: { current: 1.2, limit: 20, unit: "GB" },
    },
    billingHistory: [
      { id: "1", date: "December 14, 2024", status: "paid", amount: 12.99 },
      { id: "2", date: "November 14, 2024", status: "paid", amount: 12.99 },
      { id: "3", date: "October 14, 2024", status: "paid", amount: 12.99 },
      { id: "4", date: "September 14, 2024", status: "paid", amount: 12.99 },
    ],
  };

  const getStatusBadge = (status: typeof subscription.status) => {
    const variants = {
      active: { label: "Active", variant: "default" as const, className: "bg-primary/10 text-primary border-primary/20" },
      trial: { label: "Trial", variant: "secondary" as const, className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
      canceled: { label: "Canceled", variant: "secondary" as const, className: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20" },
      past_due: { label: "Past Due", variant: "destructive" as const, className: "bg-destructive/10 text-destructive border-destructive/20" },
    };
    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getBillingStatusPill = (status: string) => {
    const variants = {
      paid: { label: "Paid", className: "bg-primary/10 text-primary" },
      failed: { label: "Failed", className: "bg-destructive/10 text-destructive" },
      refunded: { label: "Refunded", className: "bg-orange-500/10 text-orange-700 dark:text-orange-400" },
    };
    const config = variants[status as keyof typeof variants] || variants.paid;
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const calculateProgress = (current: number, limit: number | string) => {
    if (limit === "unlimited") return 0;
    return (current / (limit as number)) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Subscription & Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription, billing information, and usage
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1: Current Plan */}
          <Card className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl">{subscription.planName}</h2>
                  {getStatusBadge(subscription.status)}
                </div>
                <p className="text-muted-foreground mb-4">
                  {subscription.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold">
                    ${subscription.price}
                  </span>
                  <span className="text-muted-foreground">
                    / {subscription.billingPeriod}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowChangePlanModal(true)}
                >
                  Change Plan
                </Button>
                <Button onClick={() => setShowChangePlanModal(true)}>
                  Upgrade Plan
                </Button>
              </div>
            </div>

            {/* Plan Features */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">
                Plan includes
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {subscription.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Section 2: Billing Information */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Billing Information</h3>
            
            <div className="space-y-4">
              {/* Next Billing Date */}
              <div className="flex items-start justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Next Billing Date</div>
                    <div className="text-sm text-muted-foreground">
                      {subscription.nextBillingDate}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Your subscription will automatically renew
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-start justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">Payment Method</div>
                    <div className="text-sm text-muted-foreground">
                      {subscription.paymentMethod.brand} ••••{" "}
                      {subscription.paymentMethod.last4}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Securely managed • Expires {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUpdatePaymentModal(true)}
                  className="flex-shrink-0"
                >
                  Update
                </Button>
              </div>
            </div>
          </Card>

          {/* Section 3: Usage Overview */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Usage Overview</h3>
            
            <div className="space-y-4">
              {/* Farm Projects */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Farm Projects</span>
                  <span className="text-sm text-muted-foreground">
                    {subscription.usage.projects.current} / {subscription.usage.projects.limit}
                  </span>
                </div>
                <Progress 
                  value={calculateProgress(
                    subscription.usage.projects.current,
                    subscription.usage.projects.limit
                  )} 
                  className="h-2"
                />
              </div>

              {/* Active Modules */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Active Modules</span>
                  <span className="text-sm text-muted-foreground">
                    {subscription.usage.modules.current} / {subscription.usage.modules.limit === "unlimited" ? "Unlimited" : subscription.usage.modules.limit}
                  </span>
                </div>
                {subscription.usage.modules.limit === "unlimited" ? (
                  <div className="h-2 bg-primary/20 rounded-full" />
                ) : (
                  <Progress 
                    value={calculateProgress(
                      subscription.usage.modules.current,
                      subscription.usage.modules.limit
                    )} 
                    className="h-2"
                  />
                )}
              </div>

              {/* Cloud Storage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Cloud Storage</span>
                  <span className="text-sm text-muted-foreground">
                    {subscription.usage.storage.current} {subscription.usage.storage.unit} / {subscription.usage.storage.limit} {subscription.usage.storage.unit}
                  </span>
                </div>
                <Progress 
                  value={calculateProgress(
                    subscription.usage.storage.current,
                    subscription.usage.storage.limit
                  )} 
                  className="h-2"
                />
              </div>
            </div>
          </Card>

          {/* Section 4: Billing History */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Billing History</h3>
            
            <div className="space-y-3">
              {subscription.billingHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-sm text-muted-foreground min-w-[120px]">
                      {item.date}
                    </div>
                    <div>{getBillingStatusPill(item.status)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-medium">
                      ${item.amount.toFixed(2)}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Cancel Subscription */}
          <div className="pt-4 pb-8">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel subscription
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePlanModal
        open={showChangePlanModal}
        onClose={() => setShowChangePlanModal(false)}
        currentPlan={subscription.planName}
      />
      <UpdatePaymentModal
        open={showUpdatePaymentModal}
        onClose={() => setShowUpdatePaymentModal(false)}
      />
      <CancelSubscriptionModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        nextBillingDate={subscription.nextBillingDate}
      />
    </div>
  );
}