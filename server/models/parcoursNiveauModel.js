const pool = require('../config/db');

class ParcoursNiveauModel {
  static async getParcoursNiveauId(parcoursId, niveauId) {
    try {
      const [rows] = await pool.query(
        'SELECT parcours_niveau_id FROM parcours_niveaux WHERE parcours_id = ? AND niveau_id = ?',
        [parcoursId, niveauId]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Erreur dans la requête: ${error.message}`);
    }
  }
}

module.exports = ParcoursNiveauModel;