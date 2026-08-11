const { readDb, writeDb, nextId } = require('../config/jsonDb');

const AdminModel = {
  findByUsername(username) {
    const db = readDb();
    return db.admin.find((a) => a.username === username) || null;
  },

  create({ username, password_hash }) {
    const db = readDb();
    const item = {
      id: nextId(db, 'admin'),
      username,
      password_hash,
      created_at: new Date().toISOString(),
    };
    db.admin.push(item);
    writeDb(db);
    return { id: item.id, username: item.username, created_at: item.created_at };
  },

  count() {
    const db = readDb();
    return db.admin.length;
  },
};

module.exports = AdminModel;
