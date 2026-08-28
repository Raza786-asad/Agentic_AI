/**
 * PostgreSQL Connection Pool
 * Uses DATABASE_URL (Neon serverless) or individual PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE vars
 */
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

let pool;

if (process.env.DATABASE_URL) {
  // Neon serverless / Supabase / any PostgreSQL cloud with a connection string
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  // Local PostgreSQL
  pool = new Pool({
    host:     process.env.PGHOST     || 'localhost',
    port:     parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'roadnex',
    user:     process.env.PGUSER     || 'postgres',
    password: process.env.PGPASSWORD || '',
  });
}

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
});

export default pool;
