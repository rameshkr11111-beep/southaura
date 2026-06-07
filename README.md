# SouthAura Commerce Platform

A premium South Indian storefront plus an enterprise commerce operating system
covering CRM, ERP, CMS, SEO, fulfilment, finance and growth.

## Features

- Responsive luxury D2C design with dark mode
- Search, category filters, price/rating filters and sorting
- Product detail pages with JSON-LD product schema
- Persistent cart and wishlist using local storage
- Coupon, checkout, payment and order tracking interfaces
- Dynamic category, product and blog routes
- Per-page metadata, Open Graph defaults, sitemap and robots
- WhatsApp support, mobile bottom navigation and custom 404
- Netlify-ready configuration
- PostgreSQL database with Prisma ORM
- Auth.js / NextAuth credentials authentication
- Role-based access for seven staff roles
- Responsive enterprise admin at `/admin`
- Third-party seller portal at `/vendor` with shop onboarding, catalogue,
  inventory, orders, shipping, returns, promotions, analytics and payouts
- Protected App Router APIs with Zod validation and audit hooks
- CRM, product, inventory, order, pricing, marketing, delivery, vendor,
  accounting, SEO, CMS, domain, integration and security workspaces
- Governed **Dakshin AI Manager** with chat, tool connections and mandatory
  approval workflow
- Customer-facing **Dakshin AI Assistant** with product discovery, guarded
  order tracking, lead capture and human support handoff

## Dakshin AI Customer Assistant

The floating storefront assistant is available on every customer-facing page.
It supports English, Hindi, Tamil, Telugu, Malayalam and Kannada; product
recommendations; cart and wishlist context; policy answers; verified order
tracking; voice input; quotation lead capture; WhatsApp handoff and human
escalation.

Staff manage conversations at:

- `/admin/support-inbox`

Channel adapters use the shared conversation model:

- `POST /api/assistant/chat`
- `POST /api/assistant/order`
- `POST /api/assistant/lead`
- `GET/POST /api/assistant/webhooks/:channel`
- `GET/PATCH /api/admin/support-conversations`

The webhook route is an integration boundary, not a production-ready Meta
receiver until provider signature verification, app review, templates and
outbound delivery callbacks are configured. The assistant never approves
refunds, changes prices or exposes private order data without matching order
credentials.

## Dakshin AI Manager

Open:

- `/admin/ai-manager` - agent operations dashboard
- `/admin/ai-manager/chat` - ChatGPT-style commerce command interface
- `/admin/ai-manager/approvals` - approve or reject proposed actions
- `/admin/ai-manager/tools` - connect business systems using environment references
- `/admin/ai-manager/operations` - schedules, templates, history, costs and notifications

The local agent works without an API key using deterministic demo planning for
the included example commands. To use an OpenAI-compatible Responses API, set:

```env
OPENAI_API_KEY="..."
OPENAI_BASE_URL="https://api.openai.com/v1"
OPENAI_MODEL="gpt-5.4-mini"
```

The provider is called only from the server. API keys are never sent to the
browser or stored by the tool-connections UI. `Integration.secretRef` stores
only an environment-variable name such as `OPENAI_API_KEY`.

### Approval safety

Read-only questions can return immediately. Any product creation, publishing,
price or stock update, message, coupon, refund, social post or delivery action
creates an `AgentAction` with `PENDING_APPROVAL` status. An authorized admin
must approve it before the separate executor runs. Every decision and execution
is written to the audit trail.

### Specialist agents and controls

The manager routes work to Product, Order, CRM, SEO, Content, Marketing,
Delivery and Analytics specialists. Server-side tools validate prices, stock,
SKUs, coupon limits and messaging targets before execution. The operations
workspace adds searchable conversation history, saved command templates,
scheduled monitoring tasks, token/cost reporting, failed-action retries and
admin notifications.

Scheduled tasks store the command and schedule definition. Connect a trusted
job runner such as Netlify Scheduled Functions or Vercel Cron to invoke due
tasks in production. Generated mutations still enter the approval workflow.

## Run locally

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Before a database is configured, the local demo login is:

