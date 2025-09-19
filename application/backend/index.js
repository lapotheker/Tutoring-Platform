const express = require('express')
const app = express()
const pool = require('./db');

app.use(express.static('public'))

// health check
app.get('/api/db-ping', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json(rows[0]);              // => { ok: 1 }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'))