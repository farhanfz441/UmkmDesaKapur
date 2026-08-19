/**
 * Script migrasi SATU KALI PAKAI: memindahkan data asli dari db.json (JSON storage lama)
 * ke Supabase Postgres. Menjaga ID, timestamp, dan hash password admin apa adanya
 * (tidak reset password, tidak generate ulang data).
 *
 * Cara pakai:
 *   1. Pastikan .env sudah berisi DATABASE_URL yang mengarah ke Supabase.
 *   2. Pastikan schema.sql sudah dijalankan di Supabase (tabel sudah ada).
 *   3. Jalankan: node src/seed/migrate-from-json.js
 *
 * Script ini aman dijalankan ulang: baris yang ID-nya sudah ada akan dilewati (ON CONFLICT DO NOTHING).
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { query, pool } = require('../config/db');

const dbJsonPath = path.join(__dirname, 'original-db-backup.json');

async function main() {
  if (!fs.existsSync(dbJsonPath)) {
    console.error(`✗ File tidak ditemukan: ${dbJsonPath}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));
  const { kategori = [], umkm = [], admin = [] } = raw;

  console.log(`→ Ditemukan di db.json: ${kategori.length} kategori, ${umkm.length} umkm, ${admin.length} admin`);
  console.log('→ Memulai migrasi ke Postgres...\n');

  // 1. Migrasi kategori (harus duluan karena umkm punya foreign key ke kategori)
  let kategoriCount = 0;
  for (const k of kategori) {
    const res = await query(
      `INSERT INTO kategori (id, nama, ikon, warna)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [k.id, k.nama, k.ikon, k.warna]
    );
    if (res.rowCount > 0) kategoriCount++;
  }
  console.log(`✓ Kategori: ${kategoriCount}/${kategori.length} baris dimasukkan`);

  // 2. Migrasi umkm
  let umkmCount = 0;
  for (const u of umkm) {
    const res = await query(
      `INSERT INTO umkm
        (id, nama, kategori_id, deskripsi, alamat, latitude, longitude, kontak, jam_buka, jam_tutup, foto_url, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO NOTHING`,
      [
        u.id, u.nama, u.kategori_id, u.deskripsi, u.alamat, u.latitude, u.longitude,
        u.kontak, u.jam_buka, u.jam_tutup, u.foto_url, u.status, u.created_at, u.updated_at,
      ]
    );
    if (res.rowCount > 0) umkmCount++;
  }
  console.log(`✓ UMKM: ${umkmCount}/${umkm.length} baris dimasukkan`);

  // 3. Migrasi admin (password_hash dipindah apa adanya, tidak di-hash ulang)
  let adminCount = 0;
  for (const a of admin) {
    const res = await query(
      `INSERT INTO admin (id, username, password_hash, created_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [a.id, a.username, a.password_hash, a.created_at]
    );
    if (res.rowCount > 0) adminCount++;
  }
  console.log(`✓ Admin: ${adminCount}/${admin.length} baris dimasukkan`);

  // 4. Sinkronkan sequence auto-increment supaya ID berikutnya tidak bentrok dengan data yang baru dimasukkan
  await query(`SELECT setval('kategori_id_seq', COALESCE((SELECT MAX(id) FROM kategori), 1))`);
  await query(`SELECT setval('umkm_id_seq', COALESCE((SELECT MAX(id) FROM umkm), 1))`);
  await query(`SELECT setval('admin_id_seq', COALESCE((SELECT MAX(id) FROM admin), 1))`);
  console.log('✓ Auto-increment sequence disinkronkan\n');

  console.log('✓ Migrasi selesai. Data asli kamu sudah ada di Supabase.');
  await pool.end();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('✗ Migrasi gagal:', err);
  await pool.end();
  process.exit(1);
});
