import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Plan, BillingSummary, Invoice, Subscription, CheckLimitResult } from '@/types';
import { billingService } from '@/services/billing.service';
import { useAuth } from './AuthContext';

interface BillingContextType {
  // State
  summary: BillingSummary | null;
  plans: Plan[];
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;

  // Actions
  refreshSummary: () => Promise<void>;
  refreshPlans: () => Promise<void>;
  refreshInvoices: (limit?: number) => Promise<void>;
  startCheckout: (priceId: string) => Promise<void>;
  startTrial: (priceId: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  changePlan: (newPriceId: string) => Promise<Subscription>;
  cancelSubscription: () => Promise<Subscription>;
  reactivateSubscription: () => Promise<Subscription>;
  downloadInvoice: (invoiceId: string) => Promise<void>;
  checkLimit: (limitType: 'projects' | 'modules' | 'storage') => Promise<CheckLimitResult>;

  // Helpers
  formatPrice: (cents: number) => string;
  formatStorage: (bytes: number) => string;
  formatDate: (dateString: string) => string;
  getStatusConfig: (status: string) => { label: string; variant: 'default' | 'secondary' | 'destructive'; className: string };

  // Computed values
  hasActiveSubscription: boolean;
  isTrialing: boolean;
  isCanceled: boolean;
  currentPlan: Plan | null;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

interface BillingProviderProps {
  children: ReactNode;
}

export function BillingProvider({ children }: BillingProviderProps) {
  const { isAuthenticated } = useAuth();
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh billing summary
  const refreshSummary = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await billingService.getSummary();
      setSummary(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load billing summary';
      setError(message);
      console.error('Error loading billing summary:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Refresh plans
  const refreshPlans = useCallback(async () => {
    try {
      const data = await billingService.getPlans();
      setPlans(data);
    } catch (err) {
      console.error('Error loading plans:', err);
    }
  }, []);

  // Refresh invoices
  const refreshInvoices = useCallback(async (limit?: number) => {
    if (!isAuthenticated) return;

    try {
      const data = await billingService.getInvoices(limit);
      setInvoices(data);
    } catch (err) {
      console.error('Error loading invoices:', err);
    }
  }, [isAuthenticated]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshSummary();
      refreshPlans();
      refreshInvoices(10);
    } else {
      setSummary(null);
      setInvoices([]);
    }
  }, [isAuthenticated, refreshSummary, refreshPlans, refreshInvoices]);

  // Start checkout
  const startCheckout = useCallback(async (priceId: string) => {
    setError(null);
    try {
      await billingService.startCheckout(priceId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start checkout';
      setError(message);
      throw err;
    }
  }, []);

  // Start trial (no credit card required)
  const startTrial = useCallback(async (priceId: string) => {
    setError(null);
    try {
      await billingService.startTrial(priceId);
      await refreshSummary();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start trial';
      setError(message);
      throw err;
    }
  }, [refreshSummary]);

  // Open customer portal
  const openCustomerPortal = useCallback(async () => {
    setError(null);
    try {
      await billingService.openCustomerPortal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to open billing portal';
      setError(message);
      throw err;
    }
  }, []);

  // Change plan (or redirect to checkout for free tier users)
  const changePlan = useCallback(async (newPriceId: string) => {
    setError(null);
    try {
      const result = await billingService.changePlan(newPriceId);
      // If free tier user upgrading, redirect to checkout
      if ('requiresCheckout' in result && result.requiresCheckout) {
        window.location.href = result.checkoutUrl;
        return result as any;
      }
      await refreshSummary();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change plan';
      setError(message);
      throw err;
    }
  }, [refreshSummary]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    setError(null);
    try {
      const result = await billingService.cancelSubscription();
      await refreshSummary();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(message);
      throw err;
    }
  }, [refreshSummary]);

  // Reactivate subscription
  const reactivateSubscription = useCallback(async () => {
    setError(null);
    try {
      const result = await billingService.reactivateSubscription();
      await refreshSummary();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reactivate subscription';
      setError(message);
      throw err;
    }
  }, [refreshSummary]);

  // Download invoice
  const downloadInvoice = useCallback(async (invoiceId: string) => {
    try {
      await billingService.downloadInvoice(invoiceId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download invoice';
      setError(message);
      throw err;
    }
  }, []);

  // Check limit
  const checkLimit = useCallback(async (limitType: 'projects' | 'modules' | 'storage') => {
    return billingService.checkLimit(limitType);
  }, []);

  // Computed values
  const hasActiveSubscription = summary?.subscription?.status === 'active' ||
                                summary?.subscription?.status === 'trialing';
  const isTrialing = summary?.subscription?.status === 'trialing';
  const isCanceled = summary?.subscription?.cancelAtPeriodEnd ||
                     summary?.subscription?.status === 'canceled';
  const currentPlan = summary?.plan || null;

  const value: BillingContextType = {
    summary,
    plans,
    invoices,
    isLoading,
    error,
    refreshSummary,
    refreshPlans,
    refreshInvoices,
    startCheckout,
    startTrial,
    openCustomerPortal,
    changePlan,
    cancelSubscription,
    reactivateSubscription,
    downloadInvoice,
    checkLimit,
    formatPrice: billingService.formatPrice,
    formatStorage: billingService.formatStorage,
    formatDate: billingService.formatDate,
    getStatusConfig: billingService.getStatusConfig,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    currentPlan,
  };

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBilling(): BillingContextType {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}
