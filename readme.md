# RentNest 🏠

**Find & List Rental Properties with Ease**

RentNest is a full-stack rental property marketplace backend API built with **Node.js, Express, TypeScript, and Prisma ORM**. Landlords can list properties and manage rental requests, tenants can browse listings, request rentals, and pay online via Stripe, and admins oversee the entire platform.


---

## 📌 Project Links

| Resource | Link |
|---|---|
| GitHub Repository | https://github.com/umme-Tahazzee/rent-nest.git |
| ERD (Database Diagram) | https://drawsql.app/teams/tahazzee/diagrams/rent-nest |

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (ESM)
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Prisma (with `@prisma/adapter-pg`)
- **Authentication:** JWT (access + refresh token)
- **Password Hashing:** bcryptjs
- **Validation:** Yup
- **Payments:** Stripe (Checkout Sessions + Webhooks)
- **Dev tooling:** tsx (watch mode), TypeScript compiler

---

## 👥 Roles & Permissions

| Role | Description | Key Permissions |
|---|---|---|
| **Tenant** | Users looking for rental properties | Browse listings, submit rental requests, pay via Stripe, leave reviews, manage profile |
| **Landlord** | Property owners who list rentals | Create/manage listings, approve/reject rental requests, view tenant history |
| **Admin** | Platform moderators | Manage all users (ban/unban), oversee all listings & rental requests, manage categories |

> 💡 Users select their role (`TENANT` / `LANDLORD`) during registration. Admin accounts cannot be self-registered.

---

## 🔑 Test Credentials

**Admin login:**

```
email:    admin@gmail.com
password: 12345678
```

Use this account to test all `/api/admin/*` routes (user ban/unban, view all properties, view all rental requests).

For tenant/landlord accounts, register new users via `POST /api/auth/register`.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/umme-Tahazzee/rent-nest.git
cd rent-nest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) below).

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or whatever `PORT` is set in `.env`).

---

## 🔐 Environment Variables

Create a `.env` file with the following keys:

```env
PORT=5000
APP_URL=http://localhost:3000

DATABASE_URL="postgres://<user>:<password>@<host>:5432/<database>?sslmode=require"

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
```

> ⚠️ Never commit your real `.env` file. Use your own test values for `DATABASE_URL`, JWT secrets, and Stripe keys.

### Getting Stripe test keys

1. Create a free account at [stripe.com](https://stripe.com).
2. Go to **Developers → API keys** and copy the **Secret key** (starts with `sk_test_...`).
3. For the webhook secret, either:
   - Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) locally: `stripe listen --forward-to localhost:5000/api/payments/webhook` — it will print a `whsec_...` value to use.
   - Or create a webhook endpoint in the Stripe Dashboard pointing to your deployed URL + `/api/payments/webhook`.

---

## 📚 API Endpoints

> ⚠️ All protected routes require a Bearer token: `Authorization: Bearer <access_token>` (obtained from the login endpoint).

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/users/register` | Public | Register a new user (tenant/landlord) |
| POST | `/api/auth/login` | Public | Login, returns access + refresh token |
| GET | `/api/users/me` | Authenticated | Get current logged-in user's profile |

### Categories

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/categories` | Public | Get all property categories |
| GET | `/api/categories/:id` | Public | Get single category |
| POST | `/api/categories` | Admin | Create a new category |
| PATCH | `/api/categories/:id` | Admin | Update a category |
| DELETE | `/api/categories/:id` | Admin | Delete a category |

### Properties

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/properties` | Public | Get all properties (supports filtering & pagination — `searchTerm`, `city`, `minPrice`, `maxPrice`, `bedroom`, `bathroom`, `categoryId`, `status`, `page`, `limit`, `sortBy`, `sortOrder`) |
| GET | `/api/properties/:id` | Public | Get property details |
| POST | `/api/properties` | Landlord | Create a new property listing |
| PATCH | `/api/properties/:id` | Landlord / Admin | Update a property listing |
| DELETE | `/api/properties/:id` | Landlord / Admin | Delete a property listing |

### Rental Requests

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/rentals` | Tenant | Submit a rental request for a property |
| GET | `/api/rentals` | Authenticated | Get the logged-in user's rental requests |
| GET | `/api/rentals/:id` | Tenant / Landlord / Admin | Get rental request details |

