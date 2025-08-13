const express = require('express');
const ParcoursController = require('../controllers/parcoursController');

const router = express.Router();
router.get('/:mentionId', ParcoursController.getParcoursbyMention);
router.get('/niveau/:niveauId', ParcoursController.getParcoursbyNiveau);

module.exports = router;