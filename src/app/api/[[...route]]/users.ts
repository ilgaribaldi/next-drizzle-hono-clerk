import { z } from "zod";
import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { db, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono().get("/", async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, auth.userId))
      .limit(1);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

export default app;
