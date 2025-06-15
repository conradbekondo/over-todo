import { and, asc, count, desc, eq, gt } from "drizzle-orm";
import { TaskDtoSchema, TaskFetchParamsSchema } from "~/models/schemas";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const db = await useDrizzle();
    const {
      user: { id: owner },
    } = useAuth(event);
    const { limit, page } = TaskFetchParamsSchema.parse(getQuery(event));
    const filter = eq(tasks.owner, owner);

    const data = await db
      .select()
      .from(tasks)
      .where(filter)
      .orderBy(desc(tasks.updatedAt), asc(tasks.dueDate))
      .offset(page * limit)
      .limit(limit)
      .then((values) => values.map((v) => TaskDtoSchema.parse(v)));

    const [{ total }] = await db
      .select({ total: count(filter) })
      .from(tasks);

    return { data, total, size: limit, page };
  },
});
