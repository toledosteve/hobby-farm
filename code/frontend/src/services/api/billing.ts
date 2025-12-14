import { httpClient } from '../http-client';
import {
  Plan,
  BillingSummary,
  Invoice,
  Subscription,
  CheckLimitResult,
  CreateCheckoutSessionDto,
  ChangePlanDto,
} from '@/types';

export const billingApi = {
  /**
   * Get all available subscription plans
   */
  getPlans: async (): Promise<Plan[]> => {
    return httpClient.get<Plan[]>('billing/plans');
  },

  /**
   * Get billing summary for the current user
   */
  getSummary: async (): Promise<BillingSummary> => {
    return httpClient.get<BillingSummary>('billing/summary');
  },

  /**
   * Create a Stripe Checkout session for new subscriptions
   */
  createCheckoutSession: async (
    dto: CreateCheckoutSessionDto
  ): Promise<{ sessionId: string; url: string }> => {
    return httpClient.post<{ sessionId: string; url: string }>(
      'billing/checkout-session',
      dto
    );
  },

  /**
   * Start a trial without credit card (for signup flow)
   */
  startTrial: async (dto: { priceId: string }): Promise<void> => {
    return httpClient.post<void>('billing/start-trial', dto);
  },

  /**
   * Create a Stripe Customer Portal session for managing billing
   */
  createPortalSession: async (): Promise<{ url: string }> => {
    return httpClient.post<{ url: string }>('billing/portal-session');
  },

  /**
   * Change subscription plan (or get checkout URL for free tier users)
   */
  changePlan: async (dto: ChangePlanDto): Promise<Subscription | { requiresCheckout: true; checkoutUrl: string }> => {
    return httpClient.post<Subscription | { requiresCheckout: true; checkoutUrl: string }>('billing/change-plan', dto);
  },

  /**
   * Cancel subscription at end of billing period
   */
  cancelSubscription: async (): Promise<Subscription> => {
    return httpClient.post<Subscription>('billing/cancel');
  },

  /**
   * Reactivate a canceled subscription
   */
  reactivateSubscription: async (): Promise<Subscription> => {
    return httpClient.post<Subscription>('billing/reactivate');
  },

  /**
   * Get invoice history
   */
  getInvoices: async (limit?: number): Promise<Invoice[]> => {
    const params = limit ? { params: { limit: limit.toString() } } : undefined;
    return httpClient.get<Invoice[]>('billing/invoices', params);
  },

  /**
   * Get invoice download URL
   */
  getInvoiceDownloadUrl: async (invoiceId: string): Promise<{ url: string }> => {
    return httpClient.get<{ url: string }>(`billing/invoices/${invoiceId}/download`);
  },

  /**
   * Check if user can perform an action based on limits
   */
  checkLimit: async (
    limitType: 'projects' | 'modules' | 'storage'
  ): Promise<CheckLimitResult> => {
    return httpClient.get<CheckLimitResult>(`billing/check-limit/${limitType}`);
  },
};
