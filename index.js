const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json()); // IMPORTANT for POST requests

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: "postgresql://postgres:Alice123@localhost:5432/railway_app"
});

// Test DB connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB Connection Error:", err));

// GET /
app.get('/', (req, res) => {
    res.send('Cloud computing and big data are transforming the way we store, process, and analyze data.');
});

// GET /users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// POST /users
app.post('/users', async (req, res) => {
  try {
    const { name, sex } = req.body;
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});