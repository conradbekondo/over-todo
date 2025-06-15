import { betterAuth, Session, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { captcha, openAPI } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/node-postgres";
import { EventHandler, H3Event } from "h3";
import { Pool } from "pg";
import * as schema from "./db-schema";

const pool = new Pool({ connectionString: process.env.NITRO_DATABASE_URL });
const db = drizzle(pool, { schema });

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
  plugins: [
    openAPI(),
    captcha({
      provider: "google-recaptcha",
      secretKey: process.env.NITRO_RECAPTCHA_SECRET,
    }),
  ],
  trustedOrigins: [process.env.NITRO_FRONTEND_ORIGIN],
});

export const requireAuth: EventHandler = async (event) => {
  const headers = event.headers;
  const session = await auth.api.getSession({ headers });

  if (!session) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
      statusMessage: "Unauthorized",
    });
  }
  event.context.auth = session;
};

export function useAuth(event: H3Event) {
  return event.context.auth as { session: Session; user: User };
}
