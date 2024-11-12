// server/config/db.js
const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool(config.DATABASE);

module.exports = pool;