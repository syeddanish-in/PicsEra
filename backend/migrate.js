import { initDb, query, pool } from "./db.js";

async function runMigration() {
  console.log("Connecting to PostgreSQL and applying schema...");
  try {
    await initDb();
    const res = await query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );
    console.log("✓ Schema applied successfully. Current tables in database:");
    res.rows.forEach((r) => console.log("  - " + r.table_name));
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err.message);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
