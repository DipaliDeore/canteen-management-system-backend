const db = require('../db/db');

const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findUserByGoogleId = async (google_id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE google_id = ?', [google_id]);
  return rows[0];
};

const createUser = async (user) => {
  const { name, email, mob_no, password, google_id, is_google_login } = user;
  const [result] = await db.query(
    'INSERT INTO Users (name, email, mob_no, password, google_id, is_google_login) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, mob_no, password, google_id, is_google_login]
  );
  return result.insertId;
};

module.exports = {
  findUserByEmail,
  findUserByGoogleId,
  createUser,
};
