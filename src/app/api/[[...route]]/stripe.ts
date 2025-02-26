import { Hono } from "hono";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

const app = new Hono().post("/webhook", async (c) => {
  const body = await c.req.text();
  const signature = c.req.header("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log(`🔴 Error de webhook: Firma inválida`);
    return c.json({ error: "Firma inválida" }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("🟢 Checkout session completed:", event.id);
      break;
    case "invoice.payment_succeeded":
      console.log("🟢 Invoice payment succeeded:", event.id);
      break;
    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
  }

  return c.json(null, 200);
});

export default app;
