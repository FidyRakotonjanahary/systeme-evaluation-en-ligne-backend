// server/server.js

const express = require('express');
const cors = require('cors');
const config = require('./config/config');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});