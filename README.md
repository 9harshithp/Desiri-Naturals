# Desiri Naturals

Premium farm-to-table natural products and fresh produce delivery platform — featuring authentic wood-pressed / bull-driven oils, A2 Desi cow ghee, organic staples, and fresh harvest.

---

## 📁 Repository Structure

This repository is organized as a clean TypeScript monorepo with pnpm workspaces:

```
.
├── apps/
│   ├── frontend/             # Client application (React 19 + Vite + TanStack Query + Tailwind CSS)
│   └── backend/              # API server (Node.js + Express 5 + Drizzle ORM)
├── lib/
│   ├── api-client-react/     # Generated TanStack Query React hooks (Orval)
│   ├── api-spec/             # OpenAPI 3.0 specification & codegen configuration
│   ├── api-zod/              # Generated Zod validation schemas
│   └── db/                   # Drizzle ORM schema, migrations, and PostgreSQL connection
├── scripts/                  # Seed scripts, catalog sync, and maintenance utilities
├── docs/                     # Documentation and assets
│   └── screenshots/          # Platform preview screenshots
├── package.json              # Monorepo root scripts and devDependencies
├── pnpm-workspace.yaml       # pnpm workspace configuration
└── tsconfig.json             # Root TypeScript project references
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20+ (recommended v24)
- **pnpm**: v9+
- **PostgreSQL**: v15+ running locally or remotely

### 1. Environment Configuration
Ensure your `.env` file exists in the project root with your database credentials:
```env
DATABASE_URL=postgres://<user>:<password>@localhost:5432/desiri
PORT=5000
VITE_PORT=3000
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Database Setup & Seeding
```bash
# Push Drizzle schema to PostgreSQL
pnpm run db:push

# Seed Desiri Naturals product catalog
pnpm run db:seed
```

### 4. Running the Applications

#### Run Frontend & Backend together
```bash
# Frontend dev server (port 3000)
pnpm run dev:frontend

# Backend API server (port 5000)
pnpm run dev:backend
```

Or run frontend directly via:
```bash
pnpm run dev
```

---

## 🛠 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm run dev:frontend` | Starts the React Vite frontend at `http://localhost:3000` |
| `pnpm run dev:backend` | Builds and starts the Express API server at `http://localhost:5000` |
| `pnpm run build` | Typechecks and builds all applications and libraries |
| `pnpm run typecheck` | Runs TypeScript type checking across all workspace packages |
| `pnpm run db:push` | Pushes the Drizzle ORM schema into the PostgreSQL database |
| `pnpm run db:seed` | Seeds the database with initial catalog, products, and categories |
| `pnpm --filter @workspace/api-spec run codegen` | Re-generates React Query hooks and Zod schemas from `openapi.yaml` |

---

## 🏛 Architecture & Key Features

- **Frontend (`apps/frontend`)**:
  - React 19 + Vite with Tailwind CSS v4 and shadcn/ui components.
  - Client routing with `wouter`.
  - Pincode delivery estimation & validation context.
  - WhatsApp instant ordering & customer support integration.
  - Interactive PDF invoice generation for customer orders.
  - Customer review submission, freshness scores, and category filters (Bull-Driven Oils, A2 Desi Ghee, Organic Staples, Fresh Produce).

- **Backend (`apps/backend`)**:
  - Node.js with Express 5 and esbuild bundling.
  - Cookie-based authentication: `farm2me_session` for guest carts, `farm2me_uid` for authenticated sessions.
  - Role-Based Access Control (RBAC): `customer` and `admin` roles.
  - API Routes: Authentication, Products, Orders, Cart, Pincode availability, and Invoice generation.

- **Shared Libraries (`lib/`)**:
  - `lib/db/src/schema.ts`: Single source of truth for PostgreSQL tables (users, products, orders, cart items, reviews, pincodes).
  - `lib/api-spec/openapi.yaml`: OpenAPI 3.0 specification contract.
  - `lib/api-client-react`: Generated React Query hooks consumed by `apps/frontend`.
  - `lib/api-zod`: Shared Zod schemas for runtime request validation.

---

## 🔐 Demo Credentials

- **Admin Account**: `admin@farm2me.in` / `admin123` (Access `/admin` dashboard)
- **Customer Account**: `demo@farm2me.in` / `demo123`
