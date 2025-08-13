const NiveauModel = require('../models/niveauModel');
const NiveauController = {
  getNiveauxByParcours: async (req, res) => {
    try {
      const niveaux = await NiveauModel.getNiveauxByParcoursId(req.params.parcoursId);
      res.json(niveaux);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des niveaux', error: error.message });
    }
  },
  getNiveaux: async (req, res) => {
    try {
      const niveaux = await NiveauModel.findAll();
      res.json(niveaux);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des niveaux', error: error.message });
    }
  }
};

module.exports = NiveauController;