const db = require('../db/db');

const findAdminByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
  return rows[0];
};

module.exports = {
  findAdminByEmail,
};
