import { randomBytes, randomUUID } from "crypto";
import { and, count, eq } from "drizzle-orm";
import { fromZodError } from "zod-validation-error";
import { CredentialSignUpSchema } from "~/models/schemas";
import { adaptDrizzle } from "~/utils/db";
import { hashPassword } from "~/utils/password";
import { validateRecaptcha } from "~/utils/recaptcha-validator";

function randomCode(len = 10) {
  return randomBytes(len / 2).toString("hex");
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  await validateRecaptcha(event);
  const { success, error, data } = CredentialSignUpSchema.safeParse(body);
  if (!success)
    throw createError({
      statusCode: 400,
      ...fromZodError(error),
    });

  const db = await adaptDrizzle();
  await db.transaction(async (tx) => {
    const [{ emailCount }] = await tx
      .select({ emailCount: count() })
      .from(accounts)
      .where(
        and(
          eq(accounts.username, data.email),
          eq(accounts.provider, "credential")
        )
      );

    if (emailCount > 0)
      throw createError({
        statusCode: sanitizeStatusCode("conflict"),
        message: "Email address is already in use",
      });

    const salt = randomCode(6);

    const hash = await hashPassword(data.password, salt);

    const [{ id: userId }] = await tx
      .insert(users)
      .values({
        email: data.email,
        names: data.names,
      })
      .onConflictDoNothing({
        target: [users.email],
      })
      .returning({
        id: users.id,
      });

    await tx.insert(accounts).values({
      id: randomUUID(),
      provider: "credential",
      owner: userId,
      passwordHash: hash,
      username: data.email,
    });
  });
  setResponseStatus(event, 201, "Created");
});
