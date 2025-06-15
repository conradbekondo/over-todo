import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db-schema";

export async function useDrizzle() {
  const db = useDatabase();
  const logger = useLogger();
  const client = await db.getInstance();
  return drizzle(client as any, {
    schema,
    logger: {
      logQuery: (q, params) => {
        logger.debug(`${q} -- [${params.join(", ")}]`);
      },
    },
  });
}
