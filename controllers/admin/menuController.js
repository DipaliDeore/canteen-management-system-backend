const menuModel = require('../../models/admin/menuModel');

// Add Menu Item
exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, meal_type, quantity } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!name || !description || !price || !meal_type || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    const existingItem = await menuModel.getMenuItemByName(name);
    if (existingItem) {
      return res.status(400).json({ message: "This food item already exists" });
    }

    const image_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const itemId = await menuModel.createMenuItem({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      meal_type,
      quantity: parseInt(quantity),
      image_url,
      is_available: 1
    });

    res.status(201).json({
      message: "Menu item added successfully",
      item_id: itemId,
      image_url,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to add menu item", error: err.message });
  }
};

// Get all
exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await menuModel.getAllMenuItems();
    res.status(200).json({ message: "Menu items fetched successfully", data: items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu items", error: err.message });
  }
};

// Get by type
exports.getMenuItemsByType = async (req, res) => {
  try {
    const { meal_type } = req.params;
    const items = await menuModel.getMenuItemsByType(meal_type);

    if (!items || items.length === 0) {
      return res.status(404).json({ message: `No menu items found for meal type: ${meal_type}` });
    }

    res.status(200).json({ message: `${meal_type} menu items fetched successfully`, data: items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu items by type", error: err.message });
  }
};

// Update
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, meal_type, quantity, is_available } = req.body;

    let image_url;
    if (req.file) {
      image_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const existingItem = await menuModel.getMenuItemById(id);
    if (!existingItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (name && name !== existingItem.name) {
      const duplicateItem = await menuModel.getMenuItemByName(name);
      if (duplicateItem && duplicateItem.item_id !== parseInt(id)) {
        return res.status(400).json({ message: "Food item with this name already exists" });
      }
    }

    const updatedItem = await menuModel.updateMenuItem(id, {
      name: name || existingItem.name,
      description: description || existingItem.description,
      price: price || existingItem.price,
      meal_type: meal_type || existingItem.meal_type,
      quantity: quantity || existingItem.quantity,
      image_url: image_url || existingItem.image_url,
      is_available: is_available !== undefined ? is_available : existingItem.is_available
    });

    res.status(200).json({ message: "Menu item updated successfully", updatedItem });

  } catch (err) {
    res.status(500).json({ message: "Failed to update menu item", error: err.message });
  }
};

// Delete
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await menuModel.getMenuItemById(id);
    if (!existingItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await menuModel.deleteMenuItem(id);

    res.status(200).json({ message: "Menu item deleted successfully", deleted_item_id: id });

  } catch (err) {
    res.status(500).json({ message: "Failed to delete menu item", error: err.message });
  }
};
