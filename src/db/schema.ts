import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { timestamp, pgTable, text, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

export const userRoleEnum = pgEnum("userRole", [
  "STAFF",
  "DEVELOPER",
  "INVESTOR",
]);

export const users = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    firstName: text("firstName"),
    lastName: text("lastName"),
    username: text("username").unique(),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    imageUrl: text("imageUrl"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
    stripeCustomerId: text("stripeCustomerId").notNull(),
  },
  (table) => ({
    userNameIdx: index("user_name_idx").on(table.firstName, table.lastName),
    userCreatedAtIdx: index("user_created_at_idx").on(table.createdAt),
  })
);
