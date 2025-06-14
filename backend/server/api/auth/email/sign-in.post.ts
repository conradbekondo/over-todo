import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { fromZodError } from "zod-validation-error";
import { CredentialSignUpSchema } from "~/models/schemas";
import { verifyPassword } from "~/utils/password";

defineRouteMeta({
  openAPI: {
    operationId: "signInWithEmail",
    summary: "Sign in with email and password",
    description:
      "Authenticates a user using email and password credentials. Returns access and refresh JWT tokens on success.",
    tags: ["Auth"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string", format: "password" },
            },
            required: ["email", "password"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successful authentication",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                access: { type: "string", description: "Access JWT token" },
                refresh: { type: "string", description: "Refresh JWT token" },
              },
              required: ["access", "refresh"],
            },
          },
        },
      },
      400: {
        description: "Validation error",
      },
      401: {
        description: "Invalid email or password",
      },
    },
  },
});

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
  const accountResult = await db
    .select({ userId: accounts.owner, passwordHash: accounts.passwordHash })
    .from(accounts)
    .where(
      and(
        eq(accounts.username, data.email),
        eq(accounts.provider, "credential")
      )
    );

  const unauthorizedError = createError({
    statusCode: 401,
    message: "Invalid email or password",
  });

  if (accountResult.length == 0) throw unauthorizedError;

  const [userAccount] = accountResult;
  const passwordValid = await verifyPassword(
    data.password,
    userAccount.passwordHash
  );

  if (!passwordValid) throw unauthorizedError;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userAccount.userId));

  const userPayload = {
    sub: user.id,
    names: user.names,
    email: user.email,
  };

  const session = await useSession(event, {
    password: data.password
  })

  return await db.transaction(async (tx) => {
    return tx.insert(sessions).values({});
  });
});
