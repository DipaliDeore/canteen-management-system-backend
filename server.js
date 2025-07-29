const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const db = require('./db/db'); // Assuming db.js is in the same folder

// Middlewares
app.use(cors());
app.use(express.json());

// Sample route to test DB connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.json({ message: 'DB Connected Successfully!', result: rows });
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ message: 'Database connection failed', error: err });
  }
});

// Add your routes here (e.g., /menu, /orders, /users, etc.)

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
