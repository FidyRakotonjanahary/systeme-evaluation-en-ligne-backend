/* The User class in user.model.js defines methods for interacting with user data in a database. */
// server/models/user.model.js
const pool = require('../config/db');
const { hashPassword } = require('../utils/password');

class User {
  constructor({ id, name, email, password, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0] ? new User(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?', 
        [id]
      );
      return rows[0] ? new User(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error finding user by id: ${error.message}`);
    }
  }

  static async create({name, email, password }) {
    try {
      const hashedPassword = await hashPassword(password);
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      const fields = Object.keys(updateData)
        .map(key => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(updateData), id];
      
      const [result] = await pool.query(
        `UPDATE users SET ${fields} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = User;