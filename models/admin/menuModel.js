const db = require('../../db/db');

// Create
const createMenuItem = async (item) => {
  const { name, description, price, meal_type, quantity, image_url, is_available } = item;
  const [result] = await db.query(
    `INSERT INTO Menu_Items 
     (name, description, price, meal_type, quantity, is_available, image_url) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, price, meal_type, quantity, is_available, image_url]
  );
  return result.insertId;
};

// Get by ID
const getMenuItemById = async (id) => {
  const [rows] = await db.query("SELECT * FROM Menu_Items WHERE item_id = ?", [id]);
  return rows[0];
};

// Get by name
const getMenuItemByName = async (name) => {
  const [rows] = await db.query("SELECT * FROM Menu_Items WHERE LOWER(name) = LOWER(?)", [name]);
  return rows.length ? rows[0] : null;
};

// Get all
const getAllMenuItems = async () => {
  const [rows] = await db.execute("SELECT * FROM Menu_Items");
  return rows;
};

// Get by type
const getMenuItemsByType = async (meal_type) => {
  const [rows] = await db.execute("SELECT * FROM Menu_Items WHERE meal_type = ?", [meal_type]);
  return rows;
};

// Update
const updateMenuItem = async (id, data) => {
  const { name, description, price, meal_type, quantity, image_url, is_available } = data;
  await db.query(
    `UPDATE Menu_Items 
     SET name=?, description=?, price=?, meal_type=?, quantity=?, image_url=?, is_available=? 
     WHERE item_id=?`,
    [name, description, price, meal_type, quantity, image_url, is_available, id]
  );

  return getMenuItemById(id);
};

// Delete
const deleteMenuItem = async (id) => {
  const [result] = await db.query("DELETE FROM Menu_Items WHERE item_id = ?", [id]);
  return result.affectedRows;
};

module.exports = { 
  createMenuItem, 
  getMenuItemByName, 
  getAllMenuItems, 
  getMenuItemsByType, 
  getMenuItemById, 
  updateMenuItem,
  deleteMenuItem 
};
