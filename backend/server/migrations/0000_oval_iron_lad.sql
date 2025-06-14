CREATE TYPE "public"."account_providers" AS ENUM('credential', 'google');--> statement-breakpoint
CREATE TYPE "public"."fcm_notification_status" AS ENUM('sent', 'pending');--> statement-breakpoint
CREATE TYPE "public"."priorities" AS ENUM('high', 'low');--> statement-breakpoint
CREATE TABLE "user_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" uuid NOT NULL,
	"accessKey" text,
	"refreshKey" text,
	"passwordHash" text,
	"username" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_accounts_username_unique" UNIQUE NULLS NOT DISTINCT("username")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"dueDate" timestamp,
	"priority" "priorities",
	"reminder" varchar(10),
	"description" text,
	"category" varchar(100),
	"completed" boolean DEFAULT false,
	"fcmStatus" "fcm_notification_status",
	"fcmSend" timestamp,
	"fcmSentAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"owner" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"names" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;