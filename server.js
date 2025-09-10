const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const db = require('./db/db'); // DB connection
const authRoutes = require('./routes/authRoute'); // Import auth routes

const menuRoutes = require('./routes/admin/menuRoute');

const contactRoutes = require('./routes/contactUsRoute');//contactUs
const feedbackRoutes = require('./routes/feedbackRoute');//feedback


// Handle preflight requests
app.use(cors());

app.use(express.json());


// Test DB connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.json({ message: 'DB Connected Successfully!', result: rows });
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ message: 'Database connection failed', error: err });
  }
});

// Mount auth routes
app.use('/api', authRoutes);

app.use('/menu',menuRoutes);
app.use('/uploads',express.static('uploads'));


app.use('/api', feedbackRoutes);
app.use('/api', contactRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Server listener
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
