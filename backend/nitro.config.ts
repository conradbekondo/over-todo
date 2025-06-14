export default defineNitroConfig({
  runtimeConfig: {
    weatherApiKey: "sample-token",
    frontendOrigin: "http://localhost:4201",
    logLevel: "info",
    recaptchaSecret: "",
    jwtSecret: "",
    jwtLife: "15m",
  },
  experimental: {
    database: true,
    openAPI: true,
  },
  routeRules: {
    "/api/**": {
      cors: true,
      headers: {
        "access-control-allow-headers":
          "Content-Type, Authorization, X-Requested-With, x-recaptcha-token",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-origin": process.env.NITRO_FRONTEND_ORIGIN,
      },
    },
  },
  openAPI: {
    meta: {
      description: "An over-engineered To-Do application",
      title: "Over Todo API",
      version: "1.0.0",
    },
    ui: {
      scalar: {
        theme: "purple",
        route: "/_docs/scalar",
      },
    },
    route: "/_docs/openapi.json",
  },
  database: {
    default: {
      connector: "postgresql",
      options: {
        url: process.env.NITRO_DATABASE_URL,
      },
    },
  },
  srcDir: "server",
  compatibilityDate: "2025-06-12",
});
