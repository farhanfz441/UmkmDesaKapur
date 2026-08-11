const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const umkmRoutes = require('./routes/umkmRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Peta UMKM API aktif', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/umkm', umkmRoutes);
app.use('/api/kategori', kategoriRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
