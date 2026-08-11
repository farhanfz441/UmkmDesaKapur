const { body } = require('express-validator');

const umkmValidationRules = [
  body('nama').trim().notEmpty().withMessage('Nama UMKM wajib diisi'),
  body('kategori_id').isInt({ min: 1 }).withMessage('Kategori wajib dipilih'),
  body('alamat').trim().notEmpty().withMessage('Alamat wajib diisi'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude tidak valid'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude tidak valid'),
  body('kontak').optional({ nullable: true }).trim(),
  body('jam_buka').optional({ nullable: true }).trim(),
  body('jam_tutup').optional({ nullable: true }).trim(),
  body('status').optional().isIn(['aktif', 'tutup_sementara', 'tutup_permanen']),
];

module.exports = { umkmValidationRules };
