import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db-schema";

export async function adaptDrizzle() {
  const db = useDatabase();
  const client = await db.getInstance();
  return drizzle(client, { schema });
}
