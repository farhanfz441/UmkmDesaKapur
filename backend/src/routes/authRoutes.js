const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const loginValidationRules = [
  body('username').trim().notEmpty().withMessage('Username wajib diisi'),
  body('password').notEmpty().withMessage('Password wajib diisi'),
];

router.post('/login', loginValidationRules, AuthController.login);
router.get('/me', authMiddleware, AuthController.me);

module.exports = router;
