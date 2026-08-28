import pool from './config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function clearAllData() {
  try {
    console.log('🧹 Clearing complaints, reports, and work_orders in database...');
    await pool.query('TRUNCATE TABLE work_orders CASCADE;');
    await pool.query('TRUNCATE TABLE complaints CASCADE;');
    await pool.query('TRUNCATE TABLE reports CASCADE;');
    await pool.query('TRUNCATE TABLE users CASCADE;');
    console.log('✅ Database tables cleared successfully.');

    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      console.log('🧹 Clearing uploads directory...');
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        if (fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
      console.log('✅ Uploads folder cleared.');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to clear data:', err);
    process.exit(1);
  }
}

clearAllData();
