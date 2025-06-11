import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "src/db/migrations",
  schema: "src/lib/schema.ts",
  dbCredentials: {
    url: String(process.env.DATABASE_URL),
  },
});
