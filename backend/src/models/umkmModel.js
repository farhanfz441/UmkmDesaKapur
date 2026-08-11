const { readDb, writeDb, nextId } = require('../config/jsonDb');

function nowString() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function attachKategori(item, db) {
  const kat = db.kategori.find((k) => k.id === item.kategori_id);
  return {
    ...item,
    kategori_nama: kat ? kat.nama : null,
    kategori_ikon: kat ? kat.ikon : null,
    kategori_warna: kat ? kat.warna : null,
  };
}

const UmkmModel = {
  findAll({ kategori_id, status, search } = {}) {
    const db = readDb();
    let items = db.umkm;

    if (kategori_id) {
      items = items.filter((u) => u.kategori_id === Number(kategori_id));
    }
    if (status) {
      items = items.filter((u) => u.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (u) =>
          u.nama.toLowerCase().includes(s) ||
          u.alamat.toLowerCase().includes(s) ||
          (u.deskripsi || '').toLowerCase().includes(s)
      );
    }

    return items
      .map((u) => attachKategori(u, db))
      .sort((a, b) => a.nama.localeCompare(b.nama));
  },

  findById(id) {
    const db = readDb();
    const item = db.umkm.find((u) => u.id === Number(id));
    return item ? attachKategori(item, db) : null;
  },

  create(data) {
    const db = readDb();
    const timestamp = nowString();
    const item = {
      id: nextId(db, 'umkm'),
      nama: data.nama,
      kategori_id: Number(data.kategori_id),
      deskripsi: data.deskripsi || null,
      alamat: data.alamat,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      kontak: data.kontak || null,
      jam_buka: data.jam_buka || null,
      jam_tutup: data.jam_tutup || null,
      foto_url: data.foto_url || null,
      status: data.status || 'aktif',
      created_at: timestamp,
      updated_at: timestamp,
    };
    db.umkm.push(item);
    writeDb(db);
    return attachKategori(item, db);
  },

  update(id, data) {
    const db = readDb();
    const idx = db.umkm.findIndex((u) => u.id === Number(id));
    if (idx === -1) return null;

    const existing = db.umkm[idx];
    const merged = {
      ...existing,
      ...data,
      kategori_id: data.kategori_id !== undefined ? Number(data.kategori_id) : existing.kategori_id,
      latitude: data.latitude !== undefined ? Number(data.latitude) : existing.latitude,
      longitude: data.longitude !== undefined ? Number(data.longitude) : existing.longitude,
      updated_at: nowString(),
    };

    db.umkm[idx] = merged;
    writeDb(db);
    return attachKategori(merged, db);
  },

  remove(id) {
    const db = readDb();
    const idx = db.umkm.findIndex((u) => u.id === Number(id));
    if (idx === -1) return false;
    db.umkm.splice(idx, 1);
    writeDb(db);
    return true;
  },
};

module.exports = UmkmModel;
