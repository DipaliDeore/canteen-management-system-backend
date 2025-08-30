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

// Get menu item by ID
const getMenuItemById = async (id) => {
  const [rows] = await db.query("SELECT * FROM Menu_Items WHERE Item_id = ?", [id]);
  return rows[0];
};

// Check if item already exists
const getMenuItemByName = async (name) => {
  const [rows] = await db.query(`SELECT * FROM Menu_Items WHERE LOWER(name) = LOWER(?)`, [name]);
  return rows.length ? rows[0] : null;
};

// Get all menu items
const getAllMenuItems = async () => {
  const [rows] = await db.execute("SELECT * FROM Menu_Items");
  return rows;
};

// Get menu items by meal type
const getMenuItemsByType = async (meal_type) => {
  const [rows] = await db.execute(
    "SELECT * FROM Menu_Items WHERE meal_type = ?",
    [meal_type]
  );
  return rows;
};

// Update menu item
const updateMenuItem = async (id, data) => {
  const { name, description, price, meal_type, quantity, image_url } = data;
  await db.query(
    `UPDATE Menu_Items 
     SET name=?, description=?, price=?, meal_type=?, quantity=?, image_url=? 
     WHERE Item_id=?`,
    [name, description, price, meal_type, quantity, image_url, id]
  );
};

module.exports = { createMenuItem, getMenuItemByName, getAllMenuItems, getMenuItemsByType , getMenuItemById,updateMenuItem};
