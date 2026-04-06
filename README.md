## ⚠️ Setup Requirements

This ERP prototype is not runnable out of the box.

It requires:
- PostgreSQL database setup
- Environment variables configuration
- (Optional) message queue / background services (if applicable)

Due to these dependencies not being bundled in the repository, additional setup is required before running the project.


### HyperMart ERP Backend

A modular, production-ready backend for HyperMart ERP, designed for inventory, purchase, user, and contact management. Built with Node.js, TypeScript, Express, and Prisma, it provides robust APIs for retail and business operations, with secure authentication, role-based access, and scalable architecture.

---

## Features

- User authentication (JWT, OTP, password reset)
- Role-based access control (Admin, Manager, Employee, etc.)
- Inventory management (categories, brands, units, subcategories, products)
- Purchase bill and supplier management
- Contact management (customers, suppliers)
- Modular, extensible codebase
- PostgreSQL database with Prisma ORM
- Redis integration for caching, OTP, and session management
- Secure, production-ready Docker setup
- Environment-based configuration and validation

---

## Tech Stack

- **Node.js** 24.x
- **TypeScript** 5.x
- **Express** 5.x
- **Prisma ORM** 7.x
- **PostgreSQL** 18.x
- **Redis** (ioredis)
- **Zod** (schema validation)
- **JWT** (jsonwebtoken)
- **Docker & Docker Compose**
- **pnpm** (package manager)

---

## Folder Structure

```
├── src/
│   ├── app.ts                # Express app setup and route mounting
│   ├── server.ts             # Server startup and shutdown logic
│   ├── common/
│   │   ├── db.ts             # Prisma client and shutdown helper
│   │   ├── auth/             # Auth guards and helpers
│   │   ├── integrations/     # Redis integration
│   │   ├── types/            # Shared TypeScript types
│   │   └── utils/            # Utility functions (password, OTP, barcode, etc.)
│   ├── config/
│   │   ├── env.config.ts     # Environment/configuration loader and validator
│   │   └── redis.config.ts   # Redis config
│   ├── generated/
│   │   └── prisma/           # Generated Prisma client
│   ├── modules/
│   │   ├── auth/             # Authentication (JWT, OTP, password)
│   │   ├── contacts/         # Contact management
│   │   ├── inventory/        # Inventory (categories, brands, units, subcategories, products)
│   │   ├── purchase/         # Purchase bill management
│   │   └── users/            # User management
│   └── scripts/
│       └── seeds/            # Database seed scripts
├── prisma/
│   ├── schema.prisma         # Prisma schema
│   └── migrations/           # Database migrations
├── Dockerfile                # Multi-stage Docker build
├── docker-compose.yaml       # Docker Compose services
├── package.json              # Project metadata and scripts
├── pnpm-workspace.yaml       # pnpm workspace config
├── tsconfig.json             # TypeScript config
└── .env.dev                  # Example environment variables
```

---

## Environment Variables

Set these in your `.env.dev` (see example in repo):

| Variable                      | Description                        |
|-------------------------------|------------------------------------|
| NODE_ENV                      | Environment (development/production)|
| PORT                          | App port (default: 5000)           |
| DATABASE_URL                  | PostgreSQL connection string        |
| JWT_SECRET                    | JWT secret key                     |
| JWT_EXPIRES_IN                | JWT expiry (seconds)               |
| JWT_REFRESH_SECRET            | JWT refresh secret                  |
| JWT_REFRESH_EXPIRES_IN        | JWT refresh expiry (seconds)        |
| REDIS_USERNAME                | Redis username                      |
| REDIS_PASSWORD                | Redis password                      |
| REDIS_HOST                    | Redis host                          |
| REDIS_PORT                    | Redis port                          |
| REDIS_REFRESH_TOKEN_EXPIRES_IN| Redis refresh token expiry (seconds)|
| REDIS_OTP_EXPIRES_IN          | Redis OTP expiry (seconds)          |
| AUTH_KEY                      | MSG91 Auth key (for OTP SMS)        |
| MSG_DLT_TEMPLATE_ID_OTP       | MSG91 DLT template ID for OTP       |

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/Vedant-Scripts/hypermart-erp.git
cd hypermart-erp
```

### 2. Install Dependencies

```sh
pnpm install
```

### 3. Configure Environment Variables

Copy `.env.dev` and update values as needed:

```sh
cp .env.dev .env.dev
```

### 4. Run with Docker Compose (Recommended)

```sh
docker-compose up --build
```

- Backend: http://localhost:5000
- PostgreSQL: localhost:5432

### 5. Run Locally (Without Docker)

Ensure PostgreSQL and Redis are running and accessible.

```sh
pnpm dev
```

---

## Example API Usage

### Authentication

- **Send OTP:**
  - `POST /api/auth/send-otp`
  - Body: `{ "phone": "+911234567890" }`

- **Login:**
  - `POST /api/auth/login`
  - Body: `{ "phone": "+911234567890", "otp": "123456" }`

- **Refresh Token:**
  - `POST /api/auth/refresh-token`
  - Body: `{ "refreshToken": "..." }`

### Inventory

- **List Products:**
  - `GET /api/product`

- **Create Product:**
  - `POST /api/product`
  - Body: `{ "name": "Product Name", ... }`

### Users

- **List Users:**
  - `GET /api/user`

- **Create User:**
  - `POST /api/user`
  - Body: `{ "name": "User Name", ... }`

### Contacts

- **List Contacts:**
  - `GET /api/contact`

- **Create Contact:**
  - `POST /api/contact`
  - Body: `{ "name": "Contact Name", ... }`

### Purchase Bills

- **List Purchase Bills:**
  - `GET /api/purchase-bill`

- **Create Purchase Bill:**
  - `POST /api/purchase-bill`
  - Body: `{ ... }`

---

## License

MIT

---

## Contact

For support or inquiries, contact the HyperMart team at (https://github.com/Vedant-Scripts).
