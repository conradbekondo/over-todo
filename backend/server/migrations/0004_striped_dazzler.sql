ALTER TABLE "generated_tokens" RENAME COLUMN "validTill" TO "lifetime";--> statement-breakpoint
ALTER TABLE "generated_tokens" ADD COLUMN "id" uuid DEFAULT gen_random_uuid();