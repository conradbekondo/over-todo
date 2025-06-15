import { and, eq } from "drizzle-orm";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const id = getRouterParam(event, "id");
    const { user } = useAuth(event);
    const db = await useDrizzle();
    await db.transaction(async (tx) => {
      const result = await tx
        .delete(tasks)
        .where(and(eq(tasks.owner, user.id), eq(tasks.id, id)));

      setResponseStatus(
        event,
        result.rowCount == 0 ? 404 : 200,
        result.rowCount == 0 ? "Not Found" : "OK"
      );
    });
  },
});
