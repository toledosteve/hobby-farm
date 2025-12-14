# Billing Feature - Local Development & Testing Guide

This guide explains how to run and test the billing feature locally.

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd code/backend
npm install stripe

# Frontend (already has all deps)
cd code/frontend
npm install
```

### 2. Configure Environment Variables

**Backend (`code/backend/.env`):**
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/hobby-farm

# JWT
JWT_SECRET=your-jwt-secret

# Stripe (use test keys!)
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Frontend (`code/frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_USE_MOCK_DATA=false
```

### 3. Set Up Stripe Products

See [STRIPE_SETUP.md](./STRIPE_SETUP.md) for detailed Stripe configuration.

**Quick Setup:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) (Test Mode)
2. Create products with prices and metadata
3. Run sync: `POST /api/billing/sync-plans`

### 4. Start Services

**Terminal 1 - Backend:**
```bash
cd code/backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd code/frontend
npm run dev
```

**Terminal 3 - Stripe CLI (for webhooks):**
```bash
stripe listen --forward-to localhost:3001/api/billing/webhook
```

## Testing Flows

### Test Subscription Checkout

1. Log in to the app
2. Navigate to **Settings** > **Billing**
3. Click **View All Plans** or **Upgrade**
4. Select a plan
5. Use test card: `4242 4242 4242 4242`
6. Any future expiry, any CVC
7. Complete checkout

### Test Plan Change

1. With an active subscription, go to **Settings** > **Billing**
2. Click **Change Plan**
3. Select a different plan
4. Confirm the change

### Test Cancel & Reactivate

1. Go to **Settings** > **Billing**
2. Click "Cancel subscription" at the bottom
3. Confirm cancellation
4. Click "Reactivate" to restore

### Test Customer Portal

1. Go to **Settings** > **Billing**
2. Click **Update** on the payment method
3. This opens Stripe Customer Portal
4. Test updating payment method

## Test Cards

| Number | Result |
|--------|--------|
| 4242424242424242 | Success |
| 4000000000000002 | Decline |
| 4000002500003155 | 3D Secure required |
| 4000000000009995 | Insufficient funds |

Use any future expiry date and any 3-digit CVC.

## Webhook Testing

### Using Stripe CLI

```bash
# Trigger specific events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.paid
stripe trigger invoice.payment_failed
```

### Manual Testing

After each action (checkout, plan change, cancel), check:
1. Database for updated records
2. Backend logs for webhook processing
3. Frontend for updated UI state

## API Endpoints Reference

### Public Endpoints
- `GET /api/billing/plans` - List available plans

### Authenticated Endpoints
- `GET /api/billing/summary` - Get billing summary
- `POST /api/billing/checkout-session` - Create checkout session
- `POST /api/billing/portal-session` - Create customer portal session
- `POST /api/billing/change-plan` - Change subscription plan
- `POST /api/billing/cancel` - Cancel subscription
- `POST /api/billing/reactivate` - Reactivate subscription
- `GET /api/billing/invoices` - Get invoice history
- `GET /api/billing/invoices/:id/download` - Get invoice download URL
- `GET /api/billing/check-limit/:type` - Check usage limits
- `POST /api/billing/sync-plans` - Sync plans from Stripe

### Webhook Endpoint
- `POST /api/billing/webhook` - Stripe webhook handler (no auth)

## Testing with cURL

```bash
# Set your auth token
TOKEN="your-jwt-token"

# Get plans
curl http://localhost:3001/api/billing/plans

# Get billing summary
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/billing/summary

# Create checkout session
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_xxx"}' \
  http://localhost:3001/api/billing/checkout-session

# Check limit
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/billing/check-limit/projects

# Sync plans from Stripe
curl -X POST -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/billing/sync-plans
```

## Database Collections

The billing feature uses these MongoDB collections:

- **plans** - Subscription plan definitions
- **subscriptions** - User subscription records
- **invoices** - Invoice history
- **usages** - Usage tracking per user
- **users** - Extended with `stripeCustomerId`

### Check Database Records

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/hobby-farm

# View plans
db.plans.find().pretty()

# View subscriptions
db.subscriptions.find().pretty()

# View user with Stripe customer ID
db.users.find({stripeCustomerId: {$exists: true}}).pretty()
```

## Common Issues

### "No plans available"
- Run `POST /api/billing/sync-plans` to sync from Stripe
- Check Stripe Dashboard has products with prices

### Webhook signature verification failed
- Ensure Stripe CLI is running with correct forward URL
- Check `STRIPE_WEBHOOK_SECRET` matches CLI output

### Checkout redirects but no subscription
- Check webhook endpoint is receiving events
- Check backend logs for webhook processing errors
- Verify Stripe CLI is forwarding to correct port

### Customer Portal not opening
- Configure Customer Portal in Stripe Dashboard
- Ensure user has a Stripe customer ID

## File Structure

```
code/
├── backend/
│   └── src/
│       └── billing/
│           ├── billing.controller.ts  # API endpoints
│           ├── billing.service.ts     # Business logic & Stripe
│           ├── billing.module.ts      # NestJS module
│           ├── dto/
│           │   ├── create-checkout-session.dto.ts
│           │   └── change-plan.dto.ts
│           └── schemas/
│               ├── plan.schema.ts
│               ├── subscription.schema.ts
│               ├── invoice.schema.ts
│               └── usage.schema.ts
│
└── frontend/
    └── src/
        ├── components/
        │   ├── settings/
        │   │   └── BillingSettings.tsx    # Main billing UI
        │   └── subscription/
        │       ├── ChangePlanModal.tsx
        │       ├── CancelSubscriptionModal.tsx
        │       └── EmptySubscriptionState.tsx
        ├── contexts/
        │   └── BillingContext.tsx         # State management
        ├── services/
        │   ├── billing.service.ts         # Service wrapper
        │   └── api/
        │       └── billing.ts             # API client
        └── types/
            └── index.ts                   # Billing types
```

## Development Tips

1. **Keep Stripe CLI running** during development for webhook testing
2. **Use test mode** in Stripe Dashboard (toggle in top-right)
3. **Clear browser cache** if subscription state seems stale
4. **Check backend logs** for detailed error messages
5. **Use Stripe Dashboard** to verify customer/subscription state
