const express = require('express');
const router = express.Router();
const UmkmController = require('../controllers/umkmController');
const { umkmValidationRules } = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint publik — bisa diakses siapa saja tanpa login
router.get('/', UmkmController.getAll);
router.get('/:id', UmkmController.getById);

// Endpoint admin — wajib login (Bearer token) untuk tambah/edit/hapus data
router.post('/', authMiddleware, umkmValidationRules, UmkmController.create);
router.put('/:id', authMiddleware, umkmValidationRules, UmkmController.update);
router.delete('/:id', authMiddleware, UmkmController.remove);

module.exports = router;
