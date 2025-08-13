const pool = require('../config/db');

class MentionModel {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM mentions');
    return rows;
  }
}

module.exports = MentionModel;