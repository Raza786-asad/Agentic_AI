/**
 * Database migration runner
 * Reads schema.sql and executes it against the connected PostgreSQL database
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(sql);
    console.log('  ✅ Database schema migrated / verified successfully.');
  } catch (err) {
    console.error('  ❌ Migration error:', err.message);
    // Don't crash server — schema might already be applied
  }
}
