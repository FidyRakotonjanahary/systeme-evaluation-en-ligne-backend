const ParcoursModel = require('../models/parcoursModel');

const ParcoursController = {
  getParcoursbyMention: async (req, res) => {
    try {
      const parcours = await ParcoursModel.getParcoursbyMentionId(req.params.mentionId);
      res.json(parcours);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des parcours', error: error.message });
    }
  },
  getParcoursbyNiveau: async (req, res) => {
    try {
      const parcours = await ParcoursModel.getParcoursbyNiveauId(req.params.niveauId);
      res.json(parcours);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des parcours', error: error.message });
    }
  }
};

module.exports = ParcoursController;
