import express from "express";
import Stripe from "stripe";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Authoritative Fine-Art Print Pricing Models (Server-Side Source of Truth)
const PRODUCT_TYPES = {
  framed_canvas: { label: "FRAMED CANVAS", multiplier: 1.25 },
  framed_print: { label: "FRAMED PRINT", multiplier: 1.0 },
  canvas: { label: "CANVAS", multiplier: 0.9 },
};

const SIZES = {
  small: { label: "Small 30 × 40 cm", basePrice: 45 },
  medium: { label: "Medium 45 × 60 cm", basePrice: 75 },
  med_large: { label: "Medium Large 60 × 80 cm", basePrice: 110 },
  large: { label: "Large 75 × 100 cm", basePrice: 150 },
  xlarge: { label: "Extra Large 90 × 120 cm", basePrice: 185 },
};

// Helper to initialize Stripe safely
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured in server environment variables. Please add your Stripe Test Secret Key."
    );
  }
  return new Stripe(secretKey);
};

/**
 * POST /api/checkout/create-session
 * Blocks unauthenticated users, validates real database prices,
 * creates pending order & order_items, and starts Stripe Checkout Session.
 */
router.post("/create-session", requireAuth, async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty. Please add items to checkout." });
  }

  try {
    const stripe = getStripe();
    const verifiedItems = [];
    let totalOrderAmount = 0;

    // 1. Validate real products and compute prices server-side (Never trust client prices)
    for (const item of items) {
      const photoId = parseInt(item.photoId, 10);
      if (isNaN(photoId)) {
        return res.status(400).json({ error: "Invalid photograph ID provided." });
      }

      // Look up real photograph in database
      const photoRes = await query(
        "SELECT id, title, image, category FROM photos WHERE id = $1",
        [photoId]
      );

      if (photoRes.rows.length === 0) {
        return res.status(404).json({ error: `Photograph with ID ${photoId} not found in catalog.` });
      }

      const photo = photoRes.rows[0];
      const pType = PRODUCT_TYPES[item.productTypeId] || PRODUCT_TYPES.framed_canvas;
      const pSize = SIZES[item.sizeId] || SIZES.small;
      const unitPrice = Math.round(pSize.basePrice * pType.multiplier);
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const subtotal = unitPrice * quantity;

      totalOrderAmount += subtotal;

      verifiedItems.push({
        photoId: photo.id,
        title: photo.title,
        image: photo.image,
        productType: pType.label,
        size: pSize.label,
        unitPrice,
        quantity,
        subtotal,
      });
    }

    // 2. Insert order record into database with 'pending' status
    const orderRes = await query(
      `INSERT INTO orders (user_id, total_amount, currency, status, customer_email)
       VALUES ($1, $2, 'usd', 'pending', $3)
       RETURNING id, total_amount, status, created_at`,
      [req.user.id, totalOrderAmount, req.user.email]
    );

    const order = orderRes.rows[0];

    // 3. Insert itemized lines into order_items table
    for (const lineItem of verifiedItems) {
      await query(
        `INSERT INTO order_items (order_id, photo_id, title, product_type, size, unit_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          order.id,
          lineItem.photoId,
          lineItem.title,
          lineItem.productType,
          lineItem.size,
          lineItem.unitPrice,
          lineItem.quantity,
          lineItem.subtotal,
        ]
      );
    }

    // 4. Create Stripe Checkout Session
    const frontendUrl =
      process.env.FRONTEND_URL || "https://pics-era.vercel.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      client_reference_id: order.id.toString(),
      metadata: {
        orderId: order.id.toString(),
        userId: req.user.id.toString(),
      },
      line_items: verifiedItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.title} (${item.productType} - ${item.size})`,
            images: item.image && item.image.startsWith("http") ? [item.image] : [],
            metadata: {
              photoId: item.photoId.toString(),
            },
          },
          unit_amount: Math.round(item.unitPrice * 100), // in cents
        },
        quantity: item.quantity,
      })),
      success_url: `${frontendUrl}/?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${frontendUrl}?checkout=cancelled`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AE", "AU", "DE", "FR", "IN"],
      },
    });

    // 5. Update order with Stripe session ID
    await query(
      "UPDATE orders SET stripe_session_id = $1 WHERE id = $2",
      [session.id, order.id]
    );

    res.json({
      success: true,
      orderId: order.id,
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (err) {
    console.error("Checkout session creation error:", err);
    res.status(500).json({
      error: err.message || "Failed to create checkout session. Please try again.",
    });
  }
});

