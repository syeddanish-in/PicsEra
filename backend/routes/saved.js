import express from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/saved - Retrieve all saved photos for the authenticated user
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, s.created_at AS saved_at
       FROM photos p
       INNER JOIN saved_photos s ON p.id = s.photo_id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );

    const savedPhotoIds = result.rows.map((row) => row.id);

    return res.json({
      savedPhotoIds,
      savedPhotos: result.rows,
    });
  } catch (err) {
    console.error("Fetch saved photos error:", err);
    return res.status(500).json({ error: "Failed to load saved collection." });
  }
});

// POST /api/saved/toggle - Save or unsave a photo for the authenticated user
router.post("/toggle", requireAuth, async (req, res) => {
  try {
    const { photoId } = req.body;
    const cleanPhotoId = parseInt(photoId, 10);

    if (!cleanPhotoId || isNaN(cleanPhotoId)) {
      return res.status(400).json({ error: "Valid photoId is required." });
    }

    // Check if photo exists
    const photoExists = await query("SELECT id FROM photos WHERE id = $1", [cleanPhotoId]);
    if (photoExists.rows.length === 0) {
      return res.status(404).json({ error: "Photograph does not exist." });
    }

    // Check if already saved
    const existing = await query(
      "SELECT 1 FROM saved_photos WHERE user_id = $1 AND photo_id = $2",
      [req.user.id, cleanPhotoId]
    );

    if (existing.rows.length > 0) {
      // Unsave
      await query(
        "DELETE FROM saved_photos WHERE user_id = $1 AND photo_id = $2",
        [req.user.id, cleanPhotoId]
      );
      return res.json({ saved: false, photoId: cleanPhotoId, message: "Removed from saved collection" });
    } else {
      // Save
      await query(
        "INSERT INTO saved_photos (user_id, photo_id) VALUES ($1, $2)",
        [req.user.id, cleanPhotoId]
      );
      return res.json({ saved: true, photoId: cleanPhotoId, message: "Added to saved collection" });
    }
  } catch (err) {
    console.error("Toggle save error:", err);
    return res.status(500).json({ error: "Failed to toggle saved photo." });
  }
});

export default router;