### Landlord Management

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/landlord/request` | Landlord | Get all rental requests for the landlord's properties |
| POST | `/api/landlord/request/:id` | Landlord | Approve or reject a rental request |

### Payments (Stripe)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/create` | Tenant | Create a Stripe checkout session for an approved rental request |
| POST | `/api/payments/confirm` | Tenant | Manually verify/confirm a payment using the Stripe session ID (fallback for local testing without webhooks) |
| POST | `/api/payments/webhook` | Stripe (server-to-server) | Stripe webhook listener — auto-confirms payment on `checkout.session.completed` |
| GET | `/api/payments` | Tenant | Get the logged-in tenant's payment history |
| GET | `/api/payments/:id` | Tenant / Landlord / Admin | Get a single payment's details |

### Reviews

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/reviews` | Tenant | Leave a review after a completed rental |

### Admin

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Admin | Get all users (filter by `searchTerm`, `role`, `status` + pagination) |
| PATCH | `/api/admin/users/:id` | Admin | Ban/unban a user (`{ "status": "ACTIVE" }` or `"BLOCKED"`) |
| GET | `/api/admin/properties` | Admin | Get all properties platform-wide (moderation view) |
| GET | `/api/admin/rentals` | Admin | Get all rental requests platform-wide |

---

## 💳 Testing Stripe Payments

1. Register/login as a tenant and submit a rental request via `POST /api/rentals`.
2. Login as the landlord who owns that property and approve it via `POST /api/landlord/request/:id`.
3. As the tenant, call `POST /api/payments/create` with `{ "rentalRequestId": "<id>" }`. This returns a `checkoutUrl`.
4. Open the `checkoutUrl` in a browser and pay using a Stripe test card:

   ```
   Card number: 4242 4242 4242 4242
   Expiry: any future date
   CVC: any 3 digits
   ```

5. On success, Stripe redirects back and (if the webhook is running via Stripe CLI) the payment status updates to `PAID` automatically. If you're not running the webhook listener, call `POST /api/payments/confirm` with `{ "sessionId": "<session_id_from_checkoutUrl>" }` to manually verify and mark it as paid.

---

## 🗄️ Database Schema (Overview)

Full schema and relationships are visualized in the ERD: **[View ERD on DrawSQL](https://drawsql.app/teams/tahazzee/diagrams/rent-nest)**

Core tables:

- **User** — auth details, role (`TENANT` / `LANDLORD` / `ADMIN`), status (`ACTIVE` / `BLOCKED`)
- **Category** — property type categories (apartment, house, studio, etc.)
- **Property** — rental listings linked to a landlord and category
- **RentalRequest** — a tenant's request to rent a property, with status transitions (`PENDING` → `APPROVED`/`REJECTED`)
- **Payment** — Stripe payment transactions linked 1:1 to a rental request
- **Review** — tenant reviews left on properties

---

## 📁 Project Structure

```
src/
├── config/           # environment config
├── lib/               # Prisma client, Stripe client
├── middleware/        # auth, error handling, validation
├── modules/
│   ├── admin/
│   ├── auth/
│   ├── category/
│   ├── landlord/
│   ├── payment/
│   ├── property/
│   ├── rentalRequest/
│   ├── review/
│   ├── user/
│   └── utils/         # catchAsync, sendResponse, pick
├── app.ts
└── server.ts
```

---

## 👩‍💻 Author

**Umme Tahazzee**
GitHub: [@umme-tahazzee](https://github.com/umme-tahazzee)