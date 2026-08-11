const express = require('express');
const router = express.Router();
const KategoriController = require('../controllers/kategoriController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint publik
router.get('/', KategoriController.getAll);

// Endpoint admin — wajib login
router.post('/', authMiddleware, KategoriController.create);
router.put('/:id', authMiddleware, KategoriController.update);
router.delete('/:id', authMiddleware, KategoriController.remove);

module.exports = router;
