import { CreditCard, Calendar, HardDrive, Check } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function BillingSettings() {
  return (
    <SettingsSection
      title="Subscription & Billing"
      description="Manage your subscription plan and payment details"
    >
      {/* Current Plan */}
      <SettingsCard title="Current Plan">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3>Hobby Farmer Plan</h3>
                <Badge variant="outline" className="bg-primary/10">Active</Badge>
              </div>
              <p className="text-muted-foreground">
                Perfect for small-scale hobby farms with multiple modules
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold">$9.99</p>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium mb-3">Plan includes:</p>
            <div className="space-y-2">
              {[
                'Up to 3 farm projects',
                'All modules (Maple, Poultry, Garden, etc.)',
                '5GB cloud storage',
                'Mobile app access',
                'Weather forecasting',
                'Email support',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button>Upgrade Plan</Button>
            <Button variant="outline">Change Plan</Button>
          </div>
        </div>
      </SettingsCard>

      {/* Billing Information */}
      <SettingsCard title="Billing Information">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Next billing date</p>
              <p className="text-sm text-muted-foreground">
                January 15, 2026
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Payment method</p>
              <p className="text-sm text-muted-foreground">
                Visa ending in 4242
              </p>
            </div>
            <Button size="sm" variant="outline">
              Update
            </Button>
          </div>
        </div>
      </SettingsCard>

      {/* Usage Overview */}
      <SettingsCard title="Usage Overview">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Farm Projects</span>
              <span className="text-sm font-medium">1 / 3</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '33%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Active Modules</span>
              <span className="text-sm font-medium">2 / Unlimited</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '20%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Cloud Storage</span>
              <span className="text-sm font-medium">1.2 GB / 5 GB</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '24%' }} />
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Billing History */}
      <SettingsCard title="Billing History">
        <div className="space-y-2">
          {[
            { date: 'Dec 15, 2025', amount: '$9.99', status: 'Paid' },
            { date: 'Nov 15, 2025', amount: '$9.99', status: 'Paid' },
            { date: 'Oct 15, 2025', amount: '$9.99', status: 'Paid' },
          ].map((invoice, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm">{invoice.date}</span>
                <Badge variant="outline" className="text-xs">
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{invoice.amount}</span>
                <Button size="sm" variant="ghost">
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}
