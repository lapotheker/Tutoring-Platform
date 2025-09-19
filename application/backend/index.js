// application/backend/index.js
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
