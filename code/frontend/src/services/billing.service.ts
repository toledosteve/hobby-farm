import {
  Plan,
  BillingSummary,
  Invoice,
  Subscription,
  CheckLimitResult,
} from '@/types';
import { billingApi } from './api/billing';

class BillingService {
  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<Plan[]> {
    return billingApi.getPlans();
  }

  /**
   * Get billing summary for the current user
   */
  async getSummary(): Promise<BillingSummary> {
    return billingApi.getSummary();
  }

  /**
   * Create a Stripe Checkout session and redirect to it
   */
  async startCheckout(priceId: string): Promise<void> {
    const { url } = await billingApi.createCheckoutSession({ priceId });
    window.location.href = url;
  }

  /**
   * Start a trial without requiring credit card
   */
  async startTrial(priceId: string): Promise<void> {
    await billingApi.startTrial({ priceId });
  }

  /**
   * Open Stripe Customer Portal for managing billing
   */
  async openCustomerPortal(): Promise<void> {
    const { url } = await billingApi.createPortalSession();
    window.location.href = url;
  }

  /**
   * Change subscription plan (or get checkout URL for free tier users)
   */
  async changePlan(newPriceId: string): Promise<Subscription | { requiresCheckout: true; checkoutUrl: string }> {
    return billingApi.changePlan({ newPriceId });
  }

  /**
   * Cancel subscription at end of billing period
   */
  async cancelSubscription(): Promise<Subscription> {
    return billingApi.cancelSubscription();
  }

  /**
   * Reactivate a canceled subscription
   */
  async reactivateSubscription(): Promise<Subscription> {
    return billingApi.reactivateSubscription();
  }

  /**
   * Get invoice history
   */
  async getInvoices(limit?: number): Promise<Invoice[]> {
    return billingApi.getInvoices(limit);
  }

  /**
   * Download an invoice PDF
   */
  async downloadInvoice(invoiceId: string): Promise<void> {
    const { url } = await billingApi.getInvoiceDownloadUrl(invoiceId);
    window.open(url, '_blank');
  }

  /**
   * Check if user can perform an action based on limits
   */
  async checkLimit(
    limitType: 'projects' | 'modules' | 'storage'
  ): Promise<CheckLimitResult> {
    return billingApi.checkLimit(limitType);
  }

  /**
   * Format price from cents to display string
   */
  formatPrice(cents: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(cents / 100);
  }

  /**
   * Format storage bytes to human readable
   */
  formatStorage(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let size = bytes;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(size < 10 ? 1 : 0)} ${units[unitIndex]}`;
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Get status badge configuration
   */
  getStatusConfig(status: string): {
    label: string;
    variant: 'default' | 'secondary' | 'destructive';
    className: string;
  } {
    const configs: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive'; className: string }> = {
      active: {
        label: 'Active',
        variant: 'default',
        className: 'bg-primary/10 text-primary border-primary/20',
      },
      trialing: {
        label: 'Trial',
        variant: 'secondary',
        className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      },
      canceled: {
        label: 'Canceled',
        variant: 'secondary',
        className: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
      },
      past_due: {
        label: 'Past Due',
        variant: 'destructive',
        className: 'bg-destructive/10 text-destructive border-destructive/20',
      },
      incomplete: {
        label: 'Incomplete',
        variant: 'secondary',
        className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
      },
      unpaid: {
        label: 'Unpaid',
        variant: 'destructive',
        className: 'bg-destructive/10 text-destructive border-destructive/20',
      },
    };

    return configs[status] || configs.incomplete;
  }
}

export const billingService = new BillingService();
