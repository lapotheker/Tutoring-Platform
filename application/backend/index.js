// application/backend/index.js
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Absolute path to the "public" folder next to this file
const publicDir = path.join(__dirname, 'public');

// Serve everything in /public (index.html will auto-serve at "/")
app.use(express.static(publicDir));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
