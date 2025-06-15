import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { fromError, fromZodError } from "zod-validation-error";

const requestSchema = z.object({
  status: z.coerce.boolean({ message: "Invalid boolean value" }),
});

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const body = await readBody(event);
    const { success, error, data } = requestSchema.safeParse(body);

    if (!success)
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        ...fromError(error),
      });
    const db = await useDrizzle();
    const { user } = useAuth(event);
    const id = getRouterParam(event, "id");

    await db.transaction(async (tx) => {
      const result = await tx
        .update(tasks)
        .set({
          completed: data.status,
          completedAt: data.status ? new Date() : null,
        })
        .where(and(eq(tasks.owner, user.id), eq(tasks.id, id)));

      setResponseStatus(
        event,
        result.rowCount == 0 ? 404 : 202,
        result.rowCount == 0 ? "Not Found" : "Accepted"
      );
    });
  },
});
