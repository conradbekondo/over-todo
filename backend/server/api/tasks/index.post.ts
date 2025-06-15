import { fromError } from "zod-validation-error";
import { NewTodoSchema, TaskDtoSchema } from "~/models/schemas";
import { useAuth } from "~/utils/auth";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const body = await readBody(event);
    const { success, error, data } = NewTodoSchema.safeParse(body);
    if (!success)
      throw createError({
        statusCode: 400,
        message: fromError(error).message,
        cause: error,
      });

    const db = await useDrizzle();
    const { title, category, description, dueDate, priority, reminder } = data;
    const {
      user: { id: owner },
    } = useAuth(event);

    return await db.transaction(async (tx) => {
      const result = await tx
        .insert(tasks)
        .values({
          owner,
          title,
          category,
          description,
          dueDate,
          priority,
          reminder,
        })
        .returning()
        .then((v) => v.map((x) => TaskDtoSchema.parse(x)));
      setResponseStatus(event, 201, "Created");
      return result;
    });
  },
});
