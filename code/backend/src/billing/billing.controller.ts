import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Headers,
  RawBodyRequest,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { ChangePlanDto } from './dto/change-plan.dto';

@Controller('billing')
export class BillingController {
  private readonly stripe: Stripe | null = null;

  constructor(
    private readonly billingService: BillingService,
    private readonly configService: ConfigService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-11-17.clover',
      });
    }
  }

  // ==================== Plans ====================

  /**
   * Get all available subscription plans
   */
  @Get('plans')
  async getPlans() {
    return this.billingService.getPlans();
  }

  // ==================== Checkout & Portal ====================

  /**
   * Create a Stripe Checkout session for new subscriptions
   */
  @Post('checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(
    @Request() req,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    return this.billingService.createCheckoutSession(req.user.id, dto);
  }

  /**
   * Start a trial without credit card (for signup flow)
   */
  @Post('start-trial')
  @UseGuards(JwtAuthGuard)
  async startTrial(@Request() req, @Body() dto: { priceId: string }) {
    return this.billingService.startTrial(req.user.id, dto.priceId);
  }

  /**
   * Create a Stripe Customer Portal session for managing billing
   */
  @Post('portal-session')
  @UseGuards(JwtAuthGuard)
  async createPortalSession(@Request() req) {
    return this.billingService.createPortalSession(req.user.id);
  }

  // ==================== Subscription Management ====================

  /**
   * Get billing summary for the current user
   */
  @Get('summary')
  @UseGuards(JwtAuthGuard)
  async getBillingSummary(@Request() req) {
    return this.billingService.getBillingSummary(req.user.id);
  }

  /**
   * Change subscription plan
   */
  @Post('change-plan')
  @UseGuards(JwtAuthGuard)
  async changePlan(@Request() req, @Body() dto: ChangePlanDto) {
    return this.billingService.changePlan(req.user.id, dto);
  }

  /**
   * Cancel subscription at end of billing period
   */
  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@Request() req) {
    return this.billingService.cancelSubscription(req.user.id);
  }

  /**
   * Reactivate a canceled subscription
   */
  @Post('reactivate')
  @UseGuards(JwtAuthGuard)
  async reactivateSubscription(@Request() req) {
    return this.billingService.reactivateSubscription(req.user.id);
  }

  // ==================== Invoices ====================

  /**
   * Get invoice history
   */
  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  async getInvoices(@Request() req, @Query('limit') limit?: string) {
    return this.billingService.getInvoices(req.user.id, limit ? parseInt(limit) : 10);
  }

  /**
   * Get invoice download URL
   */
  @Get('invoices/:invoiceId/download')
  @UseGuards(JwtAuthGuard)
  async getInvoiceDownloadUrl(@Request() req, @Param('invoiceId') invoiceId: string) {
    const url = await this.billingService.getInvoiceDownloadUrl(req.user.id, invoiceId);
    return { url };
  }

  // ==================== Usage ====================

  /**
   * Check if user can perform an action based on limits
   */
  @Get('check-limit/:limitType')
  @UseGuards(JwtAuthGuard)
  async checkLimit(
    @Request() req,
    @Param('limitType') limitType: 'projects' | 'modules' | 'storage',
  ) {
    return this.billingService.checkLimit(req.user.id, limitType);
  }

  // ==================== Webhook ====================

  /**
   * Handle Stripe webhook events
   * Note: This endpoint should NOT use JwtAuthGuard
   * It uses Stripe signature verification instead
   */
  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    let event: Stripe.Event;

    try {
      // Use raw body for signature verification
      const rawBody = req.rawBody;
      if (!rawBody) {
        throw new BadRequestException('Missing raw body');
      }

      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    // Process the event
    await this.billingService.handleWebhookEvent(event);

    // Return 200 to acknowledge receipt
    return { received: true };
  }

  // ==================== Admin / Development ====================

  /**
   * Sync plans from Stripe (admin/dev endpoint)
   * In production, protect this with admin auth
   */
  @Post('sync-plans')
  async syncPlansFromStripe() {
    await this.billingService.seedPlansFromStripe();
    return { success: true, message: 'Plans synced from Stripe' };
  }
}
