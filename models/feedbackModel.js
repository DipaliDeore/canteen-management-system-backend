const db = require('../db/db');

class Feedback {
  static async create(feedbackData) {
    const { name, email, rating, category, feedback } = feedbackData;
    const [result] = await db.execute(
      "INSERT INTO Feedback (name, email, rating, category, feedback) VALUES (?, ?, ?, ?, ?)",
      [name, email, rating, category, feedback]
    );
    return result;
  }

  static async getAll() {
    const [rows] = await db.execute("SELECT * FROM Feedback ORDER BY created_at DESC");
    return rows;
  }
}

module.exports = Feedback;
