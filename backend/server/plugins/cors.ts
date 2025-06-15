import cors from "cors";
export default defineNitroPlugin((plugin) => {
  plugin.h3App.use(
    fromNodeMiddleware(
      cors({
        origin: process.env.NITRO_FRONTEND_ORIGIN,
        credentials: true,
        allowedHeaders: [
          "x-recaptcha-response",
          "authorization",
          "content-type",
          "x-requested-with",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    )
  );
});
