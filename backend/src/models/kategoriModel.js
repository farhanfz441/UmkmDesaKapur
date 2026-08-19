const { query } = require('../config/db');

const KategoriModel = {
  async findAll() {
    const { rows } = await query('SELECT * FROM kategori ORDER BY nama ASC');
    return rows;
  },

  async findById(id) {
    const { rows } = await query('SELECT * FROM kategori WHERE id = $1', [Number(id)]);
    return rows[0] || null;
  },

  async findByNama(nama) {
    const { rows } = await query('SELECT * FROM kategori WHERE nama = $1', [nama]);
    return rows[0] || null;
  },

  async create({ nama, ikon, warna }) {
    try {
      const { rows } = await query(
        'INSERT INTO kategori (nama, ikon, warna) VALUES ($1, $2, $3) RETURNING *',
        [nama, ikon || 'store', warna || '#7c6dff']
      );
      return rows[0];
    } catch (err) {
      if (err.code === '23505') {
        throw new Error('UNIQUE constraint failed: kategori.nama');
      }
      throw err;
    }
  },

  async update(id, { nama, ikon, warna }) {
    const existing = await this.findById(id);
    if (!existing) return null;
    try {
      const { rows } = await query(
        'UPDATE kategori SET nama = $1, ikon = $2, warna = $3 WHERE id = $4 RETURNING *',
        [nama || existing.nama, ikon || existing.ikon, warna || existing.warna, Number(id)]
      );
      return rows[0];
    } catch (err) {
      if (err.code === '23505') {
        throw new Error('UNIQUE constraint failed: kategori.nama');
      }
      throw err;
    }
  },

  async remove(id) {
    const { rows: umkmRows } = await query('SELECT id FROM umkm WHERE kategori_id = $1 LIMIT 1', [Number(id)]);
    if (umkmRows.length > 0) {
      throw new Error('Kategori masih memiliki UMKM');
    }
    const { rowCount } = await query('DELETE FROM kategori WHERE id = $1', [Number(id)]);
    return rowCount > 0;
  },
};

module.exports = KategoriModel;