/**
 * GET /api/checkout/order/:id
 * Looks up order details and item breakdown for the success confirmation page
 */
router.get("/order/:id", requireAuth, async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  if (isNaN(orderId)) {
    return res.status(400).json({ error: "Invalid order ID." });
  }

  try {
    const orderRes = await query(
      `SELECT o.*, 
         COALESCE(
           json_agg(
             json_build_object(
               'id', oi.id,
               'photoId', oi.photo_id,
               'title', oi.title,
               'productType', oi.product_type,
               'size', oi.size,
               'unitPrice', oi.unit_price,
               'quantity', oi.quantity,
               'subtotal', oi.subtotal,
               'image', p.image
             )
           ) FILTER (WHERE oi.id IS NOT NULL), '[]'
         ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN photos p ON p.id = oi.photo_id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [orderId, req.user.id]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    const order = orderRes.rows[0];

    // Double check with Stripe if order is still pending
    if (order.status === "pending" && order.stripe_session_id && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
        if (session.payment_status === "paid") {
          await query(
            `UPDATE orders 
             SET status = 'paid', 
                 stripe_payment_intent_id = $1,
                 customer_email = COALESCE($2, customer_email),
                 shipping_address = $3,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4`,
            [
              session.payment_intent,
              session.customer_details?.email,
              JSON.stringify(session.shipping_details || session.customer_details),
              order.id,
            ]
          );
          order.status = "paid";
          order.stripe_payment_intent_id = session.payment_intent;
        }
      } catch (stripeErr) {
        console.warn("Stripe status verify fallback warning:", stripeErr.message);
      }
    }

    res.json({ order });
  } catch (err) {
    console.error("Order lookup error:", err);
    res.status(500).json({ error: "Failed to retrieve order." });
  }
});

/**
 * GET /api/checkout/verify-session/:sessionId
 * Helper to look up order by Stripe session ID directly
 */
router.get("/verify-session/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const orderRes = await query(
      `SELECT o.*, 
         COALESCE(
           json_agg(
             json_build_object(
               'id', oi.id,
               'photoId', oi.photo_id,
               'title', oi.title,
               'productType', oi.product_type,
               'size', oi.size,
               'unitPrice', oi.unit_price,
               'quantity', oi.quantity,
               'subtotal', oi.subtotal,
               'image', p.image
             )
           ) FILTER (WHERE oi.id IS NOT NULL), '[]'
         ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN photos p ON p.id = oi.photo_id
       WHERE o.stripe_session_id = $1
       GROUP BY o.id`,
      [sessionId]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found for session." });
    }

    const order = orderRes.rows[0];

    // If pending, check Stripe directly
    if (order.status === "pending" && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
          await query(
            `UPDATE orders 
             SET status = 'paid', 
                 stripe_payment_intent_id = $1,
                 customer_email = COALESCE($2, customer_email),
                 shipping_address = $3,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4`,
            [
              session.payment_intent,
              session.customer_details?.email,
              JSON.stringify(session.shipping_details || session.customer_details),
              order.id,
            ]
          );
          order.status = "paid";
          order.stripe_payment_intent_id = session.payment_intent;
        }
      } catch (stripeErr) {
        console.warn("Stripe status verify fallback warning:", stripeErr.message);
      }
    }

    res.json({ order });
  } catch (err) {
    console.error("Session lookup error:", err);
    res.status(500).json({ error: "Failed to verify session." });
  }
});

export default router;
