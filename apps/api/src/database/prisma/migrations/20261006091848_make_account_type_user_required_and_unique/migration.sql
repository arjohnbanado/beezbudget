-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'suspended');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('signup_invitation', 'password_reset', 'two_factor_auth');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "currencies" (
    "code" CHAR(3) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "minor_unit" SMALLINT NOT NULL,
    "is_selectable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "password" VARCHAR(72),
    "facebook_id" VARCHAR(64),
    "google_id" VARCHAR(64),
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "preferred_currency_code" CHAR(3),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(320) NOT NULL,
    "user_id" UUID,
    "token_hash" VARCHAR(64) NOT NULL,
    "type" "TokenType" NOT NULL DEFAULT 'signup_invitation',
    "resend_count" INTEGER NOT NULL DEFAULT 0,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "resend_available_at" TIMESTAMP NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "used_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "account_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "account_type_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "account_number_ciphertext" TEXT,
    "account_number_iv" VARCHAR(16),
    "account_number_auth_tag" VARCHAR(24),
    "account_number_last4" VARCHAR(4),
    "opening_balance" DECIMAL(20,4),
    "currency_code" CHAR(3) NOT NULL,
    "icon_key" VARCHAR(100) NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "base_currency_code" CHAR(3) NOT NULL,
    "quote_currency_code" CHAR(3) NOT NULL,
    "rate_date" DATE NOT NULL,
    "rate" DECIMAL(24,12) NOT NULL,
    "source" VARCHAR(50) NOT NULL,
    "fetched_at" TIMESTAMP NOT NULL,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("base_currency_code","quote_currency_code","rate_date","source")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_facebook_id_key" ON "users"("facebook_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE INDEX "verification_tokens_email_type_idx" ON "verification_tokens"("email", "type");

-- CreateIndex
CREATE INDEX "verification_tokens_user_id_type_idx" ON "verification_tokens"("user_id", "type");

-- CreateIndex
CREATE INDEX "verification_tokens_token_hash_idx" ON "verification_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "account_types_user_id_idx" ON "account_types"("user_id");

-- CreateIndex
CREATE INDEX "account_types_name_idx" ON "account_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "account_types_user_id_name_key" ON "account_types"("user_id", "name");

-- CreateIndex
CREATE INDEX "accounts_user_id_status_name_idx" ON "accounts"("user_id", "status", "name");

-- CreateIndex
CREATE INDEX "accounts_user_id_account_type_id_status_idx" ON "accounts"("user_id", "account_type_id", "status");

-- CreateIndex
CREATE INDEX "exchange_rates_quote_currency_code_base_currency_code_rate__idx" ON "exchange_rates"("quote_currency_code", "base_currency_code", "rate_date");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_preferred_currency_code_fkey" FOREIGN KEY ("preferred_currency_code") REFERENCES "currencies"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_types" ADD CONSTRAINT "account_types_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_account_type_id_fkey" FOREIGN KEY ("account_type_id") REFERENCES "account_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_currency_code_fkey" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_base_currency_code_fkey" FOREIGN KEY ("base_currency_code") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_quote_currency_code_fkey" FOREIGN KEY ("quote_currency_code") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
