// server/config/config.js
require('dotenv').config();

const config = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || '123456789',
  DATABASE: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'evaluation_en_ligne',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
};

module.exports = config;