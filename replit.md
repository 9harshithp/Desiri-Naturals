# Farm2Me

Farm-to-table fresh produce delivery platform for India — better than farm2me.in. Connects conscious consumers directly with local farmers for fresh, organic produce delivered within 24 hours of harvest.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite, TanStack Query, wouter routing, shadcn/ui

## Where things live

- `lib/db/src/schema.ts` — source of truth for DB schema (users, products, orders, farms, etc.)
- `lib/api-spec/openapi.yaml` — source of truth for API contract
- `lib/api-client-react/src/generated/` — generated hooks (do not edit manually)
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/farm2me/src/pages/` — all frontend pages
- `artifacts/farm2me/src/context/auth-context.tsx` — auth state (cookie-based)

## Architecture decisions

- Cookie-based auth: `farm2me_session` for anonymous cart, `farm2me_uid` for authenticated user ID
- Role-based access: customer (default) and admin roles stored in users table
- Admin routes are guarded server-side by checking `farm2me_uid` cookie and role === "admin"
- Products have `freshnessScore` (0–100) displayed as an animated bar on the product detail page
- Orders store `paymentMethod` (upi/card/cod) and `deliverySlot` (e.g. "9am-12pm")
- No real Google OAuth (free tier demo) — Google button pre-fills demo credentials

## Product

- **Browse & discover**: Products page with category/farm/organic filters; home page with featured produce, subscription boxes, farm stories
- **Product detail**: Freshness Score bar, star ratings, review submission form, related products
- **Cart & checkout**: Enhanced checkout with 4 delivery time slots + 3 payment methods (UPI, Card, COD)
- **Auth**: Login/signup with split layout, role selector (Customer/Admin), password strength meter
- **Admin dashboard**: Sidebar nav with Overview stats, Inventory management (stock/featured/freshness), Orders management with status updates
- **Farms**: 8 partner farms across India, individual farm detail pages
- **Subscription boxes**: 5 curated weekly boxes

## Demo credentials

- Admin: `admin@farm2me.in` / `admin123` → redirects to /admin dashboard
- Customer: `demo@farm2me.in` / `demo123` → regular customer account

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After running codegen, restart the frontend Vite workflow to clear HMR pre-transform errors
- Admin routes require both the `farm2me_uid` cookie AND `role = 'admin'` in the DB
- When adding new fields to orders, also destructure them in the `POST /orders` handler body destructure line

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
