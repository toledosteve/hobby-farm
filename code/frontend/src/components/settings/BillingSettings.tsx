import { useState } from 'react';
import { CreditCard, Calendar, Download, Check, Loader2, RefreshCw } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { SettingsCard } from './SettingsCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';
import { useBilling } from '@/contexts';
import { ChangePlanModal, CancelSubscriptionModal, EmptySubscriptionState } from '../subscription';
import { toast } from 'sonner';

export function BillingSettings() {
  const {
    summary,
    invoices,
    isLoading,
    error,
    currentPlan,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    openCustomerPortal,
    downloadInvoice,
    reactivateSubscription,
    formatPrice,
    formatStorage,
    formatDate,
    getStatusConfig,
    refreshSummary,
  } = useBilling();

  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

  const handleOpenPortal = async () => {
    setIsPortalLoading(true);
    try {
      await openCustomerPortal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to open billing portal');
    } finally {
      setIsPortalLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    setDownloadingInvoiceId(invoiceId);
    try {
      await downloadInvoice(invoiceId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download invoice');
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const handleReactivate = async () => {
    setIsReactivating(true);
    try {
      await reactivateSubscription();
      toast.success('Subscription reactivated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reactivate subscription');
    } finally {
      setIsReactivating(false);
    }
  };

  const calculateProgress = (current: number, limit: number | null) => {
    if (limit === null) return 0; // unlimited
    return Math.min((current / limit) * 100, 100);
  };

  // Show loading state
  if (isLoading && !summary) {
    return (
      <SettingsSection
        title="Subscription & Billing"
        description="Manage your subscription plan and payment details"
      >
        <SettingsCard title="Current Plan">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </SettingsCard>
      </SettingsSection>
    );
  }

  // Show error state
  if (error && !summary) {
    return (
      <SettingsSection
        title="Subscription & Billing"
        description="Manage your subscription plan and payment details"
      >
        <SettingsCard title="Error Loading Billing">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshSummary} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </SettingsCard>
      </SettingsSection>
    );
  }

  // Show empty state for free tier / no subscription
  if (!hasActiveSubscription && !isTrialing) {
    return (
      <SettingsSection
        title="Subscription & Billing"
        description="Manage your subscription plan and payment details"
      >
        <EmptySubscriptionState />
      </SettingsSection>
    );
  }

  const subscription = summary?.subscription;
  const usage = summary?.usage;
  const paymentMethod = summary?.paymentMethod;
  const limits = currentPlan?.limits;

  const getStatusBadge = () => {
    if (!subscription) return null;

    let status = subscription.status;
    if (isTrialing) status = 'trialing';
    if (isCanceled) status = 'canceled';

    const config = getStatusConfig(status);
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

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
                <h3 className="text-lg font-semibold">{currentPlan?.name || 'No Plan'}</h3>
                {getStatusBadge()}
              </div>
              <p className="text-muted-foreground">
                {currentPlan?.description || 'Select a plan to get started'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold">
                {currentPlan ? formatPrice(currentPlan.priceMonthly) : '$0'}
              </p>
              <p className="text-sm text-muted-foreground">
                /{currentPlan?.billingInterval || 'month'}
              </p>
            </div>
          </div>

          {isCanceled && subscription?.currentPeriodEnd && (
            <div className="p-3 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-400 text-sm">
              Your subscription will end on {formatDate(subscription.currentPeriodEnd)}.
              <Button
                variant="link"
                className="px-2 h-auto text-orange-700 dark:text-orange-400"
                onClick={handleReactivate}
                disabled={isReactivating}
              >
                {isReactivating ? 'Reactivating...' : 'Reactivate'}
              </Button>
            </div>
          )}

          {isTrialing && subscription?.trialEnd && (
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm">
              Your free trial ends on {formatDate(subscription.trialEnd)}.
            </div>
          )}

          {currentPlan && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium mb-3">Plan includes:</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {currentPlan.features
                  .filter((f) => f.included)
                  .map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setShowChangePlanModal(true)}>
              {hasActiveSubscription ? 'Change Plan' : 'Upgrade Plan'}
            </Button>
            {hasActiveSubscription && (
              <Button variant="outline" onClick={() => setShowChangePlanModal(true)}>
                View All Plans
              </Button>
            )}
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
                {subscription?.currentPeriodEnd
                  ? formatDate(subscription.currentPeriodEnd)
                  : 'No upcoming billing'}
              </p>
              {!isCanceled && (
                <p className="text-xs text-muted-foreground mt-1">
                  Your subscription will automatically renew
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Payment method</p>
              <p className="text-sm text-muted-foreground">
                {paymentMethod
                  ? `${paymentMethod.brand} ending in ${paymentMethod.last4}`
                  : 'No payment method on file'}
              </p>
              {paymentMethod && (
                <p className="text-xs text-muted-foreground mt-1">
                  Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                </p>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenPortal}
              disabled={isPortalLoading}
            >
              {isPortalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Update'
              )}
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
              <span className="text-sm font-medium">
                {usage?.projectCount ?? 0} / {limits?.maxProjects ?? 'Unlimited'}
              </span>
            </div>
            {limits?.maxProjects !== null ? (
              <Progress
                value={calculateProgress(usage?.projectCount ?? 0, limits?.maxProjects ?? null)}
                className="h-2"
              />
            ) : (
              <div className="w-full h-2 bg-primary/20 rounded-full" />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Active Modules</span>
              <span className="text-sm font-medium">
                {usage?.moduleCount ?? 0} / {limits?.maxModules ?? 'Unlimited'}
              </span>
            </div>
            {limits?.maxModules !== null ? (
              <Progress
                value={calculateProgress(usage?.moduleCount ?? 0, limits?.maxModules ?? null)}
                className="h-2"
              />
            ) : (
              <div className="w-full h-2 bg-primary/20 rounded-full" />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Cloud Storage</span>
              <span className="text-sm font-medium">
                {formatStorage(usage?.storageUsedBytes ?? 0)} /{' '}
                {limits ? formatStorage(limits.maxStorageBytes) : '0 GB'}
              </span>
            </div>
            <Progress
              value={calculateProgress(
                usage?.storageUsedBytes ?? 0,
                limits?.maxStorageBytes ?? 0
              )}
              className="h-2"
            />
          </div>
        </div>
      </SettingsCard>

      {/* Billing History */}
      <SettingsCard title="Billing History">
        <div className="space-y-2">
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No billing history yet
            </p>
          ) : (
            invoices.map((invoice) => {
              const statusConfig = getStatusConfig(invoice.status);
              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{formatDate(invoice.periodStart)}</span>
                    <Badge variant={statusConfig.variant} className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {formatPrice(invoice.amountPaid || invoice.amountDue)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      disabled={downloadingInvoiceId === invoice.id}
                    >
                      {downloadingInvoiceId === invoice.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SettingsCard>

      {/* Cancel Subscription */}
      {hasActiveSubscription && !isCanceled && (
        <div className="pt-4">
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel subscription
          </button>
        </div>
      )}

      {/* Modals */}
      <ChangePlanModal
        open={showChangePlanModal}
        onClose={() => setShowChangePlanModal(false)}
      />
      <CancelSubscriptionModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      />
    </SettingsSection>
  );
}
