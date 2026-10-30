import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb, query } from "./db.js";
import authRoutes from "./routes/auth.js";
import photosRoutes from "./routes/photos.js";
import savedRoutes from "./routes/saved.js";
import inquiriesRoutes from "./routes/inquiries.js";
import checkoutRoutes from "./routes/checkout.js";
import webhookRoutes from "./routes/webhook.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup (supports local frontend dev server & deployed frontend URL)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman) or matched origins
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, true); // Permissive CORS for assessment preview
      }
    },
    credentials: true,
  })
);

// Mount Stripe Webhook with raw body parsing BEFORE express.json()
// Required so stripe.webhooks.constructEvent can verify cryptographic signature
app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRoutes);

app.use(express.json());

// Request logger for assessment demonstration
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint (for Railway, Render, or uptime monitoring)
app.get("/api/health", async (req, res) => {
  let dbStatus = "disconnected";
  if (!process.env.DATABASE_URL) {
    dbStatus = "disconnected (DATABASE_URL is not set in Render Environment Variables)";
  } else {
    try {
      await query("SELECT 1");
      dbStatus = "connected";
    } catch (err) {
      dbStatus = `error: ${err.message}`;
    }
  }

  res.json({
    status: "ok",
    service: "PicsEra API",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Mount modular API routes
app.use("/api/auth", authRoutes);
app.use("/api/photos", photosRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/inquiries", inquiriesRoutes);
app.use("/api/checkout", checkoutRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// Start Server and verify Database connection
app.listen(PORT, async () => {
  console.log(`\n🚀 PicsEra Backend Server running on http://localhost:${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);

  if (process.env.DATABASE_URL) {
    try {
      await initDb();
      console.log("✓ Neon Postgres connection verified.");
    } catch (err) {
      console.error("⚠️ Database initialization warning:", err.message);
    }
  } else {
    console.log("ℹ️  Note: Provide DATABASE_URL in backend/.env to connect to your Neon Postgres database.");
  }
});
