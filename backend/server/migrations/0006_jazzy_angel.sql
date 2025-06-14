ALTER TABLE "sessions" DROP CONSTRAINT "sessions_owner_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."vw_user_sessions" AS (select "id", "owner", ("refreshedAt" + "freshness") > NOW() as "is_fresh", "updatedAt", "createdAt", "ip", "platform", "data" from "sessions");