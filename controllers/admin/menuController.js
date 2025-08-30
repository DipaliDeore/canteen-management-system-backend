const menuModel = require('../../models/admin/menuModel');

exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, meal_type, quantity } = req.body;

    // Image is mandatory
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    console.log("req.body:", req.body);
console.log("req.file:", req.file);

    // Validate required fields
    if (!name || !price || !meal_type || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const image_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const itemId = await menuModel.createMenuItem({
      name,
      description,
      price,
      meal_type,
      quantity,
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