```text
Email: admin@southaura.in
Password: ChangeMe123!
```

Change these credentials before any public deployment.

Customer email login is available at `/login`, with the account dashboard at
`/account`. Local demo customer credentials are:

```text
Email: meera@example.com
Password: Welcome123!
```

Customer accounts use the `CUSTOMER` role and cannot access `/admin`. Signup
creates a linked Auth.js user and CRM customer profile. Password-reset requests
store an expiring hashed token; connect the configured email provider to send
the raw reset link in production.

Vendor login is available at `/vendor/login`, with shop applications at
`/vendor/register` and the seller workspace at `/vendor`. Demo access:

```text
Email: vendor@southaura.in
Password: Vendor123!
```

Vendor accounts use the isolated `VENDOR` role and cannot access customer or
platform-admin workspaces. `VendorShop`, vendor-owned products and vendor order
items provide the tenant boundary required for third-party marketplace sellers.

## PostgreSQL setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to a PostgreSQL database.
3. Generate the Prisma client:

```bash
npm run db:generate
```

4. Create the schema and seed representative data:

```bash
npm run db:push
npm run db:seed
```

For production, use versioned migrations instead:

```bash
npx prisma migrate dev --name initial_enterprise_schema
npx prisma migrate deploy
```

The database schema is in `prisma/schema.prisma`.

## Production build

```bash
npm run build
npm run start
```

## Live API integrations

The integration operations dashboard is available at `/admin/integrations`.
It reports environment configuration, redacted API logs, signed webhook
events and retry jobs. Secret values are never returned to the browser.

### Razorpay

Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
`NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_WEBHOOK_SECRET`.

- Create order: `POST /api/payments/razorpay/order`
- Verify browser payment: `POST /api/payments/razorpay/verify`
- Webhook: `POST /api/webhooks/razorpay`
- Success/failure UI: `/payment/success` and `/payment/failure`

Enable `payment.captured`, `payment.failed` and refund events in Razorpay.
Only the public key ID is exposed to Razorpay Checkout; the secret and
signature verification remain server-side.

### Shiprocket

Set `SHIPROCKET_TOKEN` and `SHIPROCKET_WEBHOOK_SECRET`.

- Create shipment and optionally assign AWB:
  `POST /api/shipping/shiprocket/create`
- Track AWB: `GET /api/shipping/shiprocket/track/:awb`
- Create return pickup: `POST /api/shipping/shiprocket/return`
- Webhook: `POST /api/webhooks/shiprocket`

Shipment creation and returns require an authenticated staff role with
delivery permissions.

### WhatsApp, email and SMS

WhatsApp uses `WHATSAPP_ACCESS_TOKEN` and
`WHATSAPP_PHONE_NUMBER_ID`. Configure Meta callbacks at
`/api/webhooks/whatsapp` and the verification token already listed in
`.env.example`.

Transactional email uses the Resend HTTPS API through `RESEND_API_KEY`.
SMS uses MSG91 through `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID`.
Admin-created messages enter `PENDING_APPROVAL`; approved AI actions execute
through the same server-only adapters.

### Analytics and SEO

The storefront records `page_view`, `view_item`, `add_to_cart`,
`begin_checkout`, `purchase`, `search` and `generate_lead` events at
`POST /api/analytics/events`. Set `GA_MEASUREMENT_ID` and `GA_API_SECRET`
to forward the same events through GA4 Measurement Protocol.

The existing dynamic `/sitemap.xml`, `/robots.txt`, product JSON-LD, metadata
and `/admin/seo` workspace remain the SEO foundation. Search Console service
credentials are referenced by `GOOGLE_SEARCH_CONSOLE_CREDENTIALS`; never
commit the credential JSON.

### Meta publishing

Set `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`,
`INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_BUSINESS_ACCOUNT_ID` and
`META_APP_SECRET`. Social drafts require approval before the AI executor can
publish them.

### Retry worker

Transient provider failures create `IntegrationRetry` records. Invoke:

```text
POST /api/cron/integration-retries
Authorization: Bearer <CRON_SECRET>
```

