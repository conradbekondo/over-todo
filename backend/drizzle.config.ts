import { defineConfig } from "drizzle-kit";

const dbUrl = new URL(String(process.env.NITRO_DATABASE_URL));

export default defineConfig({
  dialect: "postgresql",
  out: "server/migrations",
  schema: "server/utils/db-schema.ts",
  dbCredentials: {
    url: dbUrl.toString(),
    ssl: dbUrl.searchParams.has("sslmode", "require"),
  },
});
