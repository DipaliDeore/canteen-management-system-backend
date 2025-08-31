const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/admin/menuController');
const authenticateToken = require('../../middlewares/authenticateToken');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const multer = require('multer');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure "uploads" folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Add Menu Item (Admin only)
router.post('/add-menu',authenticateToken,authorizeRoles('admin'),upload.single('image'), // mandatory image
menuController.addMenuItem);
router.get('/get-all-menu',authenticateToken,authorizeRoles('admin'),menuController.getAllMenuItems);
router.get('/get-menu/:meal_type',authenticateToken,authorizeRoles('admin'),menuController.getMenuItemsByType);
router.put('/update-menu/:id',authenticateToken,authorizeRoles('admin'),upload.single('image'),menuController.updateMenuItem);

module.exports = router;

