import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import { auth } from "./lib/auth";

const betterAuthPlugin = new Elysia({
  name: "better-auth",
  prefix: "/api/auth",
})
  .mount(auth.handler)

  .post(
    "/sign-up/email",
    () => {
      return { message: "User registration endpoint" };
    },
    {
      body: t.Object({
        name: t.String({ description: "User's full name" }),
        email: t.String({
          format: "email",
          description: "User's email address",
        }),
        password: t.String({
          minLength: 8,
          description: "User's password (min 8 characters)",
        }),
      }),
      response: {
        200: t.Object({
          message: t.String({ description: "Success message" }),
        }),
        400: t.Object({
          error: t.String({
            description: "Error message indicating bad request",
          }),
        }),
      },
      detail: {
        summary: "Register a new user with email and password",
        tags: ["Authentication"],
      },
    }
  )
  .post(
    "/sign-in/email",
    () => {
      return { message: "User login endpoint", token: "" };
    },
    {
      body: t.Object({
        email: t.String({
          format: "email",
          description: "User's email address",
        }),
        password: t.String({ description: "User's password" }),
      }),
      response: {
        200: t.Object({
          message: t.String({ description: "Success message" }),
          token: t.String({ description: "JWT access token" }), // Assuming JWT is returned
        }),
        400: t.Object({
          error: t.String({
            description: "Error message indicating invalid credentials",
          }),
        }),
      },
      detail: {
        summary: "Sign in with email and password",
        tags: ["Authentication"],
      },
    }
  )
  .get(
    "/sign-out",
    () => {
      return { message: "User logged out successfully" };
    },
    {
      response: {
        200: t.Object({
          message: t.String({ description: "Success message" }),
        }),
        401: t.Object({
          error: t.String({
            description: "Error message indicating unauthorized access",
          }),
        }),
      },
      detail: {
        summary: "Log out the current user",
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }], // Indicates this route requires authentication
      },
    }
  )
  .get(
    "/me",
    () => {
      return {
        id: "string",
        email: "string",
        name: "string",
      };
    },
    {
      response: {
        200: t.Object({
          id: t.String({ description: "User ID" }),
          email: t.String({ format: "email", description: "User's email" }),
          name: t.String({ description: "User's name" }),
        }),
        401: t.Object({
          error: t.String({
            description: "Error message indicating unauthorized access",
          }),
        }),
      },
      detail: {
        summary: "Get current authenticated user details",
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }], // Indicates this route requires authentication
      },
    }
  )
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) {
          status(401);
          throw new Error("Unauthorized"); // Throw an error to stop execution
        }
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

const app = new Elysia()
  .use(
    cors({
      origin: String(process.env.FRONTEND_URL ?? ""),
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(betterAuthPlugin)
  .use(
    swagger({
      autoDarkMode: true,
      path: "/api/docs",
      documentation: {
        info: {
          title: "Over Todo API",
          version: "1.0.0",
          description: "Fullstack position test",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description:
                "Enter your JWT Bearer token in the format 'Bearer YOUR_TOKEN'",
            },
          },
        },
        tags: [
          {
            name: "Authentication",
            description: "User authentication and authorization endpoints",
          },
          { name: "General", description: "General API endpoints" },
        ],
      },
    })
  )
  .get("/health", () => ({ status: "OK" }), {
    detail: {
      summary: "A simple hello endpoint",
      tags: ["General"],
    },
  })
  .group("/api", (group) =>
    group.get("/todos", async () => {
      return { todos: [] };
    })
  )
  .listen(Number(process.env.PORT ?? "3000"));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
