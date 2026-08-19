const { Pool } = require('pg');

// DATABASE_URL didapat dari Supabase: Project Settings -> Database -> Connection string (URI)
// Gunakan mode "Transaction" / connection pooler (port 6543) agar cocok dengan lingkungan serverless (Vercel).
if (!process.env.DATABASE_URL) {
  console.warn('⚠ DATABASE_URL belum diset. Backend tidak akan bisa terhubung ke database.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost')
    ? false
    : { rejectUnauthorized: false },
  // Batas kecil karena tiap serverless invocation membuat koneksi sendiri
  max: 1,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
