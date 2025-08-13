const pool = require('../config/db');

class ParcoursModel {
  static async getParcoursbyMentionId(mentionId) {
    const [rows] = await pool.query(
      'SELECT parcours_id, nom_parcours FROM parcours WHERE mention_id = ?',
      [mentionId]
    );
    return rows;
  }
  static async getParcoursbyNiveauId(niveauId) {
    const [rows] = await pool.query(
      'SELECT p.parcours_id, p.nom_parcours, p.description FROM parcours p JOIN parcours_niveaux pn ON p.parcours_id = pn.parcours_id WHERE niveau_id = ?',
      [niveauId]
    );
    return rows;
  }
}

module.exports = ParcoursModel;