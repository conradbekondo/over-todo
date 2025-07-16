import { eq } from "drizzle-orm";

export default defineEventHandler({
  handler: async (event) => {
    const { user } = useAuth(event);
    const db = await useDrizzle();
    const result = await db.query.preferences.findFirst({
      where: eq(preferences.id, user.id),
    });
    setResponseStatus(event, result ? 200 : 404, result ? "OK" : "Not Found");
    return result;
  },
  onRequest: [requireAuth],
});
