ALTER TABLE "todos" ADD COLUMN "completed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;