const db = require('../../db/db');

// Create Menu Item
const createMenuItem = async (item) => {
  const { name, description, price, meal_type, quantity, image_url } = item;
  const [result] = await db.query(
    `INSERT INTO Menu_Items 
     (name, description, price, meal_type, quantity, is_available, image_url) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, price, meal_type, quantity, 1, image_url]
  );
  return result.insertId;
};

module.exports = { createMenuItem };
