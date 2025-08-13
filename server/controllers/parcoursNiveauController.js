const ParcoursNiveauModel = require('../models/parcoursNiveauModel');

const ParcoursNiveauController = {
  getParcoursNiveauId: async (req, res) => {
    try {
      const { parcours_id, niveau_id } = req.query;

      if (!parcours_id || !niveau_id) {
        return res.status(400).json({
          success: false,
          message: 'Les paramètres parcours_id et niveau_id sont requis'
        });
      }

      const parcoursNiveau = await ParcoursNiveauModel.getParcoursNiveauId(
        parcours_id,
        niveau_id
      );

      if (!parcoursNiveau) {
        return res.status(404).json({
          success: false,
          message: 'Association parcours-niveau non trouvée'
        });
      }

      res.json({
        success: true,
        data: {
          parcours_niveau_id: parcoursNiveau.parcours_niveau_id,
          parcours_id: parcoursNiveau.parcours_id,
          niveau_id: parcoursNiveau.niveau_id
        }
      });

    } catch (error) {
      console.error('Erreur dans getParcoursNiveauId:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du parcours_niveau_id',
        error: error.message
      });
    }
  }
};

module.exports = ParcoursNiveauController;