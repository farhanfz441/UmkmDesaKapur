const { query } = require('../config/db');

const AdminModel = {
  async findByUsername(username) {
    const { rows } = await query('SELECT * FROM admin WHERE username = $1', [username]);
    return rows[0] || null;
  },

  async create({ username, password_hash }) {
    const { rows } = await query(
      'INSERT INTO admin (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, password_hash]
    );
    return rows[0];
  },

  async count() {
    const { rows } = await query('SELECT COUNT(*)::int AS count FROM admin');
    return rows[0].count;
  },
};

module.exports = AdminModel;
