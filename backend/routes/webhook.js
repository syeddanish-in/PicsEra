import express from "express";
import Stripe from "stripe";
import { query } from "../db.js";

const router = express.Router();

/**
 * Helper to get Stripe instance
 */
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  return new Stripe(secretKey);
};

/**
 * POST /api/webhook
 * Stripe Webhook Endpoint
 * 
 * CRITICAL SECURITY & BUSINESS RULE:
 * This webhook endpoint is the authoritative service that verifies Stripe signatures
 * and is the primary mechanism permitted to transition an order status from 'pending' to 'paid'.
 * Never trust untrusted client notifications.
 */
router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    console.error("[Stripe Webhook] Missing stripe-signature header.");
    return res.status(400).send("Missing stripe-signature header");
  }

  let event;

  try {
    const stripe = getStripe();

    if (webhookSecret) {
      // Verify signature using the raw payload buffer
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      console.warn(
        "⚠️ [Stripe Webhook] STRIPE_WEBHOOK_SECRET is not set in environment. " +
          "Parsing event body insecurely for development/test purposes. " +
          "Set STRIPE_WEBHOOK_SECRET in production!"
      );
      // Fallback for development if secret not yet supplied by user
      event = JSON.parse(req.body.toString("utf8"));
    }
  } catch (err) {
    console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log(`\n💳 [Stripe Webhook] Received checkout.session.completed event: ${session.id}`);

    // Retrieve orderId from metadata or client_reference_id
    const orderId =
      session.metadata?.orderId || session.client_reference_id;

    if (!orderId) {
      console.error("[Stripe Webhook] No order ID found in session metadata or client_reference_id.");
      return res.status(400).json({ error: "No order ID associated with session." });
    }

    try {
      const paymentIntentId = session.payment_intent || null;
      const customerEmail =
        session.customer_details?.email || session.customer_email || null;
      const shippingAddress = JSON.stringify(
        session.shipping_details || session.customer_details || {}
      );

      // Transition order status to 'paid' in the PostgreSQL database
      const updateRes = await query(
        `UPDATE orders
         SET status = 'paid',
             stripe_payment_intent_id = $1,
             customer_email = COALESCE($2, customer_email),
             shipping_address = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING id, total_amount, status, customer_email`,
        [paymentIntentId, customerEmail, shippingAddress, parseInt(orderId, 10)]
      );

      if (updateRes.rows.length === 0) {
        console.warn(`[Stripe Webhook] Order #${orderId} was not found in database.`);
      } else {
        const updatedOrder = updateRes.rows[0];
        console.log(
          `✅ [Stripe Webhook] SUCCESS: Order #${updatedOrder.id} marked as PAID ($${updatedOrder.total_amount}).`
        );
      }
    } catch (dbErr) {
      console.error(`[Stripe Webhook] Database update error for order #${orderId}:`, dbErr);
      return res.status(500).json({ error: "Failed to update order status." });
    }
  } else {
    console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event to Stripe
  res.json({ received: true });
});

export default router;
