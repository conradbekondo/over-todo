import { randomUUID } from "crypto";
import { fromError } from "zod-validation-error";
import { NewTodoSchema } from "~/models/schemas";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { success, error, data } = NewTodoSchema.safeParse(body);
  if (!success)
    throw createError({
      statusCode: 400,
      message: fromError(error).message,
      cause: error,
    });

  const nitroDb = useDatabase();
  const { title, category, description, dueDate, priority, reminder } = data;

  await nitroDb.sql`
    INSERT INTO 
      tasks(
      "title",
      "category",
      "description",
      "dueDate",
      "priority",
      "reminder",
      "owner"
    ) VALUES (
      ${title}, 
      ${category}, 
      ${description}, 
      ${dueDate.toUTCString()}, 
      ${priority}, 
      ${reminder}, 
      ${randomUUID()}
    );
    `;
});
