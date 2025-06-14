import { sql } from "drizzle-orm";
import {
  boolean,
  interval,
  jsonb,
  pgEnum,
  pgTable,
  pgView,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
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
  owner: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
});

export const users = pgTable("users", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  names: text().notNull(),
  email: text().notNull().unique(),
  createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const accounts = pgTable(
  "user_accounts",
  {
    id: text().notNull().primaryKey(),
    owner: uuid()
      .references(() => users.id, { onDelete: "set null" })
      .notNull(),
    accessKey: text(),
    refreshKey: text(),
    provider: accountProviders().notNull(),
    passwordHash: text(),
    username: text(),
    createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp({ mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex().on(t.username, t.provider)]
);

export const sessions = pgTable("sessions", {
  id: text().primaryKey(),
  owner: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  freshness: interval().notNull(),
  createdAt: timestamp({ mode: "date" }).defaultNow().notNull(),
  refreshedAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  ip: text(),
  userAgent: text(),
  platform: text(),
  data: jsonb(),
});

export const vwSessions = pgView("vw_user_sessions").as((qb) => {
  return qb
    .select({
      id: sessions.id,
      owner: sessions.owner,
      isFresh:
        sql`(${sessions.refreshedAt} + ${sessions.freshness}) > NOW()`.as(
          "is_fresh"
        ),
      updatedAt: sessions.updatedAt,
      createdAt: sessions.createdAt,
      ip: sessions.ip,
      platform: sessions.platform,
      data: sessions.data,
    })
    .from(sessions);
});
