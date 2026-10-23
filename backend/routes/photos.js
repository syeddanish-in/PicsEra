import express from "express";
import { query } from "../db.js";

const router = express.Router();

// GET /api/photos - Fetch all photographs (optionally filtered by category)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let sql = "SELECT * FROM photos";
    const params = [];

    if (category && category !== "All") {
      sql += " WHERE category = $1";
      params.push(category);
    }

    sql += " ORDER BY id ASC";

    const result = await query(sql, params);
    return res.json({
      count: result.rows.length,
      photos: result.rows,
    });
  } catch (err) {
    console.error("Fetch photos error:", err);
    return res.status(500).json({ error: "Failed to load photos from database." });
  }
});

// GET /api/photos/:id - Fetch single photograph by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query("SELECT * FROM photos WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Photograph not found." });
    }

    return res.json({ photo: result.rows[0] });
  } catch (err) {
    console.error("Fetch photo by ID error:", err);
    return res.status(500).json({ error: "Failed to retrieve photo." });
  }
});

export default router;
