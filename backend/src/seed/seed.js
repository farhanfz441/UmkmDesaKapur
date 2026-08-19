const bcrypt = require('bcryptjs');
require('dotenv').config();
const AdminModel = require('../models/adminModel');
const KategoriModel = require('../models/kategoriModel');
const UmkmModel = require('../models/umkmModel');

async function main() {
  console.log('→ Menjalankan seeding data...');

  // Seeding akun admin (hanya sekali, tidak menimpa jika sudah ada)
  const adminCount = await AdminModel.count();
  if (adminCount === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = bcrypt.hashSync(password, 10);
    await AdminModel.create({ username, password_hash: passwordHash });
    console.log(`✓ Akun admin dibuat -> username: "${username}", password: "${password}"`);
    console.log('  (Segera ganti password ini setelah login pertama kali!)');
  } else {
    console.log('→ Akun admin sudah ada, seeding admin dilewati.');
  }

  const kategoriData = [
    { nama: 'Kuliner', ikon: 'utensils', warna: '#F59E0B' },
    { nama: 'Fashion', ikon: 'shirt', warna: '#8B5CF6' },
    { nama: 'Kerajinan', ikon: 'scissors', warna: '#EC4899' },
    { nama: 'Minuman', ikon: 'coffee', warna: '#10B981' },
    { nama: 'Jasa', ikon: 'wrench', warna: '#0EA5E9' },
    { nama: 'Lainnya', ikon: 'store', warna: '#059669' },
  ];

  for (const row of kategoriData) {
    const existing = await KategoriModel.findByNama(row.nama);
    if (!existing) {
      await KategoriModel.create(row);
    }
  }

  const getKategoriId = async (nama) => (await KategoriModel.findByNama(nama)).id;

  // Koordinat contoh di wilayah Desa Kapur, Kecamatan Sungai Raya, Kabupaten Kubu Raya, Kalbar
  const umkmData = [
    {
      nama: 'Warung Makan Bu Siti',
      kategori_id: await getKategoriId('Kuliner'),
      deskripsi: 'Menyediakan masakan rumahan khas Kalbar, sayur pakis dan ikan asam pedas.',
      alamat: 'Jl. Desa Kapur Gg. Prona, Desa Kapur, Kec. Sungai Raya, Kubu Raya',
      latitude: -0.07301,
      longitude: 109.38464,
      kontak: '0812-5678-1234',
      jam_buka: '07:00',
      jam_tutup: '20:00',
      status: 'aktif',
    },
    {
      nama: 'Rumah Jahit Raya',
      kategori_id: await getKategoriId('Fashion'),
      deskripsi: 'Menjahit pakaian custom dan menyediakan busana siap pakai.',
      alamat: 'Jl. Gg. Paremba, Desa Kapur, Kec. Sungai Raya, Kubu Raya',
      latitude: -0.06987,
      longitude: 109.38812,
      kontak: '0813-4567-8901',
      jam_buka: '08:00',
      jam_tutup: '21:00',
      status: 'aktif',
    },
    {
      nama: 'Kerajinan Rotan Borneo',
      kategori_id: await getKategoriId('Kerajinan'),
      deskripsi: 'Kerajinan anyaman rotan khas Kalbar, kursi, meja, dan dekorasi rumah.',
      alamat: 'Dusun Parit Bugis, Desa Kapur, Kec. Sungai Raya, Kubu Raya',
      latitude: -0.07689,
      longitude: 109.38103,
      kontak: '0857-1234-5678',
      jam_buka: '08:00',
      jam_tutup: '19:00',
      status: 'aktif',
    },
    {
      nama: 'Bengkel Motor Jaya',
      kategori_id: await getKategoriId('Jasa'),
      deskripsi: 'Servis motor, ganti oli, dan penjualan sparepart.',
      alamat: 'Jl. Komplek Kota Raya, Desa Kapur, Kec. Sungai Raya, Kubu Raya',
      latitude: -0.08145,
      longitude: 109.37892,
      kontak: '0821-9876-5432',
      jam_buka: '08:00',
      jam_tutup: '17:00',
      status: 'aktif',
    },
    {
      nama: 'Toko Kelontong Berkah',
      kategori_id: await getKategoriId('Lainnya'),
      deskripsi: 'Menjual sembako dan kebutuhan sehari-hari warga Desa Kapur.',
      alamat: 'Jl. Komplek Arini Resident RT.018 RW.008, Desa Kapur, Kubu Raya',
      latitude: -0.06542,
      longitude: 109.39034,
      kontak: '0852-3456-7890',
      jam_buka: '06:00',
      jam_tutup: '21:00',
      status: 'aktif',
    },
    {
      nama: 'Es Kopi Kapur',
      kategori_id: await getKategoriId('Minuman'),
      deskripsi: 'Es kopi susu kekinian dan aneka minuman segar khas Kalbar.',
      alamat: 'Jl. Desa Kapur, Kp. Bunut Jaya, Kubu Raya',
      latitude: -0.07823,
      longitude: 109.38967,
      kontak: '0838-2345-6789',
      jam_buka: '09:00',
      jam_tutup: '20:00',
      status: 'aktif',
    },
    {
      nama: 'Warung Kopi Kapur Jaya',
      kategori_id: await getKategoriId('Kuliner'),
      deskripsi: 'Kopi khas Kalbar, gorengan, dan tempat nongkrong warga sekitar.',
      alamat: 'Dusun Bunut Jaya, Desa Kapur, Kec. Sungai Raya, Kubu Raya',
      latitude: -0.07012,
      longitude: 109.38345,
      kontak: '0813-9988-7766',
      jam_buka: '06:30',
      jam_tutup: '22:00',
      status: 'aktif',
    },
    {
      nama: 'Koperasi Merah Putih Desa Kapur',
      kategori_id: await getKategoriId('Lainnya'),
      deskripsi: 'Koperasi Desa Merah Putih menyediakan sembako dan simpan pinjam untuk warga.',
      alamat: 'Gedung Koperasi Desa Merah Putih, Desa Kapur, Kec. Sungai Raya, Kubu Raya',
      latitude: -0.07421,
      longitude: 109.38578,
      kontak: '0812-3344-5566',
      jam_buka: '08:00',
      jam_tutup: '16:00',
      status: 'aktif',
    },
  ];

  const existing = await UmkmModel.findAll();
  if (existing.length === 0) {
    for (const row of umkmData) {
      await UmkmModel.create(row);
    }
    console.log(`✓ Berhasil menambahkan ${umkmData.length} data UMKM contoh.`);
  } else {
    console.log('→ Data UMKM sudah ada, seeding data UMKM dilewati.');
  }

  console.log('✓ Seeding kategori selesai.');
  console.log('✓ Proses seeding selesai.');
  process.exit(0);
}

main().catch((err) => {
  console.error('✗ Seeding gagal:', err);
  process.exit(1);
});
