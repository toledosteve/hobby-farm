# Stripe Billing Setup Guide

This guide walks you through setting up Stripe for the Hobby Farm Planner billing system.

## Prerequisites

- A [Stripe account](https://dashboard.stripe.com/register) (free to create)
- Node.js 18+ and npm installed
- The backend and frontend running locally

## 1. Create Stripe Account & Get API Keys

1. Sign up or log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in the top-right corner)
3. Go to **Developers** > **API Keys**
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

## 2. Create Products and Prices in Stripe

### Option A: Create via Stripe Dashboard (Recommended for Initial Setup)

1. Go to **Products** in Stripe Dashboard
2. Click **+ Add Product**

#### Starter Plan (Free)
- **Name:** Starter Plan
- **Description:** Free tier for getting started
- **Price:** $0.00 / month (recurring)
- After creating, add **Metadata** to the product:
  ```
  maxProjects: 1
  maxModules: 2
  maxStorageBytes: 1073741824
  hasWeatherForecasting: false
  hasPrioritySupport: false
  hasMobileAccess: true
  hasAdvancedFeatures: false
  sortOrder: 0
  isFree: true
  ```

#### Hobby Farmer Plan
- **Name:** Hobby Farmer Plan
- **Description:** Perfect for small-scale hobby farms
- **Price:** $9.99 / month (recurring)
- Add **Metadata**:
  ```
  maxProjects: 3
  maxModules: null
  maxStorageBytes: 5368709120
  hasWeatherForecasting: true
  hasPrioritySupport: false
  hasMobileAccess: true
  hasAdvancedFeatures: false
  sortOrder: 1
  isPopular: true
  ```

#### Premium Plan
- **Name:** Premium Plan
- **Description:** Everything you need to manage your farm
- **Price:** $12.99 / month (recurring)
- Add **Metadata**:
  ```
  maxProjects: null
  maxModules: null
  maxStorageBytes: 21474836480
  hasWeatherForecasting: true
  hasPrioritySupport: true
  hasMobileAccess: true
  hasAdvancedFeatures: true
  sortOrder: 2
  ```

### Option B: Sync Plans from Backend

After setting up products in Stripe, you can sync them to your database:

```bash
curl -X POST http://localhost:3001/api/billing/sync-plans \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 3. Configure Webhook Endpoint

### Local Development (using Stripe CLI)

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows (scoop)
   scoop install stripe

   # Or download from https://github.com/stripe/stripe-cli/releases
   ```

2. Log in to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3001/api/billing/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add it to your `.env`

### Production Webhooks

1. Go to **Developers** > **Webhooks** in Stripe Dashboard
2. Click **+ Add endpoint**
3. Enter your endpoint URL: `https://your-domain.com/api/billing/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `payment_method.attached`
5. Copy the signing secret and add it to your production environment

## 4. Configure Customer Portal

1. Go to **Settings** > **Billing** > **Customer portal** in Stripe Dashboard
2. Configure the portal settings:
   - **Invoices:** Enable viewing and downloading
   - **Payment methods:** Enable adding/updating
   - **Subscriptions:** Enable plan changes and cancellation
3. Under **Business information**, add your business name and support info
4. Save changes

## 5. Environment Variables

### Backend (.env)

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Frontend URL (for redirect after checkout)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

## 6. Test the Integration

### Test Cards

Use these test card numbers:

| Card Number | Description |
|-------------|-------------|
| 4242424242424242 | Successful payment |
| 4000000000000002 | Card declined |
| 4000002500003155 | Requires authentication |

Use any future expiry date and any 3-digit CVC.

### Test Checkout Flow

1. Log in to the app
2. Go to **Settings** > **Billing**
3. Click **View All Plans** or **Upgrade**
4. Select a paid plan
5. Complete checkout with test card `4242 4242 4242 4242`
6. Verify subscription is active

### Test Webhook Events

With Stripe CLI running, you can trigger test events:

```bash
# Trigger a checkout.session.completed event
stripe trigger checkout.session.completed

# Trigger subscription events
stripe trigger customer.subscription.updated
stripe trigger invoice.paid
```

### Test Customer Portal

1. After subscribing, click **Update** on the payment method card
2. This opens the Stripe Customer Portal
3. Test adding/updating payment methods
4. Test downloading invoices

## 7. Troubleshooting

### Webhook Signature Verification Failed

- Ensure `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe CLI or Dashboard
- For local development, make sure Stripe CLI is running
- Check that the backend is receiving the raw request body (not parsed JSON)

### Checkout Session Not Redirecting

- Verify `FRONTEND_URL` environment variable is set correctly
- Check browser console for errors
- Ensure the success/cancel URLs are accessible

### Plans Not Loading

- Run the sync endpoint: `POST /api/billing/sync-plans`
- Check Stripe Dashboard for product metadata
- Verify products have active prices

### Customer Portal Not Opening

- Verify Stripe Customer Portal is configured in Dashboard
- Check that the user has a Stripe customer ID
- Review the `openCustomerPortal` function in billing service

## 8. Going Live

When ready for production:

1. Toggle to **Live Mode** in Stripe Dashboard
2. Update environment variables with live keys
3. Set up production webhook endpoint
4. Configure Customer Portal for production
5. Test with real payment method (small amount, then refund)

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│   Stripe    │
│  (React)    │     │  (NestJS)   │     │    API      │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                   │
                           │                   │
                           ▼                   │
                    ┌─────────────┐            │
                    │   MongoDB   │◀───────────┘
                    │  (billing   │    (webhooks)
                    │   data)     │
                    └─────────────┘
```

### Key Flows

1. **Checkout**: Frontend → Backend (create session) → Stripe Checkout → Webhook → Database
2. **Portal**: Frontend → Backend (create portal session) → Stripe Portal
3. **Plan Change**: Frontend → Backend → Stripe API → Webhook → Database
4. **Cancel**: Frontend → Backend → Stripe API → Webhook → Database

## Support

For Stripe-specific questions, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
