const { readDb, writeDb, nextId } = require('../config/jsonDb');

const KategoriModel = {
  findAll() {
    const db = readDb();
    return [...db.kategori].sort((a, b) => a.nama.localeCompare(b.nama));
  },

  findById(id) {
    const db = readDb();
    return db.kategori.find((k) => k.id === Number(id)) || null;
  },

  findByNama(nama) {
    const db = readDb();
    return db.kategori.find((k) => k.nama === nama) || null;
  },

  create({ nama, ikon, warna }) {
    const db = readDb();
    if (db.kategori.some((k) => k.nama === nama)) {
      throw new Error('UNIQUE constraint failed: kategori.nama');
    }
    const item = {
      id: nextId(db, 'kategori'),
      nama,
      ikon: ikon || 'store',
      warna: warna || '#7c6dff',
    };
    db.kategori.push(item);
    writeDb(db);
    return item;
  },

  update(id, { nama, ikon, warna }) {
    const db = readDb();
    const idx = db.kategori.findIndex((k) => k.id === Number(id));
    if (idx === -1) return null;
    if (nama && db.kategori.some((k) => k.nama === nama && k.id !== Number(id))) {
      throw new Error('UNIQUE constraint failed: kategori.nama');
    }
    const existing = db.kategori[idx];
    db.kategori[idx] = { ...existing, nama: nama || existing.nama, ikon: ikon || existing.ikon, warna: warna || existing.warna };
    writeDb(db);
    return db.kategori[idx];
  },

  remove(id) {
    const db = readDb();
    const idx = db.kategori.findIndex((k) => k.id === Number(id));
    if (idx === -1) return false;
    if (db.umkm.some((u) => u.kategori_id === Number(id))) {
      throw new Error('Kategori masih memiliki UMKM');
    }
    db.kategori.splice(idx, 1);
    writeDb(db);
    return true;
  },
};

module.exports = KategoriModel;
