const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const AdminModel = require('../models/adminModel');

const AuthController = {
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
      }

      const { username, password } = req.body;
      const admin = await AdminModel.findByUsername(username);

      if (!admin) {
        return res.status(401).json({ success: false, message: 'Username atau password salah' });
      }

      const isValid = bcrypt.compareSync(password, admin.password_hash);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Username atau password salah' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );

      res.json({
        success: true,
        message: 'Login berhasil',
        data: { token, username: admin.username },
      });
    } catch (err) {
      next(err);
    }
  },

  me(req, res) {
    // req.admin diisi oleh authMiddleware
    res.json({ success: true, data: req.admin });
  },
};

module.exports = AuthController;
