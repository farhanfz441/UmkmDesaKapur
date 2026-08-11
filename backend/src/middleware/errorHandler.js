function notFoundHandler(req, res, next) {
  res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} tidak ditemukan` });
}

function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Terjadi kesalahan pada server' : err.message,
  });
}

module.exports = { notFoundHandler, errorHandler };
