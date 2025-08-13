const pool = require('../config/db');

class NiveauModel {
  static async getNiveauxByParcoursId(parcoursId) {
    const [rows] = await pool.query(`
      SELECT DISTINCT n.niveau_id, n.nom_niveau
      FROM niveaux n
      JOIN parcours_niveaux pn ON pn.niveau_id = n.niveau_id
      WHERE pn.parcours_id = ?
    `, [parcoursId]);
    return rows;
  }
  static async findAll() {
    const [rows] = await pool.query(`
      SELECT *
      FROM niveaux`);
      return rows;
    }
}

module.exports = NiveauModel;