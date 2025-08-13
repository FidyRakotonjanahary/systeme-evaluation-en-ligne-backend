const db = require('../config/db');

class StudentModel {
  static async findAll() {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        p.nom_parcours,
        n.nom_niveau,
        m.nom_mention
      FROM etudiants e
      JOIN parcours_niveaux pn ON pn.parcours_niveau_id = e.parcours_niveau_id
      JOIN parcours p ON p.parcours_id = pn.parcours_id
      JOIN niveaux n ON n.niveau_id = pn.niveau_id
      JOIN mentions m ON m.mention_id = p.mention_id
    `);
    return rows;
  }

  static async create(student) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [existingMatricule] = await connection.query(
        'SELECT matricule FROM etudiants WHERE matricule = ?',
        [student.matricule]
      );

      if (existingMatricule.length > 0) {
        throw new Error('Ce matricule existe déjà');
      }

      const [existingEmail] = await connection.query(
        'SELECT email FROM etudiants WHERE email = ?',
        [student.email]
      );

      if (existingEmail.length > 0) {
        throw new Error('Cet email existe déjà');
      }

      const [result] = await connection.query(
        'INSERT INTO etudiants (matricule, nom, prenom, email, parcours_niveau_id) VALUES (?, ?, ?, ?, ?)',
        [student.matricule, student.nom, student.prenom, student.email, student.parcours_niveau_id]
      );

      await connection.commit();
      return { id: result.insertId, ...student };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        pn.parcours_id,
        p.mention_id,
        pn.niveau_id,
        p.nom_parcours,
        n.nom_niveau,
        m.nom_mention
      FROM etudiants e
      JOIN parcours_niveaux pn ON pn.parcours_niveau_id = e.parcours_niveau_id
      JOIN parcours p ON p.parcours_id = pn.parcours_id
      JOIN niveaux n ON n.niveau_id = pn.niveau_id
      JOIN mentions m ON m.mention_id = p.mention_id
      WHERE e.etudiant_id = ?
    `, [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        pn.parcours_id,
        p.mention_id,
        pn.niveau_id,
        p.nom_parcours,
        n.nom_niveau,
        m.nom_mention
      FROM etudiants e
      JOIN parcours_niveaux pn ON pn.parcours_niveau_id = e.parcours_niveau_id
      JOIN parcours p ON p.parcours_id = pn.parcours_id
      JOIN niveaux n ON n.niveau_id = pn.niveau_id
      JOIN mentions m ON m.mention_id = p.mention_id
      WHERE e.email = ?
    `, [email]);
    return rows[0];
  }

  static async findByParcoursNiveau(parcoursNiveauId) {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        p.nom_parcours,
        n.nom_niveau,
        m.nom_mention
      FROM etudiants e
      JOIN parcours_niveaux pn ON pn.parcours_niveau_id = e.parcours_niveau_id
      JOIN parcours p ON p.parcours_id = pn.parcours_id
      JOIN niveaux n ON n.niveau_id = pn.niveau_id
      JOIN mentions m ON m.mention_id = p.mention_id
      WHERE e.parcours_niveau_id = ?
    `, [parcoursNiveauId]);
    return rows;
  }

  static async update(id, studentData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [existingEmail] = await connection.query(
        'SELECT email FROM etudiants WHERE email = ? AND etudiant_id != ?',
        [studentData.email, id]
      );

      if (existingEmail.length > 0) {
        throw new Error('Cet email existe déjà');
      }

      await connection.query(
        `UPDATE etudiants 
         SET nom = ?, prenom = ?, email = ?, parcours_niveau_id = ?
         WHERE etudiant_id = ?`,
        [studentData.nom, studentData.prenom, studentData.email, studentData.parcours_niveau_id, id]
      );

      await connection.commit();
      return { id, ...studentData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        `DELETE FROM etudiants WHERE etudiant_id=?`,
        [id]
      );

      await connection.commit();
      //return { id, ...studentData };
      return { id };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = StudentModel;