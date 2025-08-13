// models/matiereModel.js
const db = require('../config/db');

exports.findByParcoursEtNiveau = async (niveau_id, parcours_id) => {
  const query = `
    SELECT 
      m.matiere_id, 
      m.nom_matiere
    FROM matieres m 
    JOIN parcours_niveaux pn 
      ON m.parcours_niveau_id = pn.parcours_niveau_id 
    JOIN parcours p 
      ON pn.parcours_id = p.parcours_id
    JOIN niveaux n 
      ON pn.niveau_id = n.niveau_id 
    WHERE n.niveau_id = ${niveau_id} 
      AND p.parcours_id = ${parcours_id}
  `;
  
  // Notez qu'ici on ne passe plus de tableau de paramètres
  const [matieres] = await db.query(query);
  return matieres;
};

exports.createMatiere = async (nom_matiere, parcours_niveau_id) => {
  const [result] = await db.query(
    'INSERT INTO matieres (nom_matiere, parcours_niveau_id) VALUES (?, ?)',
    [nom_matiere, parcours_niveau_id]
  );
  return {
    id: result.insertId,
    nom_matiere,
    parcours_niveau_id
  };
};

exports.updateMatiere = async (matiere_id, nom_matiere) => {
  const [result] = await db.query(
    'UPDATE matieres SET nom_matiere = ? WHERE matiere_id = ?',
    [nom_matiere, matiere_id]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Matière non trouvée');
  }
  
  return {
    id: matiere_id,
    nom_matiere
  };
};

exports.deleteMatiere = async (matiere_id) => {
  try {
    // Supprimer d'abord tous les enregistrements liés dans la table tentatives_examens
    await db.query(`
      DELETE FROM tentatives_examens
      WHERE examen_id IN (
        SELECT examens.examen_id
        FROM examens 
        JOIN matieres ON examens.matiere_id = matieres.matiere_id
        WHERE matieres.matiere_id = ?
      )
    `, [matiere_id]);

    // Supprimer ensuite tous les enregistrements liés dans la table examens
    await db.query('DELETE FROM examens WHERE matiere_id = ?', [matiere_id]);

    // Puis supprimer l'enregistrement dans la table matieres
    const { affectedRows } = await db.query('DELETE FROM matieres WHERE matiere_id = ?', [matiere_id]);
    if (affectedRows === 0) {
      throw new Error('Matière non trouvée');
    }

    return { message: 'Matière supprimée avec succès' };
  } catch (error) {
    throw error;
  }
};