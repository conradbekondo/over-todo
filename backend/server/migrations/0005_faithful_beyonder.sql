CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner" uuid NOT NULL,
	"freshness" interval NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"refreshedAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"ip" text,
	"userAgent" text,
	"platform" text,
	"data" jsonb
);
--> statement-breakpoint
DROP TABLE "generated_tokens" CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."token_type";