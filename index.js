// index.js
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json()); // MUST be at the top for POST requests

// DATABASE CONNECTION

// Use DATABASE_URL from Railway or local .env for local testing
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Alice123@localhost:5432/railway_app",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false // SSL for Railway
});

// Test DB connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error(" DB Connection Error:", err));

// ROUTES
// Home route
app.get('/', (req, res) => {
  res.send('Cloud computing and big data are transforming the way we store, process, and analyze data.');
});

// GET all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// POST a new user
app.post('/users', async (req, res) => {
  try {
    const { name, sex } = req.body;
    if (!name || !sex) return res.status(400).send("Name and sex are required");

    const result = await pool.query(
      'INSERT INTO users(name, sex) VALUES($1, $2) RETURNING *',
      [name, sex]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// ----------------------------
// START SERVER
// ----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});