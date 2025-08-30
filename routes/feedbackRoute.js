const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// POST - Submit feedback
router.post('/feedback', feedbackController.submitFeedback);

// GET - Fetch all feedback
router.get('/feedback', feedbackController.getFeedbacks);

module.exports = router;