Run this every five minutes from a trusted scheduler. Retries use exponential
backoff and stop after the configured maximum attempts.

## Deploy to Netlify

1. Push the project to a Git provider.
2. Import the repository in Netlify.
3. Add `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true` and integration
   secrets in the Netlify environment settings.
4. Run `npx prisma migrate deploy` against the production database before the
   first application deploy.
5. Netlify will detect Next.js automatically.
6. Build command: `npm run build`
7. Publish directory: `.next`
8. Deploy.

9. Add all required provider variables from `.env.example` in **Netlify Site
   configuration → Environment variables**. Never add secrets to
   `netlify.toml`.
10. Configure provider webhooks against the production HTTPS domain.
11. Use Netlify Scheduled Functions or an external scheduler to call the
    protected retry-worker endpoint. Next.js App Router API routes are
    automatically deployed through Netlify's Next.js runtime; separate raw
    functions are not required for these endpoints.

The included `netlify.toml` provides build settings, Node 20, security headers and immutable caching for Next.js static assets. Netlify's current Next.js runtime handles App Router routes and image optimization automatically.

## Vercel deployment

1. Import the repository in Vercel.
2. Add the same environment variables from `.env.example`.
3. Use a managed PostgreSQL provider such as Neon, Supabase or Prisma Postgres.
4. Run `npx prisma migrate deploy` in CI or before promoting the release.
5. Deploy using the default Next.js build settings.

## Authentication and roles

Roles are declared in Prisma and mapped to permissions in `lib/rbac.ts`:

- Super Admin
- Admin
- Manager
- Marketing Executive
- Delivery Manager
- Customer Support
- Content Writer
- Vendor

Admin routes are protected by the server-rendered Auth.js admin layout. API
routes additionally check the required permission before touching data.
Two-factor flags, login history, IP metadata, notifications and audit logs are
represented in the schema.

## API routes

Protected operational APIs include:

- `GET/POST /api/admin/products`
- `GET/PATCH/DELETE /api/admin/products/:id`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id`
- `GET/POST /api/admin/customers`
- `GET/POST /api/admin/coupons`
- `GET /api/admin/analytics`
- `GET/PUT /api/admin/settings`
- `GET/PUT /api/admin/integrations`
- `POST /api/admin/agent/chat`
- `GET /api/admin/agent/dashboard`
- `GET /api/admin/agent/approvals`
- `PATCH /api/admin/agent/approvals/:id`
- `GET/PUT /api/admin/agent/tools`
- `GET/POST /api/admin/agent/operations`
- `POST /api/webhooks/:provider`

Provider-specific webhook signature verification must be implemented and tested
with each live account before accepting production events.

## External integrations

The architecture includes typed storage and configuration boundaries for:

- Razorpay, Stripe, PayPal, UPI and COD
- WhatsApp Business, SMS, email and push
- Shiprocket, Delhivery, Blue Dart and other couriers
- AI writing, SEO, forecasting and support assistance
- Custom domains, DNS and SSL lifecycle status

These services require commercial accounts, API credentials, verified webhook
signatures and provider-specific compliance. The UI and persistence layer are
ready; live transactions remain disabled until those credentials are supplied.

## Production security checklist

- Replace the demo password and set a strong `AUTH_SECRET`.
- Use a restricted production database user and encrypted connections.
- Add provider-specific webhook signature verification.
- Enable two-factor authentication enforcement for privileged roles.
- Configure rate limiting and bot protection at the CDN/edge.
- Encrypt sensitive integration credentials with a managed KMS.
- Schedule encrypted database backups and test restore procedures.
- Define IP allowlists for finance and super-admin roles if required.
- Retain audit logs according to legal and internal policy.

## Demo notes

- Catalog data lives in `lib/data.ts`.
- The public cart, wishlist and checkout remain frontend demos until connected
  to the order APIs and payment providers.
- Use coupon `AURA10` in the cart.
- Replace the demo WhatsApp number and `southaura.in` metadata URL before launch.
- Product imagery uses remote Unsplash placeholders configured in `next.config.mjs`.
