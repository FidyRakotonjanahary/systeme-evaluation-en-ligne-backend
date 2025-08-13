const express = require('express');
const NiveauController = require('../controllers/niveauController');

const router = express.Router();
router.get('/:parcoursId', NiveauController.getNiveauxByParcours);
router.get('/', NiveauController.getNiveaux);

module.exports = router;