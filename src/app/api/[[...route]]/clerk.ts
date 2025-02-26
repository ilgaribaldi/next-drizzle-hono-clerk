import { Hono } from "hono";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";

const app = new Hono().post("/webhook", async (c) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const body = await c.req.text();
  const svix_id = c.req.header("svix-id");
  const svix_timestamp = c.req.header("svix-timestamp");
  const svix_signature = c.req.header("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return c.json({ error: "Error occured -- no svix headers" }, 400);
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return c.json({ error: "Error occured" }, 400);
  }

  const eventType = evt.type;

  switch (eventType) {
    case "user.created": {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0].email_address;

      const customer = await stripe.customers.create({
        email: email || undefined,
        metadata: { userId: id },
      });

      await db.insert(users).values({
        id,
        email,
        firstName: first_name,
        lastName: last_name,
        imageUrl: evt.data.image_url ?? null,
        stripeCustomerId: customer.id,
      });

      console.log("🟢 user created:", id);
      break;
    }

    case "user.updated": {
      const updatedUser = evt.data;
      await db
        .update(users)
        .set({
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          email: updatedUser.email_addresses[0].email_address,
          imageUrl: updatedUser.image_url ?? null,
        })
        .where(eq(users.id, updatedUser.id));
      console.log("🟢 user updated:", updatedUser.id);
      break;
    }

    case "user.deleted": {
      const { id: deletedUserId } = evt.data;

      if (deletedUserId) {
        await db.delete(users).where(eq(users.id, deletedUserId));
        console.log("🟢 user deleted:", deletedUserId);
      } else {
        console.error("user.deleted event received with undefined id");
      }
      break;
    }

    default:
      console.log("🟡 Unhandled event type:", eventType);
  }

  return c.json(null, 200);
});

export default app;
