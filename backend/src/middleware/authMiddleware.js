const jwt = require('jsonwebtoken');

/**
 * Middleware untuk memverifikasi token JWT admin.
 * Endpoint publik (GET) tidak memerlukan middleware ini.
 * Endpoint tambah/edit/hapus data WAJIB melewati middleware ini.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Silakan login sebagai admin terlebih dahulu.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah kedaluwarsa. Silakan login kembali.',
    });
  }
}

module.exports = authMiddleware;
