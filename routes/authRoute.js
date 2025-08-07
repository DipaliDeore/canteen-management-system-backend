const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../middlewares/validateLogin');

router.post('/signup', authController.signup);
router.post('/login', validateLogin, authController.login);
router.post('/google-login', authController.googleLogin);

module.exports = router;
