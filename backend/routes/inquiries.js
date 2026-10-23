import express from "express";
import { query } from "../db.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/inquiries - Submit a new photography shoot inquiry
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { name, email, type, budget, message } = req.body;

    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanName || !cleanEmail || !cleanEmail.includes("@")) {
      return res.status(400).json({ error: "Name and a valid Email are required." });
    }
    if (!type || !budget) {
      return res.status(400).json({ error: "Photography type and budget selection are required." });
    }

    const userId = req.user?.id || null;

    const result = await query(
      `INSERT INTO inquiries (user_id, name, email, type, budget, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, type, budget, message, created_at`,
      [userId, cleanName, cleanEmail, type, budget, message || ""]
    );

    return res.status(201).json({
      message: "Thank you! Your shoot inquiry has been received.",
      inquiry: result.rows[0],
    });
  } catch (err) {
    console.error("Submit inquiry error:", err);
    return res.status(500).json({ error: "Failed to submit booking inquiry." });
  }
});

export default router;
