const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, '../../data/db.json');
const dataDir = path.dirname(DB_FILE);

function ensureDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      kategori: [],
      umkm: [],
      admin: [],
      _seq: { kategori: 0, umkm: 0, admin: 0 },
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
  }
}

ensureDb();

function readDb() {
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function nextId(db, table) {
  db._seq[table] = (db._seq[table] || 0) + 1;
  return db._seq[table];
}

module.exports = { readDb, writeDb, nextId };
