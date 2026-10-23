import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection configuration
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString && !connectionString.includes("localhost")
    ? { rejectUnauthorized: false }
    : false,
});

// Helper function to run SQL queries
export const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === "development") {
    console.log(`[SQL] executed query (${duration}ms):`, text.slice(0, 80));
  }
  return res;
};

// Automatically run schema.sql to initialize tables if they don't exist
export const initDb = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  DATABASE_URL is not set in backend/.env. Skipping database initialization.");
    return false;
  }

  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    await pool.query(schemaSql);
    console.log("✓ Database tables verified and initialized successfully.");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize database tables:", error.message);
    throw error;
  }
};
