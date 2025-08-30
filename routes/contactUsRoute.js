// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactUsController');

// POST /api/contact
router.post('/contact', sendContactEmail);

module.exports = router;
