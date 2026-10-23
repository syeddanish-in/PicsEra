import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET || "picsera_fallback_secret",
    { expiresIn: "7d" }
  );
};

// POST /api/auth/signup - Register a new user
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    // Mandatory fields validation
    if (!cleanName) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return res.status(400).json({ error: "A valid email is required." });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    // Check for existing user
    const existing = await query("SELECT id FROM users WHERE email = $1", [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into PostgreSQL
    const insertResult = await query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [cleanName, cleanEmail, hashedPassword]
    );

    const user = insertResult.rows[0];

    // Do NOT auto-sign in. User must explicitly log in after sign up.
    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error during registration. Please try again." });
  }
});

// POST /api/auth/login - Sign in existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = (email || "").trim().toLowerCase();

    // Mandatory fields validation
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return res.status(400).json({ error: "A valid email is required." });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    // Find user in PostgreSQL
    const result = await query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [cleanEmail]
    );

    // Unknown user - Return specific error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const user = result.rows[0];

    // Verify password hash
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    const token = generateToken(user);

    return res.json({
      message: "Signed in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during sign in. Please try again." });
  }
});

// GET /api/auth/me - Verify session & retrieve current user info (survives page refresh)
router.get("/me", requireAuth, async (req, res) => {
  try {
    const result = await query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const user = result.rows[0];
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      },
    });
  } catch (err) {
    console.error("Auth /me error:", err);
    return res.status(500).json({ error: "Failed to verify session." });
  }
});

export default router;
