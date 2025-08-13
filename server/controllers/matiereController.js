// controllers/matiereController.js
const matiereModel = require('../models/matiereModel');

exports.getMatieresByParcoursetNiveau = async (req, res) => {
  try {
    const { niveau_id, parcours_id } = req.params;

    const matieres = await matiereModel.findByParcoursEtNiveau(niveau_id, parcours_id);
    if (matieres.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Aucune matière trouvée pour ce parcours et ce niveau'
        });
    }

    res.status(200).json({
        success: true,
        data: matieres
    });

} catch (error) {
  res.status(500).json({ error: error.message });
}
};

exports.createMatiere = async (req, res) => {
  try {
    const { nom_matiere, parcours_niveau_id } = req.body;
    const matiere = await matiereModel.createMatiere(
      nom_matiere,
      parcours_niveau_id
    );
    res.status(201).json(matiere);
  } catch (err) {
    console.error('Erreur lors de la création d\'une matière :', err);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};

exports.updateMatiere = async (req, res) => {
  try {
    const { matiere_id } = req.params;
    const { nom_matiere } = req.body;
    const matiere = await matiereModel.updateMatiere(
      matiere_id,
      nom_matiere
    );
    res.json(matiere);
  } catch (err) {
    console.error('Erreur lors de la mise à jour d\'une matière :', err);
    res.status(err.message === 'Matière non trouvée' ? 404 : 500)
      .json({ message: err.message });
  }
};

exports.deleteMatiere = async (req, res) => {
  try {
    const { matiere_id } = req.params;
    const result = await matiereModel.deleteMatiere(matiere_id);
    res.json(result);
  } catch (err) {
    console.error('Erreur lors de la suppression d\'une matière :', err);
    res.status(err.message === 'Matière non trouvée' ? 404 : 500)
      .json({ message: err.message });
  }
};