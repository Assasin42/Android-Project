import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('photos.db');

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT NOT NULL,
      uri TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
};

export const savePhotoLocal = (uid, uri) => {
  db.runSync(
    `INSERT INTO photos (uid, uri, createdAt) VALUES (?, ?, ?)`,
    [uid, uri, new Date().toISOString()]
  );
};

export const getPhotoLocal = (uid) => {
  const result = db.getFirstSync(
    `SELECT * FROM photos WHERE uid = ? ORDER BY id DESC LIMIT 1`,
    [uid]
  );
  return result;
};

export const updatePhotoLocal = (uid, uri) => {
  db.runSync(
    `UPDATE photos SET uri = ?, createdAt = ? WHERE uid = ?`,
    [uri, new Date().toISOString(), uid]
  );
};