const { validationResult } = require('express-validator');
const UmkmModel = require('../models/umkmModel');
const KategoriModel = require('../models/kategoriModel');
const { haversineDistance } = require('../utils/haversine');

const UmkmController = {
  getAll(req, res, next) {
    try {
      const { kategori_id, status, search, lat, lng, radius } = req.query;
      let data = UmkmModel.findAll({ kategori_id, status, search });

      // Filter berdasarkan radius jika koordinat pengguna dikirim
      if (lat && lng) {
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const maxRadius = radius ? parseFloat(radius) : 5; // default 5 km

        data = data
          .map((item) => ({
            ...item,
            jarak_km: Number(
              haversineDistance(userLat, userLng, item.latitude, item.longitude).toFixed(2)
            ),
          }))
          .filter((item) => item.jarak_km <= maxRadius)
          .sort((a, b) => a.jarak_km - b.jarak_km);
      }

      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  },

  getById(req, res, next) {
    try {
      const item = UmkmModel.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'UMKM tidak ditemukan' });
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
      }

      const kategori = KategoriModel.findById(req.body.kategori_id);
      if (!kategori) {
        return res.status(400).json({ success: false, message: 'Kategori tidak valid' });
      }

      const created = UmkmModel.create(req.body);
      res.status(201).json({ success: true, message: 'UMKM berhasil ditambahkan', data: created });
    } catch (err) {
      next(err);
    }
  },

  update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
      }

      const updated = UmkmModel.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'UMKM tidak ditemukan' });
      }
      res.json({ success: true, message: 'UMKM berhasil diperbarui', data: updated });
    } catch (err) {
      next(err);
    }
  },

  remove(req, res, next) {
    try {
      const deleted = UmkmModel.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'UMKM tidak ditemukan' });
      }
      res.json({ success: true, message: 'UMKM berhasil dihapus' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = UmkmController;
