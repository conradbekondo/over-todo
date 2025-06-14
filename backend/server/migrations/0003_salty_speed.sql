CREATE TYPE "public"."token_type" AS ENUM('access', 'refresh');--> statement-breakpoint
CREATE TABLE "generated_tokens" (
	"value" text NOT NULL,
	"validTill" interval NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"revokedAt" timestamp,
	"type" "token_type" NOT NULL,
	"owner" uuid NOT NULL,
	CONSTRAINT "generated_tokens_value_type_owner_pk" PRIMARY KEY("value","type","owner")
);
--> statement-breakpoint
ALTER TABLE "generated_tokens" ADD CONSTRAINT "generated_tokens_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;