// routes/matieres.js
const express = require('express');
const router = express.Router();
const matiereController = require('../controllers/matiereController');

router.get('/:niveau_id/:parcours_id', matiereController.getMatieresByParcoursetNiveau);
router.post('/', matiereController.createMatiere);
router.put('/:matiere_id', matiereController.updateMatiere);
router.delete('/:matiere_id', matiereController.deleteMatiere);

module.exports = router;