import { User } from "better-auth";

export default defineNitroPlugin(async (app) => {
  app.hooks.hook("afterResponse", async (event, response) => {
    if (
      !event.path.startsWith("/api/auth/sign-up") ||
      !(response.body as any)?.user
    )
      return;
    const { user } = response.body as { user: User };
    const db = await useDrizzle();
    try {
      await db.transaction((tx) =>
        tx.insert(preferences).values({
          id: user.id,
        })
      );
    } catch (e) {
      const logger = useLogger(event);
      logger.error("error while creating user preferences", "err", e);
    }
  });
});
