const express = require('express');
const app = express();
app.use(express.static('public'));
app.get('/', (_,res)=>res.send('Hello from my repo!'));
const port = process.env.PORT || 3000;
app.listen(port, '127.0.0.1', () => console.log('Listening on', port));
