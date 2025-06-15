import { lastDayOfMonth } from "date-fns";
import { and, between, count, eq, ne } from "drizzle-orm";

export default defineEventHandler({
  handler: async (event) => {
    const db = await useDrizzle();
    const { user } = useAuth(event);
    const lastDay = lastDayOfMonth(new Date());
    const start = new Date(
      lastDay.getFullYear(),
      lastDay.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    return await db
      .select({
        created: count(between(tasks.createdAt, start, lastDay)),
        due: count(
          and(between(tasks.dueDate, start, lastDay), ne(tasks.completed, true))
        ),
        completed: count(between(tasks.completedAt, start, lastDay)),
      })
      .from(tasks)
      .where(eq(tasks.owner, user.id))
      .then(([v]) => v);
  },
  onRequest: [requireAuth],
});
