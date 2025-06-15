import { and, asc, desc, eq, gt } from "drizzle-orm";
import { TaskDtoSchema, TaskFetchParamsSchema } from "~/models/schemas";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const db = await useDrizzle();
    const {
      user: { id: owner },
    } = useAuth(event);
    const { limit, after } = TaskFetchParamsSchema.parse(getQuery(event));

    return await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.owner, owner), gt(tasks.createdAt, after)))
      .orderBy(desc(tasks.updatedAt), asc(tasks.dueDate))
      .limit(limit)
      .then((values) => values.map((v) => TaskDtoSchema.parse(v)));
  },
});
