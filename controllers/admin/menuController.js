const menuModel = require('../../models/admin/menuModel');

exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, meal_type, quantity } = req.body;

    // Image is mandatory
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // ✅ Validate required fields
    if (!name || !description || !price || !meal_type || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Validate constraints
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    // ✅ Check for duplicate food item (case-insensitive)
    const existingItem = await menuModel.getMenuItemByName(name);
    if (existingItem) {
      return res.status(400).json({ message: "This food item already exists" });
    }

    // ✅ Construct image URL
    const image_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // ✅ Insert into DB
    const itemId = await menuModel.createMenuItem({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      meal_type,
      quantity: parseInt(quantity),
      image_url,
    });

    res.status(201).json({
      message: "Menu item added successfully",
      item_id: itemId,
      image_url,
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to add menu item",
      error: err.message,
    });
  }
};

// 1. Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await menuModel.getAllMenuItems();
    res.status(200).json({
      message: "Menu items fetched successfully",
      data: items
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch menu items",
      error: err.message
    });
  }
};

// 2. Get menu items by meal type (Breakfast, Lunch, Dinner, Dessert, etc.)
exports.getMenuItemsByType = async (req, res) => {
  try {
    const { meal_type } = req.params;

    const items = await menuModel.getMenuItemsByType(meal_type);

    if (!items || items.length === 0) {
      return res.status(404).json({
        message: `No menu items found for meal type: ${meal_type}`
      });
    }

    res.status(200).json({
      message: `${meal_type} menu items fetched successfully`,
      data: items
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch menu items by type",
      error: err.message
    });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, meal_type, quantity } = req.body;

    // If updating image
    let image_url;
    if (req.file) {
      image_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    // 🔹 Check if food item exists
    const existingItem = await menuModel.getMenuItemById(id);
    if (!existingItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // 🔹 Only check duplicate name if user provides new name
    if (name && name !== existingItem.name) {
      const duplicateItem = await menuModel.getMenuItemByName(name);
      if (duplicateItem && duplicateItem.id !== parseInt(id)) {
        return res.status(400).json({ message: "Food item with this name already exists" });
      }
    }

    // 🔹 Update menu item (keep old values if not provided)
    const updatedItem = await menuModel.updateMenuItem(id, {
      name: name || existingItem.name,
      description: description || existingItem.description,
      price: price || existingItem.price,
      meal_type: meal_type || existingItem.meal_type,
      quantity: quantity || existingItem.quantity,
      image_url: image_url || existingItem.image_url, // keep old image if new not provided
    });

    res.status(200).json({
      message: "Menu item updated successfully",
      updatedItem,
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to update menu item",
      error: err.message,
    });
  }
};
