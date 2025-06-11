import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const dbUrl = new URL(String(process.env.DATABASE_URL));

const db = drizzle(
  {
    connectionString: dbUrl.toString(),
    ssl: dbUrl.searchParams.has("sslmode", "require"),
  },
  { schema }
);

export default db;
