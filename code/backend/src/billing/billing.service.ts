import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { Subscription, SubscriptionDocument } from './schemas/subscription.schema';
import { Plan, PlanDocument } from './schemas/plan.schema';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { Usage, UsageDocument } from './schemas/usage.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Project, ProjectDocument } from '../projects/schemas/project.schema';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { ChangePlanDto } from './dto/change-plan.dto';

@Injectable()
export class BillingService {
  private readonly stripe: Stripe | null = null;
  private readonly logger = new Logger(BillingService.name);
  private readonly stripeConfigured: boolean = false;

  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Usage.name) private usageModel: Model<UsageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private configService: ConfigService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      this.logger.warn('STRIPE_SECRET_KEY not configured - billing features will use mock data');
      this.stripeConfigured = false;
    } else {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-11-17.clover',
      });
      this.stripeConfigured = true;
    }

    // Seed default plans if none exist
    this.seedDefaultPlansIfNeeded();
  }

  /**
   * Check if Stripe is configured
   */
  private ensureStripeConfigured(): void {
    if (!this.stripeConfigured || !this.stripe) {
      throw new BadRequestException('Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment.');
    }
  }

  /**
   * Seed default plans if database is empty (for development without Stripe)
   */
  private async seedDefaultPlansIfNeeded(): Promise<void> {
    const existingPlans = await this.planModel.countDocuments();
    if (existingPlans > 0) return;

    this.logger.log('Seeding default plans for development...');

    const defaultPlans = [
      {
        stripePriceId: 'price_starter_free',
        stripeProductId: 'prod_starter',
        name: 'Starter Plan',
        description: 'Free tier for getting started',
        priceMonthly: 0,
        billingInterval: 'month',
        limits: {
          maxProjects: 1,
          maxModules: 2,
          maxStorageBytes: 1 * 1024 * 1024 * 1024, // 1 GB
          hasWeatherForecasting: false,
          hasPrioritySupport: false,
          hasMobileAccess: true,
          hasAdvancedFeatures: false,
        },
        features: [
          { text: '1 farm project', included: true },
          { text: '2 basic modules', included: true },
          { text: '1 GB cloud storage', included: true },
          { text: 'Mobile access', included: true },
          { text: 'Weather forecasting', included: false },
          { text: 'Priority support', included: false },
        ],
        sortOrder: 0,
        isPopular: false,
        isActive: true,
        isFree: true,
      },
      {
        stripePriceId: 'price_hobby_farmer',
        stripeProductId: 'prod_hobby_farmer',
        name: 'Hobby Farmer',
        description: 'Perfect for small-scale hobby farms',
        priceMonthly: 999, // $9.99
        billingInterval: 'month',
        limits: {
          maxProjects: 3,
          maxModules: null, // unlimited
          maxStorageBytes: 5 * 1024 * 1024 * 1024, // 5 GB
          hasWeatherForecasting: true,
          hasPrioritySupport: false,
          hasMobileAccess: true,
          hasAdvancedFeatures: false,
        },
        features: [
          { text: 'Up to 3 farm projects', included: true },
          { text: 'All modules included', included: true },
          { text: '5 GB cloud storage', included: true },
          { text: 'Mobile access', included: true },
          { text: 'Weather forecasting', included: true },
          { text: 'Email support', included: true },
        ],
        sortOrder: 1,
        isPopular: true,
        isActive: true,
        isFree: false,
      },
      {
        stripePriceId: 'price_premium',
        stripeProductId: 'prod_premium',
        name: 'Premium',
        description: 'Everything you need to manage your farm',
        priceMonthly: 1999, // $19.99
        billingInterval: 'month',
        limits: {
          maxProjects: null, // unlimited
          maxModules: null,
          maxStorageBytes: 20 * 1024 * 1024 * 1024, // 20 GB
          hasWeatherForecasting: true,
          hasPrioritySupport: true,
          hasMobileAccess: true,
          hasAdvancedFeatures: true,
        },
        features: [
          { text: 'Unlimited farm projects', included: true },
          { text: 'All modules + advanced features', included: true },
          { text: '20 GB cloud storage', included: true },
          { text: 'Mobile access', included: true },
          { text: 'Advanced weather forecasting', included: true },
          { text: 'Priority email support', included: true },
        ],
        sortOrder: 2,
        isPopular: false,
        isActive: true,
        isFree: false,
      },
    ];

    for (const plan of defaultPlans) {
      await this.planModel.create(plan);
    }

    this.logger.log('Default plans seeded successfully');
  }

  // ==================== Customer Management ====================

  /**
   * Get or create a Stripe customer for a user
   */
  async getOrCreateCustomer(userId: string): Promise<string> {
    this.ensureStripeConfigured();

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Return existing customer ID if present
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // Create new Stripe customer
    const customer = await this.stripe!.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: userId,
      },
    });

    // Store customer ID on user
    await this.userModel.findByIdAndUpdate(userId, {
      stripeCustomerId: customer.id,
    });

    // Update existing subscription or create new one
    const existingSubscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (existingSubscription) {
      // Update existing subscription with Stripe customer ID
      existingSubscription.stripeCustomerId = customer.id;
      await existingSubscription.save();
    } else {
      // Create subscription record
      await this.subscriptionModel.create({
        userId: new Types.ObjectId(userId),
        stripeCustomerId: customer.id,
        status: 'incomplete',
      });
    }

    // Initialize usage tracking if not exists
    const existingUsage = await this.usageModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!existingUsage) {
      await this.usageModel.create({
        userId: new Types.ObjectId(userId),
        projectCount: 0,
        moduleCount: 0,
        storageUsedBytes: 0,
      });
    }

    return customer.id;
  }

  /**
   * Initialize a user with free tier (no Stripe required)
   */
  async initializeUserBilling(userId: string): Promise<void> {
    // Check if already initialized
    const existingSubscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (existingSubscription) return;

    // Get free plan
    const freePlan = await this.planModel.findOne({ isFree: true, isActive: true });

    // Create subscription record for free tier
    await this.subscriptionModel.create({
      userId: new Types.ObjectId(userId),
      status: 'active',
      stripePriceId: freePlan?.stripePriceId || 'price_starter_free',
    });

    // Initialize usage tracking
    await this.usageModel.create({
      userId: new Types.ObjectId(userId),
      projectCount: 0,
      moduleCount: 0,
      storageUsedBytes: 0,
    });

    this.logger.log(`Initialized free tier for user ${userId}`);
  }

  /**
   * Start a trial without credit card (for signup flow)
   * After trial ends, user auto-downgrades to free tier
   */
  async startTrial(userId: string, priceId: string): Promise<Subscription> {
    // Verify plan exists
    const plan = await this.planModel.findOne({ stripePriceId: priceId, isActive: true });
    if (!plan) {
      throw new BadRequestException('Invalid plan');
    }

    // Get free plan for reference
    const freePlan = await this.planModel.findOne({ isFree: true, isActive: true });

    // Calculate trial end date (3 days from now)
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 3);

    // Find existing subscription or create new one
    let subscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (subscription) {
      // Update existing subscription
      if (plan.isFree) {
        // Free plan - just set as active, no trial
        subscription.status = 'active';
        subscription.stripePriceId = priceId;
        subscription.trialStart = undefined;
        subscription.trialEnd = undefined;
      } else {
        // Paid plan - start trial
        subscription.status = 'trialing';
        subscription.stripePriceId = priceId;
        subscription.trialStart = trialStart;
        subscription.trialEnd = trialEnd;
      }
      await subscription.save();
    } else {
      // Create new subscription
      subscription = await this.subscriptionModel.create({
        userId: new Types.ObjectId(userId),
        status: plan.isFree ? 'active' : 'trialing',
        stripePriceId: priceId,
        trialStart: plan.isFree ? undefined : trialStart,
        trialEnd: plan.isFree ? undefined : trialEnd,
      });

      // Initialize usage tracking
      await this.usageModel.create({
        userId: new Types.ObjectId(userId),
        projectCount: 0,
        moduleCount: 0,
        storageUsedBytes: 0,
      });
    }

    this.logger.log(
      plan.isFree
        ? `User ${userId} selected free plan`
        : `Started ${plan.name} trial for user ${userId} (ends ${trialEnd.toISOString()})`,
    );

    return subscription;
  }

  /**
   * Check and handle expired trials
   * Call this on user activity to auto-downgrade expired trials
   */
  async checkAndHandleTrialExpiration(userId: string): Promise<boolean> {
    const subscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!subscription) return false;

    // Check if trial has expired
    if (
      subscription.status === 'trialing' &&
      subscription.trialEnd &&
      new Date() > subscription.trialEnd
    ) {
      // Trial expired - downgrade to free tier
      const freePlan = await this.planModel.findOne({ isFree: true, isActive: true });

      subscription.status = 'active';
      subscription.stripePriceId = freePlan?.stripePriceId || 'price_starter_free';
      subscription.trialStart = undefined;
      subscription.trialEnd = undefined;
      await subscription.save();

      this.logger.log(`Trial expired for user ${userId} - downgraded to free tier`);
      return true; // Trial was expired and downgraded
    }

    return false; // No expiration
  }

  // ==================== Checkout & Subscription ====================

  /**
   * Create a Stripe Checkout session for new subscriptions
   */
  async createCheckoutSession(
    userId: string,
    dto: CreateCheckoutSessionDto,
  ): Promise<{ sessionId: string; url: string }> {
    this.ensureStripeConfigured();
    const customerId = await this.getOrCreateCustomer(userId);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    // Verify the price exists and is active
    const plan = await this.planModel.findOne({ stripePriceId: dto.priceId, isActive: true });
    if (!plan) {
      throw new BadRequestException('Invalid or inactive plan');
    }

    const session = await this.stripe!.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: dto.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 3, // 3-day free trial
        metadata: {
          userId: userId,
        },
      },
      success_url: dto.successUrl || `${frontendUrl}/settings/billing?success=true`,
      cancel_url: dto.cancelUrl || `${frontendUrl}/settings/billing?canceled=true`,
      metadata: {
        userId: userId,
      },
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  /**
   * Create a Stripe Customer Portal session for managing payment methods
   */
  async createPortalSession(userId: string): Promise<{ url: string }> {
    this.ensureStripeConfigured();

    const subscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!subscription?.stripeCustomerId) {
      throw new NotFoundException('No billing account found');
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    const session = await this.stripe!.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${frontendUrl}/settings/billing`,
    });

    return { url: session.url };
  }

  // ==================== Plan Management ====================

  /**
   * Get all available plans
   */
  async getPlans(): Promise<Plan[]> {
    return this.planModel.find({ isActive: true }).sort({ sortOrder: 1 }).exec();
  }

  /**
   * Change subscription plan (upgrade/downgrade)
   * For free tier users, returns a checkout URL instead
   */
  async changePlan(userId: string, dto: ChangePlanDto): Promise<Subscription | { requiresCheckout: true; checkoutUrl: string }> {
    this.ensureStripeConfigured();

    const subscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    // Free tier user upgrading to paid - redirect to checkout
    if (!subscription?.stripeSubscriptionId) {
      const checkoutSession = await this.createCheckoutSession(userId, { priceId: dto.newPriceId });
      return { requiresCheckout: true, checkoutUrl: checkoutSession.url };
    }

    // Verify new plan exists
    const newPlan = await this.planModel.findOne({ stripePriceId: dto.newPriceId, isActive: true });
    if (!newPlan) {
      throw new BadRequestException('Invalid plan');
    }

    // Get current subscription from Stripe
    const stripeSubscription = await this.stripe!.subscriptions.retrieve(
      subscription.stripeSubscriptionId,
    );

    // Update subscription with new price
    const updatedSubscription = await this.stripe!.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: dto.newPriceId,
          },
        ],
        proration_behavior: 'always_invoice', // Handle prorations
        metadata: {
          userId: userId,
        },
      },
    );

    // Update local subscription record
    subscription.stripePriceId = dto.newPriceId;
    await subscription.save();

    return subscription;
  }

  /**
   * Cancel subscription at end of billing period
   */
  async cancelSubscription(userId: string): Promise<Subscription> {
    this.ensureStripeConfigured();

    const subscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new NotFoundException('No active subscription found');
    }

    await this.stripe!.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    subscription.cancelAtPeriodEnd = true;
    subscription.canceledAt = new Date();
    await subscription.save();

    return subscription;
  }

  /**
   * Reactivate a canceled subscription
   */
  async reactivateSubscription(userId: string): Promise<Subscription> {
    this.ensureStripeConfigured();

    const subscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new NotFoundException('No subscription found');
    }

    await this.stripe!.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    subscription.cancelAtPeriodEnd = false;
    subscription.canceledAt = undefined;
    await subscription.save();

    return subscription;
  }

  // ==================== Billing Summary & Invoices ====================

  /**
   * Get billing summary for the billing page
   */
  async getBillingSummary(userId: string): Promise<{
    subscription: Subscription | null;
    plan: Plan | null;
    usage: Usage | null;
    paymentMethod: { brand: string; last4: string; expiryMonth: number; expiryYear: number } | null;
  }> {
    // Initialize user billing if not already done
    await this.initializeUserBilling(userId);

    // Check for expired trials and auto-downgrade
    await this.checkAndHandleTrialExpiration(userId);

    const subscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!subscription) {
      return {
        subscription: null,
        plan: null,
        usage: null,
        paymentMethod: null,
      };
    }

    const plan = subscription.stripePriceId
      ? await this.planModel.findOne({ stripePriceId: subscription.stripePriceId })
      : null;

    // Compute usage dynamically from actual data
    const projects = await this.projectModel.find({ userId: new Types.ObjectId(userId) });
    const projectCount = projects.length;

    // Count enabled modules across all projects
    let moduleCount = 0;
    for (const project of projects) {
      if (project.enabledModules) {
        moduleCount += project.enabledModules.length;
      }
    }

    // Get or create usage record and update with actual counts
    let usage = await this.usageModel.findOne({ userId: new Types.ObjectId(userId) });
    if (usage) {
      usage.projectCount = projectCount;
      usage.moduleCount = moduleCount;
      await usage.save();
    } else {
      usage = await this.usageModel.create({
        userId: new Types.ObjectId(userId),
        projectCount,
        moduleCount,
        storageUsedBytes: 0,
      });
    }

    // Get payment method from Stripe if customer exists and Stripe is configured
    let paymentMethod = subscription.paymentMethod || null;
    if (this.stripeConfigured && this.stripe && subscription.stripeCustomerId && !paymentMethod) {
      try {
        const customer = await this.stripe.customers.retrieve(subscription.stripeCustomerId, {
          expand: ['invoice_settings.default_payment_method'],
        }) as Stripe.Customer;

        const defaultPm = customer.invoice_settings?.default_payment_method as Stripe.PaymentMethod;
        if (defaultPm?.card) {
          paymentMethod = {
            brand: defaultPm.card.brand,
            last4: defaultPm.card.last4,
            expiryMonth: defaultPm.card.exp_month,
            expiryYear: defaultPm.card.exp_year,
          };
        }
      } catch (error) {
        this.logger.warn(`Failed to fetch payment method for customer ${subscription.stripeCustomerId}`);
      }
    }

    return {
      subscription,
      plan,
      usage,
      paymentMethod,
    };
  }

  /**
   * Get invoices for a user
   */
  async getInvoices(userId: string, limit = 10): Promise<Invoice[]> {
    return this.invoiceModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Get invoice download URL
   */
  async getInvoiceDownloadUrl(userId: string, invoiceId: string): Promise<string> {
    const invoice = await this.invoiceModel.findOne({
      _id: invoiceId,
      userId: new Types.ObjectId(userId),
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.invoicePdfUrl) {
      return invoice.invoicePdfUrl;
    }

    // Fetch from Stripe if not cached
    this.ensureStripeConfigured();
    const stripeInvoice = await this.stripe!.invoices.retrieve(invoice.stripeInvoiceId);
    if (stripeInvoice.invoice_pdf) {
      // Cache the URL
      invoice.invoicePdfUrl = stripeInvoice.invoice_pdf;
      await invoice.save();
      return stripeInvoice.invoice_pdf;
    }

    throw new NotFoundException('Invoice PDF not available');
  }

  // ==================== Usage Tracking ====================

  /**
   * Update usage counts for a user
   */
  async updateUsage(
    userId: string,
    updates: Partial<{ projectCount: number; moduleCount: number; storageUsedBytes: number }>,
  ): Promise<Usage> {
    const usage = await this.usageModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { ...updates, lastCalculatedAt: new Date() },
      { new: true, upsert: true },
    );
    return usage;
  }

  /**
   * Check if user has reached a limit
   */
  async checkLimit(
    userId: string,
    limitType: 'projects' | 'modules' | 'storage',
  ): Promise<{ allowed: boolean; current: number; limit: number | null; message?: string }> {
    const subscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    // If no subscription, use free tier limits
    let plan: Plan | null = null;
    if (subscription?.stripePriceId) {
      plan = await this.planModel.findOne({ stripePriceId: subscription.stripePriceId });
    }

    const usage = await this.usageModel.findOne({ userId: new Types.ObjectId(userId) });

    // Default free tier limits
    const limits = plan?.limits || {
      maxProjects: 1,
      maxModules: 2,
      maxStorageBytes: 1 * 1024 * 1024 * 1024, // 1 GB
      hasWeatherForecasting: false,
      hasPrioritySupport: false,
      hasMobileAccess: true,
      hasAdvancedFeatures: false,
    };

    let current = 0;
    let limit: number | null = null;

    switch (limitType) {
      case 'projects':
        current = usage?.projectCount || 0;
        limit = limits.maxProjects;
        break;
      case 'modules':
        current = usage?.moduleCount || 0;
        limit = limits.maxModules;
        break;
      case 'storage':
        current = usage?.storageUsedBytes || 0;
        limit = limits.maxStorageBytes;
        break;
    }

    // null limit means unlimited
    const allowed = limit === null || current < limit;

    return {
      allowed,
      current,
      limit,
      message: allowed ? undefined : `You have reached your ${limitType} limit. Please upgrade your plan.`,
    };
  }

  // ==================== Webhook Handlers ====================

  /**
   * Handle Stripe webhook events
   */
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    this.logger.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'payment_method.attached':
        await this.handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod);
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId;
    if (!userId) {
      this.logger.warn('Checkout session completed without userId in metadata');
      return;
    }

    // Update subscription with Stripe customer ID and subscription ID
    const subscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (subscription && session.customer) {
      subscription.stripeCustomerId = session.customer as string;
      if (session.subscription) {
        subscription.stripeSubscriptionId = session.subscription as string;
      }
      subscription.status = 'active';
      await subscription.save();
      this.logger.log(`Updated subscription for user ${userId} with customer ${session.customer}`);
    }

    this.logger.log(`Checkout completed for user ${userId}`);
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription): Promise<void> {
    // Try to find by stripeCustomerId first
    let subscription = await this.subscriptionModel.findOne({
      stripeCustomerId: stripeSubscription.customer as string,
    });

    // Fallback: find by user's stripeCustomerId
    if (!subscription) {
      const user = await this.userModel.findOne({
        stripeCustomerId: stripeSubscription.customer as string,
      });
      if (user) {
        subscription = await this.subscriptionModel.findOne({
          userId: user._id,
        });
        // Update the subscription with the customer ID for future lookups
        if (subscription) {
          subscription.stripeCustomerId = stripeSubscription.customer as string;
        }
      }
    }

    if (!subscription) {
      this.logger.warn(`No subscription found for customer ${stripeSubscription.customer}`);
      return;
    }

    // Update subscription record
    subscription.stripeSubscriptionId = stripeSubscription.id;
    subscription.stripePriceId = stripeSubscription.items.data[0]?.price.id;
    subscription.status = stripeSubscription.status as any;
    // Use type assertion for Stripe API properties
    const subData = stripeSubscription as any;
    subscription.currentPeriodStart = new Date((subData.current_period_start || Date.now() / 1000) * 1000);
    subscription.currentPeriodEnd = new Date((subData.current_period_end || Date.now() / 1000) * 1000);
    subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;

    if (subData.trial_start) {
      subscription.trialStart = new Date(subData.trial_start * 1000);
    }
    if (subData.trial_end) {
      subscription.trialEnd = new Date(subData.trial_end * 1000);
    }

    await subscription.save();
    this.logger.log(`Subscription updated for customer ${stripeSubscription.customer}`);
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription): Promise<void> {
    const subscription = await this.subscriptionModel.findOne({
      stripeSubscriptionId: stripeSubscription.id,
    });

    if (!subscription) {
      this.logger.warn(`No subscription found for ${stripeSubscription.id}`);
      return;
    }

    subscription.status = 'canceled';
    subscription.canceledAt = new Date();
    await subscription.save();

    this.logger.log(`Subscription deleted: ${stripeSubscription.id}`);
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    // Try to find by stripeCustomerId first
    let subscription = await this.subscriptionModel.findOne({
      stripeCustomerId: invoice.customer as string,
    });

    // Fallback: find by user's stripeCustomerId
    if (!subscription) {
      const user = await this.userModel.findOne({
        stripeCustomerId: invoice.customer as string,
      });
      if (user) {
        subscription = await this.subscriptionModel.findOne({
          userId: user._id,
        });
      }
    }

    if (!subscription) {
      this.logger.warn(`No subscription found for customer ${invoice.customer}`);
      return;
    }

    // Create or update invoice record
    const invoiceData = invoice as any;
    await this.invoiceModel.findOneAndUpdate(
      { stripeInvoiceId: invoice.id },
      {
        userId: subscription.userId,
        stripeInvoiceId: invoice.id,
        stripeCustomerId: invoice.customer as string,
        stripeSubscriptionId: invoiceData.subscription as string || '',
        amountDue: invoice.amount_due,
        amountPaid: invoice.amount_paid,
        currency: invoice.currency,
        status: 'paid',
        invoiceNumber: invoice.number,
        invoicePdfUrl: invoice.invoice_pdf,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        description: invoice.description,
        periodStart: new Date((invoiceData.period_start || Date.now() / 1000) * 1000),
        periodEnd: new Date((invoiceData.period_end || Date.now() / 1000) * 1000),
        paidAt: new Date(),
      },
      { upsert: true, new: true },
    );

    this.logger.log(`Invoice paid: ${invoice.id}`);
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const subscription = await this.subscriptionModel.findOne({
      stripeCustomerId: invoice.customer as string,
    });

    if (!subscription) {
      return;
    }

    // Update subscription status
    subscription.status = 'past_due';
    await subscription.save();

    this.logger.log(`Invoice payment failed: ${invoice.id}`);
  }

  private async handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod): Promise<void> {
    if (paymentMethod.type !== 'card' || !paymentMethod.card) {
      return;
    }

    const subscription = await this.subscriptionModel.findOne({
      stripeCustomerId: paymentMethod.customer as string,
    });

    if (!subscription) {
      return;
    }

    subscription.paymentMethod = {
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      expiryMonth: paymentMethod.card.exp_month,
      expiryYear: paymentMethod.card.exp_year,
    };
    await subscription.save();

    this.logger.log(`Payment method attached for customer ${paymentMethod.customer}`);
  }

  // ==================== Plan Seeding ====================

  /**
   * Seed plans from Stripe products/prices
   * Run this after creating products in Stripe dashboard
   */
  async seedPlansFromStripe(): Promise<void> {
    this.ensureStripeConfigured();
    const prices = await this.stripe!.prices.list({
      active: true,
      expand: ['data.product'],
    });

    for (const price of prices.data) {
      const product = price.product as Stripe.Product;
      if (!product || typeof product === 'string') continue;

      // Parse limits from product metadata
      const limits = {
        maxProjects: product.metadata.maxProjects === 'unlimited'
          ? null
          : parseInt(product.metadata.maxProjects || '1'),
        maxModules: product.metadata.maxModules === 'unlimited'
          ? null
          : parseInt(product.metadata.maxModules || '2'),
        maxStorageBytes: parseInt(product.metadata.maxStorageGB || '1') * 1024 * 1024 * 1024,
        hasWeatherForecasting: product.metadata.hasWeatherForecasting === 'true',
        hasPrioritySupport: product.metadata.hasPrioritySupport === 'true',
        hasMobileAccess: product.metadata.hasMobileAccess !== 'false',
        hasAdvancedFeatures: product.metadata.hasAdvancedFeatures === 'true',
      };

      // Parse features from metadata or generate from limits
      let features = product.metadata.features
        ? JSON.parse(product.metadata.features)
        : [];

      // Auto-generate features if not provided
      if (features.length === 0) {
        features = this.generateFeaturesFromLimits(limits, (price.unit_amount || 0) === 0);
      }

      await this.planModel.findOneAndUpdate(
        { stripePriceId: price.id },
        {
          stripePriceId: price.id,
          stripeProductId: product.id,
          name: product.name,
          description: product.description || '',
          priceMonthly: price.unit_amount || 0,
          billingInterval: price.recurring?.interval || 'month',
          limits,
          features,
          sortOrder: parseInt(product.metadata.sortOrder || '0'),
          isPopular: product.metadata.isPopular === 'true',
          isActive: product.active,
          isFree: (price.unit_amount || 0) === 0,
        },
        { upsert: true, new: true },
      );

      this.logger.log(`Synced plan: ${product.name} (${price.id})`);
    }
  }

  /**
   * Generate feature list from plan limits
   */
  private generateFeaturesFromLimits(
    limits: {
      maxProjects: number | null;
      maxModules: number | null;
      maxStorageBytes: number;
      hasWeatherForecasting: boolean;
      hasPrioritySupport: boolean;
      hasMobileAccess: boolean;
      hasAdvancedFeatures: boolean;
    },
    isFree: boolean,
  ): Array<{ text: string; included: boolean }> {
    const storageGB = Math.round(limits.maxStorageBytes / (1024 * 1024 * 1024));

    return [
      {
        text: limits.maxProjects === null
          ? 'Unlimited farm projects'
          : limits.maxProjects === 1
            ? '1 farm project'
            : `Up to ${limits.maxProjects} farm projects`,
        included: true,
      },
      {
        text: limits.maxModules === null
          ? 'All modules included'
          : `${limits.maxModules} basic modules`,
        included: true,
      },
      {
        text: `${storageGB} GB cloud storage`,
        included: true,
      },
      {
        text: 'Mobile access',
        included: limits.hasMobileAccess,
      },
      {
        text: limits.hasAdvancedFeatures ? 'Advanced weather forecasting' : 'Weather forecasting',
        included: limits.hasWeatherForecasting,
      },
      {
        text: limits.hasPrioritySupport ? 'Priority email support' : (isFree ? 'Priority support' : 'Email support'),
        included: isFree ? false : true,
      },
    ];
  }
}
