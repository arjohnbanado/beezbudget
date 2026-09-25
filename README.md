# BeezBudget

BeezBudget is a full-stack personal finance web app in development. The current release work focuses on account access: registration, sign-in, email verification, and password recovery. The product roadmap is to grow it into an accessible budgeting app for tracking spending, planning budgets, and reaching savings goals.

> **Status:** Work in progress. Transaction management, budgets, accounts, goals, analytics, and offline PWA support are not implemented yet.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Architecture](#architecture)
- [Data model](#data-model)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API documentation](#api-documentation)
- [Security](#security)
- [License](#license)

## Features

- Registration and sign-in
- Email verification, including resend support
- Forgot-password and password-reset flows
- JWT authentication using an HTTP-only access-token cookie
- PostgreSQL persistence through Prisma

## Technology

| Area      | Tools                                                 |
| --------- | ----------------------------------------------------- |
| Web       | Next.js, React, TypeScript, Material UI, Tailwind CSS |
| API       | NestJS, TypeScript, Passport, JWT, Zod                |
| Data      | PostgreSQL, Prisma                                    |
| Email     | Resend                                                |
| API tests | Vitest                                                |

## Architecture

The diagram below shows the **planned container architecture**. The UI cache and finance data capabilities shown are roadmap items and are not implemented in the current codebase.

![Planned BeezBudget container architecture](docs/architecture/container-view.png)

The API listens on port `3001` by default and uses the `/api/v1` URI prefix. The web app runs on port `3000` by default.

## Data model

The current database schema contains `User` and `VerificationToken` models. This ERD reflects the schema implemented in Prisma today.

![BeezBudget database entity relationship diagram](docs/database/erd.png)

## Repository layout

```text
apps/
  api/       NestJS REST API, Prisma schema, and migrations
  web/       Next.js web application
docs/
  api/       OpenAPI specification
docker-compose.yml
```

## Getting started

### Prerequisites

- Node.js and npm
- Docker with Docker Compose
- A Resend API key to deliver verification and password-reset emails
- An RS256 RSA key pair for JWT signing and verification

### 1. Configure and start PostgreSQL

Create a `.env` file in the repository root. Docker Compose reads these values to initialize the database. Do not commit this file.

```dotenv
POSTGRES_USER=beezbudget
POSTGRES_PASSWORD=change-me
POSTGRES_DB=beezbudget
```

Start PostgreSQL from the repository root:

```bash
docker compose up -d db
```

### 2. Configure the API

Create `apps/api/.env` with the API settings below. Replace placeholders with your local credentials. `PRIVATE_KEY` and `PUBLIC_KEY` must be base64-encoded PEM contents from the same RSA key pair.

```dotenv
DATABASE_URL=postgresql://beezbudget:change-me@localhost:5432/beezbudget
PORT=3001
FRONTEND_URL=http://localhost:3000
RESEND_API_KEY=re_example
PRIVATE_KEY=<base64-encoded-private-key>
PUBLIC_KEY=<base64-encoded-public-key>
OBSERVE_APP_KEY=<observe-app-key>
OBSERVE_APP_SECRET=<observe-app-secret>
```

The API requires `PRIVATE_KEY`, `PUBLIC_KEY`, `FRONTEND_URL`, `OBSERVE_APP_KEY`, and `OBSERVE_APP_SECRET` at startup. Email delivery also requires a working `RESEND_API_KEY`.

### 3. Install API dependencies and apply migrations

```bash
cd apps/api
npm ci
npx prisma migrate deploy
```

Prisma loads `apps/api/.env`. The schema and migrations are under `apps/api/src/database/prisma/`.

### 4. Configure and start the web app

Create `apps/web/.env.local` so the web app's server-rendered verification and password-recovery pages can reach the API:

```dotenv
BACKEND_URL=http://localhost:3001
```

Then install dependencies and start the development server:

```bash
cd apps/web
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To run the API, open another terminal:

```bash
cd apps/api
npm run start:dev
```

## Environment variables

| Variable             | Used by        | Purpose                                                |
| -------------------- | -------------- | ------------------------------------------------------ |
| `POSTGRES_USER`      | Docker Compose | Local PostgreSQL username                              |
| `POSTGRES_PASSWORD`  | Docker Compose | Local PostgreSQL password                              |
| `POSTGRES_DB`        | Docker Compose | Local PostgreSQL database name                         |
| `DATABASE_URL`       | API / Prisma   | PostgreSQL connection string                           |
| `PORT`               | API            | API listening port; defaults to `3001`                 |
| `FRONTEND_URL`       | API            | Frontend base URL used in email links                  |
| `RESEND_API_KEY`     | API            | Resend credential for sending email                    |
| `PRIVATE_KEY`        | API            | Base64-encoded PEM RSA private key for JWT signing     |
| `PUBLIC_KEY`         | API            | Base64-encoded PEM RSA public key for JWT verification |
| `OBSERVE_APP_KEY`    | API            | NestJS Observe application key                         |
| `OBSERVE_APP_SECRET` | API            | NestJS Observe application secret                      |
| `BACKEND_URL`        | Web            | API origin used by server-rendered pages               |

## Scripts

Run commands from the relevant application directory.

### API (`apps/api`)

| Command             | Description                 |
| ------------------- | --------------------------- |
| `npm run start:dev` | Start the API in watch mode |
| `npm run build`     | Build the API               |
| `npm run lint`      | Lint API source and tests   |
| `npm run test`      | Run unit tests              |
| `npm run test:e2e`  | Run end-to-end tests        |
| `npm run test:cov`  | Run tests with coverage     |

### Web (`apps/web`)

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the Next.js development server |
| `npm run build` | Build the web app                    |
| `npm run start` | Start the production server          |
| `npm run lint`  | Run ESLint                           |

## API documentation

The OpenAPI specification is in [`docs/api/openapi.yaml`](docs/api/openapi.yaml). The local API base URL is `http://localhost:3001/api/v1`.

## Security

Keep `.env` files, API keys, passwords, and private keys out of version control. Use separate credentials for local development and deployment, and store deployment secrets in your hosting provider's secret manager.

## License

No license has been selected yet. Add a `LICENSE` file before presenting the repository as open source or inviting reuse.
