import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const accountProviders = pgEnum("account_providers", [
  "credential",
  "google",
]);
export const taskPriorities = pgEnum("priorities", ["high", "low"]);
export const fcmStatuses = pgEnum("fcm_notification_status", [
  "sent",
  "pending",
]);

export const tasks = pgTable("tasks", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  dueDate: timestamp({ mode: "date" }),
  priority: taskPriorities(),
  reminder: varchar({ length: 10 }),
  description: text(),
  category: varchar({ length: 100 }),
  completed: boolean().default(false),
  fcmStatus: fcmStatuses(),
  fcmSend: timestamp({ mode: "date" }),
  fcmSentAt: timestamp({ mode: "date" }),
  createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  completedAt: timestamp({ mode: "date" }),
  owner: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const preferences = pgTable("user_preferences", {
  id: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  notifyMeUsingEmails: boolean().default(false),
  notifyMeUsingSms: boolean().default(false),
});
