-- Jalankan script ini di Supabase: Dashboard -> SQL Editor -> New Query -> paste -> Run

CREATE TABLE IF NOT EXISTS kategori (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  ikon TEXT DEFAULT 'store',
  warna TEXT DEFAULT '#7c6dff'
);

CREATE TABLE IF NOT EXISTS umkm (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  kategori_id INTEGER NOT NULL REFERENCES kategori(id) ON DELETE RESTRICT,
  deskripsi TEXT,
  alamat TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  kontak TEXT,
  jam_buka TEXT,
  jam_tutup TEXT,
  foto_url TEXT,
  status TEXT NOT NULL DEFAULT 'aktif',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_umkm_kategori_id ON umkm(kategori_id);
CREATE INDEX IF NOT EXISTS idx_umkm_status ON umkm(status);
