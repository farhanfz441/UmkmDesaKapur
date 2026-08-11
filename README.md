# Peta UMKM Desa Kapur

Website pemetaan lokasi UMKM (tempat makan, fotocopy, laundry, bengkel, toko kelontong, salon/barbershop, dan kategori lain) di **Desa Kapur, Kecamatan Sungai Raya, Kabupaten Kubu Raya, Kalimantan Barat**.

- **Pengunjung umum**: bisa langsung melihat peta, mencari, dan memfilter UMKM **tanpa perlu login**.
- **Admin**: wajib login untuk menambah, mengedit, atau menghapus data UMKM.

## Struktur Folder

```
umkm-map/
├── backend/      → REST API (Node.js + Express + JSON storage)
└── frontend/     → Antarmuka web (React + Vite + Tailwind + Leaflet)
```

## Teknologi yang Digunakan

| Bagian    | Teknologi                                                   |
|-----------|--------------------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router, Leaflet (peta)   |
| Backend   | Node.js, Express, penyimpanan data JSON (file-based, tanpa native addon) |
| Autentikasi | JWT (JSON Web Token) + bcryptjs untuk hash password         |

**Kenapa stack ini?** Node.js dipilih di kedua sisi (frontend & backend) agar satu bahasa pemrograman (JavaScript) dipakai menyeluruh — memudahkan pengembangan dan integrasi. Penyimpanan data memakai file JSON murni (bukan SQLite/`better-sqlite3`) secara sengaja: `better-sqlite3` butuh compiler C++ (Visual Studio Build Tools) untuk terinstal di Windows, yang sering tidak tersedia di laptop mahasiswa. Dengan JSON, `npm install` dijamin lancar di Windows/Mac/Linux manapun tanpa perlu tool tambahan. Cocok untuk skala data desa/KKN; bisa dimigrasikan ke PostgreSQL/MySQL nanti bila datanya sudah sangat besar.

## Cara Menjalankan (Development)

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed      # membuat kategori, akun admin, dan contoh data UMKM
npm run dev        # server berjalan di http://localhost:5000
```

**Akun admin default** (ganti password setelah login pertama):
- Username: `admin`
- Password: `admin123`

> Password ini diatur lewat `ADMIN_USERNAME` dan `ADMIN_PASSWORD` di file `.env` — ubah nilainya **sebelum** menjalankan `npm run seed` jika ingin kredensial yang berbeda.

### 2. Frontend

Buka terminal baru:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev        # buka http://localhost:5173
```

## Alur Penggunaan

1. **Pengunjung** membuka `http://localhost:5173` → melihat **halaman depan portal desa** (profil, layanan, akses cepat kategori UMKM, sambutan kepala desa).
2. Klik "Buka Peta UMKM" atau salah satu ikon kategori → diarahkan ke `/peta`, peta interaktif dengan pencarian & filter (tanpa perlu login).
3. **Admin** klik "Login Admin" di header/footer → diarahkan ke `/admin/login`.
4. Setelah login, admin masuk ke Dashboard (`/admin`) untuk **Tambah / Edit / Hapus** data UMKM lewat tabel dan form.
5. Semua perubahan otomatis muncul di peta publik dan di grid akses cepat halaman depan.

> **Catatan:** Bagian "Sambutan Kepala Desa" di halaman depan sengaja diisi teks generik (tanpa nama/foto asli) karena tidak ada data resmi tersebut — silakan ganti di `frontend/src/components/landing/LeaderSection.jsx` dengan nama, foto, dan kutipan yang sebenarnya. Nomor telepon, email, dan alamat kontak di header/footer juga masih placeholder dan perlu disesuaikan.

## Keamanan Login Admin

- Password admin di-hash dengan **bcrypt** (tidak pernah disimpan dalam bentuk teks biasa).
- Setelah login, backend mengeluarkan **JSON Web Token (JWT)** yang berlaku 8 jam (bisa diubah lewat `JWT_EXPIRES_IN` di `.env`).
- Endpoint tambah/edit/hapus data (`POST`, `PUT`, `DELETE` di `/api/umkm` dan `/api/kategori`) diproteksi middleware JWT — request tanpa token yang valid akan ditolak (401).
- Endpoint baca data (`GET /api/umkm`, `GET /api/kategori`) tetap terbuka untuk publik.

## Endpoint API Utama

| Method | Endpoint              | Akses   | Keterangan                              |
|--------|------------------------|---------|-------------------------------------------|
| GET    | `/api/health`          | Publik  | Cek status server                          |
| GET    | `/api/umkm`            | Publik  | Daftar UMKM (bisa difilter `kategori_id`, `search`, `lat`, `lng`, `radius`) |
| GET    | `/api/umkm/:id`        | Publik  | Detail satu UMKM                           |
| POST   | `/api/umkm`            | Admin   | Tambah UMKM baru                           |
| PUT    | `/api/umkm/:id`        | Admin   | Edit UMKM                                  |
| DELETE | `/api/umkm/:id`        | Admin   | Hapus UMKM                                 |
| GET    | `/api/kategori`        | Publik  | Daftar kategori UMKM                       |
| POST   | `/api/kategori`        | Admin   | Tambah kategori baru                       |
| POST   | `/api/auth/login`      | Publik  | Login admin, mengembalikan token JWT       |
| GET    | `/api/auth/me`         | Admin   | Cek data admin yang sedang login           |

## Menambahkan Data UMKM Baru (Tips Koordinat)

Untuk mendapatkan koordinat latitude & longitude lokasi UMKM:
1. Buka Google Maps, cari lokasinya.
2. Klik kanan pada titik lokasi → koordinat akan muncul di bagian atas menu (contoh: `-0.0745, 109.3855`).
3. Salin nilai tersebut ke kolom **Latitude** (angka pertama) dan **Longitude** (angka kedua) di form tambah UMKM.

## Deployment (Produksi)

- **Backend**: bisa di-deploy ke Railway, Render, atau VPS biasa. Pastikan folder `data/` (berisi `db.json`) memiliki storage yang persisten antar deploy.
- **Frontend**: build dengan `npm run build` di folder `frontend`, lalu deploy folder `dist/` ke Vercel, Netlify, atau hosting statis lain.
- Ubah `VITE_API_BASE_URL` di `frontend/.env` agar mengarah ke URL backend produksi.
- Ubah `CORS_ORIGIN` di `backend/.env` agar mengarah ke domain frontend produksi.
- **Wajib** ganti `JWT_SECRET` dan password admin default sebelum digunakan secara publik.

## Catatan

Data contoh (seed) sudah menggunakan lokasi nyata di sekitar **Desa Kapur, Kec. Sungai Raya, Kab. Kubu Raya** sebagai titik acuan. Silakan sesuaikan/tambahkan data sesuai UMKM yang sebenarnya di lapangan melalui Dashboard Admin.
