const { query } = require('../config/db');

function attachKategoriRow(row) {
  return {
    id: row.id,
    nama: row.nama,
    kategori_id: row.kategori_id,
    deskripsi: row.deskripsi,
    alamat: row.alamat,
    latitude: row.latitude,
    longitude: row.longitude,
    kontak: row.kontak,
    jam_buka: row.jam_buka,
    jam_tutup: row.jam_tutup,
    foto_url: row.foto_url,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    kategori_nama: row.kategori_nama,
    kategori_ikon: row.kategori_ikon,
    kategori_warna: row.kategori_warna,
  };
}

const BASE_SELECT = `
  SELECT u.*, k.nama AS kategori_nama, k.ikon AS kategori_ikon, k.warna AS kategori_warna
  FROM umkm u
  LEFT JOIN kategori k ON k.id = u.kategori_id
`;

const UmkmModel = {
  async findAll({ kategori_id, status, search } = {}) {
    const conditions = [];
    const params = [];

    if (kategori_id) {
      params.push(Number(kategori_id));
      conditions.push(`u.kategori_id = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`u.status = $${params.length}`);
    }
    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      const idx = params.length;
      conditions.push(
        `(LOWER(u.nama) LIKE $${idx} OR LOWER(u.alamat) LIKE $${idx} OR LOWER(COALESCE(u.deskripsi, '')) LIKE $${idx})`
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await query(`${BASE_SELECT} ${where} ORDER BY u.nama ASC`, params);
    return rows.map(attachKategoriRow);
  },

  async findById(id) {
    const { rows } = await query(`${BASE_SELECT} WHERE u.id = $1`, [Number(id)]);
    return rows[0] ? attachKategoriRow(rows[0]) : null;
  },

  async create(data) {
    const { rows } = await query(
      `INSERT INTO umkm
        (nama, kategori_id, deskripsi, alamat, latitude, longitude, kontak, jam_buka, jam_tutup, foto_url, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        data.nama,
        Number(data.kategori_id),
        data.deskripsi || null,
        data.alamat,
        Number(data.latitude),
        Number(data.longitude),
        data.kontak || null,
        data.jam_buka || null,
        data.jam_tutup || null,
        data.foto_url || null,
        data.status || 'aktif',
      ]
    );
    return this.findById(rows[0].id);
  },

  async update(id, data) {
    const existing = await query('SELECT * FROM umkm WHERE id = $1', [Number(id)]);
    if (existing.rows.length === 0) return null;
    const current = existing.rows[0];

    const merged = {
      nama: data.nama !== undefined ? data.nama : current.nama,
      kategori_id: data.kategori_id !== undefined ? Number(data.kategori_id) : current.kategori_id,
      deskripsi: data.deskripsi !== undefined ? data.deskripsi : current.deskripsi,
      alamat: data.alamat !== undefined ? data.alamat : current.alamat,
      latitude: data.latitude !== undefined ? Number(data.latitude) : current.latitude,
      longitude: data.longitude !== undefined ? Number(data.longitude) : current.longitude,
      kontak: data.kontak !== undefined ? data.kontak : current.kontak,
      jam_buka: data.jam_buka !== undefined ? data.jam_buka : current.jam_buka,
      jam_tutup: data.jam_tutup !== undefined ? data.jam_tutup : current.jam_tutup,
      foto_url: data.foto_url !== undefined ? data.foto_url : current.foto_url,
      status: data.status !== undefined ? data.status : current.status,
    };

    await query(
      `UPDATE umkm SET
        nama=$1, kategori_id=$2, deskripsi=$3, alamat=$4, latitude=$5, longitude=$6,
        kontak=$7, jam_buka=$8, jam_tutup=$9, foto_url=$10, status=$11, updated_at=NOW()
       WHERE id=$12`,
      [
        merged.nama, merged.kategori_id, merged.deskripsi, merged.alamat, merged.latitude, merged.longitude,
        merged.kontak, merged.jam_buka, merged.jam_tutup, merged.foto_url, merged.status, Number(id),
      ]
    );
    return this.findById(id);
  },

  async remove(id) {
    const { rowCount } = await query('DELETE FROM umkm WHERE id = $1', [Number(id)]);
    return rowCount > 0;
  },
};

module.exports = UmkmModel;
