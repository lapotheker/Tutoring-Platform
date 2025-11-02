// application/backend/index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes live under /api 
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`API listening on ${PORT}`);
});
