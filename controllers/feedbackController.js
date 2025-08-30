const Feedback = require('../models/feedbackModel');

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, category, feedback } = req.body;

    if (!name || !email || !rating || !category || !feedback) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await Feedback.create({ name, email, rating, category, feedback });
    res.status(201).json({ message: "Feedback submitted successfully" });

  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.getAll();
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
