CREATE TABLE "user_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"notifyMeUsingEmails" boolean DEFAULT false,
	"notifyMeUsingSms" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;