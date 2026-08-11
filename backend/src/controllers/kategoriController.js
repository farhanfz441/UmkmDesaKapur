const KategoriModel = require('../models/kategoriModel');

const KategoriController = {
  getAll(req, res, next) {
    try {
      const data = KategoriModel.findAll();
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  },

  create(req, res, next) {
    try {
      const { nama, ikon, warna } = req.body;
      if (!nama) {
        return res.status(422).json({ success: false, message: 'Nama kategori wajib diisi' });
      }
      const created = KategoriModel.create({ nama, ikon, warna });
      res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan', data: created });
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ success: false, message: 'Kategori sudah ada' });
      }
      next(err);
    }
  },

  update(req, res, next) {
    try {
      const { nama, ikon, warna } = req.body;
      const updated = KategoriModel.update(req.params.id, { nama, ikon, warna });
      if (!updated) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
      res.json({ success: true, message: 'Kategori berhasil diperbarui', data: updated });
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ success: false, message: 'Nama kategori sudah digunakan' });
      }
      next(err);
    }
  },

  remove(req, res, next) {
    try {
      const deleted = KategoriModel.remove(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
      res.json({ success: true, message: 'Kategori berhasil dihapus' });
    } catch (err) {
      if (err.message.includes('masih memiliki UMKM')) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next(err);
    }
  },
};

module.exports = KategoriController;
