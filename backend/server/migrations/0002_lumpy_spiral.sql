ALTER TABLE "user_accounts" DROP CONSTRAINT "user_accounts_username_unique";--> statement-breakpoint
ALTER TABLE "user_accounts" ADD COLUMN "provider" "account_providers" NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_accounts_username_provider_index" ON "user_accounts" USING btree ("username","provider");